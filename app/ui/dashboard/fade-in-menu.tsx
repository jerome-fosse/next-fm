import {PiMicrophoneStage, PiVinylRecord} from "react-icons/pi";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {GrStatusUnknown} from "react-icons/gr";

type Props = {
    className?: string,
    isVisible: boolean
};

const menuItems = [
    {
        type: 'Title',
        text: 'Scrobble',
    },
    {
        type: 'MenuItem',
        text: 'Album',
        path: '/dashboard/scrobble/album',
        icon: PiVinylRecord
    },
    {
        type: 'MenuItem',
        text: 'Setlist',
        path: '/dashboard/scrobble/setlist',
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

export default function FadeInMenu({className, isVisible}: Props) {
    const pathname = usePathname();

    return (
        <div className={[
            `transition-all duration-300 ease-out`,
            isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-2 pointer-events-none",
            ...(className ? [className] : []),
        ].join(" ")}
             aria-hidden={!isVisible}
        >
            <ul className="menu rounded-box w-56">
                {menuItems.map((item, index) => {
                    switch (item.type) {
                        case 'Title': return <li key={index} className="menu-title">{item.text}</li>;
                        case 'MenuItem': {
                            const Icon = item.icon ?? GrStatusUnknown;
                            return (
                                <li key={index} className={pathname === item.path ? "menu-active" : ""}>
                                    <Link href={item.path ?? pathname}><Icon className="h-5 w-5"/> {item.text}</Link>
                                </li>
                            );
                        }
                        case 'Divider': return <li key={index} className="ui-menu-divider"></li>;
                    }
                })}
            </ul>
        </div>
    )
}