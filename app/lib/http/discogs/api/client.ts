import {DiscogsMaster, DiscogsRelease, DiscogsSearchParams, DiscogsSearchResponse} from "@/app/lib/http/discogs/model/types";
import axios, {AxiosInstance, AxiosResponse} from "axios";

export type Config = {
    token: string,
    baseUrl?: string,
    timeout?: number,
    userAgent?: string,

}

export interface Client {
    search(params: DiscogsSearchParams): Promise<AxiosResponse<DiscogsSearchResponse>>,
    masterById(id: number): Promise<AxiosResponse<DiscogsMaster>>,
    releaseById(id: number): Promise<AxiosResponse<DiscogsRelease>>,
}

class DiscogsClient implements Client {
    private cfg: Config;
    private apiClient: AxiosInstance;

    constructor(config: Config) {
        this.cfg = config;
        this.apiClient = axios.create({
            baseURL: config.baseUrl,
            timeout: config.timeout,
            headers: {
                "User-Agent": this.cfg.userAgent,
                "Content-Type": "application/json",
                "Accept": "application/json",
                Authorization: `Discogs token=${this.cfg.token}`,
            }
        });
    }

    public async search(params: DiscogsSearchParams): Promise<AxiosResponse<DiscogsSearchResponse>> {
         return this.apiClient
            .get<DiscogsSearchResponse>("/database/search", {
                    params: params,
                }
            );
    }

    public async masterById(id: number): Promise<AxiosResponse<DiscogsMaster>> {
        return this.apiClient.get<DiscogsMaster>(`/masters/${id}`);
    }

    public async releaseById(id: number): Promise<AxiosResponse<DiscogsRelease>> {
        return this.apiClient.get<DiscogsRelease>(`/releases/${id}`);
    }
}

class Discogs {
    constructor() {
    }
    public createClient(config: Config) : Client {
        return new DiscogsClient(config)
    }
    public defaultConfig(): Config {
        const config = {
            token: process.env.DISCOGS_TOKEN ?? "",
            baseUrl: process.env.DISCOGS_BASE_URL ?? "https://api.discogs.com",
            timeout: parseInt(process.env.DISCOGS_TIMEOUT ?? "1000", 10),
            userAgent: process.env.USER_AGENT ?? "Next.js/generic",
        }

        if (config.token === "") {
            throw new Error("Missing DISCOGS_TOKEN env var")
        }

        if (config.baseUrl === "") {
            throw new Error("Missing DISCOGS_BASE_URL env var")
        }

        return config;
    }
}

export const discogs = new Discogs();
