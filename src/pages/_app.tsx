import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import ProtectedRoute from '@/components/protectedRoute'

const publicPages = ['/login']

export default function App({ Component, pageProps, router }: AppProps) {
  const isPublicPage = publicPages.includes(router.pathname)

  if (isPublicPage) {
    return <Component {...pageProps} />
  }

  return (
    <ProtectedRoute>
      <Component {...pageProps} />
    </ProtectedRoute>
  )
}
