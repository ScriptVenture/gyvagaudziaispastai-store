import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))

// Mock Next.js Image component
jest.mock('next/image', () => {
  return function MockedImage(props) {
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img {...props} />
  }
})

// Mock environment variables
process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL = 'http://localhost:9000'
process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY = 'test_publishable_key'

// Mock fetch for API calls
global.fetch = jest.fn()

// Mock window.matchMedia for Radix UI components
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})