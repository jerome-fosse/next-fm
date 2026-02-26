import {BiLogInCircle, BiLogOutCircle} from "react-icons/bi";
import {GrConfigure} from "react-icons/gr";
import {requestAuthorizationFromLastFM} from "@/app/lib/actions/authent";
import Image from "next/image";
import {cookies} from "next/headers";
import {sessionCookieSchema} from "@/app/schemas/authent";

export default async function OptionsMenu() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('nextfm-session');
    const parsed = sessionCookieSchema.safeParse(JSON.parse(sessionCookie?.value ?? '{}'));
    const connected = parsed.success;
    const username = parsed.success ? parsed.data.username : undefined;

    return (
        <div className="flex space-x-2 items-center justify-end">
            {connected && <span className="text-sm font-bold">{username}</span>}
            <details className="dropdown dropdown-end">
                <summary className="btn btn-lg btn-square btn-ghost w-8 h-8">
                    <Image className="rounded-full"
                           src="/images/no-user-image.gif"
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