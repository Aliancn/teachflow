import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const authCookie = request.cookies.get('isAuthenticated')?.value
  if (request.nextUrl.pathname.startsWith('/home') && (authCookie !== 'true' )) {
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }
}

export const config = {
  matcher: ['/home/:path*']
}