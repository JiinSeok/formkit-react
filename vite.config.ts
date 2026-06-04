// jiin: test 옵션을 쓰려면 vite가 아닌 vitest/config에서 defineConfig를 가져와야 타입이 맞음
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      include: ['src/**/*'],
      exclude: ['**/*.test.ts', '**/*.test.tsx', '**/*.stories.tsx', 'src/test/**'],
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'FormKitReact',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'mjs' : 'js'}`,
    },
    rollupOptions: {
      // jiin: 런타임 의존성을 번들에 인라인하면 소비자 앱과 react-hook-form 인스턴스가
      // 이중으로 생겨 폼 상태가 깨질 수 있음 — package.json dependencies 전부 external 처리
      external: [
        'react',
        'react-dom',
        /^react\/.*/,
        /^react-dom\/.*/,
        'react-hook-form',
        '@hookform/resolvers',
        /^@hookform\/resolvers\/.*/,
        '@radix-ui/react-select',
        'clsx',
        'lucide-react',
        'tailwind-merge',
        'zod',
        /^zod\/.*/,
      ],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
        preserveModules: false,
        // jiin: named/default export 혼용 시 rollup 경고 제거 + CJS interop 명시
        exports: 'named',
      },
    },
    cssCodeSplit: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
      // jiin: rollup banner는 terser 압축 단계에서 제거됨 — preamble은 압축 후 삽입되어
      // 'use client'가 보존됨. 없으면 Next.js App Router 서버 컴포넌트에서 import 시 크래시
      format: {
        preamble: `'use client';`,
      },
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: false,
  },
})
