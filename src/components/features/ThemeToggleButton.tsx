import { useTheme } from '@/context/themeContext'

export default function ThemeToggleButton() {
  const { toggleTheme, theme } = useTheme()
  return (
    <button className="outline-0 focus:outline-0!" onClick={toggleTheme}>
      {theme === 'dark' ? (
        <i className="hn hn-sun-solid text-[3rem] text-[#FED33C]"></i>
      ) : (
        <i className="hn hn-moon-solid text-[3rem] text-[#005570]"></i>
      )}
    </button>
  )
}
