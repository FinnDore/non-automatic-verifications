import { useEffect, useState } from 'react';
import {
    useCurrentVerification,
    useSubmitVerification,
} from '../../hooks/verifcation';

const Picture = () => {
    const url = '/img2.gif';

    return (
        <picture className="w-full overflow-hidden rounded-lg border border-black/70 dark:border-white/70 lg:my-auto lg:w-max">
            <img src={url} alt="the verification image" />
        </picture>
    );
};

const getMeta = (meta: unknown, key: string) => {
    return typeof meta === 'object' ? (meta as any)?.[key] : 'unknown';
};

const SideBar = () => {
    const currentVerification = useCurrentVerification();
    const [vrn, setVrn] = useState<string | null>(
        currentVerification?.vrn ?? null
    );

    useEffect(
        () => setVrn(currentVerification?.vrn ?? null),
        [setVrn, currentVerification?.vrn]
    );

    const { submitVerification } = useSubmitVerification();
    return (
        <div className="mt-6 flex w-full flex-col items-center lg:flex-row lg:justify-between ">
            <div className="w-2/3 lg:w-1/3">
                <h1 className="text-2xl">Metadata</h1>
                <table className="w-full">
                    <tbody>
                        <tr>
                            <td className="w-1/2 font-bold">Type</td>
                            <td>
                                {getMeta(
                                    currentVerification?.metadata,
                                    'carType'
                                )}
                            </td>
                        </tr>
                        <tr>
                            <td className="w-1/2 font-bold">Direction</td>
                            <td>
                                {getMeta(
                                    currentVerification?.metadata,
                                    'direction'
                                )}
                            </td>
                        </tr>
                        <tr>
                            <td className="w-1/2 font-bold">Colour</td>
                            <td>
                                {getMeta(
                                    currentVerification?.metadata,
                                    'nationality'
                                )}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <input
                value={vrn ?? ''}
                onChange={(e) => setVrn(e.target.value)}
                className="border-black/7 dark:border-white/7 my-6 mx-auto rounded-md border bg-transparent py-4 text-center text-3xl dark:bg-black"
                type="text"
            />

            <div className="my-6 flex justify-center">
                <button
                    className="mx-4 h-20 w-32 rounded-md border-2 border-transparent bg-rose-700 px-6 py-2 text-white transition-colors hover:border-rose-800 hover:bg-rose-500"
                    onClick={() => {
                        if (currentVerification) {
                            submitVerification({
                                verificationId: currentVerification.id,
                                status: 'REJECTED',
                                vrn: vrn || currentVerification.vrn,
                            });
                        }
                    }}
                >
                    REJECT
                </button>
                <button
                    className=" h-20 w-32 rounded-md  border-2 border-transparent bg-emerald-500 px-6 py-2 text-white transition-colors hover:border-emerald-700 hover:bg-emerald-400"
                    onClick={() => {
                        if (currentVerification) {
                            submitVerification({
                                verificationId: currentVerification.id,
                                status: 'ACCEPTED',
                                vrn: vrn || currentVerification.vrn,
                            });
                        }
                    }}
                >
                    ACCEPT
                </button>
            </div>
        </div>
    );
};

const Verify = () => {
    const currentVerification = useCurrentVerification();
    return (
        <div className="flex w-full flex-col items-center">
            <div className="flex flex-col">
                {currentVerification && (
                    <>
                        <Picture />
                        <SideBar />
                    </>
                )}
            </div>
        </div>
    );
};

export default Verify;
