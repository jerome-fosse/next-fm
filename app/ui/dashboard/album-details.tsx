'use client'

import {memo, useState} from "react";
import {Album} from "@/app/types/albums";
import Image from "next/image";
import {DISCOGS, LASTFM} from "@/app/types/common";
import {displayTimeToSeconds, secondsToDisplayTime} from "@/app/lib/utils/duration";
import EditableText from "@/app/ui/common/editable-text";

type Props = {
    className?: string,
    album: Album
}

const AlbumDetails = memo(function ShowAlbumDetails({className, album}: Props) {
    const [durations, setDurations] = useState<number[]>(album.tracks.map(track => track.duration ?? 0));
    const totalDuration = durations.filter(value => !isNaN(value)).reduce((acc, curr) => acc + curr, 0);
    console.log(totalDuration)

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

    function updateDurationsState(value: string, index: number) {
        const newDurations = [...durations];
        newDurations[index] = displayTimeToSeconds(value);
        setDurations(newDurations);
    }

    const url = albumCover(album);

    return (
        <div className={`flex flex-col space-y-2 ${className ?? ''}`}>
            <div className="flex space-x-4">
                <div className="relative flex-none w-52 h-52">
                    <Image className="rounded-lg" src={url} alt={album.title} fill={true}/>
                </div>
                <div className="flex flex-col">
                    <EditableText name="title" type="textarea" className="text-md font-bold" defaultValue={album.title} iconClassName="h-4 w-4" />
                    <p className="flex-1 text-sm">{album.artists.map(artist => artist.name).join(', ')}</p>
                    {album.year &&
                        <div className="flex text-sm my-0.5">
                            <div className="w-20 font-italic">Année :</div>
                            <EditableText name="year" type="input" defaultValue={album.year} min={1900} iconClassName="h-4 w-4" />
                        </div>
                    }
                    {(totalDuration > 0 || album.duration) &&
                        <div className="flex text-sm my-0.5">
                            <div className="w-20 font-italic">Durée :</div>
                            <div>{secondsToDisplayTime(totalDuration > 0 ? totalDuration : (album.duration ?? 0))}</div>
                        </div>
                    }
                    {album.released &&
                        <div className="flex text-sm my-0.5">
                            <div className="w-20 font-italic">Sortie :</div>
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
                                <td className="p-1">{index + 1}</td>
                                <td className="p-1"><EditableText name="trackname" type="textarea" defaultValue={track.title} iconClassName="h-4 w-4" /></td>
                                <td className="p-1 w-px">
                                    <div className="flex justify-end">
                                        <EditableText name="duration" type="input" pattern="^[0-9]{2}:[0-9]{2}$"
                                                      onChange={value => updateDurationsState(value, index) }
                                                      defaultValue={track.duration ? secondsToDisplayTime(track.duration) : '00:00'} iconClassName="h-4 w-4" />
                                    </div>
                                </td>
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