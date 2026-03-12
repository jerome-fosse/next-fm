'use client'

import AlbumThumbnail from "@/app/ui/dashboard/album-thumb";
import {DISCOGS, LASTFM, Pagination} from "@/app/types/common";
import {Album, AlbumShort} from "@/app/types/albums";
import PaginationControl from "@/app/ui/common/pagination";
import {useRef, useState, useTransition} from "react";
import {useRouter} from "next/navigation";
import {fetchAlbumAction, FetchAlbumResult} from "@/app/lib/actions/album";
import AlertDialog from "@/app/ui/common/alert-dialog";
import AlbumDialog from "@/app/ui/dashboard/album-dialog";

export type Props = {
    className?: string,
    albums: AlbumShort[],
    pagination?: Pagination,
    query: string,
    searchApi: string,
}

export default function SearchAlbumsResult({className, albums, pagination, query, searchApi}: Props) {
    const router = useRouter();
    const [isPaginating, startPaginationTransition] = useTransition();
    const [, startTransition] = useTransition();
    const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [allImagesLoaded, setAllImagesLoaded] = useState(false);
    const imagesLoaded = useRef(0);

    const changePage = (page: number) => {
        startPaginationTransition(() => {
            const params = new URLSearchParams();
            if (query) params.set('query', query);
            if (searchApi) params.set('searchapi', searchApi);
            params.set('page', page.toString());
            router.push(`?${params.toString()}`);
        });
    }

    const handleShowAlbum = (album: AlbumShort) => {
        startTransition(async () => {
            let data: FetchAlbumResult;
            switch(album.origin) {
                case DISCOGS:
                    data = await fetchAlbumAction({id: album.id, origin: album.origin});
                    break;
                case LASTFM:
                    data = await fetchAlbumAction({id: album.id, title: album.title, artist: album.artist.name, origin: album.origin});
                    break;
            }

            if (data.success) {
                setSelectedAlbum(data.album);
                setError(null);
            } else {
                setError(data.error);
                setSelectedAlbum(null);
            }
        })
    }

    const handleImageLoad = () => {
        imagesLoaded.current++;

        if (imagesLoaded.current === albums.length) {
            setAllImagesLoaded(true);
            imagesLoaded.current = 0;
        }
    }

    return (
        <div className={`flex flex-col ${className || ''}`}>
            <div
                className="flex items-center h-12 px-4 text-sm bg-secondary-content border border-gray-300 rounded-t-md">
                <span>{pagination?.total ?? albums.length} résultat(s)</span>
                <span className="grow"></span>
                {pagination && <span>Page {pagination.page} sur {pagination.pages}</span>}
            </div>
            <div className={`flex relative w-full h-full border px-2 border-gray-300 ${pagination && pagination.pages > 1 ? '' : 'rounded-b-md'} overflow-y-auto`}>
                <div className={`flex flex-wrap content-start ${isPaginating || !allImagesLoaded ? 'invisible' : 'visible'}`}>
                    {albums.map((album, index) =>
                        <div key={index}
                             className={`mx-1 my-2 p-2 h-fit border border-gray-300 rounded-md shadow-md cursor-pointer hover:shadow-lg hover:shadow-blue-500/50`}>
                            <AlbumThumbnail key={`${album.origin}_${album.artist}_${album.title}_${album.id}`}
                                            album={album} handleImageLoad={handleImageLoad}
                                            showDetailAction={() => handleShowAlbum(album)} />
                        </div>
                    )}
                </div>
                {(isPaginating || !allImagesLoaded) &&
                    <div className="absolute inset-0 flex items-center justify-center z-10 bg-base-100/50">
                        <span className="loading loading-spinner loading-lg" />
                    </div>
                }
            </div>
            {pagination && pagination.pages > 1 &&
                <div className={`flex justify-center items-center w-full h-16 px-4 ${isPaginating ? 'btn-disabled' : ''} text-sm bg-secondary-content border border-gray-300 rounded-b-md`}>
                    <PaginationControl page={pagination.page} pages={pagination.pages} onChangePage={changePage} />
                </div>
            }

            {selectedAlbum &&
                <AlbumDialog album={selectedAlbum} onCloseAction={() => setSelectedAlbum(null)} />
            }

            {error &&
                <AlertDialog message={error} onCloseAction={() => setError(null)} />
            }
        </div>
    )
}