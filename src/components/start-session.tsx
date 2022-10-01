import { useAtom } from 'jotai';
import { useState } from 'react';
import { sessionAtom, useSetCurrentVerificationId } from '../atoms/verifcation';
import { Button } from '../cocaine/button';
import { popToast, ToastLevel } from '../cocaine/toast';
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
                body: 'Created random verifications',
                level: ToastLevel.SUCCESS,
            });
        },
    });

    return () => {
        if (isCreatingRandomVerifications) return;

        createRandomVerificationsMutation({
            number: 10,
        });
    };
};

const useStartSession = () => {
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
            },
        });

    return (verificationCount: number) => {
        if (isStartingSession) return;

        startSessionMutation({
            limit: verificationCount,
        });
    };
};

export const StartSession = () => {
    const createRandomVerifications = useCreateVerification();
    const startSession = useStartSession();

    const [verificationCount, setVerificationCount] = useState(10);
    return (
        <div className="flex h-full w-full flex-col justify-center">
            <h1 className="mx-auto text-2xl font-bold text-rose-500">
                Start Session
            </h1>

            <div className="order-white/7 my-4 mx-auto rounded-md border">
                <Button onClick={() => createRandomVerifications()}>
                    Create verifications
                </Button>
            </div>

            <input
                value={1}
                className="order-white/7 my-4 mx-auto rounded-md border bg-transparent py-4 text-center"
                type="number"
                onChange={(e) => setVerificationCount(() => +e.target.value)}
            />
            <div className="border-white/7 mx-auto my-4 rounded-md border">
                <Button onClick={() => startSession(verificationCount)}>
                    Start Session
                </Button>
            </div>
        </div>
    );
};
