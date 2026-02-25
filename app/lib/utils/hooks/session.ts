import {useState, useEffect} from 'react';
import Cookies from 'js-cookie';

export type Session =
    | { connected: true, username: string }
    | { connected: false, username?: never }

export function useSession(): Session {
    const [session, setSession] = useState<Session>({ connected: false });

    useEffect(() => {
        const sessionCookie = Cookies.get('nextfm-session');
        if (!sessionCookie) return;

        try {
            const parsed = JSON.parse(sessionCookie) as { username: string };
            // eslint-disable-next-line
            setSession({ connected: true, username: parsed.username });
        } catch {
            setSession({ connected: false });
        }
    }, []);

    return session;
}
