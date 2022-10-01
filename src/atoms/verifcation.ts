import { Verificaiton } from '@prisma/client';
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';

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
