import clsx from 'clsx';
import { forwardRef, HTMLProps } from 'react';

// eslint-disable-next-line react/display-name
export const Skeleton = forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement>>(
    (props, forwardedRef) => (
        <div
            {...props}
            className={clsx(
                'animate-pulse bg-bg-dark/10 dark:bg-bg/10',
                props.className
            )}
            ref={forwardedRef}
        ></div>
    )
);
