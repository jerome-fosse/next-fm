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