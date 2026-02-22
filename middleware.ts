import {NextRequest, NextResponse} from 'next/server';
import {z} from 'zod';

const sessionCookieSchema = z.object({
    username: z.string().min(1),
});

function validateCookie(request: NextRequest): boolean {
    const raw = request.cookies.get('nextfm-session')?.value;
    if (!raw) return true;

    try {
        return sessionCookieSchema.safeParse(JSON.parse(raw)).success;
    } catch {
        return false;
    }
}

export function middleware(request: NextRequest) {
    if (!validateCookie(request)) {
        const response = NextResponse.redirect(request.url);
        response.cookies.delete('nextfm-session');
        return response;
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
