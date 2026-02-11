import {AlbumShort} from "@/app/types/albums";
import Image from "next/image";

type Props = {
    album: AlbumShort,
}

export default function AlbumThumbnail({album}: Props) {

    const thumburl = (album.images
            ?.find((img) => img.size === 'large')?.uri || undefined)
        ?? '/images/image-not-found.png';

    return (
        <>
            <div className="w-40 aspect-square relative overflow-hidden">
                <Image src={thumburl} alt={`${album.artist.name} - ${album.title}`} fill={true} sizes="160px"/>
            </div>
            <div className="mt-1 w-40 h-12">
                <div className="max-h-8 overflow-hidden">
                    <p className="text-xs font-bold">{album.title}</p>
                </div>
                <p className="text-xs">{album.artist.name}</p>
            </div>
        </>
    )
}