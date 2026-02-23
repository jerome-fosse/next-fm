'use server'

import {discogs} from "@/app/lib/http/discogs/api/client";
import {Album, SearchAlbumsResult} from "@/app/types/albums";
import {discogsMasterToAlbum, discogsSearchResultItemToAlbumShort} from "@/app/lib/mapper/album";
import {discogsPaginationToPagination} from "@/app/lib/mapper/common";
import {logger} from "@/app/lib/logger";
import config from "@/app/config";
import {LRUCache} from "lru-cache";

const api = discogs.createClientWithDefaultConfig();
const searchAlbumsPageSize = config.discogs.searchPageSize;
const searchCache =  new LRUCache<string, SearchAlbumsResult>({
    max: config.cache.discogs.search.capacity,
    ttl: config.cache.discogs.search.ttl,
    onInsert: (value, key) => logger.debug( `SearchAlbumsResult with key ${key} inserted in Discogs cache.`)
});
const albumsCache =  new LRUCache<string, Album>({
    max: config.cache.discogs.albums.capacity,
    ttl: config.cache.discogs.albums.ttl,
    onInsert: (value, key) => logger.debug( `Album with key ${key} inserted in Discogs cache.`)
});

export async function searchDiscogsAlbums(query: string, page: number = 1): Promise<SearchAlbumsResult> {
    logger.info("Discogs: Searching albums for =>", "query=", query, "page=", page);

    const key = `${query}-${page}`;

    if (searchCache.has(key)) {
        const result = searchCache.get(key);
        logger.debug(`SearchAlbumsResult with key ${key} fetched from Discogs cache.`)
        return result!;
    }

    return api.search({query: query, type: "master", per_page: searchAlbumsPageSize, page: page})
        .then(response => {
            const albums = response.data.results
                .map(item => discogsSearchResultItemToAlbumShort(item));
            const pagination = discogsPaginationToPagination(response.data.pagination);

            const result = {albums: albums, pagination: pagination};
            searchCache.set(key, result);

            return result;
        })
        .catch(error => {
            logger.error("searchAlbumsDiscogs:", error);
            throw new Error(`Erreur lors de la recherche${error ? ': ' + error.message : '.'}`, error);
        });
}

export async function fetchDiscogsMasterReleaseById(id: number): Promise<Album> {
    logger.info("Discogs: Fetching master by id: ", id);

    if (albumsCache.has(id.toString(10))) {
        const album = albumsCache.get(id.toString(10));
        logger.debug(`Album with key ${id} fetched from Discogs cache.`);
        return album!;
    }

    return api.masterReleaseById(id)
        .then(response => {
            const album = discogsMasterToAlbum(response.data);
            albumsCache.set(album.id, album);
            return album;
        })
        .catch(error => {
            logger.error("getMasterDiscogsById:", error);
            throw new Error(`Erreur lors du chargement de l'album${error ? ': ' + error.message : '.'}`, error);
        });
}
