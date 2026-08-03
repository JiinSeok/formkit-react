import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// jiin: globals: false라서 RTL 자동 cleanup이 동작하지 않음 — 명시적으로 등록
afterEach(() => {
  cleanup()
})

// jiin: jsdom에 Pointer Capture와 scrollIntoView가 없어 Radix Select가 열리다 예외로 죽는다
if (!Element.prototype.hasPointerCapture) {
  Element.prototype.hasPointerCapture = () => false
  Element.prototype.setPointerCapture = () => {}
  Element.prototype.releasePointerCapture = () => {}
}
if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {}
}
