'use server'

import {AlbumInfoParams, lastfm} from "@/app/lib/data/http/lastfm";
import {Album, SearchAlbumsResult} from "@/app/types/albums";
import {lastfmAlbumToAlbum, lastfmSearchResultItemToAlbumShort} from "@/app/lib/services/mapper/album";
import {logger} from "@/app/lib/utils/logger";
import config from "@/app/config";
import {LRUCache} from "lru-cache";

const api = lastfm.createClientWithDefaultConfig();
const searchAlbumsPageSize = config.lastfm.searchPageSize;
const searchCache = new LRUCache<string, SearchAlbumsResult>({
    max: config.cache.lastfm.search.capacity,
    ttl: config.cache.lastfm.search.ttl,
    onInsert: (value, key) => logger.debug(`SearchAlbumsResult with key ${key} inserted in Last.fm cache.`)
});
const albumsCache = new LRUCache<string, Album>({
    max: config.cache.lastfm.albums.capacity,
    ttl: config.cache.lastfm.albums.ttl,
    onInsert: (value, key) => logger.debug(`Album with key ${key} inserted in Last.fm cache.`)
});

export async function searchLastfmAlbums(query: string, page: number = 1): Promise<SearchAlbumsResult> {
    logger.debug("Last.fm: Searching albums for =>", "query=", query, "page=", page);

    const key = `${query}-${page}`;

    if (searchCache.has(key)) {
        const result = searchCache.get(key);
        logger.debug(`SearchAlbumsResult with key ${key} fetched from Last.fm cache.`);
        return result!;
    }

    return api.search({album: query, page: page, limit: searchAlbumsPageSize})
        .then(response => {
            const albums = response.data.results.albummatches.album.map((album) => lastfmSearchResultItemToAlbumShort(album))
            const pagination = {
                page: page,
                pages: Math.ceil(parseInt(response.data.results["opensearch:totalResults"], 10) / searchAlbumsPageSize),
                size: parseInt(response.data.results["opensearch:itemsPerPage"], 10),
                total: parseInt(response.data.results["opensearch:totalResults"], 10),
                urls: {},
            }

            const result = {albums: albums, pagination: pagination};
            searchCache.set(key, result);
            return result;
        })
        .catch((error) => {
            logger.error("searchLastfmAlbums:", error);
            throw new Error(`Erreur lors de la recherche${error ? ': ' + error.message : '.'}`, error);
        });
}

export async function fetchLastfmAlbumByIdOrNameAndArtist(id: string = '', title: string = '', artist: string = ''): Promise<Album> {
    logger.debug("Last.fm: Fetching album by id: ", "id=", id, "title=", title, "artist=", artist);

    const key = id !== '' && id != null ? id : `${artist}-${title}`;

    if (albumsCache.has(key)) {
        const album = albumsCache.get(key);
        if (album != null) {
            logger.debug(album)
            logger.debug(`Album with key ${key} fetched from Last.fm cache.`);
            return album;
        }
    }

    let params: AlbumInfoParams = {mbid: id, autocorrect: 1};
    if (id === '' || id == null) {
        params = {artist: artist, album: title, autocorrect: 1};
    }

    return api.getAlbumInfo(params)
        .then(response => {
            const album = lastfmAlbumToAlbum(response.data.album);
            albumsCache.set(key, album);
            return album;
        })
        .catch((error) => {
            logger.error("fetchLastfmAlbumByIdOrNameAndArtist:", error);
            throw new Error(`Erreur lors du chargement de l'album${error ? ': ' + error.message : '.'}`, error);
        });
}