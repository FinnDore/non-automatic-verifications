import clsx from 'clsx';
import { forwardRef, HTMLProps } from 'react';

// eslint-disable-next-line react/display-name
export const Box = forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement>>(
    (props, forwardedRef) => (
        <div
            onClick={props.onClick}
            className={clsx(
                'border-black/7 rounded-md border border-black/40  px-4 py-2 transition-colors dark:border-white/40 dark:bg-black',
                props.className
            )}
            ref={forwardedRef}
        >
            {props.children}
        </div>
    )
);
