import MenuController from '@/app/ui/dashboard/menu-controller';
import OptionsMenu from '@/app/ui/dashboard/options-menu';

// This layout is intentionally a Server Component.
// Interactive state (menu toggle) is isolated in MenuController ('use client').
// OptionsMenu is passed as a slot so it can remain a Server Component and fetch data server-side.
export default function Layout({children}: Readonly<{ children: React.ReactNode; }>) {
    return (
        <div className="flex flex-col max-w-[1408px] h-screen mx-auto font-sans">
            <MenuController optionsMenu={<OptionsMenu/>}>
                {children}
            </MenuController>
        </div>
    )
}
