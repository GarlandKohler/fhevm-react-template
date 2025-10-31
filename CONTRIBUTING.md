# Contributing to FHEVM SDK

Thank you for your interest in contributing to the FHEVM SDK! This document provides guidelines and instructions for contributing.

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Git
- Familiarity with TypeScript, React, and Ethereum

### Setup Development Environment

1. Fork the repository

2. Clone your fork:
```bash
git clone https://github.com/YOUR_USERNAME/fhevm-sdk.git
cd fhevm-sdk
```

3. Install dependencies:
```bash
npm install
```

4. Build the SDK:
```bash
npm run build:sdk
```

5. Run tests:
```bash
npm test
```

## Development Workflow

### 1. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Test additions/changes

### 2. Make Changes

- Write clean, readable code
- Follow existing code style
- Add comments for complex logic
- Update documentation as needed
- Write tests for new features

### 3. Test Your Changes

```bash
# Run SDK tests
cd packages/fhevm-sdk
npm test

# Test in examples
cd examples/nextjs-app
npm run dev

cd examples/confidential-futures-trading
npm run dev
```

### 4. Commit Changes

Follow conventional commits format:

```bash
git commit -m "type(scope): description"
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Test changes
- `chore`: Build process or auxiliary tool changes

Examples:
```bash
git commit -m "feat(sdk): add support for encrypted addresses"
git commit -m "fix(encryption): handle edge case for zero values"
git commit -m "docs(readme): update installation instructions"
```

### 5. Push and Create Pull Request

```bash
git push origin your-branch-name
```

Then create a Pull Request on GitHub.

## Code Standards

### TypeScript

- Use TypeScript for all new code
- Provide proper type definitions
- Avoid `any` types when possible
- Export types for public APIs

```typescript
// Good
export interface EncryptOptions {
  contract: Contract | string;
  userAddress: string;
}

// Avoid
export interface EncryptOptions {
  contract: any;
  userAddress: any;
}
```

### Code Style

- Use 2 spaces for indentation
- Use semicolons
- Use single quotes for strings
- Use meaningful variable names
- Keep functions small and focused

```typescript
// Good
async function encryptValue(
  value: number,
  options: EncryptOptions
): Promise<EncryptedInput> {
  // Implementation
}

// Avoid
async function ev(v: any, o: any): Promise<any> {
  // Implementation
}
```

### Documentation

- Document all public APIs
- Include JSDoc comments
- Provide usage examples
- Update README files

```typescript
/**
 * Encrypts a uint32 value for use in FHEVM contracts
 *
 * @param value - The value to encrypt (0 to 2^32-1)
 * @param options - Encryption options including contract address
 * @returns Encrypted input with handles and proof
 *
 * @example
 * ```typescript
 * const encrypted = await client.encryption.encryptU32(42, {
 *   contract: contractAddress,
 *   userAddress: signerAddress
 * });
 * ```
 */
async encryptU32(
  value: number,
  options: EncryptOptions
): Promise<EncryptedInput> {
  // Implementation
}
```

## Testing

### Writing Tests

- Write tests for all new features
- Test edge cases
- Test error conditions
- Aim for high coverage

```typescript
describe('EncryptionService', () => {
  it('should encrypt uint32 values', async () => {
    const encrypted = await service.encryptU32(42, options);
    expect(encrypted.handles).toBeDefined();
    expect(encrypted.inputProof).toBeDefined();
  });

  it('should throw error for invalid values', async () => {
    await expect(
      service.encryptU32(-1, options)
    ).rejects.toThrow();
  });
});
```

### Running Tests

```bash
# All tests
npm test

# Watch mode
npm test -- --watch

# Coverage
npm test -- --coverage
```

## Contributing Areas

### SDK Core

Location: `packages/fhevm-sdk/src/`

Areas for contribution:
- New encryption types
- Performance optimizations
- Better error handling
- Additional utility functions

### React Hooks

Location: `packages/fhevm-sdk/src/hooks.ts`

Areas for contribution:
- New hooks for common patterns
- Better state management
- Performance optimizations

### Examples

Location: `examples/`

Areas for contribution:
- New example applications
- Framework integrations (Vue, Angular, Svelte)
- Real-world use cases
- Improved documentation

### Documentation

Location: `*.md` files

Areas for contribution:
- Tutorials
- API documentation
- Best practices
- Troubleshooting guides

## Pull Request Process

### Before Submitting

- [ ] Code builds without errors
- [ ] All tests pass
- [ ] New tests added for new features
- [ ] Documentation updated
- [ ] Commit messages follow conventions
- [ ] Code follows style guidelines

### PR Description

Include in your PR:

1. **What**: Brief description of changes
2. **Why**: Reason for changes
3. **How**: Implementation approach
4. **Testing**: How you tested
5. **Screenshots**: If UI changes

Template:
```markdown
## What
Adds support for encrypted address types

## Why
Users need to encrypt Ethereum addresses for privacy

## How
- Added encryptAddress method to EncryptionService
- Updated types to include address encryption
- Added tests for address encryption

## Testing
- Unit tests pass
- Tested in Next.js example
- Verified on Sepolia testnet

## Screenshots
N/A
```

### Review Process

1. Maintainer will review your PR
2. Address any feedback
3. Once approved, PR will be merged

## Reporting Issues

### Bug Reports

Include:
- Clear title
- Steps to reproduce
- Expected behavior
- Actual behavior
- Environment details
- Code samples (if applicable)

Template:
```markdown
## Bug Description
Encryption fails for large values

## Steps to Reproduce
1. Initialize client
2. Call encryptU64(2^64 - 1, options)
3. Observe error

## Expected Behavior
Should encrypt successfully

## Actual Behavior
Throws "Value out of range" error

## Environment
- SDK Version: 1.0.0
- Node Version: 18.0.0
- Browser: Chrome 120
- Network: Sepolia
```

### Feature Requests

Include:
- Clear description
- Use case
- Proposed API (if applicable)
- Alternatives considered

## Code of Conduct

### Our Standards

- Be respectful and inclusive
- Accept constructive criticism
- Focus on what's best for the community
- Show empathy towards others

### Unacceptable Behavior

- Harassment or discrimination
- Trolling or insulting comments
- Personal or political attacks
- Publishing others' private information

## Questions?

- Open a discussion on GitHub
- Join our community Discord
- Check existing issues and PRs

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Recognition

Contributors will be acknowledged in:
- CONTRIBUTORS.md file
- Release notes
- Project documentation

Thank you for contributing to FHEVM SDK!
