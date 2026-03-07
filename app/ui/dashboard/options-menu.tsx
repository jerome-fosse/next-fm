import {BiLogInCircle, BiLogOutCircle} from "react-icons/bi";
import {GrConfigure, GrLastfm} from "react-icons/gr";
import {requestAuthorizationFromLastFM} from "@/app/lib/actions/authent";
import Image from "next/image";
import {getConnectedUserInfos} from "@/app/lib/services/authent";


export default async function OptionsMenu() {
    const user = await getConnectedUserInfos();
    const profileImage = user ?
        user.images?.filter(image => image.size === 'small')[0]?.url ?? '/images/no-user-image.gif' :
        '/images/no-user-image.gif';

    return (
        <div className="flex space-x-2 items-center justify-end">
            {user && <span className="text-sm font-bold text-secondary-content">{user.name}</span>}
            <details className="dropdown dropdown-end">
                <summary className="btn btn-square btn-ghost w-10 h-10 border-none hover:bg-transparent focus:bg-transparent active:bg-transparent">
                    <Image className="rounded-full"
                           src={profileImage}
                           alt="User avatar" fill={true} />
                </summary>
                <form id="options-form">
                    <ul tabIndex={-1} className="menu dropdown-content bg-base-100 rounded-box z-10 w-52 p-2 shadow-sm">
                        {!user && <li><button form="options-form" formAction={requestAuthorizationFromLastFM}><BiLogInCircle />Connection</button></li>}
                        {user && <li><a href={user.url} target="_blank"><GrLastfm />Profil Last.fm</a></li>}
                        {user && <li><button><GrConfigure />Paramètres</button></li>}
                        {user && <li className="ui-menu-divider"></li>}
                        {user && <li><button><BiLogOutCircle />Déconnection</button></li>}
                    </ul>
                </form>
            </details>
        </div>
    )
}