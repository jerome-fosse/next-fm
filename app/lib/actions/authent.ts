'use server'

import {logger} from "@/app/lib/logger";
import {lastfm, LastFmGetSessionResponse} from "@/app/lib/http/lastfm";

export async function createSession(token: string): Promise<LastFmGetSessionResponse | undefined> {
    logger.debug(`Creating session for ${token}`);

    const api = lastfm.createClientWithDefaultConfig();

    api.getSession(token)
        .then(response => {
            const data = response.data;
            logger.debug(`Session created for ${token} with data ${JSON.stringify(data)}`);

            return data;
        })
        .catch(error => {
            logger.error(`Error creating session for ${token}:`, error);
        });

    return undefined
}