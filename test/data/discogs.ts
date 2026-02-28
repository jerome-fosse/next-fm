import {makeDiscogsArtist, makeDiscogsMaster, makeDiscogsRelease} from "@test/factories/discogs"

export const Artists = {
    MilesDavis: makeDiscogsArtist({id: 1, name: "Miles Davis"}),
    BlackSabbath: makeDiscogsArtist({id: 2, name: "Black Sabbath"}),
    Metallica: makeDiscogsArtist({id: 3, name: "Metallica"}),
}

export const Masters = {
    KindOfBlue: makeDiscogsMaster({
        id: 1001,
        title: "Kind of Blue",
        year: 1959,
        genres: ["Jazz"],
        artists: [Artists.MilesDavis]
    }),
    BlackSabbath: makeDiscogsMaster({
        id: 1002,
        title: "Black Sabbath",
        year: 1970,
        genres: ["Rock"],
        styles: ["Blues Rock", "hard Rock", "Heav Metal"],
        tracklist: [
            {position: "A1", type_: "track", title: "Black Sabbath", duration: "6:22", extraartists: []},
            {position: "A2", type_: "track", title: "The Wizard", duration: "4:25", extraartists: []},
            {position: "A3", type_: "track", title: "Behind The Wall Of Sleep", duration: "3:37", extraartists: []},
            {position: "A4", type_: "track", title: "N.I.B.", duration: "6:07", extraartists: []},
            {position: "B1", type_: "track", title: "Evil Woman, Don't Play Your Games With Me", duration: "3:27", extraartists: []},
            {position: "B2", type_: "track", title: "Sleeping Village", duration: "3:46", extraartists: []},
            {position: "B3", type_: "track", title: "Warning", duration: "10:33", extraartists: []},
        ],
        images: [
            {
                type: "primary",
                uri: "https://i.discogs.com/1234567890.jpg",
                resource_url: "https://api.discogs.com/images/1234567890",
                uri150: "https://i.discogs.com/1234567890-150.jpg",
                height: 150,
                width: 150
            }
        ],
        artists: [Artists.BlackSabbath]
    }),
    MasterOfPuppets: makeDiscogsMaster({
        id: 1003,
        title: "Master of Puppets",
        year: 1986,
        genres: ["Metal"],
        artists: [Artists.Metallica]
    }),
}

export const Releases = {
    KindOfBlue: makeDiscogsRelease({
        id: 2001,
        title: "Kind of Blue",
        year: 1959,
        genres: ["Jazz"],
        master_id: Masters.KindOfBlue.id,
        artists: [Artists.MilesDavis]
    }),
    BlackSabbath: makeDiscogsRelease({
        id: 2002,
        title: "Black Sabbath",
        year: 1970,
        genres: ["Rock"],
        master_id: Masters.BlackSabbath.id,
        artists: [Artists.BlackSabbath]
    }),
    MasterOfPuppets: makeDiscogsRelease({
        id: 2003,
        title: "Master of Puppets",
        year: 1986,
        genres: ["Metal"],
        master_id: Masters.MasterOfPuppets.id,
        artists: [Artists.Metallica]
    }),
}
