// jiin: FormKit이 자동으로 노출하는 기본 문구(placeholder·aria-label 등)를 언어별로 분리.
// 필드에 직접 텍스트를 넘기면 이 기본값 대신 그 값이 쓰이고, 안 넘기면 locale에 맞는 기본값이 쓰인다.

export type FormLocale = 'ko' | 'en'

export interface FormMessages {
  /** Select에 값을 넘기지 않았을 때 보여줄 기본 placeholder */
  selectPlaceholder: string
  /** 비밀번호 표시 토글 버튼의 aria-label (감춰진 상태) */
  showPassword: string
  /** 비밀번호 표시 토글 버튼의 aria-label (드러난 상태) */
  hidePassword: string
}

export const FORM_MESSAGES: Record<FormLocale, FormMessages> = {
  en: {
    selectPlaceholder: 'Select an option',
    showPassword: 'Show password',
    hidePassword: 'Hide password',
  },
  ko: {
    selectPlaceholder: '옵션을 선택하세요',
    showPassword: '비밀번호 표시',
    hidePassword: '비밀번호 숨기기',
  },
} as const

// jiin: 기존 동작(영어)을 그대로 유지하기 위해 기본 locale은 'en'.
export const DEFAULT_LOCALE: FormLocale = 'en'
