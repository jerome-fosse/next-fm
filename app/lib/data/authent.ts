'use server'

import {lastfm} from "@/app/lib/http/lastfm";
import {Session, User} from "@/app/types/authent";
import {lastFmUserToUser} from "@/app/lib/mapper/authent";
import {logger} from "@/app/lib/logger";
import {getStorage} from "@/app/lib/storage";
import {isSome} from "@/app/types/option";

const api = lastfm.createClientWithDefaultConfig();

export async function getOrCreateSession(token: string): Promise<Session> {
    logger.info(`getOrCreateSession for ${token}`);

    const respSession = await api.getSession(token);
    const { name, key, subscriber } = respSession.data.session;

    const storage = getStorage('session');
    const optSession = await storage.read<Session>(name);

    const now = new Date().toISOString();
    const session: Session = isSome(optSession)
        ? { ...optSession.value, key, subscriber }
        : { user: name, key, subscriber, createdAt: now };

    await storage.write(session.user, JSON.stringify(session));
    logger.debug(`Session ${session.user} created.`);

    return session;
}


export async function getUserInfos(user: string): Promise<User> {
    logger.info(`getOrCreateSession for user ${user}`);

    return api.getUserInfo(user)
        .then(response => lastFmUserToUser(response.data.user))
        .catch(error => {
            throw new Error(`Erreur lors du chargement des données de l'utilisateur ${user} : ${error.message}`)
        });
}
