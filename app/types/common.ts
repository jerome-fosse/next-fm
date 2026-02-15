export const DISCOGS = "Discogs";
export const LASTFM = "Last.fm";
export const ORIGINS = [DISCOGS, LASTFM] as const;

export type Origin = typeof DISCOGS | typeof LASTFM;

export type Pagination = {
    page: number,
    pages: number,
    size: number,
    total: number,
    urls: {
        first?: string,
        prev?: string,
        next?: string,
        last?: string
    }
};