
import '@testing-library/jest-dom';

// Suppress console errors during tests
const originalConsoleError = console.error;
console.error = (...args) => {
  // Ignore specific React error messages that are known and expected during tests
  if (
    args[0] && 
    typeof args[0] === 'string' && 
    (args[0].includes('Warning: ReactDOM.render') || 
     args[0].includes('Warning: React.createFactory'))
  ) {
    return;
  }
  originalConsoleError(...args);
};

// Mocking matchMedia for components that rely on it
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mocking localStorage
const localStorageMock = (function() {
  let store: Record<string, string> = {};
  return {
    getItem(key: string) {
      return store[key] || null;
    },
    setItem(key: string, value: string) {
      store[key] = value.toString();
    },
    removeItem(key: string) {
      delete store[key];
    },
    clear() {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Global afterEach cleanup
afterEach(() => {
  // Clean up any mocks created using jest.spyOn
  jest.restoreAllMocks();
});
