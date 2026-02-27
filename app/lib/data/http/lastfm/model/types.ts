export type LastFmErrorResponse = {
    error: number,
    message: string,
}

export type SearchParams = {
    // The album name
    album: string,
    // A Last.fm API key.
    //api_key: string,
    // The number of results to fetch per page. Defaults to 30.
    limit?: number,
    // The page number to fetch. Defaults to first page.
    page?: number,
}

export type AlbumInfoParams = {
    // The artist name. Required unless using mbid.
    artist?: string,
    // The album name. Required unless using mbid.
    album?: string,
    // The musicbrainz album id. Required unless using artist and album.
    mbid?: string,
    // Transform misspelled artist names into correct artist names, returning the correct version instead. The corrected artist name will be returned in the response.
    autocorrect?: 0 | 1,
    // The username for the context of the request. If supplied, the user's playcount for this album is included in the response.
    username?: string,
    // The language to return the biography in, expressed as an ISO 639 alpha-2 code.
    lang?: string,
}

export type LastFmAlbumSearchResponse = {
    results: {
        "opensearch:Query": {
            "#text": string
            role: "request" | string
            searchTerms: string
            startPage: string
        }
        "opensearch:totalResults": string
        "opensearch:startIndex": string
        "opensearch:itemsPerPage": string
        albummatches: {
            album: LastFmAlbumInfos[]
        }
        "@attr": {
            for: string
        }
    }
}

export type LastFmGetAlbumInfoResponse = {
    album: LastFmAlbum
}

export type LastFmAlbum = {
    id: string,
    mbid: string,
    name: string,
    artist: string,
    url: string,
    releasedate: string,
    listeners: string,
    playcount: string,
    image: LastFmImage[],
    tracks: {
        track: LastFmTrack[],
    },
    tags: {
        tag: {
            url: string,
            name: string,
        }[],
    },
}

export type LastFmTrack = {
    streamable: {
        fulltrack: string
        "#text": string
    }
    duration: number | null
    url: string
    name: string
    "@attr": {
        rank: number
    }
    artist: {
        url: string
        name: string
        mbid: string
    }
}

export type LastFmAlbumInfos = {
    name: string
    artist: string
    url: string
    image: LastFmImage[]
    streamable: string
    mbid: string
}

export type LastFmImage = {
    "#text": string
    size: "small" | "medium" | "large" | "extralarge" | "mega" | ""
}

export type LastFmGetSessionResponse = {
    session: {
        name: string,
        key: string,
        subscriber: string
    }
}

export type LastFmUserGetInfoResponse = {
    user: LastFmUser
}

export type LastFmUser = {
    name: string,
    age: string,
    subscriber: string,
    realname: string,
    bootstrap: string,
    playcount: string,
    artist_count: string,
    playlists: string,
    track_count: string,
    album_count: string,
    image: LastFmImage[],
    registered: {
        unixtime: string,
        "#text": string,
    },
    country: string,
    gender: string,
    url: string,
    type: string,
}

