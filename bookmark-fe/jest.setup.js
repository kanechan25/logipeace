require('@testing-library/jest-dom')

// Polyfill for MSW
const { TextDecoder, TextEncoder } = require('util')

global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

// Polyfill Web Streams API
try {
  const { ReadableStream, WritableStream, TransformStream } = require('stream/web')
  global.ReadableStream = ReadableStream
  global.WritableStream = WritableStream
  global.TransformStream = TransformStream
} catch {
  // Fallback for older Node versions
  global.ReadableStream = class ReadableStream {}
  global.WritableStream = class WritableStream {}
  global.TransformStream = class TransformStream {}
}

// Polyfill fetch for Jest environment
if (!global.fetch) {
  const fetch = require('cross-fetch')
  global.fetch = fetch
  global.Headers = fetch.Headers
  global.Request = fetch.Request
  global.Response = fetch.Response
}

// Mock BroadcastChannel for MSW
global.BroadcastChannel = class BroadcastChannel {
  constructor(name) {
    this.name = name
  }
  postMessage() {}
  close() {}
  addEventListener() {}
  removeEventListener() {}
}

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: {},
      asPath: '/',
      push: jest.fn(),
      pop: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn().mockResolvedValue(undefined),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
      isFallback: false,
    }
  },
}))

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      refresh: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      prefetch: jest.fn(),
    }
  },
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))

// Suppress console errors in tests unless explicitly needed
const originalError = console.error
beforeAll(() => {
  console.error = (...args) => {
    if (typeof args[0] === 'string' && args[0].includes('Warning: ReactDOM.render is no longer supported')) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
})

// Global test timeout
jest.setTimeout(30000)
