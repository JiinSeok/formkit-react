'use client'

import { Button } from './Button'
import { SelectKit } from './Select'
import {
  FieldProps,
  FormContextProps,
  FormProps,
  FormResetButtonProps,
  FormSubmitButtonProps,
  InputProps,
  LegendProps,
  TextareaProps,
  SelectProps,
  ComponentProps,
} from '../types'
import { cn } from '../utils/cn'
import { DEFAULT_LOCALE, FORM_MESSAGES } from '../messages'
import { createContext, useContext, useId, useState, forwardRef, useImperativeHandle } from 'react'
import {
  FieldError,
  FieldErrorsImpl,
  Merge,
  RegisterOptions,
  useForm,
  Controller,
} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff } from 'lucide-react'

const FormContext = createContext<FormContextProps | undefined>(undefined)

export const useFormContext = () => {
  const context = useContext(FormContext)
  if (!context) {
    throw new Error('useFormContext must be used within a FormProvider')
  }
  return context
}

const FieldContext = createContext<{ forId: string } | undefined>(undefined)

const useFieldContext = () => {
  const context = useContext(FieldContext)
  if (!context) {
    throw new Error('useFieldContext must be used within a FieldProvider')
  }
  return context
}

const Form = forwardRef<any, FormProps>(({
  children,
  className,
  formId,
  onSubmit,
  defaultValues = {},
  locale = DEFAULT_LOCALE,
  messages: messagesOverride,
  ...rest
}, ref) => {
  const FormClass = cn('flex flex-col flex-wrap', className)

  // jiin: locale 기본 문구 위에 개별 override를 얕게 덮어써 최종 문구를 만든다
  const messages = { ...FORM_MESSAGES[locale], ...messagesOverride }

  const hasSchema = 'schema' in rest && rest.schema
  const formOptions = hasSchema
    ? {
        resolver: zodResolver(rest.schema as any),
        mode: 'onChange' as const,
        defaultValues,
      }
    : {
        mode: 'onChange' as const,
        defaultValues,
      }

  const {
    watch,
    getValues,
    getFieldState,
    setValue,
    formState: { errors, isValid, isSubmitting },
    reset,
    handleSubmit,
    register,
    setFocus,
    control,
  } = useForm(formOptions)

  useImperativeHandle(ref, () => ({
    setValue,
    getValues,
    reset,
    setFocus,
  }))

  return (
    <FormContext.Provider
      value={{
        formId,
        onSubmit,
        watch,
        getValues,
        getFieldState,
        setValue,
        errors,
        isValid,
        isSubmitting,
        reset,
        register,
        setFocus,
        control,
        messages,
      }}
    >
      <form
        id={formId}
        onSubmit={handleSubmit(onSubmit)}
        className={FormClass}
        {...(hasSchema ? {} : rest)}
      >
        {children}
      </form>
    </FormContext.Provider>
  )
})

Form.displayName = 'Form'

function Title({ children, className }: ComponentProps) {
  const FormTitleClass = cn(
    'self-center text-3xl font-semibold text-foreground',
    className,
  )
  return <header className={FormTitleClass}>{children}</header>
}

function FormResetButton({
  children,
  className,
  onClick,
  ...rest
}: FormResetButtonProps) {
  const { reset } = useFormContext()
  return (
    <Button
      type={'reset'}
      className={className}
      onClick={() => {
        if (typeof onClick === 'function') onClick()
        reset()
      }}
      {...rest}
    >
      {children}
    </Button>
  )
}

function FormSubmitButton({ children, variant = 'default', className, disabled, ...rest }: FormSubmitButtonProps) {
  return (
    <Button type={'submit'} variant={variant} size={'lg'} className={className} disabled={disabled} {...rest}>
      {children}
    </Button>
  )
}

function Fieldset({ children, className }: ComponentProps) {
  const fieldsetClass = cn('flex flex-col flex-wrap gap-4 py-4', className)
  return <fieldset className={fieldsetClass}>{children}</fieldset>
}

function Legend({ children, className, required }: LegendProps) {
  const legendClass = cn(
    'flex flex-row flex-wrap justify-start items-center gap-1 text-xl font-normal text-foreground',
    className,
  )
  return (
    <p className={legendClass}>
      {children}
      {required && (
        <span className="text-primary my-auto leading-none pt-1 text-md">
          *
        </span>
      )}
    </p>
  )
}

function Field({
  children,
  className,
  htmlFor = '',
  isInline = false,
  hidden,
}: FieldProps) {
  // jiin: effect에서 random id를 만들면 SSR에서 id가 비고 첫 렌더에 label 연결이 누락됨
  // — React 18+의 useId는 서버/클라이언트 모두 안정적인 id를 보장
  const generatedId = useId()
  const { formId } = useFormContext()
  const fieldId = htmlFor || `${formId}-${generatedId}`
  const fieldClass = cn(
    'flex gap-4',
    {
      'flex-row': isInline,
      'flex-col': !isInline,
    },
    className,
  )

  return (
    <FieldContext.Provider value={{ forId: fieldId }}>
      <label className={fieldClass} htmlFor={fieldId} hidden={hidden}>
        {children}
      </label>
    </FieldContext.Provider>
  )
}

function Label({ children, className }: ComponentProps) {
  const LabelClass = cn('text-xl font-normal text-foreground', className)
  return <p className={LabelClass}>{children}</p>
}

function Wrapper({ children, className }: ComponentProps) {
  const wrapperClass = cn('relative block p-2', className)
  return <div className={wrapperClass}>{children}</div>
}

function Unit({ unit }: { unit: string }) {
  return (
    <span className="absolute top-8 right-8 z-10 transform -translate-y-1/2 block text-xl font-normal text-muted-foreground">
      {unit}
    </span>
  )
}

function ErrorMessage({
  error,
  id,
}: {
  error: FieldError | Merge<FieldErrorsImpl, any> | undefined
  id?: string
}) {
  if (!error) return null
  // jiin: role="alert"(=암묵적 aria-live="assertive")로 동적으로 나타난 에러를 SR이 즉시 읽게 한다.
  // aria-describedby로 필드와 연결하기 위해 id를 받는다.
  return (
    <p id={id} role="alert" aria-live="assertive" className="text-destructive text-sm">
      {typeof error === 'object' &&
        'message' in error &&
        (error.message as string)}
    </p>
  )
}

function Input({
  className,
  type = 'text',
  name,
  required = false,
  minLength = 1,
  maxLength = 200,
  hookFormPattern,
  validate,
  ...rest
}: InputProps) {
  const { register, errors, watch, messages } = useFormContext()
  const { forId } = useFieldContext()

  const rules: RegisterOptions = {
    required,
    minLength,
    maxLength,
    pattern: hookFormPattern || undefined,
    validate,
  }

  const inputClass = cn(
    `flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`,
    className,
  )

  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false)
  const isPasswordField = type === 'password'
  const inputType = isPasswordField
    ? isPasswordVisible
      ? 'text'
      : 'password'
    : type

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev)
  }

  const isConfirm = name.startsWith('confirm')
  const confirmInputName = name.replace('confirm', '').trim().toLowerCase()
  const confirmInputValue = watch(confirmInputName)

  if (isConfirm) {
    rules.validate = (value) => value === confirmInputValue
  }

  const error = errors?.[name]
  const errorId = `${forId}-error`

  return (
    <>
      <div className="relative">
        <input
          {...register(name, rules)}
          type={inputType}
          id={forId}
          className={inputClass}
          {...rest}
          // jiin: 시각 별표(Legend)와 별개로 SR에 필수/에러 상태를 전달. rest 뒤에 둬 a11y 속성을 보장
          aria-required={required || undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
        />
        {isPasswordField && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={isPasswordVisible ? messages.hidePassword : messages.showPassword}
          >
            {isPasswordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
      <ErrorMessage error={error} id={errorId} />
    </>
  )
}

function Textarea({
  className,
  name,
  required = false,
  minLength = 1,
  maxLength = 200,
  validate,
  ...rest
}: TextareaProps) {
  const rules: RegisterOptions = {
    required,
    validate,
    minLength,
    maxLength,
  }
  const { register, errors } = useFormContext()
  const { forId } = useFieldContext()
  const textareaClass = cn(
    'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none',
    className,
  )

  const error = errors?.[name]
  const errorId = `${forId}-error`

  return (
    <>
      <textarea
        {...register(name, rules)}
        className={textareaClass}
        id={forId}
        rows={4}
        {...rest}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
      />
      <ErrorMessage error={error} id={errorId} />
    </>
  )
}

function FormSelect({
  name,
  options,
  placeholder,
  required = false,
  className,
  ...rest
}: SelectProps) {
  const { control, errors, messages } = useFormContext()
  const { forId } = useFieldContext()

  // jiin: 넘긴 placeholder가 있으면 그대로, 없으면 locale 기본 문구를 쓴다
  const resolvedPlaceholder = placeholder ?? messages.selectPlaceholder

  const error = errors?.[name]
  const errorId = `${forId}-error`

  return (
    <>
      <Controller
        name={name}
        control={control}
        rules={{ required }}
        defaultValue=""
        render={({ field }) => (
          <SelectKit.Root
            onValueChange={field.onChange}
            value={field.value || ''}
            {...rest}
          >
            {/* jiin: Radix Trigger는 버튼이므로 aria-*를 그대로 전달해 필수/에러 상태를 SR에 노출 */}
            <SelectKit.Trigger
              className={className}
              id={forId}
              aria-required={required || undefined}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? errorId : undefined}
            >
              <SelectKit.Value placeholder={resolvedPlaceholder} />
            </SelectKit.Trigger>
            <SelectKit.Content>
              {options.map((option) => (
                <SelectKit.Item
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                >
                  {option.label}
                </SelectKit.Item>
              ))}
            </SelectKit.Content>
          </SelectKit.Root>
        )}
      />
      <ErrorMessage error={error} id={errorId} />
    </>
  )
}

export const FormKit = {
  Root: Form,
  Title,
  ResetButton: FormResetButton,
  SubmitButton: FormSubmitButton,
  Fieldset,
  Legend,
  Field,
  Label,
  Wrapper,
  Unit,
  Error: ErrorMessage,
  Input,
  Textarea,
  Select: FormSelect,
}

export default FormKit