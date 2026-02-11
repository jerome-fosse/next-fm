'use server'

import {discogs} from "@/app/lib/http/discogs/api/client";
import {SearchAlbumsResult} from "@/app/types/albums";
import {discogsSearchResultItemToAlbumShort} from "@/app/lib/mapper/album";
import {discogsPaginationToPagination} from "@/app/lib/mapper/common";
import {logger} from "@/app/lib/logger";

const api = discogs.createClientWithDefaultConfig();
const searchAlbumsPageSize = parseInt(process.env.SEARCH_ALBUMS_PAGE_SIZE ?? "", 10) || 10;

export async function searchAlbumsDiscogs(query: string, page: number = 1): Promise<SearchAlbumsResult> {
    logger.debug("Discogs: Searching albums for =>", "query=", query, "page=", page);

    return api.search({query: query, type: "master", per_page: searchAlbumsPageSize, page: page})
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
            logger.error("Error fetching albums from Discogs:", error);
            throw new Error("Erreur lors de la recherche sur Discogs", error);
        });
}
