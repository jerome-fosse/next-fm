import {PiWaveform} from "react-icons/pi";

type Props = {
    size: "small" | "large",
    primaryColor?: string,
    secondaryColor?: string,
    slogan?: boolean,
};

export default function Logo({size, primaryColor = "text-black", secondaryColor = "text-amber-400", slogan = false}: Props) {
    return (
        <>
            <div className="flex items-center gap-1">
                <PiWaveform className={[
                    size === "small" ? "w-8 h-8 " : "",
                    size === "large" ? "w-12 h-12 " : "",
                    secondaryColor
                ].join(" ")}/>
                <span className={[
                    "font-bold",
                    size === "small" ? "text-2xl " : "",
                    size === "large" ? "text-5xl " : "",
                    primaryColor
                ].join(" ")}>Next<span className={`${secondaryColor}`}>FM</span></span>
            </div>
            {slogan &&
                <p className={[
                    size === "small" ? "text-sm " : "",
                    size === "large" ? "text-xl " : "",
                    "text-base-content/70",
                ].join(" ")}>Écoutez. Scrobblez. Analysez. Partagez.</p>
            }
        </>
    )
}