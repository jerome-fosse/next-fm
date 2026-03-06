import type {Origin} from "@/app/types/common";
import {searchAlbums} from "@/app/lib/queries/album";
import AlertDialog from "@/app/ui/common/alert-dialog";
import SearchAlbumsResult from "@/app/ui/dashboard/search-albums-result";

type Props = {
    query: string;
    searchApi: Origin;
    page: number;
}

export default async function SearchAlbumsLoader({query, searchApi, page}: Props) {
    const result = await searchAlbums(query, searchApi, page);

    if ('error' in result) {
        return <AlertDialog message={result.error}/>;
    }

    return (
        <SearchAlbumsResult key={`${query}_${searchApi}_${page}`} className="flex-1 min-h-0 mt-4"
                            albums={result.albums} pagination={result.pagination}
                            query={query} searchApi={searchApi}/>
    );
}
