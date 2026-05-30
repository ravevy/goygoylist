type BadgeVariant = 'dark' | 'primary' | 'success' | 'warning' | 'error'

const variantClassMap: Record<BadgeVariant, string> = {
  dark: 'is-dark',
  primary: 'is-primary',
  success: 'is-success',
  warning: 'is-warning',
  error: 'is-error'
}

type SingleBadgeProps = {
  type?: 'single'
  variant: BadgeVariant
  label: string
  onRemove?: () => void
  href?: string
  className?: string
}

type BadgeProps = SingleBadgeProps

export const Badge = ({ href, className = '', ...props }: BadgeProps) => {
  const Wrapper = href ? 'a' : 'span'
  const wrapperProps = href ? { href } : {}

  return (
    <Wrapper className={`nes-badge min-w-fit ${className}`} {...wrapperProps}>
      <span
        className={`inline-flex max-w-48 items-center justify-between gap-1 px-2 ${variantClassMap[props.variant]}`}
      >
        <span className="min-w-0 truncate">{props.label}</span>
        {props.onRemove && (
          <button
            type="button"
            onClick={props.onRemove}
            className="inline-flex shrink-0"
            style={{ cursor: 'pointer' }}
          >
            <i className="hn hn-times" />
          </button>
        )}
      </span>
    </Wrapper>
  )
}
