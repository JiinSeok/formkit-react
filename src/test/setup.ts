import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// jiin: globals: false라서 RTL 자동 cleanup이 동작하지 않음 — 명시적으로 등록
afterEach(() => {
  cleanup()
})
