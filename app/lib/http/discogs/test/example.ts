import {discogs} from "@/app/lib/http/discogs/test";

const discogsClient = discogs.createClientWithDefaultConfig();


discogsClient.search({query: "Vacuous in his blood", type: "master", per_page: 10})
    .then(response => {
        console.log(response.data);

        discogsClient.masterById(response.data.results[0].id)
            .then(response => console.log(response.data))
            .catch(error => console.error(error))
    })
    .catch(error => console.error(error))



