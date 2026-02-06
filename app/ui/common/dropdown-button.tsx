/* eslint-disable @typescript-eslint/ban-ts-comment */
'use client';

import {IconType} from "react-icons";
import {BiSolidDownArrow} from "react-icons/bi";
import {useState} from "react";

type Props = {
    type?: "submit" | "reset" | "button",
    text?: string
    icon?: IconType
    items: DropDownButtonItem[]
}

export type DropDownButtonItem = {
    textMenuItem: string,
    textButton?: string,
    action?: () => void, // TODO : to implement
    href?: string,
    icon?: IconType,
    default?: boolean
}

export default function DropDownButton({type = "button", text = "Button", icon, items}: Props) {
    const ButtonIcon = icon;
    const textButton = items.filter(item => item.default == true)
        .map(item => item.textButton)
        .shift() ?? text;
    const [label, setLabel] = useState(textButton)

    return (
        <div className="join join-horizontal btn btn-secondary rounded-md m-0 p-0 border-none bg-transparent gap-0">
            <button type={type} className="btn btn-secondary join-item border-r-0 mr-0 pr-0 shadow-none">
                {ButtonIcon != null ? <ButtonIcon className="w-5 h-5"/> : null}{label}
            </button>
            <div className="dropdown dropdown-bottom dropdown-end">
                <div tabIndex={0} role="button" className="join-item btn btn-secondary border-l-0 ml-0 p-3 shadow-none">
                    <BiSolidDownArrow/>
                </div>
                <ul tabIndex={-1} className="dropdown-content menu bg-secondary-content text-base-content rounded-box z-1 w-52 p-2 shadow-sm">
                    {items.map((item, index) => {
                        const ItemIcon = item.icon;

                        return (
                            <li key={index}>
                                <a href={item.href ?? "#"} onClick={() => {
                                    setLabel(item.textButton ?? item.textMenuItem);
                                    // @ts-ignore
                                    document.activeElement!.blur();
                                }}>
                                    {ItemIcon != null ? <ItemIcon className="w-5 h-5"/> : null}{item.textMenuItem}
                                </a>
                            </li>
                        )
                    })}
                </ul>
            </div>
        </div>
    )
}

