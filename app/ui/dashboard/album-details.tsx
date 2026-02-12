import {memo} from "react";
import {Album} from "@/app/types/albums";
import Image from "next/image";

type Props = {
    className?: string,
    album: Album
}

const AlbumDetails = memo(function showAlbumDetails({className, album}: Props) {
    console.log(album)
    const coverUrl = album.images
        ?.filter(image => image.type === 'primary')
        .at(0)?.uri ?? album.images?.at(0)?.uri ?? "/images/image-not-found.png"

    return (
        <div className={`flex flex-col space-y-2 ${className ?? ''}`}>
            <div className="flex space-x-4">
                <div className="relative flex-none w-52 h-52">
                    <Image className="rounded-lg" src={coverUrl} alt={album.title} fill={true}/>
                </div>
                <div className="flex flex-col">
                    <p className="text-md font-bold">{album.title}</p>
                    <p className="flex-1 text-sm">{album.artists.map(artist => artist.name).join(', ')}</p>
                    <div className="flex text-sm">
                        <div className="w-20 font-italic">Année :</div><div>{album.year}</div>
                    </div>
                    <div className="flex text-sm">
                        <div className="w-20 font-italic">Genres :</div><div>{album.genres.join(', ')}</div>
                    </div>
                    <div className="flex text-sm">
                        <div className="w-20 font-italic">Styles :</div><div>{album.styles.join(', ')}</div>
                    </div>
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