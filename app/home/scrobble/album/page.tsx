'use client'

import {PiVinylRecord} from "react-icons/pi";
import SearchAlbumsForm from "@/app/ui/dashboard/search-albums-form";
import {useActionState} from "react";
import {searchAlbumsAction, SearchAlbumsState} from "@/app/lib/actions/album";
import SearchAlbumsResult from "@/app/ui/dashboard/search-albums-result";

export default function Page() {
    const initialState: SearchAlbumsState = {
        query: "",
        isLoading: false,
        error: undefined,
        albums: undefined,
        pagination: undefined
    }
    const [state, formAction] = useActionState(searchAlbumsAction, initialState)

    return (
        <div className="flex flex-col w-full h-full">
            <div className="flex text-4xl mb-8"><PiVinylRecord className="mr-4"/>Scrobbler des albums...</div>
            <SearchAlbumsForm defaultQuery={state.query} formAction={formAction}/>
            <SearchAlbumsResult className="flex-1 min-h-0 mt-4" albums={state.albums} pagination={state.pagination}/>
        </div>
    )
}