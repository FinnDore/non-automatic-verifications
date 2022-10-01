import type { NextPage } from 'next';
import { signIn, useSession } from 'next-auth/react';
import { Verify } from '../components/verify';

const Nav = () => {
    const { data } = useSession();

    return (
        <div className="mb-6 flex w-full">
            <div className="mr-auto text-xl font-bold">NAV</div>
            {!data?.user && (
                <button className="" onClick={() => signIn('keycloak')}>
                    Login
                </button>
            )}
            {data?.user && (
                <div className="text-rose-600">{data.user.name}</div>
            )}
        </div>
    );
};

const Home: NextPage = () => {
    return (
        <div className="h-screen w-screen bg-white px-6 py-4 dark:bg-black dark:text-white">
            <Nav />
            <Verify />
        </div>
    );
    // return <pre>{JSON.stringify(data, null, 2)}</pre>;
};

export default Home;
