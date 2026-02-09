'use server'

import {discogs} from "@/app/lib/http/discogs/api/client";
import {SearchAlbumsResult} from "@/app/types/albums";
import {discogsSearchResultItemToAlbumShort} from "@/app/lib/mapper/album";
import {discogsPaginationToPagination} from "@/app/lib/mapper/common";

const api = discogs.createClientWithDefaultConfig();
const searchAlbumsPageSize = parseInt(process.env.SEARCH_ALBUMS_PAGE_SIZE ?? "", 10) || 10;

export async function searchAlbums(query: string): Promise<SearchAlbumsResult> {

    return api.search({query: query, type: "master", per_page: searchAlbumsPageSize})
        .then(response => {
            const albums = response.data.results
                .map(item => discogsSearchResultItemToAlbumShort(item));
            const pagination = discogsPaginationToPagination(response.data.pagination);

            return {
                albums: albums,
                pagination: pagination,
            }
        })
        .catch(error => {
            console.log(error);
            throw new Error("Erreur lors de la recherche sur Discogs");
        });
}
