import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // Skip if it's not a page route or starts with specific prefixes
  if (pathname.startsWith('/_next') || 
      pathname.startsWith('/api') || 
      pathname.includes('.')) {
    return NextResponse.next()
  }

  // Split path into segments and capitalize each word
  const segments = pathname.split('/').filter(Boolean)
  const capitalizedSegments = segments.map(segment => 
    segment.split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('-')
  )

  // If there are no changes needed, continue
  if (segments.join('/') === capitalizedSegments.join('/')) {
    return NextResponse.next()
  }

  // Create new URL with capitalized path
  const newUrl = new URL(request.url)
  newUrl.pathname = '/' + capitalizedSegments.join('/')

  // Redirect to the capitalized version
  return NextResponse.redirect(newUrl)
}

// Configure which paths the middleware will run on
export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
}