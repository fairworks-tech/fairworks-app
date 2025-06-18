import 'jest-preset-angular/setup-jest';

/* global mocks for jsdom */
const mock = () => {
  let storage: { [key: string]: string } = {};
  return {
    getItem: (key: string) => (key in storage ? storage[key] : null),
    setItem: (key: string, value: string) => (storage[key] = value || ''),
    removeItem: (key: string) => delete storage[key],
    clear: () => (storage = {}),
  };
};

Object.defineProperty(window, 'localStorage', { value: mock() });
Object.defineProperty(window, 'sessionStorage', { value: mock() });
Object.defineProperty(window, 'getComputedStyle', {
  value: () => ['-webkit-appearance'],
});

Object.defineProperty(document.body, 'style', {
  value: {
    transform: {
      configurable: true,
      value: () => ({
        offsetHeight: 0,
        offsetLeft: 0,
        offsetTop: 0,
        offsetWidth: 0,
        offsetParent: null,
        value: 'none',
      }),
    },
  },
}); 