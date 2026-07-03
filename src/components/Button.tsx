import * as React from 'react'
import { cn } from '../utils/cn'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    
    // jiin: 색 토큰이 완전색상값(var())이라 Tailwind v3의 /opacity 모디파이어는 알파를 주입하지 못하고
    // 규칙을 통째로 누락시킨다. 대신 color-mix arbitrary value로 알파를 명시한다(hsl·oklch 무관하게 동작).
    // bg-primary/90 == primary 알파 90% == transparent와 10% 혼합.
    const variants = {
      default:
        'bg-primary text-primary-foreground hover:bg-[color-mix(in_oklab,var(--primary)_90%,transparent)]',
      destructive:
        'bg-destructive text-destructive-foreground hover:bg-[color-mix(in_oklab,var(--destructive)_90%,transparent)]',
      outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
      secondary:
        'bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklab,var(--secondary)_80%,transparent)]',
      ghost: 'hover:bg-accent hover:text-accent-foreground',
      link: 'text-primary underline-offset-4 hover:underline',
    }
    
    const sizes = {
      default: 'h-10 px-4 py-2',
      sm: 'h-9 rounded-md px-3',
      lg: 'h-11 rounded-md px-8',
      icon: 'h-10 w-10',
    }
    
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          variants[variant as keyof typeof variants],
          sizes[size],
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button }