import {DiscogsSearchResultItem} from "@/app/lib/http/discogs";
import {AlbumShort} from "@/app/types/albums";
import {LastFmAlbum} from "@/app/lib/http/lastfm";

export function discogsSearchResultItemToAlbumShort(item: DiscogsSearchResultItem): AlbumShort {
    const [artistName, albumTitle] = item.title.split(' - ')

    return {
        id: item.id.toString(10),
        title: albumTitle,
        year: item.year,
        artist: {id: '', name: artistName},
        origin: "Discogs",
        url: `https://www.discogs.com${item.uri}`,
        images: [
            {size: "small", uri: item.thumb},
            {size: "large", uri: item.cover_image},
        ]
    }
}

export function lastfmSearchResultItemToAlbumShort(item: LastFmAlbum): AlbumShort {
    return {
        id: item.mbid,
        title: item.name,
        artist: {id: '', name: item.artist},
        origin: "Last.fm",
        url: item.url,
        images: item.image.map((image) =>
            ({
                size: image.size,
                uri: image['#text']
            })
        )
    }
}