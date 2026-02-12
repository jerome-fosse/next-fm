import AlbumThumbnail from "@/app/ui/dashboard/album-thumb";
import {Pagination} from "@/app/types/common";
import {Album, AlbumShort} from "@/app/types/albums";
import PaginationControl from "@/app/ui/common/pagination";
import {logger} from "@/app/lib/logger";
import {memo, useRef, useState, useTransition} from "react";
import {getDiscogsMasterReleaseById} from "@/app/lib/data/discogs";
import AlbumDetails from "@/app/ui/dashboard/album-details";

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

    const modalRef = useRef<HTMLDialogElement>(null);
    const [isPending, startTransition] = useTransition();
    const [album, setAlbum] = useState<Album | undefined>();
    const handleShowAlbum = (id: string) => {
        startTransition(async () => {
            const data = await getDiscogsMasterReleaseById(parseInt(id, 10));
            setAlbum(data);
            modalRef.current?.showModal()
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
                            <AlbumThumbnail album={album} handleImageLoad={handleImageLoad}
                                            showDetailAction={() => handleShowAlbum(album.id)} />
                        </div>
                    )}
            </div>
            {pagination && pagination.pages > 1 &&
                <div className={`flex justify-center items-center w-full h-16 px-4 ${pending ? 'btn-disabled' : ''} text-sm bg-secondary-content border border-gray-300 rounded-b-md`}>
                <PaginationControl page={pagination.page} pages={pagination.pages} onChangePage={onChangePage} />
            </div>}
            <dialog ref={modalRef} className="modal">
                <div className="modal-box max-w-2xl max-h-4/6 flex flex-col">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost border-none absolute right-2 top-2">X</button>
                    </form>
                    {album && <AlbumDetails className="flex min-h-0 my-4 p-1 border border-gray-300 shadow-md rounded-md" album={album} />}
                    <div className="flex justify-end mt-auto">
                        <button className="btn btn-secondary">Scrobbler</button>
                    </div>
                </div>
            </dialog>
        </div>
    )
});

export default SearchAlbumsResult;