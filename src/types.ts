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
}

export interface FormProps extends HTMLAttributes<HTMLFormElement> {
  formId: string
  onSubmit: SubmitHandler<any>
  defaultValues?: Record<string, any>
  schema?: ZodSchema<any>
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