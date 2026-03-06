import axios, {AxiosInstance} from "axios";
import {
    AlbumInfoParams,
    LastFmAlbumSearchResponse,
    LastFmGetAlbumInfoResponse,
    LastFmGetSessionResponse,
    LastFmScrobbleResponse,
    LastFmUserGetInfoResponse,
    Scrobble,
    SearchParams
} from "@/app/lib/data/http/lastfm/model/types";
import crypto from "crypto";
import {match} from "ts-pattern";
import {logger} from "@/app/lib/utils/logger";
import {getStorage} from "@/app/lib/data/storage";
import {Session} from "@/app/types/authent";
import {XMLParser} from "fast-xml-parser";

export type LastfmConfiguration = {
    apiKey: string,
    secret: string,
    baseUrl?: string,
    timeout?: number,
    userAgent?: string,
}

export interface Client {
    search(params: SearchParams): Promise<LastFmAlbumSearchResponse>,
    getAlbumInfo(params: AlbumInfoParams): Promise<LastFmGetAlbumInfoResponse>
    getSession(token: string): Promise<LastFmGetSessionResponse>
    getUserInfo(user: string): Promise<LastFmUserGetInfoResponse>
    scrobble(username: string, scrobbles: Scrobble[]): Promise<LastFmScrobbleResponse>
}

export class LastFMClient implements Client {
    private cfg: LastfmConfiguration;
    private api: AxiosInstance;

    constructor(config: LastfmConfiguration) {
        this.cfg = config;
        this.api = axios.create({
            baseURL: config.baseUrl,
            timeout: config.timeout,
            headers: {
                "User-Agent": config.userAgent,
            }
        });
    }

    public search(params: SearchParams): Promise<LastFmAlbumSearchResponse> {
        return this.api.get<LastFmAlbumSearchResponse>("/2.0/", {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            params: {
                method: "album.search",
                api_key: this.cfg.apiKey,
                format: "json",
                ...params,
            },
        })
        .then(r => r.data)
        .catch((error) => {
            return match(error)
                .when(
                    (e) => axios.isAxiosError(e) && e.response?.data.message,
                    (e) => {
                        logger.error("LastFM: search", e.response!.data)
                        throw new Error(e.response!.data.message)
                    }
                )
                .otherwise(() => {
                    logger.error("LastFM: search", "Unexpected error when fetching search results", error)
                    throw new Error("Unexpected error when fetching search results")
                })
        })
    }

    public getAlbumInfo(params: AlbumInfoParams): Promise<LastFmGetAlbumInfoResponse> {
        return this.api.get<LastFmGetAlbumInfoResponse>("/2.0/", {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            params: {
                method: "album.getInfo",
                api_key: this.cfg.apiKey,
                format: "json",
                ...params,
            }
        })
        .then(r => r.data)
        .catch((error) => {
            return match(error)
                .when(
                    (e) => axios.isAxiosError(e) && e.response?.data.message,
                    (e) => {
                        logger.error("LastFM: getAlbumInfo", e.response!.data)
                        throw new Error(e.response!.data.message)
                    }
                )
                .otherwise(() => {
                    logger.error("LastFM: getAlbumInfo", error)
                    throw new Error("Unexpected error when fetching album info")
                })
        })
    }

    public getSession(token: string): Promise<LastFmGetSessionResponse> {
        const params = [
            ["api_key", this.cfg.apiKey],
            ["method", "auth.getSession"],
            ["token", token],
        ]
        const hash = this.buildApiSignature(params, this.cfg.secret)

        return this.api.get<LastFmGetSessionResponse>("/2.0/", {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            params: {
                method: "auth.getSession",
                token: token,
                api_key: this.cfg.apiKey,
                api_sig: hash,
                format: "json",
            }
        })
        .then(r => r.data)
        .catch((error) => {
            return match(error)
                .when(
                    (e) => axios.isAxiosError(e) && e.response?.data.message,
                    (e) => {
                        logger.error("LastFM: getSession", e.response!.data)
                        throw new Error(e.response!.data.message)
                    }
                )
                .otherwise(() => {
                    logger.error("LastFM: getSession", "Unexpected error when fetching session", error)
                    throw new Error("Unexpected error when fetching session")
                })
        })
    }

    public getUserInfo(user: string): Promise<LastFmUserGetInfoResponse> {
        return this.api.get<LastFmUserGetInfoResponse>("/2.0/", {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            params: {
                method: "user.getInfo",
                user: user,
                api_key: this.cfg.apiKey,
                format: "json",
            }
        })
        .then(r => r.data)
        .catch((error) => {
            return match(error)
                .when(
                    (e) => axios.isAxiosError(e) && e.response?.data.message,
                    (e) => {
                        logger.error("LastFM: getUserInfo", e.response!.data)
                        throw new Error(e.response!.data.message)
                    }
                )
                .otherwise(() => {
                    logger.error("LastFM: getUserInfo", "Unexpected error when fetching user info", error)
                    throw new Error("Unexpected error when fetching user info")
                })
        })
    }

    public async scrobble(username: string, scrobbles: Scrobble[]): Promise<LastFmScrobbleResponse> {
        const storage = getStorage("session")
        const result = await storage.read<Session>(username)
        if (!result.success) {
            logger.error("LastFM: scrobble", "Failed to read session", result.error)
            throw new Error("Failed to read session")
        }
        const session = result.data

        const params = [
            ["api_key", this.cfg.apiKey],
            ["method", "track.scrobble"],
            ["sk", session.key],
            ...scrobbles.map((s, i) => [`artist[${i}]`, s.artist]),
            ...scrobbles.map((s, i) => [`track[${i}]`, s.track]),
            ...scrobbles.map((s, i) => [`timestamp[${i}]`, s.timestamp.toString()]),
            ...scrobbles.map((s, i) => [`duration[${i}]`, (s.duration ?? 180).toString(10)]),
        ];

        const sig = this.buildApiSignature(params, this.cfg.secret)

        return this.api.post<string>("/2.0/", new URLSearchParams({
            api_sig: sig,
            format: "xml",
            ...Object.fromEntries(params)
        }), {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        })
            .then(r => {
                const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "", parseAttributeValue: true });
                return parser.parse(r.data) as LastFmScrobbleResponse;
            })
            .catch((error) => {
                logger.error("LastFM: scrobble", error.message)
                throw new Error("Unexpected error when scrobbling");
            })
    }

    private buildApiSignature(params: string[][], secret: string): string {
        const sig = params.sort()
            .map(([key, value]) => `${key}${value}`)
            .reduce((acc, curr) => `${acc}${curr}`, "") + secret;

        return crypto.createHash('md5').update(sig).digest('hex');
    }
}
