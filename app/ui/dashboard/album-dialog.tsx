'use client'

import {scrobbleAction} from "@/app/lib/actions/scrobble";
import AlbumDetails from "@/app/ui/dashboard/album-details";
import DropDownButton from "@/app/ui/common/dropdown-button";
import {useActionState, useEffect, useRef} from "react";
import {Album} from "@/app/types/albums";
import {SiDiscogs} from "react-icons/si";
import {PiPlaylist} from "react-icons/pi";

type Props = {
    album: Album;
    onCloseAction: () => void;
};

const menuItems = [
    {textMenuItem: 'album', textButton: 'Scrobbler l\'album', icon: SiDiscogs, default: true},
    {textMenuItem: 'pistes', textButton: 'Scrobbler les pistes', icon: PiPlaylist},
]

export default function AlbumDialog({ album, onCloseAction }: Props) {
    const [scrobbleState, scrobbleStateAction] = useActionState(scrobbleAction, { error: false });
    const ref = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        ref.current?.showModal();
    }, []);

    return (
        <dialog ref={ref} onClose={onCloseAction} className="modal">
            <div className="modal-box max-w-2xl max-h-5/6 flex flex-col">
                <form method="dialog">
                    <button className="btn btn-sm btn-circle btn-ghost border-none absolute right-2 top-2">X</button>
                </form>
                <form action={scrobbleStateAction} className="flex flex-col min-h-0">
                    <AlbumDetails key={`${album.origin}_${album.id}`} className="flex min-h-0 my-4 p-1 border border-gray-300 shadow-md rounded-md" album={album} />
                    <div className="flex justify-end space-x-2">
                        <DropDownButton name="scrobbling" type="submit" vMenuPosition="top" items={menuItems} />
                    </div>
                </form>
            </div>
        </dialog>
    )
}