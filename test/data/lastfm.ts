import { makeLastFmAlbum, makeLastFmAlbumInfos, makeLastFmSession, makeLastFmUser } from "@test/factories/lastfm"

export const Albums = {
    Believe:         makeLastFmAlbum({ id: "1", name: "Believe",         artist: "Cher",         url: "https://www.last.fm/music/Cher/Believe"                     }),
    BlackSabbath:    makeLastFmAlbum({ id: "2", name: "Black Sabbath",   artist: "Black Sabbath", url: "https://www.last.fm/music/Black-Sabbath/Black-Sabbath"      }),
    MasterOfPuppets: makeLastFmAlbum({ id: "3", name: "Master of Puppets", artist: "Metallica",  url: "https://www.last.fm/music/Metallica/Master-of-Puppets"      }),
}

export const AlbumInfos = {
    Believe:         makeLastFmAlbumInfos({ name: "Believe",           artist: "Cher"         }),
    BlackSabbath:    makeLastFmAlbumInfos({ name: "Black Sabbath",     artist: "Black Sabbath" }),
    MasterOfPuppets: makeLastFmAlbumInfos({ name: "Master of Puppets", artist: "Metallica"    }),
}

export const Users = {
    Jerome: makeLastFmUser({ name: "jerome", realname: "Jerome", playcount: "12345" }),
}

export const Sessions = {
    Jerome: makeLastFmSession({ name: "jerome", key: "abc123" }),
}
