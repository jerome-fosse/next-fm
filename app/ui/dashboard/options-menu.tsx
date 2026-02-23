import {ImCog} from "react-icons/im";
import {useSession} from "@/app/lib/hooks/session";

export default function OptionsMenu() {
    const {connected, username} = useSession();

    return (
        <div>
            {connected && <span className="text-sm font-bold">{username}</span>}
            <button className="btn btn-lg btn-square btn-ghost">
                <ImCog/>
            </button>
        </div>
    )
}