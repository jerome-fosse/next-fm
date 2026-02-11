import {lastfm} from "@/app/lib/http/lastfm/test/";

const client = lastfm.createClientWithDefaultConfig();

client.search({album: "vacuous in his blood", limit: 10, page: 1})
    .then(response => {
        console.log(response.data)

        client.getAlbumInfo({mbid: response.data.results.albummatches.album[0].mbid})
            .then(response => console.log(response.data))
            .catch(error => console.error(error))
    })
    .catch(error => console.error(error))