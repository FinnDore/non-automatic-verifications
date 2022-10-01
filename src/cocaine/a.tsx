import clsx from 'clsx';
import { forwardRef, HTMLProps } from 'react';

// eslint-disable-next-line react/display-name
export const A = forwardRef<HTMLAnchorElement, HTMLProps<HTMLAnchorElement>>(
    (props, forwardedRef) => (
        <a
            {...props}
            className={clsx(
                'cursor-pointer select-none rounded-md px-4 py-2 transition-colors hover:bg-black/[.05] dark:hover:bg-white/[.05]',
                props.className
            )}
            ref={forwardedRef}
        >
            {props.children}
        </a>
    )
);
