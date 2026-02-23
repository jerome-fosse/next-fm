import {cookies} from 'next/headers';
import {requestAuthorizationFromLastFM} from '@/app/lib/actions/authent';

export default async function Page() {
    const cookieStore = await cookies();
    const session = cookieStore.get('nextfm-session');

    if (session) {
        const { username } = JSON.parse(session.value);
        return <h1>Bienvenue {username} — stats à venir</h1>;
    }

    return (
        <div>
            <h1>Bienvenue sur Next-FM</h1>
            <p>Next-FM vous permet de rechercher des albums et artistes via Discogs et Last.fm.</p>
            <p>Sans connexion, vous pouvez rechercher et consulter des albums. En vous connectant avec votre compte Last.fm, vous accédez à des fonctionnalités supplémentaires comme le scrobbling.</p>
            <form action={requestAuthorizationFromLastFM}>
                <button className="btn btn-secondary" type="submit">Se connecter avec Last.fm</button>
            </form>
        </div>
    );
}
