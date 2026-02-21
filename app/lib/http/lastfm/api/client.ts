
import axios, {AxiosInstance, AxiosResponse} from "axios";
import {
    AlbumInfoParams,
    LastFmAlbumSearchResponse,
    LastFmGetAlbumInfoResponse, LastFmGetSessionResponse,
    SearchParams
} from "@/app/lib/http/lastfm/model/types";
import config from "@/app/config";
import crypto from "crypto";

export type LastfmConfiguration = {
    apiKey: string,
    secret: string,
    baseUrl?: string,
    timeout?: number,
    userAgent?: string,
}

export interface Client {
    search(params: SearchParams): Promise<AxiosResponse<LastFmAlbumSearchResponse>>,
    getAlbumInfo(params: AlbumInfoParams): Promise<AxiosResponse<LastFmGetAlbumInfoResponse>>
    getSession(token: string): Promise<AxiosResponse<LastFmGetSessionResponse>>
}

class LastFMClient implements Client {
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

    public search(params: SearchParams): Promise<AxiosResponse<LastFmAlbumSearchResponse>> {
        return this.api.get<LastFmAlbumSearchResponse>("/2.0/", {
            params: {
                method: "album.search",
                api_key: this.cfg.apiKey,
                format: "json",
                ...params,
            },
        });
    }

    public getAlbumInfo(params: AlbumInfoParams): Promise<AxiosResponse<LastFmGetAlbumInfoResponse>> {
        return this.api.get<LastFmGetAlbumInfoResponse>("/2.0/", {
            params: {
                method: "album.getInfo",
                api_key: this.cfg.apiKey,
                format: "json",
                ...params,
            }
        })
    }

    public getSession(token: string): Promise<AxiosResponse<LastFmGetSessionResponse>> {
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
    }
}

class LastFM {
    constructor() {
    }
    public createClient(config: LastfmConfiguration) : Client {
        this.checkConfig(config)
        return new LastFMClient(config)
    }
    public createClientWithDefaultConfig() : Client {
        const config = this.defaultConfig()
        this.checkConfig(config)

        return new LastFMClient(config)
    }
    public defaultConfig(): LastfmConfiguration {
        return {
            apiKey: config.lastfm.apiKey,
            secret: config.lastfm.secret,
            baseUrl: config.lastfm.baseUrl,
            timeout: config.lastfm.timeout,
            userAgent: config.userAgent
        }
    }

    private checkConfig(config: LastfmConfiguration) {
        if (config.apiKey === "") {
            throw new Error("Missing LASTFM_API_KEY in config...");
        }
        if (config.secret === "") {
            throw new Error("Missing LASTFM_SECRET in config...");
        }
        if (config.baseUrl === "") {
            throw new Error("Missing LASTFM_BASE_URL in config...");
        }
        if (config.timeout === null) {
            throw new Error("Missing LASTFM_TIMEOUT in config...");
        }
        if (config.userAgent === "") {
            throw new Error("Missing USER_AGENT in config...");
        }
    }
}

export const lastfm = new LastFM();
