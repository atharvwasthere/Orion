import { beforeAll, afterAll } from '@jest/globals';

// Global test timeout
jest.setTimeout(10000);

// Setup before all tests
beforeAll(async () => {
  // Any global setup logic
  console.log('Setting up tests...');
});

// Cleanup after all tests
afterAll(async () => {
  // Any global cleanup logic
  console.log('Cleaning up tests...');
  
  // Give time for async operations to complete
  await new Promise(resolve => setTimeout(resolve, 500));
});