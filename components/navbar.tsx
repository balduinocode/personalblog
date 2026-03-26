'use client'

import cn from 'clsx'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'

const THEME_KEY = 'preferred-theme'
type Theme = 'light' | 'sunny' | 'dark'

function LeafIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' {...props}>
      <path
        d='M18.5 4.5C12 4.5 6 8.7 6 15.3c0 2.5 1.7 4.2 4.2 4.2 6.6 0 10.8-6 10.8-12.5 0-1.4-1.1-2.5-2.5-2.5Z'
        strokeWidth='1.7'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M7.5 16.5c2.4-2.4 5.5-4.8 9-6.5M11.1 13.4c.2 2 .9 4 2 5.8'
        strokeWidth='1.7'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  )
}

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
  const [theme, setTheme] = useState<Theme>('light')
  const isDark = theme === 'dark'
  const nextTheme: Theme =
    theme === 'light' ? 'sunny' : theme === 'sunny' ? 'dark' : 'light'

  useEffect(() => {
    const storedTheme = window.localStorage.getItem(THEME_KEY)
    const systemPrefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches
    const initialTheme =
      storedTheme === 'dark' || storedTheme === 'light' || storedTheme === 'sunny'
        ? storedTheme
        : systemPrefersDark
          ? 'dark'
          : 'light'

    document.documentElement.dataset.theme = initialTheme
    setTheme(initialTheme)
  }, [])

  function toggleTheme() {
    document.documentElement.dataset.theme = nextTheme
    window.localStorage.setItem(THEME_KEY, nextTheme)
    setTheme(nextTheme)
  }

  const themeLabel =
    nextTheme === 'sunny'
      ? 'Ativar sunny mode'
      : nextTheme === 'dark'
        ? 'Ativar modo escuro'
        : 'Ativar modo claro'

  return (
    <nav className='mobile:mr-6 sm:mr-10 md:mr-14 w-full mobile:w-16'>
      <div className='mobile:sticky top-6 sm:top-10 md:top-14 mb-6 mobile:mb-0 flex items-center justify-between mobile:flex mobile:flex-col mobile:items-end'>
        <ul className='lowercase text-left mobile:text-right flex gap-2 justify-start mobile:block'>
          <Item href='/'>Sobre</Item>
          <Item href='/escritos'>Escritos</Item>
          <Item href='/desenhos'>Desenhos</Item>
          {/* <Item href='/visuals'>Visuals</Item> */}
          <Item href='/projetos'>Projetos</Item>
          {/* <Item href='/guestbook'>Guestbook</Item> */}
        </ul>
        <button
          type='button'
          aria-label={themeLabel}
          aria-pressed={theme === 'dark'}
          className='ml-4 mobile:ml-0 mobile:mt-3 mobile:self-end inline-flex h-8 w-8 items-center justify-center rounded-full text-rurikon-300 transition-[color,background-color,border-color] duration-300 ease-out hover:text-rurikon-600 focus-visible:outline focus-visible:outline-rurikon-400 focus-visible:outline-dotted'
          onClick={toggleTheme}
        >
          <span className='relative block h-4 w-4 pointer-events-none'>
            <SunIcon
              className={cn(
                'absolute left-1/2 top-1/2 h-[17px] w-[17px] -translate-x-1/2 -translate-y-1/2 transition-opacity duration-200 ease-out',
                nextTheme === 'light' ? 'opacity-100' : 'opacity-0'
              )}
            />
            <LeafIcon
              className={cn(
                'absolute left-1/2 top-1/2 h-[17px] w-[17px] -translate-x-1/2 -translate-y-1/2 transition-opacity duration-200 ease-out',
                nextTheme === 'sunny' ? 'opacity-100' : 'opacity-0'
              )}
            />
            <MoonIcon
              className={cn(
                'absolute inset-0 h-4 w-4 transition-opacity duration-200 ease-out',
                nextTheme === 'dark' ? 'opacity-100' : 'opacity-0'
              )}
            />
          </span>
        </button>
      </div>
    </nav>
  )
}
