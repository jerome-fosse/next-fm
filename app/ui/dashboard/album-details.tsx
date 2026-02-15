import {memo} from "react";
import {Album} from "@/app/types/albums";
import Image from "next/image";
import {DISCOGS, LASTFM} from "@/app/types/common";
import {logger} from "@/app/lib/logger";

type Props = {
    className?: string,
    album: Album
}

const AlbumDetails = memo(function showAlbumDetails({className, album}: Props) {
    logger.debug(album)

    function albumCover(album: Album): string {
        switch (album.origin) {
            case DISCOGS :
                return album.images
                    ?.filter(image => image.type === 'primary')
                    .at(0)?.uri ?? "/images/image-not-found.png";
            case LASTFM :
                return album.images
                    ?.filter(image => image.size === 'large')
                    .at(0)?.uri ?? "/images/image-not-found.png";
            default:
                return "/images/image-not-found.png"
        }
    }

    const url = albumCover(album);

    return (
        <div className={`flex flex-col space-y-2 ${className ?? ''}`}>
            <div className="flex space-x-4">
                <div className="relative flex-none w-52 h-52">
                    <Image className="rounded-lg" src={url} alt={album.title} fill={true}/>
                </div>
                <div className="flex flex-col">
                    <p className="text-md font-bold">{album.title}</p>
                    <p className="flex-1 text-sm">{album.artists.map(artist => artist.name).join(', ')}</p>
                    {album.year &&
                        <div className="flex text-sm">
                            <div className="w-20 font-italic">Année :</div>
                            <div>{album.year}</div>
                        </div>
                    }
                    {album.released &&
                        <div className="flex text-sm">
                            <div className="w-20 font-italic">Date de sortie :</div>
                            <div>{album.released}</div>
                        </div>
                    }
                    {album.genres &&
                        <div className="flex text-sm my-0.5">
                            <div className="w-20 font-italic">Genres :</div>
                            <div className='flex flex-wrap gap-1'>
                                {album.genres.map((value, index) => (
                                    <div key={index} className='badge badge-sm badge-neutral'>{value}</div>
                                ))}
                            </div>
                        </div>
                    }
                    {album.styles &&
                        <div className="flex text-sm my-0.5">
                            <div className="w-20 font-italic">Styles :</div>
                            <div className='flex flex-wrap gap-1'>
                                {album.styles.map((value, index) => (
                                    <div key={index} className='badge badge-sm badge-neutral'>{value}</div>
                                ))}
                            </div>
                        </div>
                    }
                    {album.tags &&
                        <div className="flex text-sm my-0.5">
                            <div className="w-20 font-italic">Tags :</div>
                            <div className='flex flex-wrap gap-1'>
                                {album.tags.map((value, index) => (
                                    <div key={index} className='badge badge-sm badge-neutral'>{value}</div>
                                ))}
                            </div>
                        </div>
                    }
                    <div className="flex-2"></div>
                </div>
            </div>
            {album.tracks && album.tracks.length > 0 && (
                <div className="h-full overflow-y-auto">
                    <table className="table table-pin-rows">
                        <thead>
                        <tr>
                            <th colSpan={3} className="px-1">Pistes</th>
                        </tr>
                        </thead>
                        <tbody>
                        {album.tracks.map((track, index) => (
                            <tr key={index}>
                                <td className="p-1.5">{index + 1}</td>
                                <td className="p-1.5">{track.title}</td>
                                <td className="p-1.5" align="right">{track.duration}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
})

export default AlbumDetails