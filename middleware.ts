import { authMiddleware } from '@clerk/nextjs'
import createMiddleware from 'next-intl/middleware'
import { NextResponse } from 'next/server'
import { DEFAULT_LOCALE, LOCALES } from '@/constants/i18n'

const intlMiddleware = createMiddleware({
  // A list of all locales that are supported
  locales: LOCALES,

  // Used when no locale matches
  defaultLocale: DEFAULT_LOCALE
})

// See https://clerk.com/docs/references/nextjs/auth-middleware
// for more information about configuring your Middleware
export default authMiddleware({
  // Allow signed out users to access the specified routes:
  publicRoutes: [],
  beforeAuth: (req) => {
    const { pathname } = req.nextUrl

    // If the request is for an API route or tRPC, remove the locale prefix
    if (pathname.startsWith('/api') || pathname.startsWith('/trpc')) {
      // Remove the locale prefix from the URL
      return NextResponse.rewrite(req.nextUrl)
    }

    return intlMiddleware(req)
  }
})

export const config = {
  matcher: [
    // Exclude files with a "." followed by an extension, which are typically static files.
    // Exclude files in the _next directory, which are Next.js internals.
    '/((?!.+\\.[\\w]+$|_next).*)',
    // Re-include any files in the api or trpc folders that might have an extension
    '/(api|trpc)(.*)'
  ]
}
