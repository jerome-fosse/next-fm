import {Album, AlbumShort, Image} from "@/app/types/albums";

export function albumToAlbumShort(album: Album): AlbumShort {
    const images = album.images
        ?.toSorted((a, b) => a.type === 'primary' ? -1 : 1)
        .slice(0, 1)
        .map((image) => ({
            size: "large",
            ...image
        })) as Image[]
    ;

    return {
        id: album.id,
        title: album.title,
        year: album.year?.toString(),
        artist: album.artists[0],
        origin: album.origin,
        images: images ?? [],
    }
}