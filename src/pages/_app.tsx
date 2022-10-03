// src/pages/_app.tsx
import { httpBatchLink } from '@trpc/client/links/httpBatchLink';
import { loggerLink } from '@trpc/client/links/loggerLink';
import { withTRPC } from '@trpc/next';
import type { Session } from 'next-auth';
import { SessionProvider, signIn, useSession } from 'next-auth/react';
import type { AppType } from 'next/app';
import Link from 'next/link';
import { Toaster } from 'react-hot-toast';
import superjson from 'superjson';
import { Button } from '../cocaine/button';
import type { AppRouter } from '../server/router';
import '../styles/globals.css';

const Nav = () => {
    const { data } = useSession();

    return (
        <div className="z-50 mb-6 flex w-full">
            <Link href={'/'}>
                <div className="my-auto mr-12 cursor-pointer text-2xl font-bold text-rose-600">
                    NAV
                </div>
            </Link>

            <div className="my-auto mr-auto flex">
                <Link href={'/start-session'}>
                    <Button className="mr-6 border-none dark:bg-transparent">
                        Start Session
                    </Button>
                </Link>
                <Link href={'/'}>
                    <Button className="border-none dark:bg-transparent">
                        Stats
                    </Button>
                </Link>
            </div>

            {!data?.user && (
                <button className="my-auto" onClick={() => signIn('keycloak')}>
                    Login
                </button>
            )}
            {data?.user && <div className="my-auto">{data.user.name}</div>}
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
                <div className="relative h-screen w-screen">
                    <div className="noise absolute min-h-screen backdrop-invert dark:backdrop-filter-none"></div>
                    <div className="absolute z-50 flex h-full w-full flex-col overflow-visible px-8 py-6 pb-12 md:px-16 ">
                        <Nav />
                        <Component {...pageProps} />
                    </div>
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
