'use client'

import {memo, useState} from "react";
import {Album} from "@/app/types/albums";
import Image from "next/image";
import {Origin} from "@/app/types/common";
import {displayTimeToSeconds, secondsToDisplayTime} from "@/app/lib/utils/duration";
import EditableText from "@/app/ui/common/editable-text";
import {logger} from "@/app/lib/utils/logger";

type Props = {
    className?: string,
    album: Album
}

const AlbumDetails = memo(function ShowAlbumDetails({className, album}: Props) {
    const initialDurations = album.tracks  ? album.tracks.map(track => track.duration ?? 0) : []
    const [durations, setDurations] = useState<number[]>(initialDurations);
    const totalDuration = durations.filter(value => !isNaN(value)).reduce((acc, curr) => acc + curr, 0);

    logger.debug(album)

    function updateDurationsState(value: string, index: number) {
        const newDurations = [...durations];
        newDurations[index] = displayTimeToSeconds(value);
        setDurations(newDurations);
    }

    const url = album.origin === Origin.Discogs ?
        album.images?.filter(image => image.type === 'primary').at(0)?.uri ?? album.images?.at(0)?.uri ?? "/images/image-not-found.png" :
        album.images?.filter(image => image.size === 'large').at(0)?.uri ?? "/images/image-not-found.png";

    return (
        <div className={`flex flex-col space-y-2 ${className ?? ''}`}>
            <div className="flex space-x-4">
                <div className="relative flex-none w-52 h-52">
                    <Image className="rounded-lg" src={url} alt={album.title} fill={true}/>
                </div>
                <div className="flex flex-col">
                    <EditableText name="title" type="textarea" className="text-md font-bold" defaultValue={album.title} iconClassName="h-4 w-4" />
                    <EditableText name="artists" type="textarea" className="text-sm" defaultValue={album.artists.map(artist => artist.name).join(', ')} iconClassName="h-4 w-4" />
                    {album.year &&
                        <div className="flex text-sm my-0.5">
                            <div className="w-20 font-italic">Année :</div>
                            <div>{album.year}</div>
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
                                <td className="p-1">
                                    <div className="flex flex-wrap space-x-2 items-baseline">
                                        <textarea className="outline-none input-ghost cursor-default pointer-events-none resize-none field-sizing-content" name="trackName" defaultValue={track.title} readOnly={true} />
                                        {track.artists && track.artists.length > 0 &&
                                           <input className="outline-none input-ghost cursor-default pointer-events-none text-[8px]" name="trackArtist" type="text" defaultValue={track.artists?.map(artist => artist.name).join(', ')} readOnly={true} />
                                        }
                                    </div>
                                </td>
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