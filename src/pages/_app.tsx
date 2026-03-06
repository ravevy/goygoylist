import '@/styles/globals.css'
import 'nes.css/css/nes.min.css'
import '@hackernoon/pixel-icon-library/fonts/iconfont.css'
import type { AppProps } from 'next/app'
import ProtectedRoute from '@/components/protectedRoute'
import { ThemeProvider } from '@/context/themeContext'
import { Layout } from '@/components/layout'

const publicPages = ['/login', '/404']

export default function App({ Component, pageProps, router }: AppProps) {
  const isPublicPage = publicPages.includes(router.pathname)

  if (isPublicPage) {
    return (
      <ThemeProvider>
        <Component {...pageProps} />
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider>
      <ProtectedRoute>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ProtectedRoute>
    </ThemeProvider>
  )
}
