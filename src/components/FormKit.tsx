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
import {
  createContext,
  useContext,
  useEffect,
  useId,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react'
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

const FieldContext = createContext<
  | {
      forId: string
      descriptionId: string
      hasDescription: boolean
      setHasDescription: (has: boolean) => void
    }
  | undefined
>(undefined)

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
        data-formkit="form"
        className={cn(className)}
        {...(hasSchema ? {} : rest)}
      >
        {children}
      </form>
    </FormContext.Provider>
  )
})

Form.displayName = 'Form'

function Title({ children, className }: ComponentProps) {
  return (
    <header data-formkit="title" className={cn(className)}>
      {children}
    </header>
  )
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
  return (
    <fieldset data-formkit="fieldset" className={cn(className)}>
      {children}
    </fieldset>
  )
}

function Legend({ children, className, required }: LegendProps) {
  return (
    <p data-formkit="legend" className={cn(className)}>
      {children}
      {required && (
        <span data-formkit="required" aria-hidden>
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
  // jiin: Description은 있을 때만 aria-describedby로 가리켜야 한다 — 없는 id를 가리키면
  // 보조기기가 읽을 것을 찾다가 아무것도 못 찾는다
  const [hasDescription, setHasDescription] = useState(false)

  return (
    <FieldContext.Provider
      value={{
        forId: fieldId,
        descriptionId: `${fieldId}-description`,
        hasDescription,
        setHasDescription,
      }}
    >
      <label
        data-formkit="field"
        data-inline={isInline}
        className={cn(className)}
        htmlFor={fieldId}
        hidden={hidden}
      >
        {children}
      </label>
    </FieldContext.Provider>
  )
}

// 입력 예시·형식 안내처럼 칸 옆에 두는 설명. Field가 label이라 그냥 두면 칸 이름에 설명까지
// 섞여 읽힌다. 이름에서 빼고 aria-describedby로만 읽게 한다(참조된 요소는 hidden이어도 읽힌다).
function Description({ children, className }: ComponentProps) {
  const { descriptionId, setHasDescription } = useFieldContext()

  useEffect(() => {
    setHasDescription(true)
    return () => setHasDescription(false)
  }, [setHasDescription])

  return (
    <p
      id={descriptionId}
      aria-hidden="true"
      data-formkit="description"
      className={cn(className)}
    >
      {children}
    </p>
  )
}

// 설명과 오류를 함께 가리킨다. 하나만 넣으면 나머지가 읽히지 않는다.
function describedBy(
  descriptionId: string,
  hasDescription: boolean,
  errorId: string,
  hasError: boolean,
) {
  const ids = []
  if (hasDescription) ids.push(descriptionId)
  if (hasError) ids.push(errorId)
  return ids.length > 0 ? ids.join(' ') : undefined
}

function Label({ children, className }: ComponentProps) {
  return (
    <p data-formkit="label" className={cn(className)}>
      {children}
    </p>
  )
}

function Wrapper({ children, className }: ComponentProps) {
  return (
    <div data-formkit="wrapper" className={cn(className)}>
      {children}
    </div>
  )
}

function Unit({ unit }: { unit: string }) {
  return (
    <span data-formkit="unit">{unit}</span>
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
    <p id={id} role="alert" aria-live="assertive" data-formkit="error">
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
  const { forId, descriptionId, hasDescription } = useFieldContext()

  const rules: RegisterOptions = {
    required,
    minLength,
    maxLength,
    pattern: hookFormPattern || undefined,
    validate,
  }


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
      <div data-formkit="wrapper">
        <input
          {...register(name, rules)}
          type={inputType}
          id={forId}
          data-formkit="input"
          className={cn(className)}
          {...rest}
          // jiin: 시각 별표(Legend)와 별개로 SR에 필수/에러 상태를 전달. rest 뒤에 둬 a11y 속성을 보장
          aria-required={required || undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(descriptionId, hasDescription, errorId, Boolean(error))}
        />
        {isPasswordField && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            data-formkit="password-toggle"
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
  const { forId, descriptionId, hasDescription } = useFieldContext()

  const error = errors?.[name]
  const errorId = `${forId}-error`

  return (
    <>
      <textarea
        {...register(name, rules)}
        data-formkit="textarea"
        className={cn(className)}
        id={forId}
        rows={4}
        {...rest}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(descriptionId, hasDescription, errorId, Boolean(error))}
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
  onValueChange,
  ...rest
}: SelectProps) {
  const { control, errors, messages } = useFormContext()
  const { forId, descriptionId, hasDescription } = useFieldContext()

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
            {...rest}
            // jiin: 넘어온 onValueChange를 그대로 Root에 흘리면 field.onChange를 덮어써
            // 고른 값이 폼에 들어가지 않는다 — 폼에 먼저 넣고 바깥에도 알린다
            onValueChange={(value) => {
              field.onChange(value)
              onValueChange?.(value)
            }}
            value={field.value || ''}
          >
            {/* jiin: Radix Trigger는 버튼이므로 aria-*를 그대로 전달해 필수/에러 상태를 SR에 노출 */}
            <SelectKit.Trigger
              className={className}
              id={forId}
              aria-required={required || undefined}
              aria-invalid={error ? true : undefined}
              aria-describedby={describedBy(descriptionId, hasDescription, errorId, Boolean(error))}
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
  Description,
  Wrapper,
  Unit,
  Error: ErrorMessage,
  Input,
  Textarea,
  Select: FormSelect,
}

export default FormKit