import {logger} from "@/app/lib/utils/logger";
import config from "@/app/config";

export function register() {
    logger.info("Starting Next.fm...")
    logger.info("Configuration: ", {
        ...config,
        discogs: {
            ...config.discogs,
            token: '*******',
        },
        lastfm: {
            ...config.lastfm,
            apiKey: '*******',
            secret: '*******',
        }
    })
}