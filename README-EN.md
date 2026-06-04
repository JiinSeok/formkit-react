# @jiin.seok/formkit-react

🚀 A powerful React form library with Compound Component Pattern, built-in validation, and TypeScript support

[![npm version](https://img.shields.io/npm/v/@jiin.seok/formkit-react.svg)](https://www.npmjs.com/package/@jiin.seok/formkit-react)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

- 🎯 **Compound Component Pattern** - Clean, composable API
- 🔄 **React Hook Form Integration** - Performance optimized
- 🛡️ **Zod Schema Support** - Type-safe validation
- ♿ **Accessibility First** - ARIA compliant
- 🎨 **Tailwind CSS Styled** - Beautiful by default
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
npm install react react-dom
```

> `react-hook-form`, `zod`, and `@hookform/resolvers` are installed automatically as package dependencies.

### Import Styles

Import the base stylesheet once at your app entry point (e.g. `main.tsx`, `layout.tsx`).

```tsx
import '@jiin.seok/formkit-react/styles.css'
```

Colors are CSS-variable based, so you can theme the library by overriding variables on `:root`.

```css
:root {
  --primary: 222.2 47.4% 11.2%; /* hsl values without commas */
  --destructive: 0 84.2% 60.2%;
}
```

## 🚀 Quick Start

### Basic Example

```tsx
import FormKit from '@jiin.seok/formkit-react'

function LoginForm() {
  const handleSubmit = (data) => {
    console.log('Form data:', data)
  }

  return (
    <FormKit.Root formId="login" onSubmit={handleSubmit}>
      <FormKit.Title>Login</FormKit.Title>
      
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
  password: z.string().min(8, 'Password must be at least 8 characters')
})

function LoginForm() {
  const handleSubmit = (data) => {
    console.log('Validated data:', data)
  }

  return (
    <FormKit.Root 
      formId="login" 
      schema={loginSchema} 
      onSubmit={handleSubmit}
    >
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
    { value: 'us', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'ca', label: 'Canada' },
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
          <FormKit.Textarea 
            name="bio" 
            placeholder="Tell us about yourself"
            maxLength={500}
          />
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
- **FormKit.Field** - Field wrapper with label-input association
- **FormKit.Fieldset** - Group related fields
- **FormKit.Legend** - Fieldset title with optional required indicator

### 🎨 Input Components
- **FormKit.Input** - Text input with password toggle, email, number, etc.
- **FormKit.Textarea** - Multi-line text input
- **FormKit.Select** - Dropdown select with search (powered by Radix UI)

### 🏷️ Display Components
- **FormKit.Label** - Field label
- **FormKit.Title** - Form title
- **FormKit.Wrapper** - Container for custom layouts
- **FormKit.Unit** - Display units (e.g., "원", "kg")
- **FormKit.Error** - Error message display

### 🎯 Action Components
- **FormKit.SubmitButton** - Submit button with loading states
- **FormKit.ResetButton** - Reset form to initial values

## 📚 API Reference

### FormKit.Root

The main form container that provides context to all child components.

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| formId | string | ✅ | Unique identifier for the form |
| onSubmit | (data) => void | ✅ | Form submission handler |
| schema | ZodSchema | ❌ | Zod schema for validation |
| defaultValues | object | ❌ | Default form values |

### FormKit.Field

Container for form inputs with automatic label-input association.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| isInline | boolean | false | Display label and input horizontally |
| hidden | boolean | false | Hide the field |
| htmlFor | string | auto | Custom ID for label-input association |

### FormKit.Input

Enhanced input component with built-in features.

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| name | string | ✅ | Field name |
| type | string | ❌ | Input type (text, email, password, etc.) |
| required | boolean | ❌ | Mark field as required |
| minLength | number | ❌ | Minimum character length |
| maxLength | number | ❌ | Maximum character length |

**Features:**
- 🔒 Automatic password visibility toggle for `type="password"`
- ✅ Automatic validation for confirm fields (e.g., `confirmPassword`)
- 🎯 Full TypeScript support

### FormKit.Select

Dropdown select component with Radix UI.

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| name | string | ✅ | Field name |
| options | Array<{value, label}> | ✅ | Select options |
| placeholder | string | ❌ | Placeholder text |
| required | boolean | ❌ | Mark field as required |

### FormKit.Textarea

Multi-line text input component.

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| name | string | ✅ | Field name |
| required | boolean | ❌ | Mark field as required |
| minLength | number | ❌ | Minimum character length |
| maxLength | number | ❌ | Maximum character length |
| rows | number | ❌ | Number of visible text lines (default: 4) |

### FormKit.Fieldset

Groups related form fields together.

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| className | string | ❌ | Custom CSS classes |
| children | ReactNode | ✅ | Child components |

### FormKit.Legend

Title for a fieldset with optional required indicator.

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| required | boolean | ❌ | Shows red asterisk (*) |
| className | string | ❌ | Custom CSS classes |
| children | ReactNode | ✅ | Legend text |

### FormKit.Label

Accessible label for form inputs.

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| className | string | ❌ | Custom CSS classes |
| children | ReactNode | ✅ | Label text |

### FormKit.Title

Form title/header component.

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| className | string | ❌ | Custom CSS classes |
| children | ReactNode | ✅ | Title text |

### FormKit.SubmitButton

Submit button with built-in loading states.

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| variant | string | ❌ | Button style variant |
| disabled | boolean | ❌ | Disable button |
| className | string | ❌ | Custom CSS classes |
| children | ReactNode | ✅ | Button text |

### FormKit.ResetButton

Resets form to initial values.

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| onClick | function | ❌ | Additional click handler |
| className | string | ❌ | Custom CSS classes |
| children | ReactNode | ✅ | Button text |

### FormKit.Wrapper

Container component for custom layouts.

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| className | string | ❌ | Custom CSS classes |
| children | ReactNode | ✅ | Child components |

### FormKit.Unit

Displays units next to input fields.

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| unit | string | ✅ | Unit text (e.g., "원", "kg", "%") |

### FormKit.Error

Displays validation error messages.

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| error | FieldError | ❌ | Error object from react-hook-form |

## 🎨 Styling

FormKit uses Tailwind CSS with CSS variables for theming. Add these variables to your CSS:

```css
:root {
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 222.2 84% 4.9%;
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96.1%;
  --secondary-foreground: 222.2 47.4% 11.2%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
  --muted: 210 40% 96.1%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --accent: 210 40% 96.1%;
  --accent-foreground: 222.2 47.4% 11.2%;
  --popover: 0 0% 100%;
  --popover-foreground: 222.2 84% 4.9%;
}

.dark {
  --border: 217.2 32.6% 17.5%;
  --input: 217.2 32.6% 17.5%;
  --ring: 212.7 26.8% 83.9%;
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... other dark mode variables */
}
```

## 🧪 Testing

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FormKit from '@jiin.seok/formkit-react'

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

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

MIT © [Jiin Seok]

## 🔗 Links

- [Documentation](https://github.com/JiinSeok/formkit-react)
- [Examples](https://github.com/JiinSeok/formkit-react/tree/main/examples)
- [Report Issues](https://github.com/JiinSeok/formkit-react/issues)