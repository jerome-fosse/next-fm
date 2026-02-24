import {NextRequest, NextResponse} from 'next/server';
import {createSessionAction} from '@/app/lib/actions/authent';

export async function GET(request: NextRequest) {
    const token = request.nextUrl.searchParams.get('token');

    if (!token) {
        return new NextResponse('Authentication failed - No token', { status: 400 });
    }

    const result = await createSessionAction(token);

    if (result.error) {
        return new NextResponse(result.message, { status: 500 });
    }

    const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host') ?? 'localhost:3000';
    const protocol = request.headers.get('x-forwarded-proto') ?? 'http';

    const response = NextResponse.redirect(new URL('/dashboard', `${protocol}://${host}`));
    response.cookies.set('nextfm-session', JSON.stringify({ username: result.session.user }), {
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 30 * 24 * 60 * 60,
    });

    return response;
}
