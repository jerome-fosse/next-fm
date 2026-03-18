export enum Origin {
    Discogs = "Discogs",
    LastFm = "Last.fm"
}

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

export type Error = {
    code?: string,
    type: "error" | "warning"
    message: string
}