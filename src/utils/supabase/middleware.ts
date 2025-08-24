import { NextResponse, type NextRequest } from 'next/server';
import { AuthServerServices } from '@/services/auth/server';

export async function updateSession(request: NextRequest) {
    const supabaseResponse = NextResponse.next({
        request
    });

    const {
        data: { user }
    } = await AuthServerServices.check();

    if (
        !user &&
        !request.nextUrl.pathname.startsWith('/login') &&
        !request.nextUrl.pathname.startsWith('/signup') &&
        !request.nextUrl.pathname.startsWith('/error')
    ) {
        const url = request.nextUrl.clone();

        url.pathname = '/login';

        return NextResponse.redirect(url);
    }

    if (
        user &&
        (request.nextUrl.pathname.startsWith('/login') ||
            request.nextUrl.pathname.startsWith('/signup'))
    ) {
        const url = request.nextUrl.clone();

        url.pathname = '/';

        return NextResponse.redirect(url);
    }

    return supabaseResponse;
}
