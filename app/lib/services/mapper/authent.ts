import {User} from "@/app/types/authent";
import {LastFmUser} from "@/app/lib/data/http/lastfm";

export function lastFmUserToUser(lastFmUser: LastFmUser): User {
    return {
        name: lastFmUser.name,
        age: lastFmUser.age,
        country: lastFmUser.country,
        stats: {
            play: parseInt(lastFmUser.playcount, 10),
            artists: parseInt(lastFmUser.artist_count, 10),
            albums: parseInt(lastFmUser.album_count, 10),
            tracks: parseInt(lastFmUser.track_count, 10),
            playlist: parseInt(lastFmUser.playlists, 10),
        },
        url: lastFmUser.url,
        images: lastFmUser.image
            .filter(image => image["#text"] !== "")
            .map(image => ({size: image.size, url: image["#text"]})) as User['images']
    }
}