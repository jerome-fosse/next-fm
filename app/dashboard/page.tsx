import {cookies} from 'next/headers';
import {requestAuthorizationFromLastFM} from '@/app/lib/actions/authent';
import {PiHeadphones, PiWaveform, PiChartBar, PiShareNetwork} from 'react-icons/pi';

const features = [
    { icon: PiHeadphones,   title: 'Écoutez',    description: 'Recherchez vos albums via Discogs ou Last.fm' },
    { icon: PiWaveform,     title: 'Scrobblez',  description: 'Scrobblez albums, concerts et setlists sur Last.fm' },
    { icon: PiChartBar,     title: 'Analysez',   description: 'Explorez vos stats musicales en détail' },
    { icon: PiShareNetwork, title: 'Partagez',   description: 'Publiez vos écoutes sur vos réseaux sociaux' },
];

export default async function Page() {
    const cookieStore = await cookies();
    const session = cookieStore.get('nextfm-session');

    if (session) {
        return (
            <div className="flex flex-col w-full h-full p-6 gap-8 overflow-y-auto">
                <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center gap-1">
                        <PiWaveform className="w-12 h-12 text-amber-400" />
                        <span className="font-bold text-5xl">Next<span className="text-amber-400">FM</span></span>
                    </div>
                    <p className="text-xl text-base-content/70">Écoutez. Scrobblez. Analysez. Partagez.</p>
                </div>
                <div className="flex flex-col gap-4">
                    <section className="flex flex-col gap-2">
                        <h2 className="font-bold">Derniers albums scrobblés</h2>
                        <div className="border border-gray-300 rounded-md shadow-md p-4">
                            <div className="flex gap-4">
                                {Array.from({ length: 10 }).map((_, i) => (
                                    <div key={i} className="flex flex-col gap-2 animate-pulse">
                                        <div className="w-20 h-20 bg-base-300 rounded-md" />
                                        <div className="w-20 h-2 bg-base-300 rounded" />
                                        <div className="w-14 h-2 bg-base-300 rounded" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                    <section className="flex flex-col gap-2">
                        <h2 className="font-bold">Top artistes</h2>
                        <div className="border border-gray-300 rounded-md shadow-md p-4">
                            <div className="flex gap-4">
                                {Array.from({ length: 10 }).map((_, i) => (
                                    <div key={i} className="flex flex-col gap-2 animate-pulse">
                                        <div className="w-20 h-20 bg-base-300 rounded-full" />
                                        <div className="w-20 h-2 bg-base-300 rounded" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                    <section className="flex flex-col gap-2">
                        <h2 className="font-bold">Dernières recherches</h2>
                        <div className="border border-gray-300 rounded-md shadow-md p-4">
                            <p className="text-sm text-base-content/60">À venir...</p>
                        </div>
                    </section>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full h-full items-center justify-center gap-12 p-8">
            <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-1">
                    <PiWaveform className="w-12 h-12 text-amber-400" />
                    <span className="font-bold text-5xl">Next<span className="text-amber-400">FM</span></span>
                </div>
                <p className="text-xl text-base-content/70">Écoutez. Scrobblez. Analysez. Partagez.</p>
            </div>
            <div className="flex gap-6">
                {features.map(({ icon: Icon, title, description }) => (
                    <div key={title} className="flex flex-col items-center gap-3 p-6 w-48 border border-gray-300 rounded-md shadow-md text-center">
                        <Icon className="w-10 h-10" />
                        <h2 className="font-bold">{title}</h2>
                        <p className="text-xs text-base-content/70">{description}</p>
                    </div>
                ))}
            </div>
            <form action={requestAuthorizationFromLastFM}>
                <button className="btn btn-secondary" type="submit">Se connecter avec Last.fm</button>
            </form>
        </div>
    );
}
