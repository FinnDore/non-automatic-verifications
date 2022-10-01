import type { NextPage } from 'next';
import { signIn } from 'next-auth/react';
import { Verify } from '../components/verify';

const Nav = () => (
    <div className="flex w-full mb-6">
        <div className="mr-auto text-xl font-bold">NAV</div>
        <button className="" onClick={() => signIn('keycloak')}>
            Login
        </button>
    </div>
);

const Home: NextPage = () => {
    return (
        <div className="w-screen h-screen dark:bg-black bg-white dark:text-white px-6 py-4">
            <Nav />
            <Verify />
        </div>
    );
    // return <pre>{JSON.stringify(data, null, 2)}</pre>;
};

export default Home;
