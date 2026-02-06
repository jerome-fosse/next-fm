import {BiSearchAlt2} from "react-icons/bi";

type Props = { name: string, label: string, required: boolean }

export default function SearchInput({name = "search", required = true}: Props) {
    return (
        <label className="input input-secondary">
            <BiSearchAlt2 className="w-5 h-5"/>
            <input name={name} type="search" required={required} placeholder="Recherche" />
        </label>
    );
}