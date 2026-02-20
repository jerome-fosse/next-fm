'use client'

import {PiVinylRecord} from "react-icons/pi";
import SearchAlbumsForm from "@/app/ui/dashboard/search-albums-form";
import {useActionState, useCallback, useEffect, useRef, useTransition} from "react";
import {searchAlbumsAction, SearchAlbumsState} from "@/app/lib/actions/album";
import SearchAlbumsResult from "@/app/ui/dashboard/search-albums-result";
import AlertDialog from "@/app/ui/common/alert-dialog";

export default function Page() {
    const initialState: SearchAlbumsState = {
        query: "",
        searchApi: "",
        albums: undefined,
        pagination: undefined
    }
    const [state, formAction] = useActionState(searchAlbumsAction, initialState)
    const [isPending, startTransition] = useTransition();
    const errorModal = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        if (state.error) errorModal.current?.showModal();
    }, [state.error]);

    const changePage = useCallback((page: number) => {
        startTransition(() => {
            const formData = new FormData();
            formData.append('query', state.query);
            formData.append('searchapi', state.searchApi);
            formData.append('page', page.toString());

            formAction(formData);
        });
    }, [state.query, state.searchApi])

    return (
        <div className="flex flex-col w-full h-full">
            <div className="flex text-4xl mb-8"><PiVinylRecord className="mr-4"/>Scrobbler des albums...</div>
            <SearchAlbumsForm defaultQuery={state.query} formAction={formAction}/>
            <SearchAlbumsResult className="flex-1 min-h-0 mt-4" albums={state.albums} pagination={state.pagination} pending={isPending} onChangePage={changePage}/>
            <AlertDialog ref={errorModal} message={state.error ?? ''} />
        </div>
    )
}