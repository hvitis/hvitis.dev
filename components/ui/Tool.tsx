import {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
  forwardRef,
} from 'react'

export function ToolHeader({ title, description }: { title: string; description?: string }) {
  return (
    <header className="border-b border-gray-200 pb-6 dark:border-gray-800">
      <h1 className="font-serif text-3xl italic tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">
        {title}
      </h1>
      {description && (
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-500 dark:text-gray-400">
          {description}
        </p>
      )}
    </header>
  )
}

export function Notice({ children }: { children: ReactNode }) {
  return (
    <div className="border-l-2 border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-600 dark:border-gray-700 dark:bg-gray-900/60 dark:text-gray-400">
      {children}
    </div>
  )
}

export function Label({ children }: { children: ReactNode }) {
  return (
    <span className="text-xs uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">
      {children}
    </span>
  )
}

export const Panel = forwardRef<HTMLDivElement, { children: ReactNode; className?: string }>(
  function Panel({ children, className = '' }, ref) {
    return (
      <div ref={ref} className={`border border-gray-200 dark:border-gray-800 ${className}`}>
        {children}
      </div>
    )
  }
)

const buttonVariants = {
  primary:
    'bg-gray-900 text-white hover:bg-gray-700 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white',
  secondary:
    'border border-gray-300 text-gray-700 hover:border-gray-900 hover:text-gray-900 dark:border-gray-700 dark:text-gray-300 dark:hover:border-gray-100 dark:hover:text-gray-100',
  ghost: 'px-2 py-1 text-gray-400 hover:text-gray-900 dark:text-gray-500 dark:hover:text-gray-100',
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof buttonVariants
}

export function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  const base =
    variant === 'ghost'
      ? 'text-xs uppercase tracking-[0.15em] transition-colors disabled:cursor-not-allowed disabled:opacity-40'
      : 'px-4 py-2.5 text-xs uppercase tracking-[0.15em] transition-colors disabled:cursor-not-allowed disabled:opacity-40'
  return <button className={`${base} ${buttonVariants[variant]} ${className}`} {...props} />
}

const fieldClasses =
  'w-full border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:outline-none dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-600 dark:focus:border-gray-100'

export function Input({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`${fieldClasses} ${className}`} {...props} />
}

export function Textarea({
  className = '',
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={`${fieldClasses} ${className}`} {...props} />
}

export function Select({ className = '', ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={`${fieldClasses} ${className}`} {...props} />
}

export function ColorInput({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type="color"
      className={`h-10 w-14 cursor-pointer border border-gray-300 bg-white p-1 dark:border-gray-700 dark:bg-gray-950 ${className}`}
      {...props}
    />
  )
}
