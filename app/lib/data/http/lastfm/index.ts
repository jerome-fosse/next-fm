import "server-only"
import {Client, LastfmConfiguration, LastFMClient} from "@/app/lib/data/http/lastfm/api/client";
import config from "@/app/config";

export * from "./api/client";
export * from "./model/types";

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
