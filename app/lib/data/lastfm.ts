'use server'

import {AlbumInfoParams, lastfm} from "@/app/lib/http/lastfm";
import {Album, SearchAlbumsResult} from "@/app/types/albums";
import {lastfmAlbumToAlbum, lastfmSearchResultItemToAlbumShort} from "@/app/lib/mapper/album";
import {logger} from "@/app/lib/logger";
import config from "@/app/config";

const api = lastfm.createClientWithDefaultConfig();
const searchAlbumsPageSize = config.lastfm.searchPageSize;

export async function searchLastfmAlbums(query: string, page: number = 1): Promise<SearchAlbumsResult> {
    logger.debug("Last.fm: Searching albums for =>", "query=", query, "page=", page);

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

            return {
                albums: albums,
                pagination: pagination,
            }
        })
        .catch((error) => {
            logger.error("Error fetching albums from Last.fm:", error);
            throw new Error("Erreur lors de la recherche sur Last.fm", error);
        })
        ;
}

export async function fetchLastfmAlbumByIdOrNameAndArtist(id: string = '', title: string = '', artist: string = ''): Promise<Album> {
    logger.debug("Last.fm: Fetching album by id: ", "id=", id, "title=", title, "artist=", artist);

    let params: AlbumInfoParams = {mbid: id, autocorrect: 1};
    if (id === '' || id == null) {
        params = {artist: artist, album: title, autocorrect: 1};
    }

    return api.getAlbumInfo(params)
        .then(response => lastfmAlbumToAlbum(response.data.album))
        .catch((error) => {
            logger.error("Error fetching album from Last.fm:", error);
            throw new Error("Erreur lors de la récupération de l'album sur Last.fm", error);
        })
}