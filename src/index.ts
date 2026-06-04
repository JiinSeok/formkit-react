export { FormKit, useFormContext } from './components/FormKit'
export { SelectKit } from './components/Select'
export { Button } from './components/Button'
export { cn } from './utils/cn'

// jiin: README의 `import FormKit from '@jiin.seok/formkit-react'`(default import)가 동작해야 함
export { default } from './components/FormKit'

export type {
  FormProps,
  FormContextProps,
  ComponentProps,
  FieldProps,
  LegendProps,
  InputProps,
  TextareaProps,
  SelectProps,
  SelectOption,
  FormSubmitButtonProps,
  FormResetButtonProps,
} from './types'

// Re-export types from dependencies for convenience
export type {
  UseFormReturn,
  SubmitHandler,
  FieldValues,
  FieldErrors,
  RegisterOptions,
  Control,
} from 'react-hook-form'

export type { ZodSchema } from 'zod'