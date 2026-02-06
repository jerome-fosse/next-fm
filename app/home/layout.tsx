'use client'

import NavigationBar from "@/app/ui/dashboard/navbar";
import FadeInMenu from "@/app/ui/dashboard/fade-in-menu";
import {useState} from "react";

export default function Layout({children}: Readonly<{ children: React.ReactNode; }>) {
    const [menuIsVisible, setMenuVisibility] = useState(false);

    return (
        <div className="flex flex-col max-w-[1408px] mx-auto h-screen overflow-hidden font-sans space-x-2">
            <div id="navbar" className="w-full px-2 pt-2">
                <NavigationBar onMenuToggle={() => setMenuVisibility(!menuIsVisible)}/>
            </div>
            <div id="content-parent" className="flex h-full m-2 space-x-2">
                <div id="menu" className={[
                    "h-full mb-2 rounded-md",
                    "transition-[width] duration-300 ease-out",
                    menuIsVisible ? "w-72" : "w-0",
                ].join(" ")}
                >
                    <FadeInMenu isVisible={menuIsVisible}/>
                </div>
                <div id="content" className="h-full w-full p-2 overflow-y-auto">
                    { children }
                </div>
            </div>
        </div>
    )
}