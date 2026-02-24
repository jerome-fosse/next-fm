export type Session = {
    user: string,
    key: string,
    subscriber: string,
    createdAt: string,
    lastLoginAt?: string,
}

export type User = {
    name: string,
    age: string,
    country: string,
    stats: {
        play: number,
        artists: number,
        albums: number,
        tracks: number,
        playlist: number,
    },
    images?: [
        {
            size: "small" | "medium" | "large" | "extralarge",
            url: string,
        }
    ]
    url: string,
}