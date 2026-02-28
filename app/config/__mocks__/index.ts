const config = {
    userAgent: 'TestAgent/1.0',
    isDev: false,
    env: 'test' as const,
    discogs: {
        token: 'test-discogs-token',
        baseUrl: 'https://api.discogs.com',
        timeout: 3000,
        searchPageSize: 30,
    },
    lastfm: {
        apiKey: 'test-lastfm-api-key',
        secret: 'test-lastfm-secret',
        baseUrl: 'https://ws.audioscrobbler.com',
        timeout: 3000,
        searchPageSize: 30,
    },
    storage: new Map(),
    cache: {
        discogs: {
            albums: { capacity: 100, ttl: 600000 },
            search: { capacity: 100, ttl: 600000 },
        },
        lastfm: {
            userinfos: { capacity: 100, ttl: 600000 },
            albums: { capacity: 100, ttl: 600000 },
            search: { capacity: 100, ttl: 600000 },
        },
    },
};

export default config;
