import {PiVinylRecord} from "react-icons/pi";
import SearchAlbumsForm from "@/app/home/search-albums-form";

export default function Page() {
    return (
        <div className="flex flex-col">
            <div className="flex text-4xl"><PiVinylRecord className="mr-4 mb-8"/>Scrobbler des albums...</div>
            <SearchAlbumsForm />
        </div>
    )
}