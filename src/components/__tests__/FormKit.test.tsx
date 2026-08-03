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

  const genreOptions = [
    { value: 'drama', label: '드라마' },
    { value: 'song', label: '노래' },
  ]

  it('locale을 지정하지 않으면 Select 기본 placeholder는 영어다', () => {
    render(
      <FormKit.Root formId="f" onSubmit={vi.fn()}>
        <FormKit.Field htmlFor="genre">
          <FormKit.Select name="genre" options={genreOptions} />
        </FormKit.Field>
      </FormKit.Root>,
    )

    expect(screen.getByText('Select an option')).toBeInTheDocument()
  })

  it('locale="ko"이면 Select 기본 placeholder가 한국어로 바뀐다', () => {
    render(
      <FormKit.Root formId="f" locale="ko" onSubmit={vi.fn()}>
        <FormKit.Field htmlFor="genre">
          <FormKit.Select name="genre" options={genreOptions} />
        </FormKit.Field>
      </FormKit.Root>,
    )

    expect(screen.getByText('옵션을 선택하세요')).toBeInTheDocument()
  })

  it('placeholder를 직접 넘기면 locale 기본값 대신 그 텍스트가 쓰인다', () => {
    render(
      <FormKit.Root formId="f" locale="ko" onSubmit={vi.fn()}>
        <FormKit.Field htmlFor="genre">
          <FormKit.Select name="genre" options={genreOptions} placeholder="장르를 골라주세요" />
        </FormKit.Field>
      </FormKit.Root>,
    )

    expect(screen.getByText('장르를 골라주세요')).toBeInTheDocument()
    expect(screen.queryByText('옵션을 선택하세요')).not.toBeInTheDocument()
  })

  it('messages로 개별 문구만 덮어쓸 수 있다', () => {
    render(
      <FormKit.Root
        formId="f"
        locale="ko"
        messages={{ selectPlaceholder: '선택 안 함' }}
        onSubmit={vi.fn()}
      >
        <FormKit.Field htmlFor="genre">
          <FormKit.Select name="genre" options={genreOptions} />
        </FormKit.Field>
      </FormKit.Root>,
    )

    expect(screen.getByText('선택 안 함')).toBeInTheDocument()
  })

  it('required Input에 aria-required가 붙는다', () => {
    render(
      <FormKit.Root formId="f" onSubmit={vi.fn()}>
        <FormKit.Field htmlFor="name">
          <FormKit.Label>이름</FormKit.Label>
          <FormKit.Input name="name" required />
        </FormKit.Field>
      </FormKit.Root>,
    )

    expect(screen.getByLabelText('이름')).toHaveAttribute('aria-required', 'true')
  })

  it('필수가 아니면 aria-required를 붙이지 않는다', () => {
    render(
      <FormKit.Root formId="f" onSubmit={vi.fn()}>
        <FormKit.Field htmlFor="name">
          <FormKit.Label>이름</FormKit.Label>
          <FormKit.Input name="name" />
        </FormKit.Field>
      </FormKit.Root>,
    )

    expect(screen.getByLabelText('이름')).not.toHaveAttribute('aria-required')
  })

  it('검증 실패 시 에러가 role="alert"로 노출되고 입력과 aria로 연결된다', async () => {
    const user = userEvent.setup()
    const schema = z.object({
      email: z.string().email('유효하지 않은 이메일 주소입니다'),
    })

    render(
      <FormKit.Root formId="login" schema={schema} onSubmit={vi.fn()}>
        <FormKit.Field htmlFor="email">
          <FormKit.Label>이메일</FormKit.Label>
          <FormKit.Input name="email" required />
        </FormKit.Field>
        <FormKit.SubmitButton>로그인</FormKit.SubmitButton>
      </FormKit.Root>,
    )

    const input = screen.getByLabelText('이메일')
    await user.type(input, '이메일아님')
    await user.click(screen.getByRole('button', { name: '로그인' }))

    // role="alert"로 에러가 노출된다
    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent('유효하지 않은 이메일 주소입니다')

    // 입력이 무효 표시되고 그 에러 메시지를 aria-describedby로 가리킨다
    await waitFor(() => expect(input).toHaveAttribute('aria-invalid', 'true'))
    expect(input).toHaveAttribute('aria-describedby', alert.id)
    expect(alert.id).toBeTruthy()
  })

  it('Description을 두면 입력이 그 설명을 aria-describedby로 가리킨다', () => {
    render(
      <FormKit.Root formId="signup" onSubmit={vi.fn()}>
        <FormKit.Field htmlFor="headcount">
          <FormKit.Label>예상 인원</FormKit.Label>
          <FormKit.Description>수업에 참여하실 어르신 수</FormKit.Description>
          <FormKit.Input name="headcount" type="number" />
        </FormKit.Field>
      </FormKit.Root>,
    )

    const input = screen.getByRole('spinbutton', { name: '예상 인원' })
    const description = screen.getByText('수업에 참여하실 어르신 수')

    expect(input).toHaveAttribute('aria-describedby', description.id)
    expect(description.id).toBeTruthy()
  })

  // 설명이 칸 이름에 섞이면 스크린리더로 칸 목록을 훑을 때 이름이 길어져 방해가 된다.
  it('Description은 칸 이름에 섞이지 않는다', () => {
    render(
      <FormKit.Root formId="signup" onSubmit={vi.fn()}>
        <FormKit.Field htmlFor="headcount">
          <FormKit.Label>예상 인원</FormKit.Label>
          <FormKit.Description>수업에 참여하실 어르신 수</FormKit.Description>
          <FormKit.Input name="headcount" />
        </FormKit.Field>
      </FormKit.Root>,
    )

    expect(screen.getByText('수업에 참여하실 어르신 수')).toHaveAttribute('aria-hidden', 'true')
  })

  it('Description이 없으면 aria-describedby를 붙이지 않는다', () => {
    render(
      <FormKit.Root formId="signup" onSubmit={vi.fn()}>
        <FormKit.Field htmlFor="name">
          <FormKit.Label>성명</FormKit.Label>
          <FormKit.Input name="name" />
        </FormKit.Field>
      </FormKit.Root>,
    )

    expect(screen.getByRole('textbox', { name: '성명' })).not.toHaveAttribute('aria-describedby')
  })

  it('설명과 에러가 함께 있으면 둘 다 가리킨다', async () => {
    const user = userEvent.setup()
    const schema = z.object({ email: z.string().email('유효하지 않은 이메일 주소입니다') })

    render(
      <FormKit.Root formId="login" schema={schema} onSubmit={vi.fn()}>
        <FormKit.Field htmlFor="email">
          <FormKit.Label>이메일</FormKit.Label>
          <FormKit.Description>회사 주소를 적어 주세요</FormKit.Description>
          <FormKit.Input name="email" required />
        </FormKit.Field>
        <FormKit.SubmitButton>로그인</FormKit.SubmitButton>
      </FormKit.Root>,
    )

    const input = screen.getByRole('textbox', { name: '이메일' })
    await user.type(input, '이메일아님')
    await user.click(screen.getByRole('button', { name: '로그인' }))

    const alert = await screen.findByRole('alert')
    const description = screen.getByText('회사 주소를 적어 주세요')

    await waitFor(() =>
      expect(input).toHaveAttribute('aria-describedby', `${description.id} ${alert.id}`),
    )
  })

  // onValueChange를 그대로 Root에 흘리면 field.onChange를 덮어써 고른 값이 폼에 들어가지 않았다.
  it('Select에 onValueChange를 넘겨도 고른 값이 제출된다', async () => {
    const user = userEvent.setup()
    const handleSubmit = vi.fn()
    const handleValueChange = vi.fn()

    render(
      <FormKit.Root formId="signup" onSubmit={handleSubmit}>
        <FormKit.Field htmlFor="facility">
          <FormKit.Label>기관 유형</FormKit.Label>
          <FormKit.Select
            name="facility"
            options={[
              { value: 'welfare', label: '노인복지기관' },
              { value: 'etc', label: '기타' },
            ]}
            onValueChange={handleValueChange}
          />
        </FormKit.Field>
        <FormKit.SubmitButton>보내기</FormKit.SubmitButton>
      </FormKit.Root>,
    )

    await user.click(screen.getByRole('combobox'))
    await user.click(await screen.findByRole('option', { name: '노인복지기관' }))
    await user.click(screen.getByRole('button', { name: '보내기' }))

    await waitFor(() => expect(handleSubmit).toHaveBeenCalledTimes(1))
    expect(handleSubmit.mock.calls[0][0]).toEqual({ facility: 'welfare' })
    expect(handleValueChange).toHaveBeenCalledWith('welfare')
  })
})
