import AlbumThumbnail from "@/app/ui/dashboard/album-thumb";
import {DISCOGS, LASTFM, Pagination} from "@/app/types/common";
import {Album, AlbumShort} from "@/app/types/albums";
import PaginationControl from "@/app/ui/common/pagination";
import {logger} from "@/app/lib/utils/logger";
import {memo, useRef, useState, useTransition} from "react";
import AlbumDetails from "@/app/ui/dashboard/album-details";
import {fetchAlbumAction} from "@/app/lib/actions/album";
import AlertDialog from "@/app/ui/common/alert-dialog";
import {SlOptions} from "react-icons/sl";
import {match, P} from "ts-pattern";

export type Props = {
    className?: string,
    albums?: AlbumShort[],
    pagination?: Pagination,
    pending?: boolean,
    onChangePage: (page: number) => void
}

const SearchAlbumsResult = memo(function SearchAlbumsResult({
                                                                onChangePage,
                                                                className,
                                                                albums,
                                                                pending,
                                                                pagination
                                                            }: Props) {

    logger.debug("SearchAlbumsResult Params:", "className=", className, "albums=", albums, "pagination=", pagination);

    const albumModal = useRef<HTMLDialogElement>(null);
    const errorModal = useRef<HTMLDialogElement>(null);
    const [isPending, startTransition] = useTransition();
    const [album, setAlbum] = useState<Album | undefined>();
    const [error, setError] = useState<string | undefined>();

    const [showOptions, setShowOptions] = useState<boolean>(false);

    function toggleOptions() {
        setShowOptions(!showOptions);
    }

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
    const imagesLoaded = useRef(0)
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

    return (
        <div className={`flex flex-col ${className || ''}`}>
            <div
                className="flex items-center h-12 px-4 text-sm bg-secondary-content border border-gray-300 rounded-t-md">
                <span>{pagination?.total ?? albums.length} résultat(s)</span>
                <span className="grow"></span>
                {pagination && <span>Page {pagination.page} sur {pagination.pages}</span>}
            </div>
            <div className={`flex flex-wrap content-start w-full h-full border px-2 ${pending || !allImagesLoaded ? 'invisible' : 'visible'} border-gray-300 ${pagination && pagination.pages > 1 ? '' : 'rounded-b-md'} overflow-y-auto`}>
                    {albums.map((album, index) =>
                        <div key={index}
                             className={`mx-1 my-2 p-2 h-fit border border-gray-300 rounded-md shadow-md cursor-pointer hover:shadow-lg hover:shadow-blue-500/50`}>
                            <AlbumThumbnail key={`${album.origin}_${album.artist}_${album.title}_${album.id}`}
                                            album={album} handleImageLoad={handleImageLoad}
                                            showDetailAction={() => handleShowAlbum(album)} />
                        </div>
                    )}
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
                    {album && <AlbumDetails className="flex min-h-0 my-4 p-1 border border-gray-300 shadow-md rounded-md" album={album} />}
                    <div className="flex justify-end space-x-2">
                        <div className="relative">
                            <div
                                className={`absolute z-10 bg-base-200 bottom-0 right-full mx-2 h-44 border border-gray-300 rounded-md shadow-md ${showOptions ? 'block' : 'hidden'}`}>
                                <label className="label text-sm">
                                    <input type="checkbox" className="toggle" />
                                    Editer les informations
                                </label>
                            </div>
                            <button className="btn btn-square btn-ghost" onClick={toggleOptions}>
                                <SlOptions className="h-5 w-5" />
                            </button>
                        </div>
                        <button className="btn btn-secondary">Scrobbler Album</button>
                    </div>
                </div>
            </dialog>

            <AlertDialog ref={errorModal} message={error ?? ''} />

        </div>
)
});

export default SearchAlbumsResult;