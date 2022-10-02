import { Verification, VrnStatus } from '@prisma/client';
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { popToast, ToastLevel } from '../cocaine/toast';
import { trpc } from '../utils/trpc';

export const sessionAtom = atom<{
    sessionId: string;
    verifications: Verification[];
} | null>(null);

const currentVerificationAtomId = atom<string | null>(null);

export const useSession = () => {
    const [session, setSession] = useAtom(sessionAtom);
    return { session, setSession };
};

export const useSetCurrentVerificationId = () =>
    useSetAtom(currentVerificationAtomId);

export const useCurrentVerification = () => {
    const currentVerificationId = useAtomValue(currentVerificationAtomId);
    const session = useAtomValue(sessionAtom);

    return (
        session?.verifications.find((v) => v.id === currentVerificationId) ??
        null
    );
};

const useProgerssToNextVerification = () => {
    const router = useRouter();
    const { session, setSession } = useSession();
    const currentVerification = useCurrentVerification();
    const setCurrentVerificationId = useSetCurrentVerificationId();

    const progressToNextVerification = useCallback(() => {
        if (!session) {
            return;
        }
        const currentIndex = session.verifications.findIndex(
            (v) => v.id === currentVerification?.id
        );

        const nextVerification = session.verifications[currentIndex + 1];
        if (!nextVerification) {
            setSession(null);
            popToast({
                body: 'Verification session complete',
                level: ToastLevel.SUCCESS,
            });
            router.push('/start-session');
        } else {
            setCurrentVerificationId(nextVerification.id);
        }
    }, [
        session,
        currentVerification?.id,
        setSession,
        router,
        setCurrentVerificationId,
    ]);

    return progressToNextVerification;
};

export const useStartSessionById = (sessionId: string) => {
    const router = useRouter();
    const [, setSession] = useAtom(sessionAtom);
    const setCurrentVerificationId = useSetCurrentVerificationId();
    const { refetch, isLoading } = trpc.session.getSession.useQuery(
        {
            sessionId,
        },
        {
            enabled: false,
            refetchOnWindowFocus: false,
            onError(err) {
                console.log(err);
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
        }
    );

    return {
        startSession: refetch,
        isLoading,
    };
};

export const useSubmitVerification = () => {
    const progressToNextVerification = useProgerssToNextVerification();
    const session = useSession();
    const { mutate: submitVerificationMutation, isLoading } =
        trpc.verification.submitVerification.useMutation({
            onError(err) {
                console.log(err);
                popToast({
                    body: 'Failed to submit verification',
                    level: ToastLevel.ERROR,
                });
            },
            onSuccess() {
                popToast({
                    body: 'Verification submitted',
                    level: ToastLevel.SUCCESS,
                });

                progressToNextVerification();
            },
        });

    const submitVerification = useCallback(
        (opts: { verificationId: string; status: VrnStatus; vrn: string }) =>
            session.session?.sessionId &&
            submitVerificationMutation({
                sessionId: session.session?.sessionId,
                ...opts,
            }),
        [session.session?.sessionId, submitVerificationMutation]
    );

    return {
        submitVerification,
        isLoading,
    };
};
