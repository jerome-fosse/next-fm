import {TopArtistEvent} from "@/app/lib/events/bus";
import {logger} from "@/app/lib/utils/logger";

export async function handleTopArtistEvent(event: TopArtistEvent) {
    logger.info("TopArtists event received", event);
}