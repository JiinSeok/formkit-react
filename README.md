# @jiin.seok/formkit-react

🚀 Compound Component Pattern과 내장 검증, TypeScript 지원을 갖춘 강력한 React 폼 라이브러리

[![npm version](https://img.shields.io/npm/v/@jiin.seok/formkit-react.svg)](https://www.npmjs.com/package/@jiin.seok/formkit-react)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[English Documentation](./README-EN.md)

## ✨ 주요 기능

- 🎯 **Compound Component Pattern** - 깔끔하고 조합 가능한 API
- 🔄 **React Hook Form 통합** - 성능 최적화
- 🛡️ **Zod 스키마 지원** - 타입 안전 검증
- ♿ **접근성 우선** - ARIA 준수
- 🎨 **Tailwind CSS 스타일링** - 기본적으로 아름다운 디자인
- 📝 **TypeScript** - 완전한 타입 안정성
- 🔒 **비밀번호 토글** - 내장 가시성 토글
- 🎛️ **Select 컴포넌트** - Radix UI 기반

## 📦 설치

```bash
npm install @jiin.seok/formkit-react
# 또는
yarn add @jiin.seok/formkit-react
# 또는
pnpm add @jiin.seok/formkit-react
```

### Peer Dependencies

```bash
npm install react react-dom
```

> `react-hook-form`, `zod`, `@hookform/resolvers` 등은 패키지 의존성으로 자동 설치됩니다.

### 스타일 불러오기

앱 진입점(예: `main.tsx`, `layout.tsx`)에서 기본 스타일을 한 번 불러옵니다.

```tsx
import '@jiin.seok/formkit-react/styles.css'
```

색상은 CSS 변수 기반이라 `:root`에서 변수만 오버라이드하면 테마를 바꿀 수 있습니다.

```css
:root {
  --primary: 222.2 47.4% 11.2%; /* hsl 값 (쉼표 없이) */
  --destructive: 0 84.2% 60.2%;
}
```

## 🚀 빠른 시작

### 기본 예제

```tsx
import FormKit from '@jiin.seok/formkit-react'

function LoginForm() {
  const handleSubmit = (data) => {
    console.log('폼 데이터:', data)
  }

  return (
    <FormKit.Root formId="login" onSubmit={handleSubmit}>
      <FormKit.Title>로그인</FormKit.Title>
      
      <FormKit.Field>
        <FormKit.Label>이메일</FormKit.Label>
        <FormKit.Input name="email" type="email" required />
      </FormKit.Field>
      
      <FormKit.Field>
        <FormKit.Label>비밀번호</FormKit.Label>
        <FormKit.Input name="password" type="password" required />
      </FormKit.Field>
      
      <FormKit.SubmitButton>로그인</FormKit.SubmitButton>
    </FormKit.Root>
  )
}
```

### Zod 검증과 함께 사용

```tsx
import FormKit from '@jiin.seok/formkit-react'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email('유효하지 않은 이메일 주소입니다'),
  password: z.string().min(8, '비밀번호는 최소 8자 이상이어야 합니다')
})

function LoginForm() {
  const handleSubmit = (data) => {
    console.log('검증된 데이터:', data)
  }

  return (
    <FormKit.Root 
      formId="login" 
      schema={loginSchema} 
      onSubmit={handleSubmit}
    >
      <FormKit.Field>
        <FormKit.Label>이메일</FormKit.Label>
        <FormKit.Input name="email" type="email" />
      </FormKit.Field>
      
      <FormKit.Field>
        <FormKit.Label>비밀번호</FormKit.Label>
        <FormKit.Input name="password" type="password" />
      </FormKit.Field>
      
      <FormKit.SubmitButton>로그인</FormKit.SubmitButton>
    </FormKit.Root>
  )
}
```

### Select를 포함한 고급 폼

```tsx
import FormKit from '@jiin.seok/formkit-react'

function RegistrationForm() {
  const countries = [
    { value: 'kr', label: '대한민국' },
    { value: 'us', label: '미국' },
    { value: 'jp', label: '일본' },
  ]

  return (
    <FormKit.Root formId="registration" onSubmit={handleSubmit}>
      <FormKit.Fieldset>
        <FormKit.Legend required>개인 정보</FormKit.Legend>
        
        <FormKit.Field>
          <FormKit.Label>이름</FormKit.Label>
          <FormKit.Input name="fullName" required />
        </FormKit.Field>
        
        <FormKit.Field>
          <FormKit.Label>국가</FormKit.Label>
          <FormKit.Select 
            name="country" 
            options={countries}
            placeholder="국가를 선택하세요"
            required
          />
        </FormKit.Field>
        
        <FormKit.Field>
          <FormKit.Label>자기소개</FormKit.Label>
          <FormKit.Textarea 
            name="bio" 
            placeholder="간단한 자기소개를 작성해주세요"
            maxLength={500}
          />
        </FormKit.Field>
      </FormKit.Fieldset>
      
      <FormKit.SubmitButton>가입하기</FormKit.SubmitButton>
    </FormKit.Root>
  )
}
```

## 📦 사용 가능한 컴포넌트

FormKit은 포괄적인 폼 컴포넌트 세트를 제공합니다:

### 📝 핵심 컴포넌트
- **FormKit.Root** - 검증 컨텍스트를 포함한 메인 폼 컨테이너
- **FormKit.Field** - 레이블-입력 연결이 있는 필드 래퍼
- **FormKit.Fieldset** - 관련된 필드 그룹화
- **FormKit.Legend** - 필수 표시가 선택적으로 포함된 필드셋 제목

### 🎨 입력 컴포넌트
- **FormKit.Input** - 비밀번호 토글, 이메일, 숫자 등을 지원하는 텍스트 입력
- **FormKit.Textarea** - 여러 줄 텍스트 입력
- **FormKit.Select** - 검색 기능이 있는 드롭다운 선택 (Radix UI 기반)

### 🏷️ 표시 컴포넌트
- **FormKit.Label** - 필드 레이블
- **FormKit.Title** - 폼 제목
- **FormKit.Wrapper** - 커스텀 레이아웃용 컨테이너
- **FormKit.Unit** - 단위 표시 (예: "원", "kg")
- **FormKit.Error** - 오류 메시지 표시

### 🎯 액션 컴포넌트
- **FormKit.SubmitButton** - 로딩 상태가 있는 제출 버튼
- **FormKit.ResetButton** - 폼을 초기값으로 재설정

## 📚 API 레퍼런스

### FormKit.Root

모든 자식 컴포넌트에 컨텍스트를 제공하는 메인 폼 컨테이너입니다.

| Prop | Type | 필수 | 설명 |
|------|------|------|------|
| formId | string | ✅ | 폼의 고유 식별자 |
| onSubmit | (data) => void | ✅ | 폼 제출 핸들러 |
| schema | ZodSchema | ❌ | 검증을 위한 Zod 스키마 |
| defaultValues | object | ❌ | 기본 폼 값 |
| locale | `'ko' \| 'en'` | ❌ | 자동 노출 문구(Select placeholder·비밀번호 aria-label)의 기본 언어. 기본값 `'en'` |
| messages | `Partial<FormMessages>` | ❌ | 개별 문구만 덮어쓰기. `locale` 기본값 위에 얕게 병합됨 |

```tsx
// 폼 전체의 기본 문구를 한국어로
<FormKit.Root formId="signup" locale="ko" onSubmit={onSubmit}>
  {/* Select 기본 placeholder가 '옵션을 선택하세요'로 나온다 */}
  <FormKit.Select name="genre" options={options} />
</FormKit.Root>

// 특정 문구만 커스텀
<FormKit.Root
  formId="signup"
  locale="ko"
  messages={{ selectPlaceholder: '장르를 골라주세요' }}
  onSubmit={onSubmit}
/>
```

### FormKit.Field

자동 레이블-입력 연결이 있는 폼 입력용 컨테이너입니다.

| Prop | Type | 기본값 | 설명 |
|------|------|--------|------|
| isInline | boolean | false | 레이블과 입력을 가로로 표시 |
| hidden | boolean | false | 필드 숨기기 |
| htmlFor | string | auto | 레이블-입력 연결을 위한 커스텀 ID |

### FormKit.Input

내장 기능이 있는 향상된 입력 컴포넌트입니다.

| Prop | Type | 필수 | 설명 |
|------|------|------|------|
| name | string | ✅ | 필드 이름 |
| type | string | ❌ | 입력 타입 (text, email, password 등) |
| required | boolean | ❌ | 필드를 필수로 표시 |
| minLength | number | ❌ | 최소 문자 길이 |
| maxLength | number | ❌ | 최대 문자 길이 |

**기능:**
- 🔒 `type="password"`에 대한 자동 비밀번호 가시성 토글
- ✅ 확인 필드에 대한 자동 검증 (예: `confirmPassword`)
- 🎯 완전한 TypeScript 지원

### FormKit.Select

Radix UI를 사용한 드롭다운 선택 컴포넌트입니다.

| Prop | Type | 필수 | 설명 |
|------|------|------|------|
| name | string | ✅ | 필드 이름 |
| options | Array<{value, label}> | ✅ | 선택 옵션 |
| placeholder | string | ❌ | 플레이스홀더 텍스트. 넘기지 않으면 `FormKit.Root`의 `locale`에 맞는 기본값 사용 |
| required | boolean | ❌ | 필드를 필수로 표시 |

### FormKit.Textarea

여러 줄 텍스트 입력 컴포넌트입니다.

| Prop | Type | 필수 | 설명 |
|------|------|------|------|
| name | string | ✅ | 필드 이름 |
| required | boolean | ❌ | 필드를 필수로 표시 |
| minLength | number | ❌ | 최소 문자 길이 |
| maxLength | number | ❌ | 최대 문자 길이 |
| rows | number | ❌ | 표시되는 텍스트 줄 수 (기본값: 4) |

### FormKit.Fieldset

관련된 폼 필드를 함께 그룹화합니다.

| Prop | Type | 필수 | 설명 |
|------|------|------|------|
| className | string | ❌ | 커스텀 CSS 클래스 |
| children | ReactNode | ✅ | 자식 컴포넌트 |

### FormKit.Legend

필수 표시가 선택적으로 있는 필드셋 제목입니다.

| Prop | Type | 필수 | 설명 |
|------|------|------|------|
| required | boolean | ❌ | 빨간색 별표(*) 표시 |
| className | string | ❌ | 커스텀 CSS 클래스 |
| children | ReactNode | ✅ | 범례 텍스트 |

### FormKit.Label

폼 입력을 위한 접근 가능한 레이블입니다.

| Prop | Type | 필수 | 설명 |
|------|------|------|------|
| className | string | ❌ | 커스텀 CSS 클래스 |
| children | ReactNode | ✅ | 레이블 텍스트 |

### FormKit.Title

폼 제목/헤더 컴포넌트입니다.

| Prop | Type | 필수 | 설명 |
|------|------|------|------|
| className | string | ❌ | 커스텀 CSS 클래스 |
| children | ReactNode | ✅ | 제목 텍스트 |

### FormKit.SubmitButton

내장 로딩 상태가 있는 제출 버튼입니다.

| Prop | Type | 필수 | 설명 |
|------|------|------|------|
| variant | string | ❌ | 버튼 스타일 변형 |
| disabled | boolean | ❌ | 버튼 비활성화 |
| className | string | ❌ | 커스텀 CSS 클래스 |
| children | ReactNode | ✅ | 버튼 텍스트 |

### FormKit.ResetButton

폼을 초기값으로 재설정합니다.

| Prop | Type | 필수 | 설명 |
|------|------|------|------|
| onClick | function | ❌ | 추가 클릭 핸들러 |
| className | string | ❌ | 커스텀 CSS 클래스 |
| children | ReactNode | ✅ | 버튼 텍스트 |

### FormKit.Wrapper

커스텀 레이아웃용 컨테이너 컴포넌트입니다.

| Prop | Type | 필수 | 설명 |
|------|------|------|------|
| className | string | ❌ | 커스텀 CSS 클래스 |
| children | ReactNode | ✅ | 자식 컴포넌트 |

### FormKit.Unit

입력 필드 옆에 단위를 표시합니다.

| Prop | Type | 필수 | 설명 |
|------|------|------|------|
| unit | string | ✅ | 단위 텍스트 (예: "원", "kg", "%") |

### FormKit.Error

검증 오류 메시지를 표시합니다.

| Prop | Type | 필수 | 설명 |
|------|------|------|------|
| error | FieldError | ❌ | react-hook-form의 오류 객체 |

## 🎨 스타일링

FormKit은 테마를 위해 CSS 변수와 함께 Tailwind CSS를 사용합니다. CSS에 다음 변수를 추가하세요:

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
  /* ... 다른 다크 모드 변수들 */
}
```

## 🧪 테스팅

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FormKit from '@jiin.seok/formkit-react'

test('폼 데이터 제출', async () => {
  const handleSubmit = jest.fn()
  
  render(
    <FormKit.Root formId="test" onSubmit={handleSubmit}>
      <FormKit.Field>
        <FormKit.Input name="username" />
      </FormKit.Field>
      <FormKit.SubmitButton>제출</FormKit.SubmitButton>
    </FormKit.Root>
  )
  
  await userEvent.type(screen.getByRole('textbox'), 'john')
  await userEvent.click(screen.getByRole('button'))
  
  expect(handleSubmit).toHaveBeenCalledWith({ username: 'john' })
})
```

## 📄 라이선스

MIT © [Jiin Seok]

## 🔗 링크

- [문서](https://github.com/JiinSeok/formkit-react)
- [예제](https://github.com/JiinSeok/formkit-react/tree/main/examples)
- [이슈 리포트](https://github.com/JiinSeok/formkit-react/issues)
