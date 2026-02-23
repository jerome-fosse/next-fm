import {ImCog} from "react-icons/im";
import {SlMenu} from "react-icons/sl";
import {PiWaveform} from "react-icons/pi";
import Logo from "@/app/ui/common/logo";

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
                <Logo size="small" />
            </div>
            <div className="flex-none">
                <button className="btn btn-lg btn-square btn-ghost">
                    <ImCog />
                </button>
            </div>
        </div>
    );
}