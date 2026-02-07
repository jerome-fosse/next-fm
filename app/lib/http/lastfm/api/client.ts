
import axios, {AxiosInstance, AxiosResponse} from "axios";
import {
    GetAlbumInfoParams,
    LastFmAlbumSearchResponse,
    LastFmGetAlbumInfoResponse,
    SearchParams
} from "@/app/lib/http/lastfm/model/types";

export type Config = {
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
    private cfg: Config;
    private api: AxiosInstance;

    constructor(config: Config) {
        this.cfg = config;
        this.api = axios.create({
            baseURL: config.baseUrl,
            timeout: config.timeout,
            headers: {
                "User-Agent": config.userAgent,
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
    public createClient(config: Config) : Client {
        return new LastFMClient(config)
    }
    public defaultConfig(): Config {
        const config = {
            apiKey: process.env.LASTFM_API_KEY ?? "",
            baseUrl: process.env.LASTFM_BASE_URL ?? "https://ws.audioscrobbler.com",
            timeout: parseInt(process.env.LASTFM_TIMEOUT ?? "1000", 10),
            userAgent: process.env.USER_AGENT ?? "Next.js/generic",
        }

        if (config.apiKey === "") {
            throw new Error("Missing LASTFM_API_KEY env var");
        }

        return config;
    }
}

export const lastfm = new LastFM();
