import EventEmitter from "node:events";
import {Artist} from "@/app/types/albums";
import {logger} from "@/app/lib/utils/logger";
import {handleTopArtistEvent} from "@/app/lib/events/handlers";

export const Events = {
    TopArtists: "top-artist",
}

export type TopArtistEvent = {
    artist: Artist,
    amount: number
}

class TopArtistsManager extends EventEmitter {
    constructor() {
        super();
    }

    public incrementArtistScore(artist: Artist, amount: number) {
        logger.info(`Incrementing score for ${artist.name} by ${amount}`);
        const result = this.emit<TopArtistEvent>(Events.TopArtists, {artist, amount});
        logger.info(`Event emitted: ${result}`);
    }
}

const topArtistsManager = new TopArtistsManager();

topArtistsManager.on<TopArtistEvent>(Events.TopArtists, (event) => handleTopArtistEvent(event))

export {topArtistsManager};
