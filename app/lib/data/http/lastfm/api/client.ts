import axios, {AxiosInstance} from "axios";
import {
    AlbumInfoParams,
    LastFmAlbumSearchResponse,
    LastFmErrorResponse,
    LastFmGetAlbumInfoResponse,
    LastFmGetSessionResponse,
    LastFmUserGetInfoResponse,
    SearchParams
} from "@/app/lib/data/http/lastfm/model/types";
import crypto from "crypto";
import {match} from "ts-pattern";
import {logger} from "@/app/lib/utils/logger";

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
                "Content-Type": "application/json",
                "Accept": "application/json",
            }
        });
    }

    public search(params: SearchParams): Promise<LastFmAlbumSearchResponse> {
        return this.api.get<LastFmAlbumSearchResponse>("/2.0/", {
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
        const sig = `api_key${this.cfg.apiKey}methodauth.getSessiontoken${token}${this.cfg.secret}`;
        const hash = crypto.createHash('md5').update(sig).digest('hex')

        return this.api.get<LastFmGetSessionResponse>("/2.0/", {
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
}