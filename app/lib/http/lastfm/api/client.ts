
import axios, {AxiosInstance, AxiosResponse} from "axios";
import {
    GetAlbumInfoParams,
    LastFmAlbumSearchResponse,
    LastFmGetAlbumInfoResponse,
    SearchParams
} from "@/app/lib/http/lastfm/model/types";
import config from "@/app/config";

export type LastfmConfiguration = {
    apiKey: string,
    baseUrl?: string,
    timeout?: number,
    userAgent?: string,
}

export interface Client {
    search(params: SearchParams): Promise<AxiosResponse<LastFmAlbumSearchResponse>>,
    getAlbumInfo(params: GetAlbumInfoParams): Promise<AxiosResponse<LastFmGetAlbumInfoResponse>>
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

    public getAlbumInfo(params: GetAlbumInfoParams): Promise<AxiosResponse<LastFmGetAlbumInfoResponse>> {
        return this.api.get<LastFmGetAlbumInfoResponse>("/2.0/", {
            params: {
                method: "album.getInfo",
                api_key: this.cfg.apiKey,
                format: "json",
                ...params,
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
            baseUrl: config.lastfm.baseUrl,
            timeout: config.lastfm.timeout,
            userAgent: config.userAgent
        }
    }

    private checkConfig(config: LastfmConfiguration) {
        if (config.apiKey === "") {
            throw new Error("Missing LASTFM_API_KEY in index...");
        }
        if (config.baseUrl === "") {
            throw new Error("Missing LASTFM_BASE_URL in index...");
        }
        if (config.timeout === null) {
            throw new Error("Missing LASTFM_TIMEOUT in index...");
        }
        if (config.userAgent === "") {
            throw new Error("Missing USER_AGENT in index...");
        }
    }
}

export const lastfm = new LastFM();
