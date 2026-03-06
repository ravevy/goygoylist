import { useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '@/lib/supabase/client'
import { Input } from '@/components/ui-kit/input'
import { Container } from '@/components/ui-kit/container'
import { Button } from '@/components/ui-kit/button'
import { useTheme } from '@/context/themeContext'
import ThemeToggleButton from '@/components/features/ThemeToggleButton'

export default function Login() {
  const { theme } = useTheme()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (error) {
      return alert(error.message)
    }
    router.push('/dashboard')
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <div className="absolute top-4 right-4">
        <ThemeToggleButton size="l" />
      </div>
      <img
        src={
          theme === 'dark'
            ? '/assets/login-background-night.png'
            : '/assets/login-background-day.png'
        }
        width={100}
        height={100}
        className="absolute -z-10 h-screen w-screen object-cover"
      />
      <Container variants={['rounded']} className="w-fit bg-white">
        <form onSubmit={handleLogin} className="flex flex-col gap-3">
          <Input
            id="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" variant="primary" disabled={submitting}>
            Submit
          </Button>
        </form>
      </Container>
    </div>
  )
}
