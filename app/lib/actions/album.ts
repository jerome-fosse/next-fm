'use server'

import {searchAlbums} from "@/app/lib/data/discogs";
import {AlbumShort} from "@/app/types/albums";
import {Pagination} from "@/app/types/common";

export type SearchAlbumsState = {
    query: string,
    searchApi: string,
    error?: Error,
    albums?: AlbumShort[],
    pagination?: Pagination,
}

export async function searchAlbumsAction(prevState: SearchAlbumsState, formData: FormData) {
    const query = formData.get("query") as string;
    const searchApi = formData.get("searchapi") as string;
    const page = parseInt(formData.get("page") as string, 10);

    if (!query)
        throw new Error("Requête invalide : champ 'query' manquant");

    const data = await searchAlbums(query, page);

    return {query: query, searchApi: searchApi, error: undefined, albums: data.albums, pagination: data.pagination};
}