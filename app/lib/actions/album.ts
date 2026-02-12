'use server'

import {searchAlbumsDiscogs} from "@/app/lib/data/discogs";
import {AlbumShort, SearchAlbumsResult} from "@/app/types/albums";
import {Pagination} from "@/app/types/common";
import {searchAlbumsLastfm} from "@/app/lib/data/lastfm";
import {logger} from "@/app/lib/logger";
import {z} from "zod";

export type SearchAlbumsState = {
    query: string,
    searchApi: string,
    error?: Error,
    albums?: AlbumShort[],
    pagination?: Pagination,
}

export async function searchAlbumsAction(prevState: SearchAlbumsState, formData: FormData) {
    const SearchParams = z.object({
        query: z.string().min(1, "Une requête de recherche est obligatoire."),
        searchapi: z.literal(["Discogs", "Last.fm"], "Seules les API Discogs et Last.fm sont supportées."),
        page: z.coerce.number().int().min(1).optional().default(1),
    })

    const formEntries = Object.fromEntries(formData.entries());
    const parsed = SearchParams.safeParse(formEntries);

    if (!parsed.success) {
        logger.error("Paramètres de recherche invalides:", parsed.error.message);
        return {query: formEntries.query, searchApi: formEntries.searchapi, error: `Paramètres de recherche invalides.`, albums: undefined, pagination: undefined};
    }

    logger.debug("searchAlbumsAction Params:", "SearchParams=", parsed.data);

    let data: SearchAlbumsResult;

    switch (parsed.data.searchapi) {
        case "Discogs":
            data = await searchAlbumsDiscogs(parsed.data.query, parsed.data.page);
            break;
        case "Last.fm":
            data = await searchAlbumsLastfm(parsed.data.query, parsed.data.page);
            break;
        default:
            throw new Error("API de recherche non supportée");
    }

    return {query: parsed.data.query, searchApi: parsed.data.searchapi, error: undefined, albums: data.albums, pagination: data.pagination};
}