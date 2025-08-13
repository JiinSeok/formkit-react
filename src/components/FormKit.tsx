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
import { createContext, useContext, useEffect, useState, forwardRef, useImperativeHandle } from 'react'
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
  ...rest
}, ref) => {
  const FormClass = cn('flex flex-col flex-wrap', className)

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
  const [fieldId, setFieldId] = useState<string>(htmlFor || '')
  const { formId } = useFormContext()
  const fieldClass = cn(
    'flex gap-4',
    {
      'flex-row': isInline,
      'flex-col': !isInline,
    },
    className,
  )

  const generateUniqueId = () => {
    if (
      typeof crypto !== 'undefined' &&
      typeof crypto.randomUUID === 'function'
    ) {
      return crypto.randomUUID()
    }

    return (
      'id-' +
      Math.random().toString(36).substring(2, 11) +
      '-' +
      Date.now().toString(36)
    )
  }

  useEffect(() => {
    if (!htmlFor) {
      const generatedId = `${formId}-${generateUniqueId()}`
      setFieldId(generatedId)
    }
  }, [formId, htmlFor])

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
}: {
  error: FieldError | Merge<FieldErrorsImpl, any> | undefined
}) {
  if (!error) return null
  return (
    <p className="text-destructive text-sm">
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
  const { register, errors, watch } = useFormContext()
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

  return (
    <>
      <div className="relative">
        <input
          {...register(name, rules)}
          type={inputType}
          id={forId}
          className={inputClass}
          {...rest}
        />
        {isPasswordField && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
          >
            {isPasswordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
      <ErrorMessage error={errors?.[name]} />
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

  return (
    <>
      <textarea
        {...register(name, rules)}
        className={textareaClass}
        id={forId}
        rows={4}
        {...rest}
      />
      <ErrorMessage error={errors?.[name]} />
    </>
  )
}

function FormSelect({
  name,
  options,
  placeholder = 'Select an option',
  required = false,
  className,
  ...rest
}: SelectProps) {
  const { control, errors } = useFormContext()
  const { forId } = useFieldContext()

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
            <SelectKit.Trigger className={className} id={forId}>
              <SelectKit.Value placeholder={placeholder} />
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
      <ErrorMessage error={errors?.[name]} />
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