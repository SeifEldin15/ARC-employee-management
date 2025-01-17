import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the pathname contains uppercase characters
  if (pathname !== pathname.toLowerCase()) {
    // Create a new URL with lowercase pathname
    const newUrl = new URL(pathname.toLowerCase(), request.url)
    
    // Preserve any query parameters
    newUrl.search = request.nextUrl.search
    
    // Return a redirect response
    return NextResponse.redirect(newUrl)
  }

  // If the URL is already lowercase, continue with the request
  return NextResponse.next()
}

// Configure which paths the middleware will run on
export const config = {
  matcher: '/:path*',
}
