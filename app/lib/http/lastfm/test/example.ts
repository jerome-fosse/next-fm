import {lastfm} from "@/app/lib/http/lastfm/test/";

const config = lastfm.defaultConfig()
const client = lastfm.createClient(config)

client.search({album: "vacuous in his blood", limit: 10, page: 1})
    .then(response => {
        console.log(response.data.results.albummatches.album[0])

        client.getAlbumInfo({mbid: response.data.results.albummatches.album[0].mbid})
            .then(response => console.log(response.data))
            .catch(error => console.error(error))
    })
    .catch(error => console.error(error))