'use client'

import {Album, AlbumShort} from "@/app/types/albums";
import Image from "next/image";
import {SiDiscogs} from "react-icons/si";
import {ImLastfm2} from "react-icons/im";
import {useState, useTransition} from "react";
import {fetchAlbumAction, FetchAlbumResult} from "@/app/lib/actions/album";
import {DISCOGS, LASTFM} from "@/app/types/common";
import AlbumDialog from "@/app/ui/dashboard/album-dialog";
import AlertDialog from "@/app/ui/common/alert-dialog";

type Props = {
    album: AlbumShort,
    handleImageLoad?: () => void,
    showOriginButton?: boolean,
}

export default function AlbumThumbnail({album, showOriginButton = true, handleImageLoad}: Props) {

    const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [, startTransition] = useTransition();

    const handleShowAlbum = (album: AlbumShort) => {
        startTransition(async () => {
            let data: FetchAlbumResult;
            switch (album.origin) {
                case DISCOGS:
                    data = await fetchAlbumAction({id: album.id, origin: album.origin});
                    break;
                case LASTFM:
                    data = await fetchAlbumAction({
                        id: album.id,
                        title: album.title,
                        artist: album.artist.name,
                        origin: album.origin
                    });
                    break;
            }

            if (data.success) {
                setSelectedAlbum(data.album);
                setError(null);
            } else {
                setError(data.error);
                setSelectedAlbum(null);
            }
        })
    }

        const url = album.images
        ?.filter((img) => img.size === 'large' && img.uri !== '')
        .at(0)?.uri;

    const [imgSrc, setImgSrc] = useState(url);

    const handleImageError = () => {
        const fallback = album.images
            ?.filter((img) => img.size === 'extralarge' && img.uri !== '')
            .at(0)?.uri;

        setImgSrc(fallback);
    }

    const originButton = (album: AlbumShort) => {
        switch (album.origin) {
            case "Discogs": return <SiDiscogs className="w-4 h-4"/>
            case "Last.fm": return <ImLastfm2 className="w-4 h-4"/>
        }
    }

    return (
        <div className={`mx-1 my-2 p-2 h-fit border border-gray-300 rounded-md shadow-md cursor-pointer hover:shadow-lg hover:shadow-blue-500/50`}>
            <div className="relative w-40 aspect-square overflow-hidden group" onClick={() => handleShowAlbum(album)}>
                <Image src={imgSrc ?? '/images/image-not-found.png'} alt={`${album.artist.name} - ${album.title}`}
                       fill={true} sizes="160px" onLoad={handleImageLoad} unoptimized={true} onError={handleImageError} />
                {showOriginButton && album.origin && album.url &&
                    <a className="absolute btn btn-circle btn-neutral bottom-0 right-0 opacity-50 group-hover:opacity-100"
                       href={album.url} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}>
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
            {selectedAlbum &&
                <AlbumDialog album={selectedAlbum} onCloseAction={() => setSelectedAlbum(null)} />
            }
            {error &&
                <AlertDialog message={error} onCloseAction={() => setError(null)} />
            }
        </div>
    )
}