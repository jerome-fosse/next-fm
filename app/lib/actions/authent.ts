'use server'

import {logger} from "@/app/lib/logger";
import {Session, User} from "@/app/types/authent";
import {headers} from "next/headers";
import {redirect} from "next/navigation";
import config from "@/app/config";
import {getOrCreateSession, getUserInfos} from "@/app/lib/data/authent";

type SessionResult = { error: false; session: Session } | { error: true; message: string }
type UserInfosResult = { error: false; user: User } | { error: true; message: string }

export async function createSessionAction(token: string): Promise<SessionResult> {
    logger.debug(`Creating session for ${token}`);

    try {
        return {error: false, session: await getOrCreateSession(token)};
    } catch (e) {
        const message = `Erreur lors de l'authentification Last.fm${e instanceof Error ? ` : ${e.message}` : ''}`
        logger.error(message);
        return { error: true, message: message };
    }
}

export async function getUserInfosAction(user: string): Promise<UserInfosResult> {
    logger.debug(`Getting user infos for ${user}`);

    try {
        return {error: false, user: await getUserInfos(user)};
    } catch (e) {
        const message = `Erreur lors du chargement des données de l'utilisateur ${user}${e instanceof Error ? ` : ${e.message}` : ''}`
        logger.error(message);
        return { error: true, message: message };
    }
}

export async function requestAuthorizationFromLastFM() {
    const headersList = await headers();
    const host = headersList.get('x-forwarded-host') ?? headersList.get('host') ?? 'localhost:3000';
    const protocol = headersList.get('x-forwarded-proto') ?? 'http';
    const callback = `${protocol}://${host}/auth`;
    const authUrl = `https://www.last.fm/api/auth/?api_key=${config.lastfm.apiKey}&cb=${callback}`;

    redirect(authUrl);
}
