import {AlbumShort} from "@/app/types/albums";
import Image from "next/image";
import {SiDiscogs} from "react-icons/si";
import {ImLastfm2} from "react-icons/im";

type Props = {
    album: AlbumShort,
    handleImageLoad: () => void,
    showOriginButton?: boolean,
    showDetailAction?: () => void,
}

export default function AlbumThumbnail({album, showOriginButton = true, showDetailAction, handleImageLoad}: Props) {

    const thumburl = (album.images
            ?.find((img) => img.size === 'large')?.uri || undefined)
        ?? '/images/image-not-found.png';

    const originButton = (album: AlbumShort) => {
        switch (album.origin) {
            case "Discogs": return <SiDiscogs className="w-4 h-4"/>
            case "Last.fm": return <ImLastfm2 className="w-4 h-4"/>
        }
    }
    
    return (
        <>
            <div className="relative w-40 aspect-square overflow-hidden group" onClick={showDetailAction ? showDetailAction : undefined}>
                <Image src={thumburl} alt={`${album.artist.name} - ${album.title}`}
                       fill={true} sizes="160px" onLoad={handleImageLoad} unoptimized={true} />
                {showOriginButton && album.origin && album.url &&
                    <a className="absolute btn btn-circle btn-neutral bottom-0 right-0 opacity-50 group-hover:opacity-100"
                       href={album.url} target="_blank" rel="noopener noreferrer">
                        {originButton(album)}
                    </a>
                }
            </div>
            <div className="mt-1 w-40 h-12">
                <div className="max-h-8 overflow-hidden">
                    <p className="text-xs font-bold">{album.title}</p>
                </div>
                <p className="text-xs max-h-4 overflow-hidden">{album.artist.name}</p>
            </div>
        </>
    )
}