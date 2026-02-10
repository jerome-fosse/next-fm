import AlbumThumbnail from "@/app/ui/dashboard/album-thumb";
import {Pagination} from "@/app/types/common";
import {AlbumShort} from "@/app/types/albums";

export type Props = {
    className?: string,
    albums?: AlbumShort[],
    pagination?: Pagination,
}

export default function SearchAlbumsResult({className, albums, pagination}: Props) {
    if (!albums || albums.length === 0)
        return null;

    return (
        <div className={`flex flex-col ${className || ''}`}>
            <div className="flex w-full navbar bg-secondary-content border border-gray-300 rounded-t-md">
                {pagination && <p>Page {pagination.page} sur {pagination.total}</p>}
            </div>
            <div className="flex flex-wrap w-full min-h-0 border border-gray-300 rounded-b-md shadow-md overflow-y-auto">
                {albums.map(album =>
                    <div key={album.id} className="m-2 p-2 border border-gray-300 rounded-md shadow-md cursor-pointer hover:shadow-lg hover:shadow-blue-500/50">
                        <AlbumThumbnail album={album} />
                    </div>
                )}
            </div>
        </div>
    )
}