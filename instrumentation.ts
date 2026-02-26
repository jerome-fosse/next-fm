import {logger} from "@/app/lib/utils/logger";
import config from "@/app/config";

export function register() {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        logger.info("Starting Next.fm...")
        logger.info("Configuration:\n" + JSON.stringify({
            ...config,
            storage: Object.fromEntries(config.storage),
            discogs: { ...config.discogs, token: '*******' },
            lastfm: { ...config.lastfm, apiKey: '*******', secret: '*******' }
        }, null, 2))
    }
}