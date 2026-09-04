import { NextRequest, NextResponse } from 'next/server'

import { isUiPreviewEnabled } from '~/lib/ui-preview'

const sessionCookieNames = [
  'better-auth.session_token',
  '__Secure-better-auth.session_token',
]

const hasSessionCookie = (request: NextRequest) =>
  sessionCookieNames.some((name) => request.cookies.has(name))

export function middleware(request: NextRequest) {
  const hasSession = hasSessionCookie(request)
  const { pathname } = request.nextUrl

  if (isUiPreviewEnabled()) {
    return NextResponse.next()
  }

  if (pathname.startsWith('/user/login')) {
    if (hasSession) {
      return NextResponse.redirect(new URL('/user', request.url))
    }

    return NextResponse.next()
  }

  if (!hasSession) {
    return NextResponse.redirect(new URL('/user/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/user', '/user/:path*'],
}
