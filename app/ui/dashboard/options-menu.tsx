import {BiLogInCircle, BiLogOutCircle} from "react-icons/bi";
import {GrConfigure} from "react-icons/gr";
import {requestAuthorizationFromLastFM} from "@/app/lib/actions/authent";
import Image from "next/image";
import {getConnectedUserInfos} from "@/app/lib/services/authent";
import {option} from "fp-ts";
import {pipe} from "fp-ts/function";

export default async function OptionsMenu() {
    const {connected, username, profileImage} = pipe(
        await getConnectedUserInfos(),
        option.map(user => ({
            connected: true,
            username: user.name,
            profileImage: user.images?.filter(image => image.size === 'small')[0]?.url ?? '/images/no-user-image.gif',
            url: user.url
        })),
        option.getOrElse(() => ({connected: false, username: '', profileImage: '/images/no-user-image.gif', url: ''}))
    )

    return (
        <div className="flex space-x-2 items-center justify-end">
            {connected && <span className="text-sm font-bold">{username}</span>}
            <details className="dropdown dropdown-end">
                <summary className="btn btn-square btn-ghost w-10 h-10 border-none hover:bg-transparent focus:bg-transparent active:bg-transparent">
                    <Image className="rounded-full"
                           src={profileImage}
                           alt="User avatar" fill={true} />
                </summary>
                <form id="options-form">
                    <ul tabIndex={-1} className="menu dropdown-content bg-base-100 rounded-box z-10 w-52 p-2 shadow-sm">
                        {!connected && <li><button form="options-form" formAction={requestAuthorizationFromLastFM}><BiLogInCircle />Connection</button></li>}
                        {connected && <li><button><GrConfigure />Paramètres</button></li>}
                        {connected && <li><button><BiLogOutCircle />Déconnection</button></li>}
                    </ul>
                </form>
            </details>
        </div>
    )
}