import {DiscogsMaster, DiscogsRelease, DiscogsSearchParams, DiscogsSearchResponse} from "@/app/lib/http/discogs/model/types";
import axios, {AxiosInstance, AxiosResponse} from "axios";
import config from "@/app/config";

export type DiscogsConfiguration = {
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

export class DiscogsClient implements Client {
    private cfg: DiscogsConfiguration;
    private apiClient: AxiosInstance;

    constructor(config: DiscogsConfiguration) {
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
    public createClient(config: DiscogsConfiguration) : Client {
        this.checkConfig(config)
        return new DiscogsClient(config)
    }
    public createClientWithDefaultConfig() : Client {
        const config = this.defaultConfig()
        this.checkConfig(config)

        return new DiscogsClient(config)
    }
    public defaultConfig(): DiscogsConfiguration {
        return {
            token: config.discogs.token,
            baseUrl: config.discogs.baseUrl,
            timeout: config.discogs.timeout,
            userAgent: config.userAgent
        }
    }

    private checkConfig(config: DiscogsConfiguration) {
        if (config.token === "") {
            throw new Error("Missing DISCOGS_TOKEN in index...")
        }

        if (config.baseUrl === "") {
            throw new Error("Missing DISCOGS_BASE_URL in index...")
        }

        if (config.timeout === null) {
            throw new Error("Missing DISCOGS_TIMEOUT in index...")
        }

        if (config.userAgent === "") {
            throw new Error("Missing USER_AGENT in index...")
        }
    }
}

export const discogs = new Discogs();
