import {ArtistTopEntry} from "@/app/types/stats";
import Image from "next/image";

export type Props = {
    topEntry: ArtistTopEntry
}

export default function ArtistAvatar({topEntry}: Props) {
    return (
        <div className="flex flex-col">
            <div className="avatar">
                <div className="w-24">
                    <Image src={topEntry.image} alt={topEntry.artist.name} fill={true} className="rounded-full" />
                </div>
            </div>
            <div className="text-center">
                <span className="text-xs font-bold max-h-4 overflow-hidden">{topEntry.artist.name}</span>
            </div>
        </div>
    )
}