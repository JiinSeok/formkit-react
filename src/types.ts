import type { ReactNode, ButtonHTMLAttributes, HTMLAttributes } from 'react'
import type {
  UseFormWatch,
  UseFormGetValues,
  UseFormGetFieldState,
  UseFormSetValue,
  FieldErrors,
  UseFormReset,
  UseFormRegister,
  UseFormSetFocus,
  Control,
  SubmitHandler,
  RegisterOptions,
} from 'react-hook-form'
import type { ZodSchema } from 'zod'
import type { FormLocale, FormMessages } from './messages'

export interface FormContextProps {
  formId: string
  onSubmit: SubmitHandler<any>
  watch: UseFormWatch<any>
  getValues: UseFormGetValues<any>
  getFieldState: UseFormGetFieldState<any>
  setValue: UseFormSetValue<any>
  errors: FieldErrors
  isValid: boolean
  isSubmitting: boolean
  reset: UseFormReset<any>
  register: UseFormRegister<any>
  setFocus: UseFormSetFocus<any>
  control: Control<any>
  // jiin: locale로 해석된 기본 문구. 하위 필드가 placeholder를 안 넘겼을 때 사용
  messages: FormMessages
}

export interface FormProps extends HTMLAttributes<HTMLFormElement> {
  formId: string
  onSubmit: SubmitHandler<any>
  defaultValues?: Record<string, any>
  schema?: ZodSchema<any>
  // jiin: 자동 노출 문구(Select placeholder 등)의 기본 언어. 기본값 'en'
  locale?: FormLocale
  // jiin: 개별 문구만 커스텀하고 싶을 때. locale 기본값 위에 얕게 덮어쓴다
  messages?: Partial<FormMessages>
  children: ReactNode
}

export interface ComponentProps {
  children: ReactNode
  className?: string
}

export interface FieldProps extends ComponentProps {
  htmlFor?: string
  isInline?: boolean
  hidden?: boolean
}

export interface LegendProps extends ComponentProps {
  required?: boolean
}

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'name'> {
  name: string
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'date' | 'time' | 'datetime-local'
  required?: boolean
  minLength?: number
  maxLength?: number
  hookFormPattern?: {
    value: RegExp
    message: string
  }
  validate?: RegisterOptions['validate']
}

export interface TextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'name'> {
  name: string
  required?: boolean
  minLength?: number
  maxLength?: number
  validate?: RegisterOptions['validate']
}

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectProps {
  name: string
  options: SelectOption[]
  placeholder?: string
  required?: boolean
  className?: string
  disabled?: boolean
  onValueChange?: (value: string) => void
}

export interface FormSubmitButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  className?: string
}

export interface FormResetButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  className?: string
  onClick?: () => void
}