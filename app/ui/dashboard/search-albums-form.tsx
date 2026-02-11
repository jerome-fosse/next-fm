'use client';

import SearchInput from "@/app/ui/common/search-input";
import DropDownButton from "@/app/ui/common/dropdown-button";
import {SiDiscogs} from "react-icons/si";
import {PiPlaylist} from "react-icons/pi";
import {BiSearchAlt2} from "react-icons/bi";

type Props = {
    defaultQuery?: string,
    formAction?: (payload: FormData) => void
}

export default function SearchAlbumsForm({defaultQuery, formAction}: Props) {
    const menuItems = [
        {textMenuItem: 'Discogs', textButton: 'Chercher sur Discogs', icon: SiDiscogs, default: true},
        {textMenuItem: 'Last.fm', textButton: 'Chercher sur Last.fm', icon: PiPlaylist},
    ]

    return (
        <form action={formAction}>
            <div className="flex space-x-4">
                <label htmlFor="query" className="label">Album ou artiste</label>
                <SearchInput name="query" defaultValue={defaultQuery} required/>
                <DropDownButton name="searchapi" type="submit" text="Chercher..." icon={BiSearchAlt2}
                                items={menuItems}/>
            </div>
        </form>
    )
}