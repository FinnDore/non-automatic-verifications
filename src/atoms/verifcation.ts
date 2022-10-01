import { Verificaiton } from '@prisma/client';
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { popToast, ToastLevel } from '../cocaine/toast';
import { trpc } from '../utils/trpc';

export const sessionAtom = atom<{
    sessionId: string;
    verifications: Verificaiton[];
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

export const useStartSessionById = (sessionId: string) => {
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
            },
        }
    );

    return {
        startSession: refetch,
        isLoading,
    };
};
