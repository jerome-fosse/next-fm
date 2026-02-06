'use client';

import SearchInput from "@/app/ui/common/search-input";
import DropDownButton from "@/app/ui/common/dropdown-button";
import {SiDiscogs} from "react-icons/si";
import {PiPlaylist} from "react-icons/pi";
import {BiSearchAlt2} from "react-icons/bi";

export default function SearchAlbumsForm() {
    const menuItems = [
        {textMenuItem: 'Discogs', textButton: 'Chercher sur Discogs', icon: SiDiscogs, default: true},
        {textMenuItem: 'Setlist.fm', textButton: 'Chercher sur Setlist.fm', icon: PiPlaylist},
    ]

    return (
        <form>
            <div className="flex space-x-4">
                <label htmlFor="album" className="label">Album ou artiste</label>
                <SearchInput name="album" label="Album ou artiste recherché" required/>
                <DropDownButton type="submit" text="Chercher..." icon={BiSearchAlt2} items={menuItems} />
            </div>
        </form>
    )
}