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
    LASTFM_SECRET: z.string().min(1, "LASTFM_SECRET est manquant"),
    LASTFM_BASE_URL: z.url().default('https://ws.audioscrobbler.com'),
    LASTFM_TIMEOUT: z.coerce.number().min(1000).default(3000),
    LASTFM_SEARCH_PAGE_SIZE: z.coerce.number().int().min(10).max(50).default(30),

    // Cache
    CACHE_DISCOGS_ALBUMS_CAPACITY: z.coerce.number().int().min(1).default(100),
    CACHE_DISCOGS_ALBUMS_TTL: z.coerce.number().int().min(1).default(600000), // 10 minutes
    CACHE_DISCOGS_SEARCH_CAPACITY: z.coerce.number().int().min(1).default(100),
    CACHE_DISCOGS_SEARCH_TTL: z.coerce.number().int().min(1).default(600000), // 10 minutes
    CACHE_LASTFM_ALBUMS_CAPACITY: z.coerce.number().int().min(1).default(100),
    CACHE_LASTFM_ALBUMS_TTL: z.coerce.number().int().min(1).default(600000), // 10 minutes
    CACHE_LASTFM_SEARCH_CAPACITY: z.coerce.number().int().min(1).default(100),
    CACHE_LASTFM_SEARCH_TTL: z.coerce.number().int().min(1).default(600000), // 10 minutes

    // Application
    USER_AGENT: z.string().default('Next.fm/0.1.0 (https://github.com/jerome-fosse/next-fm)'),

    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
    logger.error("Erreur de configuration: ", parsed.error.message);
    throw new Error("Configuration invalide.");
}

const storageConfigSchema = z.discriminatedUnion('type', [
    z.object({ type: z.literal('fs'), path: z.string().min(1) }),
    z.object({ type: z.literal('s3'), bucket: z.string().min(1), path: z.string().min(1) }),
]);

type StorageConfig = z.infer<typeof storageConfigSchema>;

const storageMap = new Map<string, StorageConfig>();
for (const [key, value] of Object.entries(process.env)) {
    if (!key.startsWith('STORAGE_') || !value) continue;
    const name = key.substring('STORAGE_'.length).toLowerCase();
    try {
        storageMap.set(name, storageConfigSchema.parse(JSON.parse(value)));
    } catch {
        logger.error(`Configuration invalide pour ${key}`);
    }
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
        secret: parsed.data.LASTFM_SECRET,
        baseUrl: parsed.data.LASTFM_BASE_URL,
        timeout: parsed.data.LASTFM_TIMEOUT,
        searchPageSize: parsed.data.LASTFM_SEARCH_PAGE_SIZE,
    },
    storage: storageMap,
    cache:{
        discogs: {
            albums: {
                capacity: parsed.data.CACHE_DISCOGS_ALBUMS_CAPACITY,
                ttl: parsed.data.CACHE_DISCOGS_ALBUMS_TTL,
            },
            search: {
                capacity: parsed.data.CACHE_DISCOGS_SEARCH_CAPACITY,
                ttl: parsed.data.CACHE_DISCOGS_SEARCH_TTL,
            },
        },
        lastfm: {
            albums: {
                capacity: parsed.data.CACHE_LASTFM_ALBUMS_CAPACITY,
                ttl: parsed.data.CACHE_LASTFM_ALBUMS_TTL,
            },
            search: {
                capacity: parsed.data.CACHE_LASTFM_SEARCH_CAPACITY,
                ttl: parsed.data.CACHE_LASTFM_SEARCH_TTL,
            },
        },
    },
}

export default config;
