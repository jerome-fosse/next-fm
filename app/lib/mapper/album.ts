import {DiscogsMaster, DiscogsSearchResultItem} from "@/app/lib/http/discogs";
import {Album, AlbumShort} from "@/app/types/albums";
import {LastFmAlbum, LastFmAlbumInfos} from "@/app/lib/http/lastfm";
import {secondsToDuration} from "@/app/lib/mapper/common";
import {logger} from "@/app/lib/logger";

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

export function lastfmSearchResultItemToAlbumShort(item: LastFmAlbumInfos): AlbumShort {
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
        origin: "Discogs",
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

export function lastfmAlbumToAlbum(item: LastFmAlbum): Album {
    logger.debug("lastfmAlbumToAlbum: item=", item);

    return {
        id: item.id ?? '',
        title: item.name,
        origin: "Last.fm",
        tags: item.tags.tag?.map(tag => tag.name),
        released: item.releasedate,
        artists: [{id: '', name: item.artist, roles: ''}],
        tracks: item.tracks?.track.map(track => ({
            position: track["@attr"].rank.toString(10),
            title: track.name,
            duration: secondsToDuration(track.duration ?? 0),
            artists: [{id: track.artist.mbid, name: track.artist.name, roles: ''}],
        })),
        images: item.image.map(image => ({
            size: image.size,
            uri: image["#text"],
        })),
    }
}