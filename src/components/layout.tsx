// components/Container.tsx
import React from 'react'
import ThemeToggleButton from './features/ThemeToggleButton'
import { Container } from './ui-kit/container'
import Link from 'next/link'

interface LayoutProps {
  children: React.ReactNode
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className={`h-screen w-screen`}>
      <nav className="w-full px-4 py-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
        <Container
          variants={['rounded']}
          className="mt-10 flex h-fit items-center gap-3"
        >
          <h3 className="mr-auto mb-0!">Goygoy List</h3>
          <Link
            href="/dashboard"
            className="nes-text is-primary flex items-center text-3xl no-underline!"
          >
            <i className="hn hn-home-solid"></i>
          </Link>
          <Link
            href="/profile"
            className="nes-text is-error flex items-center text-3xl no-underline!"
          >
            <i className="hn hn-user-solid"></i>
          </Link>
          <ThemeToggleButton size="m" />
        </Container>
      </nav>
      <main className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
        {children}
      </main>
    </div>
  )
}
