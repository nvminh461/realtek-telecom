import createMiddleware from 'next-intl/middleware'
import { NextResponse, type NextRequest } from 'next/server'

import { routing } from './i18n/routing'

const intl = createMiddleware(routing)

/** Paths served by Payload, route handlers or static files: no locale handling. */
const bypass = /^\/(api|admin|next|_next|_vercel)(\/|$)|\.[\w]+$/

// Every domain pointed at the site serves it directly (no redirect); absolute URLs follow it, see getSiteUrl().
export default function proxy(request: NextRequest) {
  if (bypass.test(request.nextUrl.pathname)) return NextResponse.next()
  return intl(request)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
