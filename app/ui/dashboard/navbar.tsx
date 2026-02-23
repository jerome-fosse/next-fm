import {ImCog} from "react-icons/im";
import {SlMenu} from "react-icons/sl";
import {PiWaveform} from "react-icons/pi";

type Props = {onMenuToggle: () => void};

export default function NavigationBar({onMenuToggle} : Props) {
    return (
        <div className="navbar bg-secondary shadow-md rounded-md">
            <div className="flex-none">
                <button className="btn btn-lg btn-square btn-ghost" onClick={onMenuToggle}>
                    <SlMenu />
                </button>
            </div>
            <div className="flex-1 mx-4">
                <a className="flex items-center gap-1">
                    <PiWaveform className="w-8 h-8 text-amber-400" />
                    <span className="font-bold text-2xl">Next<span className="text-amber-400">FM</span></span>
                </a>
            </div>
            <div className="flex-none">
                <button className="btn btn-lg btn-square btn-ghost">
                    <ImCog />
                </button>
            </div>
        </div>
    );
}