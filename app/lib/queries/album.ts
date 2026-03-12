import {searchDiscogsAlbums} from "@/app/lib/services/discogs";
import {searchLastfmAlbums} from "@/app/lib/services/lastfm";
import {DISCOGS, LASTFM, type Origin, ORIGINS, type Pagination} from "@/app/types/common";
import type {AlbumShort} from "@/app/types/albums";
import {z} from "zod";
import {logger} from "@/app/lib/utils/logger";

export type SearchResult =
    | { albums: AlbumShort[], pagination: Pagination }
    | { error: string }

export const searchSchema = z.object({
    query: z.string().min(1).optional(),
    searchapi: z.enum(ORIGINS).optional(),
    page: z.coerce.number().int().min(1).default(1),
});

export async function searchAlbums(query: string, searchApi: Origin, page: number): Promise<SearchResult> {
    try {
        switch (searchApi) {
            case DISCOGS:
                return searchDiscogsAlbums(query, page);
            case LASTFM:
                return searchLastfmAlbums(query, page);
        }
    } catch (e) {
        logger.error("Erreur lors de la recherche:", e);
        return {error: e instanceof Error ? e.message : "Une erreur inattendue s'est produite."};
    }
}
