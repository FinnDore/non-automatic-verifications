import { formatDistance } from 'date-fns';
import { useAtom } from 'jotai';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Button } from '../cocaine/button';
import { popToast, ToastLevel } from '../cocaine/toast';
import {
    sessionAtom,
    useSetCurrentVerificationId,
    useStartSessionById,
} from '../hooks/verifcation';
import { trpc } from '../utils/trpc';

const useCreateVerification = () => {
    const {
        mutate: createRandomVerificationsMutation,
        isLoading: isCreatingRandomVerifications,
    } = trpc.verification.createRandomVerifications.useMutation({
        onError(err) {
            console.error(err);
            popToast({
                body: 'Failed to create random verifications',
                level: ToastLevel.ERROR,
            });
        },
        onSuccess() {
            popToast({
                body: `Created ${100} random verifications`,
                level: ToastLevel.SUCCESS,
            });
        },
    });

    return () => {
        if (isCreatingRandomVerifications) return;

        createRandomVerificationsMutation({
            number: 100,
        });
    };
};

const useStartSession = () => {
    const router = useRouter();
    const [, setSession] = useAtom(sessionAtom);
    const setCurrentVerificationId = useSetCurrentVerificationId();
    const { mutate: startSessionMutation, isLoading: isStartingSession } =
        trpc.session.start.useMutation({
            onError(err) {
                console.error(err);
                popToast({
                    body: 'Failed to start session',
                    level: ToastLevel.ERROR,
                });
            },
            onSuccess(session) {
                setSession(() => session);
                setCurrentVerificationId(session.verifications[0]?.id ?? null);
                router.push('/verify/vrn');
            },
        });

    return (verificationCount: number) => {
        if (isStartingSession) return;

        startSessionMutation({
            limit: verificationCount,
        });
    };
};

const ExistingSession = ({
    sessionId,
    verificationCount,
    sessionStartedAt,
    verifiedCount,
}: {
    verificationCount: number;
    sessionId: string;
    sessionStartedAt: Date;
    verifiedCount: number;
}) => {
    const { startSession, isLoading } = useStartSessionById(sessionId);
    const startTheSession = () => isLoading && startSession();
    return (
        <div className="my-1 mx-auto transition-transform hover:scale-105">
            <Button onClick={() => startTheSession()} className="z-20">
                <>
                    {verifiedCount} / {verificationCount} verifications started{' '}
                    {formatDistance(sessionStartedAt, new Date(), {
                        addSuffix: true,
                    })}
                </>
            </Button>
        </div>
    );
};

export const StartSession = () => {
    const createRandomVerifications = useCreateVerification();
    const startSession = useStartSession();
    const [verificationCount, setVerificationCount] = useState(1);

    const { data: currentSessions } = trpc.session.getSessions.useQuery();

    return (
        <div className="flex h-full w-full flex-col justify-center ">
            <h1 className="mx-auto text-2xl font-bold text-rose-500">
                Start Session
            </h1>

            <Button
                onClick={() => createRandomVerifications()}
                className="my-4 mx-auto"
            >
                Create verifications
            </Button>

            {!!currentSessions?.length &&
                currentSessions.map((session) => (
                    <ExistingSession
                        key={session.id}
                        sessionId={session.id}
                        sessionStartedAt={session.startedAt}
                        verifiedCount={session.verificationCursor}
                        verificationCount={session._count.Verification}
                    />
                ))}

            <input
                defaultValue={1}
                className="border-white/7 my-4 mx-auto rounded-md border bg-transparent py-4 text-center dark:bg-black"
                type="number"
                onChange={(e) => setVerificationCount(() => +e.target.value)}
            />
            <div className="mx-auto my-4">
                <Button onClick={() => startSession(verificationCount)}>
                    Start Session
                </Button>
            </div>
        </div>
    );
};

const Home: NextPage = () => {
    return (
        <div className="flex h-full w-full flex-col">
            <div className="h-full w-full">
                <StartSession />
            </div>
        </div>
    );
};

export default Home;
