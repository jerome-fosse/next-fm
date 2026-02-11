import {lastfm} from "@/app/lib/http/lastfm";
import {SearchAlbumsResult} from "@/app/types/albums";
import {lastfmSearchResultItemToAlbumShort} from "@/app/lib/mapper/album";
import {logger} from "@/app/lib/logger";

const api = lastfm.createClientWithDefaultConfig();
const searchAlbumsPageSize = parseInt(process.env.SEARCH_ALBUMS_PAGE_SIZE ?? "20", 10);

export async function searchAlbumsLastfm(query: string, page: number = 1): Promise<SearchAlbumsResult> {
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