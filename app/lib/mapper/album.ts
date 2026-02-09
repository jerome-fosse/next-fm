import {DiscogsSearchResultItem} from "@/app/lib/http/discogs";
import {AlbumShort} from "@/app/types/albums";

export function discogsSearchResultItemToAlbumShort(item: DiscogsSearchResultItem): AlbumShort {
    return {
        id: item.id.toString(10),
        title: item.title,
        year: item.year,
        images: [
            {size: "small", uri: item.thumb},
            {size: "large", uri: item.cover_image},
        ]
    }
}