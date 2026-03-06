import {makeLastFmAlbum, makeLastFmAlbumInfos, makeLastFmSession, makeLastFmUser} from "@test/factories/lastfm"

export const Albums = {
    Believe: makeLastFmAlbum({id: "1", name: "Believe", artist: "Cher", url: "https://www.last.fm/music/Cher/Believe"}),
    BlackSabbath: makeLastFmAlbum({
        id: "2",
        name: "Black Sabbath",
        artist: "Black Sabbath",
        url: "https://www.last.fm/music/Black-Sabbath/Black-Sabbath"
    }),
    MasterOfPuppets: makeLastFmAlbum({
        id: "3",
        name: "Master of Puppets",
        artist: "Metallica",
        url: "https://www.last.fm/music/Metallica/Master-of-Puppets"
    }),
}

export const AlbumInfos = {
    Believe: makeLastFmAlbumInfos({name: "Believe", artist: "Cher"}),
    BlackSabbath: makeLastFmAlbumInfos({name: "Black Sabbath", artist: "Black Sabbath"}),
    MasterOfPuppets: makeLastFmAlbumInfos({name: "Master of Puppets", artist: "Metallica"}),
}

export const Users = {
    Jerome: makeLastFmUser({name: "jerome", realname: "Jerome", playcount: "12345"}),
}

export const Sessions = {
    Jerome: makeLastFmSession({name: "jerome", key: "abc123"}),
}

export const Scrobbles = {
    BlackSabbath: [
        {artist: "Black Sabbath", track: "Black Sabbath", timestamp: 1773244684, duration: 382},
        {artist: "Black Sabbath", track: "The Wizard", timestamp: 1773245066, duration: 265},
        {artist: "Black Sabbath", track: "Behind The Wall Of Sleep", timestamp: 1773245331, duration: 217},
        {artist: "Black Sabbath", track: "N.I.B.", timestamp: 1773245548, duration: 367},
        {artist: "Black Sabbath", track: "Evil Woman, Don't Play Your Games With Me", timestamp: 1773245915, duration: 207},
        {artist: "Black Sabbath", track: "Sleeping Village", timestamp: 1773246122, duration: 226},
        {artist: "Black Sabbath", track: "Warning", timestamp: 1773246348, duration: 633},
    ],
    WarAndPain: [
        {artist: "Voïvod", track: "Iron Side", timestamp: 1773324549.41, album: "War And Pain", albumArtist: "Voïvod", duration: 0},
        {artist: "Voïvod", track: "Voïvod", timestamp: 1773324549.41, album: "War And Pain", albumArtist: "Voïvod", duration: 254},
        {artist: "Voïvod", track: "Warriors Of Ice", timestamp: 1773324805.41, album: "War And Pain", albumArtist: "Voïvod", duration: 304},
        {artist: "Voïvod", track: "Suck Your Bone", timestamp: 1773325109.41, album: "War And Pain", albumArtist: "Voïvod", duration: 210},
        {artist: "Voïvod", track: "Iron Gang", timestamp: 1773325319.41, album: "War And Pain", albumArtist: "Voïvod", duration: 255},
        {artist: "Voïvod", track: "War And Pain", timestamp: 1773325574.41, album: "War And Pain", albumArtist: "Voïvod", duration: 295},
        {artist: "Voïvod", track: "Blower Side", timestamp: 1773325869.41, album: "War And Pain", albumArtist: "Voïvod", duration: 0},
        {artist: "Voïvod", track: "Blower", timestamp: 1773325869.41, album: "War And Pain", albumArtist: "Voïvod", duration: 162},
        {artist: "Voïvod", track: "Live For Violence", timestamp: 1773326031.41, album: "War And Pain", albumArtist: "Voïvod", duration: 311},
        {artist: "Voïvod", track: "Black City", timestamp: 1773326342.41, album: "War And Pain", albumArtist: "Voïvod", duration: 308},
        {artist: "Voïvod", track: "Nuclear War", timestamp: 1773326650.41, album: "War And Pain", albumArtist: "Voïvod", duration: 421},
    ]
}