import {DiscogsMaster, DiscogsSearchResultItem} from "@/app/lib/http/discogs";
import {Album, AlbumShort} from "@/app/types/albums";
import {LastFmAlbum} from "@/app/lib/http/lastfm";

export function discogsSearchResultItemToAlbumShort(item: DiscogsSearchResultItem): AlbumShort {
    const [artistName, albumTitle] = item.title.split(' - ')

    return {
        id: item.id.toString(10),
        title: albumTitle,
        year: item.year,
        artist: {id: '', name: artistName, roles: ''},
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
        artist: {id: '', name: item.artist, roles: ''},
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

export function discogsMasterToAlbum(item: DiscogsMaster): Album {
    return {
        id: item.id.toString(10),
        title: item.title,
        genres: item.genres,
        styles: item.styles,
        year: item.year,
        artists: item.artists.map(artist => ({
            id: artist.id.toString(10), name: artist.name, roles: artist.role ?? ""
        })),
        tracks: item.tracklist.map(track => ({
            position: track.position, title: track.title, duration: track.duration,
            artists: track.extraartists?.map(artist => ({
                id: artist.id.toString(10), name: artist.name, roles: artist.role ?? ""
            })) ?? '',
        })),
        images: item.images.map(image => ({
            type: image.type,
            height: image.height,
            width: image.width,
            uri: image.uri
        })),

    }
}