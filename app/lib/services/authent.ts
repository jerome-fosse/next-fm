'use server'

import {lastfm} from "@/app/lib/data/http/lastfm";
import {Session, User} from "@/app/types/authent";
import {lastFmUserToUser} from "@/app/lib/services/mapper/authent";
import {logger} from "@/app/lib/utils/logger";
import {getStorage} from "@/app/lib/data/storage";
import {cookies} from "next/headers";
import {sessionCookieSchema} from "@/app/schemas/authent";
import config from "@/app/config";
import {LRUCache} from "lru-cache";

const api = lastfm.createClientWithDefaultConfig();

const userInfosCache =  new LRUCache<string, User>({
    max: config.cache.lastfm.userinfos.capacity,
    ttl: config.cache.lastfm.userinfos.ttl,
    onInsert: (value, key) => logger.debug( `UserInfos for ${key} inserted in cache.`),
});

export async function getOrCreateSession(token: string): Promise<Session> {
    logger.info(`getOrCreateSession for ${token}`);

    const response = await api.getSession(token);
    const { name, key, subscriber } = response.session;

    const storage = getStorage('session');
    const result = await storage.read<Session>(name);
    const session = result.success ?
        { ...result.data, key, subscriber } :
        { user: name, key, subscriber, createdAt: new Date().toISOString() };

    const sessionSaved = await storage.write(session.user, JSON.stringify(session));
    if (sessionSaved.success) {
        logger.info(`Session ${session.user} ${result.success ? 'mise à jour' : 'créée'}.`);
    } else {
        logger.warn(`Session ${session.user} non sauvegardée : ${sessionSaved.error}`);
    }

    return session;
}

export async function getUserInfos(user: string): Promise<User> {
    logger.info(`getUserInfos for user ${user}`);

    if (userInfosCache.has(user)) {
        const userInfos = userInfosCache.get(user);
        logger.debug(`UserInfos for ${user} fetched from cache.`);
        return userInfos!;
    }

    return api.getUserInfo(user)
        .then(response => {
            const user = lastFmUserToUser(response.user)
            userInfosCache.set(user.name, user);
            return user;
        })
        .catch(error => {
            throw new Error(`Erreur lors du chargement des données de l'utilisateur ${user} : ${error.message}`)
        });
}

export async function getConnectedUserName(): Promise<string | undefined> {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('nextfm-session');
    const parsed = sessionCookieSchema.safeParse(JSON.parse(sessionCookie?.value ?? '{}'));

    if (!parsed.success) {
        return;
    }

    return parsed.data.username;
}

export async function getConnectedUserInfos(): Promise<User | undefined> {
    const username = await getConnectedUserName();
    if (!username) {
        return;
    }

    return await getUserInfos(username);
}
