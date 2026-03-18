import {
    DiscogsArtistInfos,
    DiscogsMaster,
    DiscogsRelease,
    DiscogsSearchParams,
    DiscogsSearchResponse
} from "@/app/lib/data/http/discogs/model/types";
import axios, {AxiosInstance} from "axios";
import {logger} from "@/app/lib/utils/logger";

export type DiscogsConfiguration = {
    token: string,
    baseUrl?: string,
    timeout?: number,
    userAgent?: string,

}

export interface Client {
    search(params: DiscogsSearchParams): Promise<DiscogsSearchResponse>,
    masterReleaseById(id: number): Promise<DiscogsMaster>,
    releaseById(id: number): Promise<DiscogsRelease>,
    artistById(id: number): Promise<DiscogsArtistInfos>,
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

    public async search(params: DiscogsSearchParams): Promise<DiscogsSearchResponse> {
        return this.apiClient
            .get<DiscogsSearchResponse>("/database/search", { params })
            .then(r => r.data)
            .catch((error) => {
                logger.error("Discogs: Error searching: ", `params=${JSON.stringify(params)}`, `error=${error}`);
                throw new Error(`Unexpected error when searching`);
            });
    }

    public async masterReleaseById(id: number): Promise<DiscogsMaster> {
        logger.debug("Discogs: Fetching master by id: ", "id=", id);
        return this.apiClient.get<DiscogsMaster>(`/masters/${id}`)
            .then(r => r.data)
            .catch((error) => {
                logger.error("Discogs: Error fetching master: ", `id=${id}`, `error=${error}`);
                if (axios.isAxiosError(error) && error.response?.status === 404) {
                    throw new Error(`Master with id ${id} not found`)
                } else {
                    throw new Error(`Unexpected error when fetching master with id ${id}`)
                }
            });
    }

    public async releaseById(id: number): Promise<DiscogsRelease> {
        return this.apiClient.get<DiscogsRelease>(`/releases/${id}`)
            .then(r => r.data)
            .catch((error) => {
                logger.error("Discogs: Error fetching release: ", `id=${id}`, `error=${error}`);
                if (axios.isAxiosError(error) && error.response?.status === 404) {
                    throw new Error(`Release with id ${id} not found`)
                } else {
                    throw new Error(`Unexpected error when fetching release with id ${id}`)
                }
            });
    }

    public async artistById(id: number): Promise<DiscogsArtistInfos> {
        return this.apiClient.get<DiscogsArtistInfos>(`/artists/${id}`)
            .then(r => r.data)
            .catch((error) => {
                logger.error("Discogs: Error fetching artist: ", `id=${id}`, `error=${error}`);
                if (axios.isAxiosError(error) && error.response?.status === 404) {
                    throw new Error(`Artist with id ${id} not found`)
                } else {
                    throw new Error(`Unexpected error when fetching artist with id ${id}`)
                }
            });
    }
}
