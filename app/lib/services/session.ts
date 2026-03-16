import {cookies} from "next/headers";
import {sessionCookieSchema} from "@/app/schemas/authent";
import {Session} from "@/app/types/authent";
import {getStorage} from "@/app/lib/data/storage";
import {AlbumShort} from "@/app/types/albums";

export async function getConnectedUserName(): Promise<string | undefined> {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('nextfm-session');
    const parsed = sessionCookieSchema.safeParse(JSON.parse(sessionCookie?.value ?? '{}'));

    if (!parsed.success) {
        return;
    }

    return parsed.data.username;
}

export async function getCurrentSession(): Promise<Session | undefined> {
    const user = await getConnectedUserName();
    if (typeof user === 'undefined') {
        throw new Error('Veuillez vous connecter.');
    }

    const storage = getStorage('session');
    const result = await storage.read<Session>(user)

    return result.success ? result.data : undefined;
}

export async function saveSession(session: Session): Promise<boolean> {
    const storage = getStorage('session');
    const result = await storage.write<Session>(session.user, session);
    return result.success;
}

export async function addSearchedAlbumToCurrentSession(albumToAdd: AlbumShort): Promise<boolean> {
    const session = await getCurrentSession();
    if (typeof session === 'undefined') {
        return false;
    }

    const albums = session.lastAlbums ?? [];
    for (const album of albums) {
        if (isSameAlbum(album, albumToAdd)) {
            return false;
        }
    }

    if (albums.length >= 10) {
        albums.pop();
    }

    albums.unshift(albumToAdd);
    session.lastAlbums = albums;

    return await saveSession(session);
}

function isSameAlbum(a1: AlbumShort, a2: AlbumShort): boolean {
    return a1.origin === a2.origin && ((a1.id === a2.id) || (a1.title === a2.title && a1.artist === a2.artist));
}