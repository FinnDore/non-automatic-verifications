import { atom, useAtom } from 'jotai';
import type { NextPage } from 'next';
import { StartSession } from '../components/start-session';
import { Verify } from '../components/verify';
import { sessionAtom } from '../hooks/verifcation';

const currentVerificationId = atom<string | null>(null);

const Home: NextPage = () => {
    const [verificationId] = useAtom(currentVerificationId);
    const [session] = useAtom(sessionAtom);

    return (
        <div className="flex h-full w-full flex-col">
            {session && <Verify />}
            {!session && <StartSession />}
        </div>
    );
};

export default Home;
