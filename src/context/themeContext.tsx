import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect
} from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>('light')

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
    localStorage.setItem('theme', newTheme)
  }

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as Theme | null
    const media = window.matchMedia('(prefers-color-scheme: dark)')

    const applyTheme = (theme: Theme) => {
      setTheme(theme)
      document.documentElement.setAttribute('data-theme', theme)
    }

    if (storedTheme) {
      applyTheme(storedTheme)
      return
    }

    applyTheme(media.matches ? 'dark' : 'light')

    const handleChange = (e: MediaQueryListEvent) => {
      applyTheme(e.matches ? 'dark' : 'light')
    }

    media.addEventListener('change', handleChange)

    return () => {
      media.removeEventListener('change', handleChange)
    }
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within ThemeProvider')
  return context
}
