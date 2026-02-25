import {DiscogsMaster, DiscogsSearchResultItem} from "@/app/lib/data/http/discogs";
import {Album, AlbumShort} from "@/app/types/albums";
import {LastFmAlbum, LastFmAlbumInfos} from "@/app/lib/data/http/lastfm";
import {displayTimeToSeconds} from "@/app/lib/utils/duration";

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
    const tracks = item.tracklist.map(track => ({
        position: track.position,
        title: track.title,
        duration: displayTimeToSeconds(track.duration),
        artists: track.extraartists?.map(artist => ({
            id: artist.id.toString(10), name: artist.name, roles: artist.role ?? ""
        })) ?? '',
    }));

    const totalDuration = tracks.reduce((acc, track) => acc + track.duration, 0);

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
        tracks: tracks,
        images: item.images.map(image => ({
            type: image.type,
            height: image.height,
            width: image.width,
            uri: image.uri
        })),
        duration: totalDuration > 0 ? totalDuration : undefined
    }
}

export function lastfmAlbumToAlbum(item: LastFmAlbum): Album {
    const tracks = item.tracks?.track.map(track => ({
        position: track["@attr"].rank.toString(10),
        title: track.name,
        duration: track.duration ?? undefined,
        artists: [{id: track.artist.mbid, name: track.artist.name, roles: ''}],
    }))

    const totalDuration = tracks.reduce((acc, track) => acc + (track.duration ?? 0), 0);

    return {
        id: item.id ?? '',
        title: item.name,
        origin: "Last.fm",
        tags: item.tags.tag?.map(tag => tag.name),
        released: item.releasedate,
        artists: [{id: '', name: item.artist, roles: ''}],
        tracks: tracks,
        images: item.image.map(image => ({
            size: image.size,
            uri: image["#text"],
        })),
        duration: totalDuration > 0 ? totalDuration : undefined
    }
}