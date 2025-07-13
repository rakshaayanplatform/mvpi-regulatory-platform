// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

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

// Mock fetch globally
global.fetch = jest.fn()

// Mock environment variables
process.env.NEXT_PUBLIC_API_URL = 'http://localhost:8001'
process.env.NEXT_PUBLIC_PATIENT_API_URL = 'http://localhost:8002'
process.env.NEXT_PUBLIC_HOSPITAL_API_URL = 'http://localhost:8003'
process.env.NEXT_PUBLIC_MANUFACTURER_API_URL = 'http://localhost:8004'
process.env.NEXT_PUBLIC_GOV_API_URL = 'http://localhost:8005'
process.env.NEXT_PUBLIC_COORDINATOR_API_URL = 'http://localhost:8006'
process.env.NEXT_PUBLIC_MEDIA_API_URL = 'http://localhost:8007'
process.env.NEXT_PUBLIC_AI_API_URL = 'http://localhost:8010' 