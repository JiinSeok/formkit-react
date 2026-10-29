# @jiin.seok/formkit-react

🚀 A powerful React form library with Compound Component Pattern, built-in validation, and TypeScript support

[![npm version](https://img.shields.io/npm/v/@jiin.seok/formkit-react.svg)](https://www.npmjs.com/package/@jiin.seok/formkit-react)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[한국어 문서](./README.md)

## ✨ Features

- 🎯 **Compound Component Pattern** - Clean, composable API
- 🔄 **React Hook Form Integration** - Performance optimized
- 🛡️ **Zod Schema Support** - Type-safe validation
- ♿ **Accessibility First** - ARIA compliant
- 🎨 **Opt-in Default Theme** - Import the stylesheet for a ready-to-use look, or skip it for plain HTML
- 📝 **TypeScript** - Full type safety
- 🔒 **Password Toggle** - Built-in visibility toggle
- 🎛️ **Select Component** - Powered by Radix UI

## 📦 Installation

```bash
npm install @jiin.seok/formkit-react
# or
yarn add @jiin.seok/formkit-react
# or
pnpm add @jiin.seok/formkit-react
```

### Peer Dependencies

```bash
npm install react react-dom zod
```

> `react-hook-form` and `@hookform/resolvers` are installed automatically as package dependencies. `zod` is a peer dependency so that FormKit shares the same Zod instance as your schemas.

### Import Styles

To use the default theme, import it once at your app entry point (e.g. `main.tsx`, `layout.tsx`).

```tsx
import '@jiin.seok/formkit-react/styles.css'
```

Without this import, components render as plain, unstyled HTML. Skip it if you want to style everything yourself. The stylesheet does not require Tailwind, so it works in any app.

## 🚀 Quick Start

### Basic Example

```tsx
import FormKit from '@jiin.seok/formkit-react'

function LoginForm() {
  const handleSubmit = data => {
    console.log('Form data:', data)
  }

  return (
    <FormKit.Root formId="login" onSubmit={handleSubmit}>
      <FormKit.Title>Sign In</FormKit.Title>

      <FormKit.Field>
        <FormKit.Label>Email</FormKit.Label>
        <FormKit.Input name="email" type="email" required />
      </FormKit.Field>

      <FormKit.Field>
        <FormKit.Label>Password</FormKit.Label>
        <FormKit.Input name="password" type="password" required />
      </FormKit.Field>

      <FormKit.SubmitButton>Sign In</FormKit.SubmitButton>
    </FormKit.Root>
  )
}
```

### With Zod Validation

```tsx
import FormKit from '@jiin.seok/formkit-react'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

function LoginForm() {
  const handleSubmit = data => {
    console.log('Validated data:', data)
  }

  return (
    <FormKit.Root formId="login" schema={loginSchema} onSubmit={handleSubmit}>
      <FormKit.Field>
        <FormKit.Label>Email</FormKit.Label>
        <FormKit.Input name="email" type="email" />
      </FormKit.Field>

      <FormKit.Field>
        <FormKit.Label>Password</FormKit.Label>
        <FormKit.Input name="password" type="password" />
      </FormKit.Field>

      <FormKit.SubmitButton>Sign In</FormKit.SubmitButton>
    </FormKit.Root>
  )
}
```

### Advanced Form with Select

```tsx
import FormKit from '@jiin.seok/formkit-react'

function RegistrationForm() {
  const countries = [
    { value: 'kr', label: 'South Korea' },
    { value: 'us', label: 'United States' },
    { value: 'jp', label: 'Japan' },
  ]

  return (
    <FormKit.Root formId="registration" onSubmit={handleSubmit}>
      <FormKit.Fieldset>
        <FormKit.Legend required>Personal Information</FormKit.Legend>

        <FormKit.Field>
          <FormKit.Label>Full Name</FormKit.Label>
          <FormKit.Input name="fullName" required />
        </FormKit.Field>

        <FormKit.Field>
          <FormKit.Label>Country</FormKit.Label>
          <FormKit.Select
            name="country"
            options={countries}
            placeholder="Select your country"
            required
          />
        </FormKit.Field>

        <FormKit.Field>
          <FormKit.Label>Bio</FormKit.Label>
          <FormKit.Textarea name="bio" placeholder="Tell us about yourself" maxLength={500} />
        </FormKit.Field>
      </FormKit.Fieldset>

      <FormKit.SubmitButton>Register</FormKit.SubmitButton>
    </FormKit.Root>
  )
}
```

## 📦 Available Components

FormKit provides a comprehensive set of form components:

### 📝 Core Components

- **FormKit.Root** - Main form container with validation context
- **FormKit.Field** - Field wrapper that links a label to its input
- **FormKit.Fieldset** - Groups related fields
- **FormKit.Legend** - Fieldset title with an optional required indicator

### 🎨 Input Components

- **FormKit.Input** - Text input supporting password toggle, email, number, and more
- **FormKit.Textarea** - Multi-line text input
- **FormKit.Select** - Dropdown select (powered by Radix UI)

### 🏷️ Display Components

- **FormKit.Label** - Field label
- **FormKit.Description** - Input examples or format hints
- **FormKit.Title** - Form title
- **FormKit.Wrapper** - Container for custom layouts
- **FormKit.Unit** - Unit display (e.g. "USD", "kg")
- **FormKit.Error** - Error message display

### 🎯 Action Components

- **FormKit.SubmitButton** - Submit button with loading state
- **FormKit.ResetButton** - Resets the form to its initial values

## 📚 API Reference

### FormKit.Root

The main form container that provides context to all child components.

| Prop          | Type                    | Required | Description                                                                                             |
| ------------- | ----------------------- | -------- | ------------------------------------------------------------------------------------------------------- |
| formId        | string                  | ✅       | Unique identifier for the form                                                                          |
| onSubmit      | (data) => void          | ✅       | Form submission handler                                                                                 |
| schema        | ZodSchema               | ❌       | Zod schema for validation                                                                               |
| defaultValues | object                  | ❌       | Default form values                                                                                     |
| locale        | `'ko' \| 'en'`          | ❌       | Default language for built-in text (Select placeholder, password toggle aria-label). Defaults to `'en'` |
| messages      | `Partial<FormMessages>` | ❌       | Overrides individual messages. Shallow-merged on top of the `locale` defaults                           |

```tsx
// Korean defaults for the whole form
<FormKit.Root formId="signup" locale="ko" onSubmit={onSubmit}>
  {/* The default Select placeholder becomes '옵션을 선택하세요' */}
  <FormKit.Select name="genre" options={options} />
</FormKit.Root>

// Customize a single message
<FormKit.Root
  formId="signup"
  messages={{ selectPlaceholder: 'Pick a genre' }}
  onSubmit={onSubmit}
/>
```

### FormKit.Field

Container for form inputs with automatic label-input association.

| Prop     | Type    | Default | Description                               |
| -------- | ------- | ------- | ----------------------------------------- |
| isInline | boolean | false   | Display label and input horizontally      |
| hidden   | boolean | false   | Hide the field                            |
| htmlFor  | string  | auto    | Custom ID for the label-input association |

### FormKit.Input

Enhanced input component with built-in features.

| Prop      | Type    | Required | Description                         |
| --------- | ------- | -------- | ----------------------------------- |
| name      | string  | ✅       | Field name                          |
| type      | string  | ❌       | Input type (text, email, password…) |
| required  | boolean | ❌       | Mark the field as required          |
| minLength | number  | ❌       | Minimum character length            |
| maxLength | number  | ❌       | Maximum character length            |

**Features:**

- 🔒 Automatic password visibility toggle for `type="password"`
- ✅ Automatic validation for confirmation fields (e.g. `confirmPassword`)
- 🎯 Full TypeScript support

### FormKit.Select

Dropdown select component built on Radix UI.

| Prop        | Type                  | Required | Description                                                                    |
| ----------- | --------------------- | -------- | ------------------------------------------------------------------------------ |
| name        | string                | ✅       | Field name                                                                     |
| options     | Array<{value, label}> | ✅       | Select options                                                                 |
| placeholder | string                | ❌       | Placeholder text. Falls back to the default for the `locale` of `FormKit.Root` |
| required    | boolean               | ❌       | Mark the field as required                                                     |

### FormKit.Textarea

Multi-line text input component.

| Prop      | Type    | Required | Description                         |
| --------- | ------- | -------- | ----------------------------------- |
| name      | string  | ✅       | Field name                          |
| required  | boolean | ❌       | Mark the field as required          |
| minLength | number  | ❌       | Minimum character length            |
| maxLength | number  | ❌       | Maximum character length            |
| rows      | number  | ❌       | Number of visible lines (default 4) |

### FormKit.Fieldset

Groups related form fields together.

| Prop      | Type      | Required | Description      |
| --------- | --------- | -------- | ---------------- |
| className | string    | ❌       | Custom CSS class |
| children  | ReactNode | ✅       | Child components |

### FormKit.Legend

Fieldset title with an optional required indicator.

| Prop      | Type      | Required | Description           |
| --------- | --------- | -------- | --------------------- |
| required  | boolean   | ❌       | Show a red asterisk * |
| className | string    | ❌       | Custom CSS class      |
| children  | ReactNode | ✅       | Legend text           |

### FormKit.Label

Accessible label for form inputs.

| Prop      | Type      | Required | Description      |
| --------- | --------- | -------- | ---------------- |
| className | string    | ❌       | Custom CSS class |
| children  | ReactNode | ✅       | Label text       |

### FormKit.Description

A hint that shows input examples or the expected format. Inputs in the same Field point to it with `aria-describedby`, so screen readers read the description when the field gets focus. When an error is shown as well, the input points to both.

The description is not part of the field's accessible name. Field is a `label`, so without this the name would grow into something like "Expected headcount Number of attendees", which gets in the way when scanning a list of fields.

```tsx
<FormKit.Field>
  <FormKit.Legend required>Expected headcount</FormKit.Legend>
  <FormKit.Description>Number of attendees</FormKit.Description>
  <FormKit.Input name="headcount" type="number" required />
</FormKit.Field>
```

| Prop      | Type      | Required | Description      |
| --------- | --------- | -------- | ---------------- |
| className | string    | ❌       | Custom CSS class |
| children  | ReactNode | ✅       | Description text |

### FormKit.Title

Form title/header component.

| Prop      | Type      | Required | Description      |
| --------- | --------- | -------- | ---------------- |
| className | string    | ❌       | Custom CSS class |
| children  | ReactNode | ✅       | Title text       |

### FormKit.SubmitButton

Submit button with a built-in loading state.

| Prop      | Type      | Required | Description          |
| --------- | --------- | -------- | -------------------- |
| variant   | string    | ❌       | Button style variant |
| disabled  | boolean   | ❌       | Disable the button   |
| className | string    | ❌       | Custom CSS class     |
| children  | ReactNode | ✅       | Button text          |

### FormKit.ResetButton

Resets the form to its initial values.

| Prop      | Type      | Required | Description              |
| --------- | --------- | -------- | ------------------------ |
| onClick   | function  | ❌       | Additional click handler |
| className | string    | ❌       | Custom CSS class         |
| children  | ReactNode | ✅       | Button text              |

### FormKit.Wrapper

Container component for custom layouts.

| Prop      | Type      | Required | Description      |
| --------- | --------- | -------- | ---------------- |
| className | string    | ❌       | Custom CSS class |
| children  | ReactNode | ✅       | Child components |

### FormKit.Unit

Displays a unit next to an input field.

| Prop | Type   | Required | Description                       |
| ---- | ------ | -------- | --------------------------------- |
| unit | string | ✅       | Unit text (e.g. "USD", "kg", "%") |

### FormKit.Error

Displays a validation error message.

| Prop  | Type       | Required | Description                       |
| ----- | ---------- | -------- | --------------------------------- |
| error | FieldError | ❌       | Error object from react-hook-form |

## 🎨 Styling

### Changing Colors

The default theme reads your app's CSS variables first and falls back to its own defaults only when they are missing. Define any of the variables below on `:root` and they apply as-is. Use complete color values (`oklch(...)`, `hsl(...)`, `#hex`).

```css
:root {
  --primary: oklch(0.53 0.15 215); /* accent: default button, focus ring, required mark */
  --primary-foreground: oklch(0.99 0 0); /* text on the accent color */
  --background: oklch(1 0 0); /* focused input background */
  --foreground: oklch(0.24 0.015 270); /* body text */
  --muted-foreground: oklch(0.52 0.012 270); /* hints and placeholders */
  --input: oklch(0.9 0.006 270); /* borders */
  --destructive: oklch(0.55 0.2 25); /* errors */
}
```

Corner radius and control height are set with `--fk-` variables.

```css
:root {
  --fk-radius: 0.625rem;
  --fk-control-height: 2.75rem;
}
```

### Overriding with Classes

Components pass `className` straight through, and the default look lives only inside `@layer formkit`. Rules in a layer always lose to unlayered rules and framework utilities, so the classes you pass win over the defaults regardless of their name or specificity.

```tsx
<FormKit.Input name="email" className="rounded-none border-2 border-black" />
```

Plain CSS classes work the same way in apps that don't use Tailwind.

## 🧪 Testing

```tsx
import FormKit from '@jiin.seok/formkit-react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

test('submits form data', async () => {
  const handleSubmit = jest.fn()

  render(
    <FormKit.Root formId="test" onSubmit={handleSubmit}>
      <FormKit.Field>
        <FormKit.Input name="username" />
      </FormKit.Field>
      <FormKit.SubmitButton>Submit</FormKit.SubmitButton>
    </FormKit.Root>
  )

  await userEvent.type(screen.getByRole('textbox'), 'john')
  await userEvent.click(screen.getByRole('button'))

  expect(handleSubmit).toHaveBeenCalledWith({ username: 'john' })
})
```

## 📄 License

MIT © [Jiin Seok]

## 🔗 Links

- [Documentation](https://github.com/JiinSeok/formkit-react)
- [Examples](https://github.com/JiinSeok/formkit-react/tree/main/examples)
- [Report an Issue](https://github.com/JiinSeok/formkit-react/issues)
