export type ScrobbleReport = {
    accepted: number,
    ignored: number,
    scrobbles?: {
        track: string,
        artist: string,
        code: number,
        message: string,
    }[]
}