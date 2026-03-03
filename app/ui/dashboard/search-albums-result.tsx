import AlbumThumbnail from "@/app/ui/dashboard/album-thumb";
import {DISCOGS, LASTFM, Pagination} from "@/app/types/common";
import {Album, AlbumShort} from "@/app/types/albums";
import PaginationControl from "@/app/ui/common/pagination";
import {logger} from "@/app/lib/utils/logger";
import {useRef, useState, useTransition} from "react";
import AlbumDetails from "@/app/ui/dashboard/album-details";
import {fetchAlbumAction} from "@/app/lib/actions/album";
import AlertDialog from "@/app/ui/common/alert-dialog";
import {match, P} from "ts-pattern";
import DropDownButton from "@/app/ui/common/dropdown-button";
import {SiDiscogs} from "react-icons/si";
import {PiPlaylist} from "react-icons/pi";
import {scrobbleAction} from "@/app/lib/actions/scrobble";

export type Props = {
    className?: string,
    albums?: AlbumShort[],
    pagination?: Pagination,
    pending?: boolean,
    onChangePage: (page: number) => void
}

export default function SearchAlbumsResult({onChangePage, className, albums, pending, pagination}: Props) {

    logger.debug("SearchAlbumsResult Params:", "className=", className, "albums=", albums, "pagination=", pagination);

    const albumModal = useRef<HTMLDialogElement>(null);
    const errorModal = useRef<HTMLDialogElement>(null);
    const [isPending, startTransition] = useTransition();
    const [album, setAlbum] = useState<Album | undefined>();
    const [error, setError] = useState<string | undefined>();

    const handleShowAlbum = (album: AlbumShort) => {
        startTransition(async () => {
            const showError = (error: string) => {
                setError(error);
                setAlbum(undefined);
                errorModal.current?.showModal();
            }

            const showAlbum = (album: Album) => {
                setAlbum(album);
                setError(undefined);
                albumModal.current?.showModal();
            }

            const data = await match(album.origin)
                .with(DISCOGS, () => fetchAlbumAction({id: album.id, origin: album.origin}))
                .with(LASTFM, () => fetchAlbumAction({id: album.id, title: album.title, artist: album.artist.name, origin: album.origin}))
                .exhaustive();

            match(data)
                .with({error: P.string}, (result) => showError(result.error))
                .with({error: P.optional(undefined)}, (result) => showAlbum(result.album))
                .exhaustive();
        })
    }

    const [allImagesLoaded, setAllImagesLoaded] = useState(false);
    const imagesLoaded = useRef(0);

    const handleImageLoad = () => {
        imagesLoaded.current++;

        if (imagesLoaded.current === albums?.length ) {
            setAllImagesLoaded(true);
            imagesLoaded.current = 0;
        }
    }

    if (!albums) {
        logger.debug("SearchAlbumsResult: No albums to display...");
        return null;
    }

    const menuItems = [
        {textMenuItem: 'album', textButton: 'Scrobbler l\'album', icon: SiDiscogs, default: true},
        {textMenuItem: 'pistes', textButton: 'Scrobbler les pistes', icon: PiPlaylist},
    ]

    return (
        <div className={`flex flex-col ${className || ''}`}>
            <div
                className="flex items-center h-12 px-4 text-sm bg-secondary-content border border-gray-300 rounded-t-md">
                <span>{pagination?.total ?? albums.length} résultat(s)</span>
                <span className="grow"></span>
                {pagination && <span>Page {pagination.page} sur {pagination.pages}</span>}
            </div>
            <div className={`flex relative w-full h-full border px-2 border-gray-300 ${pagination && pagination.pages > 1 ? '' : 'rounded-b-md'} overflow-y-auto`}>
                <div className={`flex flex-wrap content-start ${pending || !allImagesLoaded ? 'invisible' : 'visible'}`}>
                    {albums.map((album, index) =>
                        <div key={index}
                             className={`mx-1 my-2 p-2 h-fit border border-gray-300 rounded-md shadow-md cursor-pointer hover:shadow-lg hover:shadow-blue-500/50`}>
                            <AlbumThumbnail key={`${album.origin}_${album.artist}_${album.title}_${album.id}`}
                                            album={album} handleImageLoad={handleImageLoad}
                                            showDetailAction={() => handleShowAlbum(album)} />
                        </div>
                    )}
                </div>
                {pending || !allImagesLoaded &&
                    <div className="absolute inset-0 flex items-center justify-center z-10 bg-base-100/50">
                        <span className="loading loading-spinner loading-lg" />
                    </div>
                }
            </div>
            {pagination && pagination.pages > 1 &&
                <div className={`flex justify-center items-center w-full h-16 px-4 ${pending ? 'btn-disabled' : ''} text-sm bg-secondary-content border border-gray-300 rounded-b-md`}>
                    <PaginationControl page={pagination.page} pages={pagination.pages} onChangePage={onChangePage} />
                </div>
            }

            <dialog ref={albumModal} className="modal">
                <div className="modal-box max-w-2xl max-h-5/6 flex flex-col">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost border-none absolute right-2 top-2">X</button>
                    </form>
                    <form action={scrobbleAction} className="flex flex-col min-h-0">
                        {album && <AlbumDetails key={`${album.origin}_${album.id}`} className="flex min-h-0 my-4 p-1 border border-gray-300 shadow-md rounded-md" album={album} />}
                        <div className="flex justify-end space-x-2">
                            <DropDownButton name="scrobbling" type="submit" vMenuPosition="top" items={menuItems} />
                        </div>
                    </form>
                </div>
            </dialog>

            <AlertDialog ref={errorModal} message={error ?? ''} />
        </div>
    )
}