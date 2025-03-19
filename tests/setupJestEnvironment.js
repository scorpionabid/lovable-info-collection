// tests/setupJestEnvironment.js
// Global mocks and environment setup

// Mock localStorage
const localStorageMock = {
  store: {},
  getItem: function (key) {
    return this.store[key] || null;
  },
  setItem: function (key, value) {
    this.store[key] = value.toString();
  },
  clear: function () {
    this.store = {};
  },
  removeItem: function (key) {
    delete this.store[key];
  },
};

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  })),
});

// Mock navigator
Object.defineProperty(window, "navigator", {
  value: {
    userAgent: "jest-test",
  },
});

// Console error tracking
console.error = jest.fn();
