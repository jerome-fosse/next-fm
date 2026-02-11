'use server'

import {searchAlbumsDiscogs} from "@/app/lib/data/discogs";
import {AlbumShort, SearchAlbumsResult} from "@/app/types/albums";
import {Pagination} from "@/app/types/common";
import {searchAlbumsLastfm} from "@/app/lib/data/lastfm";
import {logger} from "@/app/lib/logger";

export type SearchAlbumsState = {
    query: string,
    searchApi: string,
    error?: Error,
    albums?: AlbumShort[],
    pagination?: Pagination,
}

export async function searchAlbumsAction(prevState: SearchAlbumsState, formData: FormData) {
    logger.debug("searchAlbumsAction Params:", "formData=", formData);

    const query = formData.get("query") as string;
    const searchApi = formData.get("searchapi") as string;
    const page = parseInt(formData.get("page") as string ?? "1", 10);

    if (!query)
        throw new Error("Requête invalide : champ 'query' manquant");

    let data: SearchAlbumsResult;

    switch (searchApi) {
        case "Discogs":
            data = await searchAlbumsDiscogs(query, page);
            break;
        case "Last.fm":
            data = await searchAlbumsLastfm(query, page);
            break;
        default:
            throw new Error("API de recherche non supportée");
    }

    logger.debug("searchAlbumsAction Result:", data);

    return {query: query, searchApi: searchApi, error: undefined, albums: data.albums, pagination: data.pagination};
}