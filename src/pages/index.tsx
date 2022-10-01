import type { NextPage } from 'next';
import { signIn } from 'next-auth/react';
import { trpc } from '../utils/trpc';
const Home: NextPage = () => {
    const { data: data, refetch } = trpc.auth.getSession.useQuery(
        { name: 'a' },
        {
            refetchOnWindowFocus: false,
            enabled: false,
        }
    );

    return (
        <div className="w-screen h-screen flex bg-black text-white">
            <button className="m-auto" onClick={() => signIn()}>
                Login
            </button>
            <button className="m-auto" onClick={() => refetch()}>
                Fetch
            </button>

            <pre>{JSON.stringify(data ?? 'null', null, 4)}</pre>
        </div>
    );
    // return <pre>{JSON.stringify(data, null, 2)}</pre>;
};

export default Home;
