import clsx from 'clsx';
import { ReactElement } from 'react';
import toast from 'react-hot-toast';

export enum ToastLevel {
    ERROR = 'ERROR',
    WARN = 'WARN',
    INFO = 'INFO',
    SUCCESS = 'SUCCESS',
}

const levelBorderColor = {
    [ToastLevel.ERROR]: 'border-rose-600',
    [ToastLevel.WARN]: 'border-amber-600',
    [ToastLevel.INFO]: 'border-indigo-600',
    [ToastLevel.SUCCESS]: 'border-teal-600',
};
const levelTextColor = {
    [ToastLevel.ERROR]: 'text-rose-400',
    [ToastLevel.WARN]: 'text-amber-400',
    [ToastLevel.INFO]: 'text-indigo-400',
    [ToastLevel.SUCCESS]: 'text-teal-400',
};
const levelBgColor = {
    [ToastLevel.ERROR]: 'hover:bg-rose-600/[.1]',
    [ToastLevel.WARN]: 'hover:bg-amber-600/[.1]',
    [ToastLevel.INFO]: 'hover:bg-indigo-600/[.1]',
    [ToastLevel.SUCCESS]: 'hover:bg-teal-600/[.1]',
};

export const popToast = ({
    level,
    duration = 4000,
    body,
}: {
    level: ToastLevel;
    duration?: number;
    body: ReactElement | string | number;
}) =>
    toast(
        (t) => (
            <span
                className={clsx(
                    'bg-red max-w-screen flex w-max max-w-prose rounded-md border bg-black text-xs text-white shadow-md transition-transform hover:scale-105 sm:text-base',
                    levelBorderColor[level]
                )}
            >
                <h1
                    className={clsx(
                        'bolder mx-4 my-auto font-bold md:mx-6',
                        levelTextColor[level]
                    )}
                >
                    {level}
                </h1>
                <p className="py-3 md:py-4">{body}</p>
                <div
                    className={clsx(
                        'ml-4 border-r md:ml-6',
                        levelBorderColor[level]
                    )}
                ></div>
                <button
                    className={clsx(
                        'h-full py-2 px-4 text-sm transition-colors hover:bg-white/[.05] md:px-6',
                        levelBgColor[level]
                    )}
                    onClick={() => toast.dismiss(t.id)}
                >
                    OK
                </button>
            </span>
        ),
        {
            duration: !duration ? undefined : duration,
            style: {
                background: 'transparent',
                padding: 0,
                margin: '0 auto',
                opacity: '1',
            },
            className: 'toast',
        }
    );
