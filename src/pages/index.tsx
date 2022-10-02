import type { NextPage } from 'next';
import { StartSession } from '../components/start-session';

const Home: NextPage = () => {
    return (
        <div className="flex h-full w-full flex-col">
            <StartSession />
        </div>
    );
};

export default Home;
