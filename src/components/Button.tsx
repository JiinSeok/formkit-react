import * as React from 'react'
import { cn } from '../utils/cn'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

// 모양은 styles.css의 @layer formkit이 data-variant·data-size를 보고 그린다. className은 그대로
// 흘려보내므로 소비자가 넘긴 클래스가 레이어 규칙을 언제나 이긴다.
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        data-formkit="button"
        data-variant={variant}
        data-size={size}
        className={cn(className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button }
