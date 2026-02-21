import {createSession} from "@/app/lib/actions/authent";

type Props = {
    searchParams: Promise<{ token?: string }>
}

export default async function Page({ searchParams }: Props) {
    const { token } = await searchParams;

    if (!token) return <h1>Authentication failed - No token</h1>;

    const response = await createSession(token);

    return <h1>{`Authentification ${token}`}</h1>;
}
