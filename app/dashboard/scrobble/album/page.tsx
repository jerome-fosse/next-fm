import {PiVinylRecord} from "react-icons/pi";
import SearchAlbumsForm from "@/app/ui/dashboard/search-albums-form";
import SearchAlbumsLoader from "@/app/ui/dashboard/search-albums-loader";
import {searchSchema} from "@/app/lib/queries/album";

export default async function Page({searchParams}: { searchParams: Promise<Record<string, string>> }) {
    const parsed = searchSchema.safeParse(await searchParams);

    const query = parsed.success ? parsed.data.query : undefined;
    const searchApi = parsed.success ? parsed.data.searchapi : undefined;
    const page = parsed.success ? parsed.data.page : 1;

    return (
        <div className="flex flex-col w-full h-full">
            <div className="flex text-4xl mb-8"><PiVinylRecord className="mr-4"/>Scrobbler des albums...</div>
            <SearchAlbumsForm defaultQuery={query} defaultApi={searchApi}/>
            {query && searchApi && <SearchAlbumsLoader query={query} searchApi={searchApi} page={page}/>}
        </div>
    )
}
