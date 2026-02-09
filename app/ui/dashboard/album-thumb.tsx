import {AlbumShort} from "@/app/types/albums";
import Image from "next/image";

type Props = {
    album: AlbumShort,
}

export default function AlbumThumbnail({album}: Props) {

    const thumburl = album.images
            ?.find((img) => img.size === 'small')?.uri
        ?? '/images/image-not-found.png';

    const [artist, title] = album.title.split(' - ');

    return (
        <>
            <div className="w-40 aspect-square relative">
                <Image src={thumburl} alt={album.title} fill={true}/>
            </div>
            <div className="mt-1 w-40 h-12">
                <div className="max-h-8 overflow-hidden">
                    <p className="text-xs font-bold">{title}</p>
                </div>
                <p className="text-xs">{artist}</p>
            </div>
        </>
    )
}