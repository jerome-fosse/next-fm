import type {
    LastFmAlbum,
    LastFmAlbumInfos,
    LastFmGetSessionResponse,
    LastFmImage,
    LastFmTrack,
    LastFmUser,
} from "@/app/lib/data/http/lastfm/model/types"

export const makeLastFmImage = (overrides?: Partial<LastFmImage>): LastFmImage => ({
    "#text": "https://lastfm.freetls.fastly.net/i/u/300x300/image.jpg",
    size: "large",
    ...overrides,
})

export const makeLastFmTrack = (overrides?: Partial<LastFmTrack>): LastFmTrack => ({
    streamable: { fulltrack: "0", "#text": "0" },
    duration: 214,
    url: `https://www.last.fm/music/${(overrides?.artist?.name ?? "Cher").replaceAll(" ", "-")}/_/${(overrides?.name ?? "Believe").replaceAll(" ", "-")}`,
    name: "Believe",
    "@attr": { rank: 1 },
    artist: {
        url: "https://www.last.fm/music/Cher",
        name: "Cher",
        mbid: "",
    },
    ...overrides,
})

export const makeLastFmAlbum = (overrides?: Partial<LastFmAlbum>): LastFmAlbum => ({
    id: "1",
    mbid: "",
    name: "Believe",
    artist: "Cher",
    url: `https://www.last.fm/music/${(overrides?.artist ?? "Cher").replaceAll(" ", "-")}/${(overrides?.name ?? "Believe").replaceAll(" ", "-")}`,
    releasedate: "1998-10-22",
    listeners: "1000000",
    playcount: "5000000",
    image: [makeLastFmImage()],
    tracks: { track: [makeLastFmTrack()] },
    tags: { tag: [{ url: "https://www.last.fm/tag/pop", name: "pop" }] },
    ...overrides,
})

export const makeLastFmAlbumInfos = (overrides?: Partial<LastFmAlbumInfos>): LastFmAlbumInfos => ({
    name: "Believe",
    artist: "Cher",
    url: `https://www.last.fm/music/${(overrides?.artist ?? "Cher").replaceAll(" ", "-")}/${(overrides?.name ?? "Believe").replaceAll(" ", "-")}`,
    image: [makeLastFmImage()],
    streamable: "0",
    mbid: "",
    ...overrides,
})

export const makeLastFmUser = (overrides?: Partial<LastFmUser>): LastFmUser => ({
    name: "jerome",
    age: "0",
    subscriber: "0",
    realname: "Jerome",
    bootstrap: "0",
    playcount: "12345",
    artist_count: "500",
    playlists: "0",
    track_count: "12345",
    album_count: "300",
    image: [makeLastFmImage()],
    registered: { unixtime: "1000000000", "#text": "2001-09-08 00:00" },
    country: "France",
    gender: "n",
    url: `https://www.last.fm/user/${(overrides?.name ?? "jerome").replaceAll(" ", "-")}`,
    type: "user",
    ...overrides,
})

export const makeLastFmSession = (overrides?: Partial<LastFmGetSessionResponse["session"]>): LastFmGetSessionResponse["session"] => ({
    name: "jerome",
    key: "abc123",
    subscriber: "0",
    ...overrides,
})
