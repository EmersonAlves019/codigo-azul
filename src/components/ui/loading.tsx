import * as React from 'react'
import { cn } from '@/lib/utils'
import { Spinner } from '@/components/ui/spinner'
import { Sparkles } from 'lucide-react'

export interface LoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'centered' | 'overlay' | 'inline'
  message?: string
  showLogo?: boolean
}

const Loading = React.forwardRef<HTMLDivElement, LoadingProps>(
  ({ className, size = 'md', variant = 'default', message, showLogo = false, ...props }, ref) => {
    const sizeClasses = {
      sm: 'h-4 w-4',
      md: 'h-6 w-6',
      lg: 'h-8 w-8',
    }

    const spinnerSize = size === 'lg' ? 'lg' : size === 'sm' ? 'sm' : 'md'

    const LoadingContent = () => (
      <div className="flex flex-col items-center justify-center gap-3">
        {showLogo && (
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-2">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
        )}
        <Spinner size={spinnerSize} className="text-primary" />
        {message && <p className="text-sm text-muted-foreground text-center max-w-xs">{message}</p>}
      </div>
    )

    if (variant === 'centered') {
      return (
        <div ref={ref} className={cn('flex items-center justify-center min-h-[200px] w-full', className)} {...props}>
          <LoadingContent />
        </div>
      )
    }

    if (variant === 'overlay') {
      return (
        <div
          ref={ref}
          className={cn(
            'fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center',
            className,
          )}
          {...props}
        >
          <div className="bg-card rounded-xl p-8 shadow-lg border">
            <LoadingContent />
          </div>
        </div>
      )
    }

    if (variant === 'inline') {
      return (
        <div ref={ref} className={cn('flex items-center gap-2', className)} {...props}>
          <Spinner size={spinnerSize} className="text-primary" />
          {message && <span className="text-sm text-muted-foreground">{message}</span>}
        </div>
      )
    }

    // Default variant
    return (
      <div ref={ref} className={cn('flex items-center justify-center p-4', className)} {...props}>
        <LoadingContent />
      </div>
    )
  },
)

Loading.displayName = 'Loading'

export { Loading }
