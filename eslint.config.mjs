import tseslint from 'typescript-eslint'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'

export default tseslint.config(
  { ignores: ['dist/**', 'node_modules/**'] },
  ...tseslint.configs.recommended,
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: {
      react,
      'react-hooks': reactHooks,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      // jiin: 기존 코드가 RHF 제네릭에 any를 광범위하게 사용 — 점진적으로 줄이기 전까지 완화
      '@typescript-eslint/no-explicit-any': 'off',
    },
    settings: {
      react: { version: 'detect' },
    },
  },
)
