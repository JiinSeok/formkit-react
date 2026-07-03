/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      // jiin: CSS 변수에 "완전한 색상값"을 담고 유틸은 var()로 그대로 읽는다(hsl() 래퍼 제거).
      // 이러면 소비자가 토큰을 hsl로 주든 oklch로 주든 그대로 흘러들어가 포맷에 무관해진다.
      // (구 shadcn의 hsl(var(--x)) 방식은 소비자 토큰을 HSL 삼중값으로 강제해 oklch와 충돌했음)
      // /opacity 모디파이어는 Tailwind가 color-mix로 처리한다.
      colors: {
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
      },
    },
  },
  // jiin: Select가 쓰는 animate-in/fade-in-0/zoom-in-95 등은 tailwindcss-animate 플러그인 제공
  plugins: [require('tailwindcss-animate')],
}
