'use server'

import {discogs} from "@/app/lib/http/discogs/api/client";
import {Album, SearchAlbumsResult} from "@/app/types/albums";
import {discogsMasterToAlbum, discogsSearchResultItemToAlbumShort} from "@/app/lib/mapper/album";
import {discogsPaginationToPagination} from "@/app/lib/mapper/common";
import {logger} from "@/app/lib/logger";
import config from "@/app/config";

const api = discogs.createClientWithDefaultConfig();
const searchAlbumsPageSize = config.discogs.searchPageSize;

export async function searchAlbumsDiscogs(query: string, page: number = 1): Promise<SearchAlbumsResult> {
    logger.info("Discogs: Searching albums for =>", "query=", query, "page=", page);

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
            logger.error("searchAlbumsDiscogs:", error);
            throw new Error("Erreur lors de la recherche sur Discogs", error);
        });
}

export async function getDiscogsMasterReleaseById(id: number): Promise<Album> {
    logger.info("Discogs: Fetching master by id: ", "id=", id);

    return api.masterReleaseById(id)
        .then(response => {
            return discogsMasterToAlbum(response.data);
        })
        .catch(error => {
            logger.error("getMasterDiscogsById:", error);
            throw new Error(`Erreur lors du chargement des données du master Discogs avec id=${id}`, error);
        });
}
