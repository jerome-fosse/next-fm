import {logger} from "@/app/lib/logger";
import {z} from "zod";

const envSchema = z.object({
    // Discogs
    DISCOGS_TOKEN: z.string().min(1, "DISCOGS_TOKEN est manquant"),
    DISCOGS_BASE_URL: z.url().default('https://api.discogs.com'),
    DISCOGS_TIMEOUT: z.coerce.number().min(1000).default(3000),
    DISCOGS_SEARCH_PAGE_SIZE: z.coerce.number().int().min(10).max(50).default(30),

    // Last.fm
    LASTFM_API_KEY: z.string().min(1, "LASTFM_API_KEY est manquant"),
    LASTFM_BASE_URL: z.url().default('https://ws.audioscrobbler.com'),
    LASTFM_TIMEOUT: z.coerce.number().min(1000).default(3000),
    LASTFM_SEARCH_PAGE_SIZE: z.coerce.number().int().min(10).max(50).default(30),

    // Application
    USER_AGENT: z.string().default('Next.fm/0.1.0 (https://github.com/jerome-fosse/next-fm)'),

    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
    logger.error("Erreur de configuration: ", parsed.error.message);
    throw new Error("Configuration invalide.");
}

const config = {
    userAgent: parsed.data.USER_AGENT,
    isDev: parsed.data.NODE_ENV === 'development',
    env: parsed.data.NODE_ENV,
    discogs: {
        token: parsed.data.DISCOGS_TOKEN,
        baseUrl: parsed.data.DISCOGS_BASE_URL,
        timeout: parsed.data.DISCOGS_TIMEOUT,
        searchPageSize: parsed.data.DISCOGS_SEARCH_PAGE_SIZE,
    },
    lastfm: {
        apiKey: parsed.data.LASTFM_API_KEY,
        baseUrl: parsed.data.LASTFM_BASE_URL,
        timeout: parsed.data.LASTFM_TIMEOUT,
        searchPageSize: parsed.data.LASTFM_SEARCH_PAGE_SIZE,
    }
}

export default config;