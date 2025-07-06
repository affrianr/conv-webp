# Testing Guide

This project uses a comprehensive testing strategy with multiple testing frameworks to ensure code quality and reliability.

## Testing Stack

- **Vitest**: Fast unit and integration testing framework
- **Playwright**: End-to-end testing for browser automation
- **Testing Library**: React component testing utilities
- **JSDOM**: Browser environment simulation for unit tests

## Test Structure

```
src/test/
├── components/          # Component unit tests
│   ├── drop-zone.test.tsx
│   └── slider.test.tsx
├── api/                 # API route tests
│   └── convert-to-webp.test.ts
├── lib/                 # Utility function tests
│   └── utils.test.ts
├── pages/               # Page integration tests
│   └── home.test.tsx
├── e2e/                 # End-to-end tests
│   └── image-conversion.spec.ts
├── performance/         # Performance benchmarks
│   └── image-processing.bench.ts
└── fixtures/            # Test data and mock files
    └── test-image.svg
```

## Available Test Commands

### Unit & Integration Tests (Vitest)

```bash
# Run tests in watch mode
npm run test

# Run tests once
npm run test:run

# Run tests with coverage report
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Open Vitest UI dashboard
npm run test:ui
```

### End-to-End Tests (Playwright)

```bash
# Run E2E tests
npm run test:e2e

# Run E2E tests with UI mode
npm run test:e2e:ui

# Run E2E tests in headed mode (visible browser)
npm run test:e2e:headed
```

## Test Categories

### 1. Component Tests

Test individual React components in isolation:

- **DropZone**: File upload, drag & drop, validation
- **Slider**: Value changes, keyboard navigation, accessibility

### 2. API Route Tests

Test backend functionality:

- **Image Conversion**: WebP conversion, error handling, file validation
- **Request/Response**: Headers, status codes, data formats

### 3. Integration Tests

Test component interactions and data flow:

- **Home Page**: Complete user workflows, state management
- **File Processing**: End-to-end file handling

### 4. End-to-End Tests

Test complete user scenarios in real browsers:

- **User Workflows**: File upload → conversion → download
- **Error Handling**: Invalid files, network errors
- **Responsive Design**: Mobile and desktop layouts
- **Cross-browser**: Chrome, Firefox, Safari

### 5. Performance Tests

Benchmark critical operations:

- **Image Processing**: Conversion speed and memory usage
- **API Performance**: Request/response times
- **Memory Management**: Garbage collection patterns

## Coverage Goals

The project maintains high test coverage standards:

- **Branches**: 80%
- **Functions**: 80%
- **Lines**: 80%
- **Statements**: 80%

## Pre-commit Hooks

Tests run automatically before each commit:

```bash
# .husky/pre-commit
bun run lint
bun run test:run
```

## Writing Tests

### Component Test Example

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should handle click events', async () => {
    const handleClick = vi.fn();
    render(<MyComponent onClick={handleClick} />);
    
    await fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledOnce();
  });
});
```

### API Test Example

```typescript
import { describe, it, expect, vi } from 'vitest';
import { POST } from './route';

// Mock Sharp
vi.mock('sharp', () => ({
  default: vi.fn(() => ({
    webp: vi.fn().mockReturnThis(),
    toBuffer: vi.fn().mockResolvedValue(Buffer.from('mock-data'))
  }))
}));

describe('/api/convert-to-webp', () => {
  it('should convert image to WebP', async () => {
    const formData = new FormData();
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    formData.append('image', file);
    
    const request = new Request('http://localhost/api/convert-to-webp', {
      method: 'POST',
      body: formData
    });
    
    const response = await POST(request);
    expect(response.status).toBe(200);
  });
});
```

### E2E Test Example

```typescript
import { test, expect } from '@playwright/test';

test('should convert image successfully', async ({ page }) => {
  await page.goto('/');
  
  // Upload file
  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles('path/to/test-image.jpg');
  
  // Convert
  const downloadPromise = page.waitForDownload();
  await page.getByRole('button', { name: /convert/i }).click();
  
  // Verify download
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('converted.webp');
});
```

## Debugging Tests

### Vitest Debugging

```bash
# Run specific test file
npm run test -- drop-zone.test.tsx

# Run tests matching pattern
npm run test -- --grep "should handle file upload"

# Debug with browser devtools
npm run test:ui
```

### Playwright Debugging

```bash
# Debug mode with browser devtools
npm run test:e2e:headed

# Interactive debugging
npm run test:e2e:ui

# Generate test code
npx playwright codegen localhost:3000
```

## Continuous Integration

Tests run automatically in CI/CD pipelines:

- **Unit Tests**: Fast feedback on code changes
- **E2E Tests**: Full browser testing across multiple environments
- **Coverage Reports**: Ensure quality standards

## Best Practices

1. **Test Naming**: Use descriptive test names that explain the expected behavior
2. **Test Isolation**: Each test should be independent and not rely on others
3. **Mock External Dependencies**: Use mocks for APIs, file system, and third-party libraries
4. **Test Edge Cases**: Include error conditions and boundary values
5. **Keep Tests Fast**: Unit tests should run quickly; use E2E tests sparingly
6. **Maintain Test Data**: Keep fixtures and test data up to date

## Troubleshooting

### Common Issues

**Tests failing locally but passing in CI:**
- Check for timing issues in async operations
- Ensure test isolation and cleanup
- Verify environment-specific configurations

**Playwright tests timing out:**
- Increase timeout values in playwright.config.ts
- Check if the development server is running
- Verify network connectivity and API responses

**Coverage not meeting thresholds:**
- Add tests for uncovered code paths
- Remove dead code or exclude from coverage
- Check for missing test files

**Sharp/Image processing tests failing:**
- Ensure Sharp is properly mocked in test environment
- Check file paths and test fixtures
- Verify buffer handling in tests

For more help, check the [Vitest documentation](https://vitest.dev/) and [Playwright documentation](https://playwright.dev/).