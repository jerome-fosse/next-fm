'use server'

import {searchAlbums} from "@/app/lib/data/discogs";
import {AlbumShort} from "@/app/types/albums";
import {Pagination} from "@/app/types/common";

export type SearchAlbumsState = {
    query: string,
    isLoading: boolean,
    error?: Error,
    albums?: AlbumShort[],
    pagination?: Pagination,
}

export async function searchAlbumsAction(prevState: SearchAlbumsState, formData: FormData) {
    const query = formData.get("query") as string;

    console.log(query);
    if (!query)
        throw new Error("Requête invalide : champ 'query' manquant");

    const data = await searchAlbums(query);

    return {query: query, isLoading: false, error: undefined, albums: data.albums, pagination: data.pagination};
}