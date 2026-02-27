import {
    DiscogsMaster,
    DiscogsRelease,
    DiscogsSearchParams,
    DiscogsSearchResponse
} from "@/app/lib/data/http/discogs/model/types";
import axios, {AxiosInstance, AxiosResponse} from "axios";
import {logger} from "@/app/lib/utils/logger";
import {match} from "ts-pattern";

export type DiscogsConfiguration = {
    token: string,
    baseUrl?: string,
    timeout?: number,
    userAgent?: string,

}

export interface Client {
    search(params: DiscogsSearchParams): Promise<AxiosResponse<DiscogsSearchResponse>>,
    masterReleaseById(id: number): Promise<AxiosResponse<DiscogsMaster>>,
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
            .get<DiscogsSearchResponse>("/database/search", { params })
            .catch((error) => {
                logger.error("Discogs: Error searching: ", `params=${JSON.stringify(params)}`, `error=${error}`);
                throw new Error(`Unexpected error when searching`);
            });
    }

    public async masterReleaseById(id: number): Promise<AxiosResponse<DiscogsMaster>> {
        logger.debug("Discogs: Fetching master by id: ", "id=", id);
        return this.apiClient.get<DiscogsMaster>(`/masters/${id}`)
            .catch((error) => {
                logger.error("Discogs: Error fetching master: ", `id=${id}`, `error=${error}`);
                return match(error)
                    .when(() => (axios.isAxiosError(error) && error.response?.status === 404), () => {
                        throw new Error(`Master with id ${id} not found`)
                    })
                    .otherwise(() => {
                        throw new Error(`Unexpected error when fetching master with id ${id}`)
                    });
            });
    }

    public async releaseById(id: number): Promise<AxiosResponse<DiscogsRelease>> {
        return this.apiClient.get<DiscogsRelease>(`/releases/${id}`)
            .catch((error) => {
                logger.error("Discogs: Error fetching release: ", `id=${id}`, `error=${error}`);
                return match(error)
                    .when(() => axios.isAxiosError(error) && error.response?.status === 404, () => {
                        throw new Error(`Release with id ${id} not found`)
                    })
                    .otherwise(() => {
                        throw new Error(`Unexpected error when fetching release with id ${id}`)
                    });
            });
    }
}
