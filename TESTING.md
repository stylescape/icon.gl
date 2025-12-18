# Testing Guide

This document describes the testing infrastructure for icon.gl.

## Overview

The project uses [Vitest](https://vitest.dev/) as its testing framework, providing:
- Fast, modern testing with native ESM support
- Built-in TypeScript support
- Code coverage reporting
- UI mode for interactive test development

## Getting Started

### Running Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

## Test Structure

### Unit Tests
Located in `src/ts/Icon.test.ts`, these tests cover:
- **Icon utility class** - Core icon manipulation functions
- **Icon caching** - Performance optimization validation
- **Accessibility features** - ARIA attributes and labels
- **Style application** - Size, color, and custom styling

### Integration Tests
Located in `test/integration.test.ts`, covering:
- **SVG file validation** - Ensuring proper SVG syntax
- **Codepoint management** - JSON codepoint file validation
- **Build output** - Generated TypeScript exports

### Build Tests
Located in `test/build.test.ts`, validating:
- **Project configuration** - package.json, tsconfig.json
- **Directory structure** - Required source directories
- **Documentation** - Presence of required files

## Coverage

Coverage thresholds are set at 80% for:
- Lines
- Functions
- Branches
- Statements

View coverage reports in `coverage/` after running `npm run test:coverage`.

## CI/CD Integration

Tests run automatically on:
- Push to `dev` and `main` branches
- Pull requests
- Multiple Node.js versions (18.x, 20.x, 22.x)

Coverage reports are uploaded to Codecov (when configured).

## Writing Tests

### Example Unit Test

```typescript
import { describe, it, expect } from 'vitest';
import Icon from './utils/Icon';

describe('My Feature', () => {
    it('should behave as expected', () => {
        const result = Icon.getIconByKey('testIcon');
        expect(result).toContain('<svg');
    });
});
```

### Best Practices

1. **Descriptive names** - Use clear test descriptions
2. **Single responsibility** - One assertion per test when possible
3. **Arrange-Act-Assert** - Follow AAA pattern
4. **Mock external dependencies** - Keep tests isolated
5. **Test edge cases** - Cover error conditions

## Troubleshooting

### Common Issues

**Issue**: Tests fail with module resolution errors
**Solution**: Ensure TypeScript paths are configured correctly in `vitest.config.ts`

**Issue**: Coverage doesn't match expected files
**Solution**: Check `coverage.include` and `coverage.exclude` patterns

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [Coverage Reports](./coverage/index.html) (after running coverage)
