'use server'

import {AlbumInfoParams, lastfm} from "@/app/lib/data/http/lastfm";
import {Album, SearchAlbumsResult} from "@/app/types/albums";
import {lastfmAlbumToAlbum, lastfmSearchResultItemToAlbumShort} from "@/app/lib/services/mapper/album";
import {logger} from "@/app/lib/utils/logger";
import config from "@/app/config";
import {LRUCache} from "lru-cache";
import {lastfmScrobbleResponseToScrobbleReport} from "@/app/lib/services/mapper/scrobble";
import {ScrobbleReport} from "@/app/types/scrobble";
import {getConnectedUserName} from "@/app/lib/services/session";

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
            const albums = response.results.albummatches.album.map((album) => lastfmSearchResultItemToAlbumShort(album))
            const pagination = {
                page: page,
                pages: Math.ceil(parseInt(response.results["opensearch:totalResults"], 10) / searchAlbumsPageSize),
                size: parseInt(response.results["opensearch:itemsPerPage"], 10),
                total: parseInt(response.results["opensearch:totalResults"], 10),
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
    logger.debug(`Last.fm: Fetching album by ${id ? `id=${id}, ` : ''}${title ? `title=${title}, ` : ''}${artist ? `artist=${artist}` : ''}`);

    const key = id !== '' && id != null ? id : `${artist}-${title}`;

    if (albumsCache.has(key)) {
        const album = albumsCache.get(key);
        if (album != null) {
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
            const album = lastfmAlbumToAlbum(response.album);
            albumsCache.set(key, album);
            return album;
        })
        .catch((error) => {
            logger.error("fetchLastfmAlbumByIdOrNameAndArtist:", error);
            throw new Error(`Erreur lors du chargement de l'album${error ? ': ' + error.message : '.'}`, error);
        });
}

export async function scrobbleTracks(albumTitle: string, albumArtist: string, tracks: string[], artists: string[], durations: number[]): Promise<{status: "ok" | "failed", report: ScrobbleReport}> {
    logger.info(`Scrobble ${tracks.length} titres de l'album ${albumTitle} par ${albumArtist}.`)

    const username = await getConnectedUserName();
    if (!username) {
        throw new Error("Utilisateur non connecté");
    }

    const now = Date.now() / 1000;
    const scrobbles = tracks.map((track, index) => ({
        artist: artists[index],
        track: track,
        timestamp: now + (durations.slice(0, index).reduce((a, b) => a + b, 0)),
        album: albumTitle,
        albumArtist: albumArtist,
        duration: durations[index],
    }))

    return api.scrobble(username, scrobbles)
        .then(response => {
            return {status: response.lfm.status, report: lastfmScrobbleResponseToScrobbleReport(response)};
        })
        .catch(error => {
            logger.error("scrobbleTracks:", error);
            throw new Error(`Erreur lors de l'envoi des scrobbles${error ? ': ' + error.message : '.'}`, error);
        });
}