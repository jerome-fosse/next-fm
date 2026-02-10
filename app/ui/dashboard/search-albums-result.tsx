import AlbumThumbnail from "@/app/ui/dashboard/album-thumb";
import {Pagination} from "@/app/types/common";
import {AlbumShort} from "@/app/types/albums";
import PaginationControl from "@/app/ui/common/pagination";
import {logger} from "@/app/lib/logger";
import {memo} from "react";

export type Props = {
    className?: string,
    albums?: AlbumShort[],
    pagination?: Pagination,
    onChangePage: (page: number) => void
}

const SearchAlbumsResult = memo(function SearchAlbumsResult({onChangePage, className, albums, pagination}: Props) {
    logger.debug("SearchAlbumsResult Params:", "className=", className, "albums=", albums, "pagination=", pagination);

    if (!albums || albums.length === 0) {
        logger.debug("SearchAlbumsResult: No albums to display...");
        return null;
    }

    return (
        <div className={`flex flex-col ${className || ''}`}>
            <div className="flex items-center w-full h-12 px-4 text-sm bg-secondary-content border border-gray-300 rounded-t-md">
                <span>{pagination?.total ?? albums.length} résultat(s)</span>
                <span className="grow"></span>
                {pagination && <span>Page {pagination.page} sur {pagination.pages}</span>}
            </div>
            <div className={`flex flex-wrap w-full h-full border px-2 border-gray-300 ${pagination && pagination.pages > 1 ? '' : 'rounded-b-md'} overflow-y-auto`}>
                {albums.map(album =>
                    <div key={album.id}
                         className="mx-1 my-2 p-2 h-fit border border-gray-300 rounded-md shadow-md cursor-pointer hover:shadow-lg hover:shadow-blue-500/50">
                        <AlbumThumbnail album={album} />
                    </div>
                )}
            </div>
            {pagination && pagination.pages > 1 && <div className="flex justify-center items-center w-full h-16 px-4 text-sm bg-secondary-content border border-gray-300 rounded-b-md">
                <PaginationControl page={pagination.page} pages={pagination.pages} onChangePage={onChangePage} />
            </div>}
        </div>
    )
});

export default SearchAlbumsResult;