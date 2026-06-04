import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { z } from 'zod'
import FormKitDefault from '../../index'
import { FormKit } from '../FormKit'

describe('FormKit', () => {
  it('default export와 named export가 같은 객체를 가리킨다', () => {
    expect(FormKitDefault).toBe(FormKit)
  })

  it('폼을 렌더링하고 입력값을 제출한다', async () => {
    const user = userEvent.setup()
    const handleSubmit = vi.fn()

    render(
      <FormKit.Root formId="login" onSubmit={handleSubmit}>
        <FormKit.Field htmlFor="email">
          <FormKit.Label>이메일</FormKit.Label>
          <FormKit.Input name="email" type="email" />
        </FormKit.Field>
        <FormKit.SubmitButton>로그인</FormKit.SubmitButton>
      </FormKit.Root>,
    )

    await user.type(screen.getByLabelText('이메일'), 'user@example.com')
    await user.click(screen.getByRole('button', { name: '로그인' }))

    await waitFor(() => expect(handleSubmit).toHaveBeenCalledTimes(1))
    expect(handleSubmit.mock.calls[0][0]).toEqual({ email: 'user@example.com' })
  })

  it('zod 스키마 검증에 실패하면 제출되지 않고 에러 메시지를 보여준다', async () => {
    const user = userEvent.setup()
    const handleSubmit = vi.fn()
    const schema = z.object({
      email: z.string().email('유효하지 않은 이메일 주소입니다'),
    })

    render(
      <FormKit.Root formId="login" schema={schema} onSubmit={handleSubmit}>
        <FormKit.Field htmlFor="email">
          <FormKit.Label>이메일</FormKit.Label>
          <FormKit.Input name="email" />
        </FormKit.Field>
        <FormKit.SubmitButton>로그인</FormKit.SubmitButton>
      </FormKit.Root>,
    )

    await user.type(screen.getByLabelText('이메일'), '이메일아님')
    await user.click(screen.getByRole('button', { name: '로그인' }))

    expect(
      await screen.findByText('유효하지 않은 이메일 주소입니다'),
    ).toBeInTheDocument()
    expect(handleSubmit).not.toHaveBeenCalled()
  })
})
