import clsx from 'clsx';
import { forwardRef, HTMLProps } from 'react';

// eslint-disable-next-line react/display-name
export const Button = forwardRef<
    HTMLButtonElement,
    HTMLProps<HTMLButtonElement>
>((props, forwardedRef) => (
    <button
        onClick={props.onClick}
        className={clsx(
            'border-black/7 cursor-pointer select-none rounded-md border px-4 py-2 transition-colors hover:bg-black/[.05] dark:bg-black hover:dark:border-white dark:hover:bg-white/[.05]',
            props.className
        )}
        ref={forwardedRef}
    >
        {props.children}
    </button>
));
