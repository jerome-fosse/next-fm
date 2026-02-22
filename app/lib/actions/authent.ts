'use server'

import {logger} from "@/app/lib/logger";
import {lastfm} from "@/app/lib/http/lastfm";
import {getStorage} from "@/app/lib/storage";
import {Session} from "@/app/types/authent";
import {isSome} from "@/app/types/option";
import {headers} from "next/headers";
import {redirect} from "next/navigation";
import config from "@/app/config";

export async function redirectToLastFmAuth() {
    const headersList = await headers();
    const host = headersList.get('x-forwarded-host') ?? headersList.get('host') ?? 'localhost:3000';
    const protocol = headersList.get('x-forwarded-proto') ?? 'http';
    const callback = `${protocol}://${host}/auth`;
    const authUrl = `https://www.last.fm/api/auth/?api_key=${config.lastfm.apiKey}&cb=${callback}`;
    redirect(authUrl);
}

type SessionResult = { error: false; session: Session } | { error: true; message: string }

export async function createSession(token: string): Promise<SessionResult> {
    logger.debug(`Creating session for ${token}`);

    try {
        const api = lastfm.createClientWithDefaultConfig();
        const response = await api.getSession(token);
        const { name, key, subscriber } = response.data.session;

        const storage = getStorage('session');
        const existing = await storage.read(name);

        const now = new Date().toISOString();

        const session: Session = isSome(existing)
            ? { ...JSON.parse(existing.value), key, subscriber }
            : { user: name, key, subscriber, createdAt: now };

        await storage.write(session.user, JSON.stringify(session));

        return { error: false, session };
    } catch (e) {
        const message = `Erreur lors de l'authentification Last.fm${e instanceof Error ? ` : ${e.message}` : ''}`
        logger.error(message);
        return { error: true, message: message };
    }
}
