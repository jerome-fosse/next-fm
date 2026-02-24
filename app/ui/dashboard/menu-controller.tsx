'use client'

import NavigationBar from '@/app/ui/dashboard/navbar';
import FadeInMenu from '@/app/ui/dashboard/fade-in-menu';
import {useState} from 'react';

type Props = { optionsMenu: React.ReactNode; children: React.ReactNode };

export default function MenuController({optionsMenu, children}: Props) {
    const [menuIsVisible, setMenuVisibility] = useState(false);

    return (
        <>
            <div id="navbar" className="w-full px-2 pt-2 flex-shrink-0">
                <NavigationBar onMenuToggle={() => setMenuVisibility(!menuIsVisible)} optionsMenu={optionsMenu}/>
            </div>
            <div id="content-parent" className="flex flex-1 min-h-0 m-2 space-x-2">
                <FadeInMenu className={`h-full bg-secondary-content rounded-md ${menuIsVisible ? "w-60" : "w-0"}`}
                            isVisible={menuIsVisible}/>
                <div id="content" className="flex w-full h-full overflow-hidden">
                    {children}
                </div>
            </div>
        </>
    )
}
