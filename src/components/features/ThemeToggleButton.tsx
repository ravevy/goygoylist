import { useTheme } from '@/context/themeContext'

export default function ThemeToggleButton({
  size = 'm'
}: {
  size?: 's' | 'm' | 'l'
}) {
  const { toggleTheme, theme } = useTheme()

  const sizeVariants = {
    s: 'text-2xl',
    m: 'text-3xl',
    l: 'text-4xl'
  }
  return (
    <button
      className="flex items-center outline-0 focus:outline-0!"
      onClick={toggleTheme}
    >
      {theme === 'dark' ? (
        <i
          className={`hn hn-sun-solid ${sizeVariants[size]} text-[#FED33C]`}
        ></i>
      ) : (
        <i
          className={`hn hn-moon-solid ${sizeVariants[size]} text-[#005570]`}
        ></i>
      )}
    </button>
  )
}
