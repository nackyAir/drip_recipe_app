'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'
import { FiBookOpen, FiUser } from 'react-icons/fi'

import { Avatar } from '@mantine/core'

import { Logo } from '~/components/atm/Logo/logo'
import { AuthUser, useAuthContext } from '~/lib/auth-context'

export const Layout = ({
  children,
  user,
}: {
  children: ReactNode
  user?: AuthUser
}) => {
  const { user: sessionUser } = useAuthContext()
  const displayUser = user ?? sessionUser
  const pathname = usePathname()
  const isRecipes = pathname === '/user'
  const isMyPage = pathname?.startsWith('/user/mypage')

  return (
    <div className="app-frame">
      <header className="app-header">
        <div className="header-left">
          <Logo />
          <nav className="nav-links" aria-label="メインメニュー">
            <Link
              href="/user"
              className={`nav-link ${isRecipes ? 'is-active' : ''}`}
              aria-current={isRecipes ? 'page' : undefined}
            >
              <FiBookOpen aria-hidden />
              <span>レシピ</span>
            </Link>
            <Link
              href="/user/mypage"
              className={`nav-link ${isMyPage ? 'is-active' : ''}`}
              aria-current={isMyPage ? 'page' : undefined}
            >
              <FiUser aria-hidden />
              <span>マイページ</span>
            </Link>
          </nav>
        </div>
        <Link
          href="/user/mypage"
          className="user-chip"
          aria-label="マイページを開く"
        >
          <Avatar src={displayUser?.image || undefined} radius="xl" size={34} />
          <span className="user-chip-name">
            {displayUser?.name || 'アカウント'}
          </span>
        </Link>
      </header>
      <main className="app-main">{children}</main>
      <footer className="app-footer">
        {new Date().getFullYear()} © Coffee Recipe ·
        バリスタのためのドリップレシピ帳
      </footer>
    </div>
  )
}
