// src/pages/_app.tsx
import { httpBatchLink } from '@trpc/client/links/httpBatchLink';
import { loggerLink } from '@trpc/client/links/loggerLink';
import { withTRPC } from '@trpc/next';
import type { Session } from 'next-auth';
import { SessionProvider, signIn, useSession } from 'next-auth/react';
import type { AppType } from 'next/app';
import { Toaster } from 'react-hot-toast';
import superjson from 'superjson';
import type { AppRouter } from '../server/router';
import '../styles/globals.css';

const Nav = () => {
    const { data } = useSession();

    return (
        <div className="mb-6 flex w-full">
            <div className="mr-auto text-xl font-bold">NAV</div>
            {!data?.user && (
                <button className="" onClick={() => signIn('keycloak')}>
                    Login
                </button>
            )}
            {data?.user && (
                <div className="text-rose-600">{data.user.name}</div>
            )}
        </div>
    );
};

const MyApp: AppType<{ session: Session | null }> = ({
    Component,
    pageProps: { session, ...pageProps },
}) => {
    return (
        <>
            <Toaster position="bottom-center" />
            <SessionProvider session={session}>
                <div className="relative z-[1] flex h-screen w-screen flex-col overflow-visible bg-white px-8 py-6 pb-12 text-black dark:bg-black dark:text-white md:px-16">
                    <div className="noise absolute min-h-screen"></div>
                    <Nav />
                    <Component {...pageProps} />
                </div>
            </SessionProvider>
        </>
    );
};

const getBaseUrl = () => {
    if (typeof window !== 'undefined') return ''; // browser should use relative url
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
    return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

export default withTRPC<AppRouter>({
    config() {
        const url = `${getBaseUrl()}/api/trpc`;

        return {
            links: [
                loggerLink({
                    enabled: (opts) =>
                        process.env.NODE_ENV === 'development' ||
                        (opts.direction === 'down' &&
                            opts.result instanceof Error),
                }),
                httpBatchLink({ url }),
            ],
            url,
            transformer: superjson,
        };
    },
    ssr: false,
})(MyApp);
