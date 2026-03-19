'use client'

import cn from 'clsx'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'

const THEME_KEY = 'preferred-theme'

function Item(props: React.ComponentProps<typeof Link>) {
  const pathname = usePathname()
  const href = props.href

  if (typeof href !== 'string') {
    throw new Error('`href` must be a string')
  }

  const isActive = pathname === href || pathname.startsWith(href + '/')

  return (
    <li
      className={cn(
        isActive
          ? 'text-rurikon-800'
          : 'text-rurikon-300 hover:text-rurikon-600',
        'transition-colors hover:transform-none',
        '-mx-2'
      )}
    >
      <Link
        {...props}
        className='inline-block w-full px-2 focus-visible:outline focus-visible:outline-rurikon-400
        focus-visible:rounded-xs 
        focus-visible:outline-dotted
        focus-visible:text-rurikon-600'
        draggable={false}
      />
    </li>
  )
}

export default function Navbar() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const isDark = theme === 'dark'

  useEffect(() => {
    const storedTheme = window.localStorage.getItem(THEME_KEY)
    const systemPrefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches
    const initialTheme =
      storedTheme === 'dark' || storedTheme === 'light'
        ? storedTheme
        : systemPrefersDark
          ? 'dark'
          : 'light'

    document.documentElement.dataset.theme = initialTheme
    setTheme(initialTheme)
  }, [])

  function toggleTheme() {
    const nextTheme = isDark ? 'light' : 'dark'

    document.documentElement.dataset.theme = nextTheme
    window.localStorage.setItem(THEME_KEY, nextTheme)
    setTheme(nextTheme)
  }

  return (
    <nav className='mobile:mr-6 sm:mr-10 md:mr-14 w-full mobile:w-16'>
      <div className='mobile:sticky top-6 sm:top-10 md:top-14 mb-6 mobile:mb-0 flex items-center justify-between mobile:flex mobile:flex-col mobile:items-end'>
        <ul className='lowercase text-left mobile:text-right flex gap-2 justify-start mobile:block'>
          <Item href='/'>Sobre</Item>
          <Item href='/notas'>Notas</Item>
          <Item href='/desenhos'>Desenhos</Item>
          {/* <Item href='/visuals'>Visuals</Item> */}
          <Item href='/projetos'>Projetos</Item>
          {/* <Item href='/guestbook'>Guestbook</Item> */}
        </ul>
        <button
          type='button'
          aria-label={isDark ? 'Ativar modo claro' : 'Ativar modo escuro'}
          aria-pressed={isDark}
          className='ml-4 mobile:ml-0 mobile:mt-3 mobile:self-end inline-flex h-8 w-8 items-center justify-center rounded-full text-rurikon-300 transition-[color,background-color,border-color] duration-300 ease-out hover:text-rurikon-600 focus-visible:outline focus-visible:outline-rurikon-400 focus-visible:outline-dotted'
          onClick={toggleTheme}
        >
          <span className='relative block h-4 w-4'>
            <SunIcon
              className={cn(
                'absolute inset-[-1px] h-[18px] w-[18px] transition-all duration-300 ease-out',
                isDark
                  ? 'rotate-0 scale-100 opacity-100'
                  : 'rotate-90 scale-75 opacity-0'
              )}
            />
            <MoonIcon
              className={cn(
                'absolute inset-0 h-4 w-4 transition-all duration-300 ease-out',
                isDark
                  ? '-rotate-90 scale-75 opacity-0'
                  : 'rotate-0 scale-100 opacity-100'
              )}
            />
          </span>
        </button>
      </div>
    </nav>
  )
}
