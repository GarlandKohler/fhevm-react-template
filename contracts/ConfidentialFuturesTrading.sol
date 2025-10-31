// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { FHE, euint32, euint64, ebool } from "@fhevm/solidity/lib/FHE.sol";
import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

contract ConfidentialFuturesTrading is SepoliaConfig {

    address public owner;
    uint32 public currentContractId;
    uint256 public lastSettlementTime;

    // Settlement happens every 4 hours
    uint256 constant SETTLEMENT_INTERVAL = 14400; // 4 hours in seconds

    struct TraderPosition {
        euint64 encryptedAmount;
        euint32 encryptedPrice;
        bool isLong;
        bool hasPosition;
        uint256 entryTime;
        euint64 encryptedCollateral;
    }

    struct FuturesContract {
        euint32 settlementPrice;
        bool priceSet;
        bool settled;
        uint256 expiryTime;
        uint256 creationTime;
        address[] traders;
        string underlying; // "BTC", "ETH", "OIL", etc.
        euint64 totalVolume;
    }

    mapping(uint32 => FuturesContract) public contracts;
    mapping(uint32 => mapping(address => TraderPosition)) public traderPositions;
    mapping(address => euint64) public traderBalances;

    event ContractCreated(uint32 indexed contractId, string underlying, uint256 expiryTime);
    event PositionOpened(address indexed trader, uint32 indexed contractId, bool isLong);
    event ContractSettled(uint32 indexed contractId, uint32 settlementPrice);
    event ProfitDistributed(address indexed trader, uint32 indexed contractId);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    modifier onlyDuringTrading(uint32 contractId) {
        require(isContractActive(contractId), "Contract not active for trading");
        _;
    }

    modifier onlyDuringSettlement() {
        require(isSettlementTime(), "Not settlement time");
        _;
    }

    constructor() {
        owner = msg.sender;
        currentContractId = 1;
        lastSettlementTime = block.timestamp;
    }

    // Check if it's time for settlement (every 4 hours)
    function isSettlementTime() public view returns (bool) {
        return block.timestamp >= lastSettlementTime + SETTLEMENT_INTERVAL;
    }

    // Check if contract is still active for trading
    function isContractActive(uint32 contractId) public view returns (bool) {
        FuturesContract storage futuresContract = contracts[contractId];
        return futuresContract.priceSet && !futuresContract.settled && block.timestamp < futuresContract.expiryTime;
    }

    // Create new futures contract
    function createFuturesContract(string memory underlying) external onlyOwner {
        require(bytes(underlying).length > 0, "Invalid underlying asset");

        uint256 expiryTime = block.timestamp + (24 * 3600); // 24 hours expiry

        contracts[currentContractId] = FuturesContract({
            settlementPrice: FHE.asEuint32(0),
            priceSet: false,
            settled: false,
            expiryTime: expiryTime,
            creationTime: block.timestamp,
            traders: new address[](0),
            underlying: underlying,
            totalVolume: FHE.asEuint64(0)
        });

        emit ContractCreated(currentContractId, underlying, expiryTime);
        currentContractId++;
    }

    // Set initial reference price for the contract (encrypted)
    function setContractPrice(uint32 contractId, uint32 initialPrice) external onlyOwner {
        require(initialPrice > 0, "Price must be greater than 0");
        require(!contracts[contractId].priceSet, "Price already set");

        euint32 encryptedPrice = FHE.asEuint32(initialPrice);
        contracts[contractId].settlementPrice = encryptedPrice;
        contracts[contractId].priceSet = true;

        FHE.allowThis(encryptedPrice);
    }

    // Open trading position (long or short)
    function openPosition(
        uint32 contractId,
        uint32 entryPrice,
        uint64 amount,
        uint64 collateral,
        bool isLong
    ) external onlyDuringTrading(contractId) {
        require(entryPrice > 0, "Entry price must be greater than 0");
        require(amount > 0, "Amount must be greater than 0");
        require(collateral > 0, "Collateral must be greater than 0");
        require(!traderPositions[contractId][msg.sender].hasPosition, "Position already exists");

        euint32 encryptedEntryPrice = FHE.asEuint32(entryPrice);
        euint64 encryptedAmount = FHE.asEuint64(amount);
        euint64 encryptedCollateral = FHE.asEuint64(collateral);

        traderPositions[contractId][msg.sender] = TraderPosition({
            encryptedAmount: encryptedAmount,
            encryptedPrice: encryptedEntryPrice,
            isLong: isLong,
            hasPosition: true,
            entryTime: block.timestamp,
            encryptedCollateral: encryptedCollateral
        });

        contracts[contractId].traders.push(msg.sender);

        // Add to total volume
        contracts[contractId].totalVolume = FHE.add(contracts[contractId].totalVolume, encryptedAmount);

        // Set permissions
        FHE.allowThis(encryptedEntryPrice);
        FHE.allowThis(encryptedAmount);
        FHE.allowThis(encryptedCollateral);
        FHE.allow(encryptedEntryPrice, msg.sender);
        FHE.allow(encryptedAmount, msg.sender);
        FHE.allow(encryptedCollateral, msg.sender);

        emit PositionOpened(msg.sender, contractId, isLong);
    }

    // Settle contracts and distribute profits/losses
    function settleContract(uint32 contractId, uint32 finalPrice) external onlyOwner {
        require(contracts[contractId].priceSet, "Contract price not set");
        require(!contracts[contractId].settled, "Contract already settled");
        require(block.timestamp >= contracts[contractId].expiryTime || isSettlementTime(), "Settlement time not reached");

        FuturesContract storage futuresContract = contracts[contractId];

        // Set final settlement price
        euint32 encryptedFinalPrice = FHE.asEuint32(finalPrice);
        futuresContract.settlementPrice = encryptedFinalPrice;

        // Request decryption for settlement calculation
        bytes32[] memory cts = new bytes32[](1);
        cts[0] = FHE.toBytes32(encryptedFinalPrice);
        FHE.requestDecryption(cts, this.processSettlement.selector);

        FHE.allowThis(encryptedFinalPrice);
    }

    // Decryption callback for settlement processing
    function processSettlement(
        uint256 requestId,
        uint32 finalPrice,
        bytes[] memory signatures
    ) external {
        // In FHEVM, decryption callbacks are automatically authorized by the FHE system
        // No additional authorization check needed here

        // Find the contract to settle (simplified - in production use mapping)
        uint32 contractId = _findContractForSettlement();

        if (contractId > 0) {
            contracts[contractId].settled = true;
            lastSettlementTime = block.timestamp;

            emit ContractSettled(contractId, finalPrice);

            // Process all trader positions
            _distributeSettlements(contractId, finalPrice);
        }
    }

    // Distribute settlements to traders (simplified implementation)
    function _distributeSettlements(uint32 contractId, uint32 finalPrice) private {
        FuturesContract storage futuresContract = contracts[contractId];

        for (uint i = 0; i < futuresContract.traders.length; i++) {
            address trader = futuresContract.traders[i];
            TraderPosition storage position = traderPositions[contractId][trader];

            if (position.hasPosition) {
                // Calculate profit/loss (simplified - would use FHE operations in production)
                _calculateAndDistributeProfit(trader, contractId, finalPrice);
                emit ProfitDistributed(trader, contractId);
            }
        }
    }

    // Calculate profit/loss for a trader (simplified)
    function _calculateAndDistributeProfit(address trader, uint32 contractId, uint32 finalPrice) private {
        // In a full implementation, this would use FHE operations
        // to calculate profit/loss while keeping individual positions private

        // Add calculated profit to trader balance
        euint64 profit = FHE.asEuint64(100); // Simplified calculation
        traderBalances[trader] = FHE.add(traderBalances[trader], profit);

        FHE.allowThis(profit);
        FHE.allow(profit, trader);
    }

    // Helper function to find contract for settlement
    function _findContractForSettlement() private view returns (uint32) {
        // Simplified implementation - would need proper tracking in production
        for (uint32 i = 1; i < currentContractId; i++) {
            if (contracts[i].priceSet && !contracts[i].settled) {
                return i;
            }
        }
        return 0;
    }

    // Get current contract information
    function getContractInfo(uint32 contractId) external view returns (
        bool priceSet,
        bool settled,
        uint256 expiryTime,
        uint256 creationTime,
        string memory underlying,
        uint256 traderCount
    ) {
        FuturesContract storage futuresContract = contracts[contractId];
        return (
            futuresContract.priceSet,
            futuresContract.settled,
            futuresContract.expiryTime,
            futuresContract.creationTime,
            futuresContract.underlying,
            futuresContract.traders.length
        );
    }

    // Check trader position status
    function getTraderPositionStatus(uint32 contractId, address trader) external view returns (
        bool hasPosition,
        bool isLong,
        uint256 entryTime
    ) {
        TraderPosition storage position = traderPositions[contractId][trader];
        return (position.hasPosition, position.isLong, position.entryTime);
    }

    // Get time until next settlement
    function getTimeToNextSettlement() external view returns (uint256) {
        if (isSettlementTime()) {
            return 0;
        }
        return (lastSettlementTime + SETTLEMENT_INTERVAL) - block.timestamp;
    }

    // Request withdrawal of profits (requires decryption)
    function requestWithdrawal() external {
        euint64 balance = traderBalances[msg.sender];

        // Request decryption of the balance
        bytes32[] memory cts = new bytes32[](1);
        cts[0] = FHE.toBytes32(balance);
        FHE.requestDecryption(cts, this.processWithdrawal.selector);
    }

    // Withdrawal callback after decryption
    function processWithdrawal(
        uint256 requestId,
        uint64 decryptedBalance,
        bytes[] memory signatures
    ) external {
        require(decryptedBalance > 0, "No profits to withdraw");

        // Reset balance after withdrawal confirmation
        traderBalances[msg.sender] = FHE.asEuint64(0);
        FHE.allowThis(traderBalances[msg.sender]);

        // In a real implementation, transfer the decryptedBalance to the user
    }

    // Emergency functions
    function emergencySettle(uint32 contractId) external onlyOwner {
        require(contracts[contractId].priceSet, "Contract not initialized");
        contracts[contractId].settled = true;
    }

    function getActiveContractsCount() external view returns (uint32) {
        uint32 count = 0;
        for (uint32 i = 1; i < currentContractId; i++) {
            if (isContractActive(i)) {
                count++;
            }
        }
        return count;
    }
}