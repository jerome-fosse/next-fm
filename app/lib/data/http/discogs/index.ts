import "server-only"
import {Client, DiscogsClient, DiscogsConfiguration} from "@/app/lib/data/http/discogs/api/client";
import config from "@/app/config";

export * from "./api/client";
export * from "./model/types";

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