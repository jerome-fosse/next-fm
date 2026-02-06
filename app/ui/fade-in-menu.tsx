import {PiMicrophoneStage, PiVinylRecord} from "react-icons/pi";
import Link from "next/link";
import {usePathname} from "next/navigation";
import { GrStatusUnknown } from "react-icons/gr";

type Props = { isVisible: boolean };

const menuItems = [
    {
        type: 'Title',
        text: 'Scrobble',
    },
    {
        type: 'MenuItem',
        text: 'Album',
        path: '/home/scrobble/album',
        icon: PiVinylRecord
    },
    {
        type: 'MenuItem',
        text: 'Setlist',
        path: '/home/scrobble/setlist',
        icon: PiMicrophoneStage
    },
    {
        type: 'Divider',
    },
    {
        type: 'Title',
        text: 'Rapports',
    },
]

export default function FadeInMenu({isVisible}: Props) {
    const pathname = usePathname();

    return (
        <div className={[
            "h-full w-full bg-secondary-content rounded-md overflow-y-auto",
            `transition-all duration-300 ease-out`,
            isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-2 pointer-events-none",
        ].join(" ")}
             aria-hidden={!isVisible}
        >
            <ul className="menu rounded-box w-56">
                {menuItems.map(item => {
                    switch (item.type) {
                        case 'Title': return <li className="menu-title">{item.text}</li>;
                        case 'MenuItem': {
                            const Icon = item.icon ?? GrStatusUnknown;
                            return (
                                <li className={pathname === item.path ? "menu-active" : ""}>
                                    <Link href={item.path ?? pathname}><Icon className="h-5 w-5"/> {item.text}</Link>
                                </li>
                            );
                        }
                        case 'Divider': return <li className="ui-menu-divider"></li>;
                    }
                })}
            </ul>
        </div>
    )
}