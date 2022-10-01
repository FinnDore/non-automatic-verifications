// src/utils/trpc.ts
import { createTRPCNext } from '@trpc/next';
import { httpBatchLink, loggerLink } from '@trpc/react';
import { inferProcedureInput, inferProcedureOutput } from '@trpc/server';
import { NextPageContext } from 'next';
import superjson from 'superjson';
import type { AppRouter } from '../server/router';

/**
 * These are helper types to infer the input and output of query resolvers
 * @example type HelloOutput = inferQueryOutput<'hello'>
 */
export type inferQueryOutput<
    TRouteKey extends keyof AppRouter['_def']['queries']
> = inferProcedureOutput<AppRouter['_def']['queries'][TRouteKey]>;

export type inferQueryInput<
    TRouteKey extends keyof AppRouter['_def']['queries']
> = inferProcedureInput<AppRouter['_def']['queries'][TRouteKey]>;

export type inferMutationOutput<
    TRouteKey extends keyof AppRouter['_def']['mutations']
> = inferProcedureOutput<AppRouter['_def']['mutations'][TRouteKey]>;

export type inferMutationInput<
    TRouteKey extends keyof AppRouter['_def']['mutations']
> = inferProcedureInput<AppRouter['_def']['mutations'][TRouteKey]>;

const getBaseUrl = () => {
    if (typeof window !== 'undefined') return ''; // browser should use relative url
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
    return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

/**
 * Extend `NextPageContext` with meta data that can be picked up by `responseMeta()` when server-side rendering
 */
export interface SSRContext extends NextPageContext {
    /**
     * Set HTTP Status code
     * @example
     * const utils = trpc.useContext();
     * if (utils.ssrContext) {
     *   utils.ssrContext.status = 404;
     * }
     */
    status?: number;
}

export const trpc = createTRPCNext<AppRouter, SSRContext>({
    config({ ctx }) {
        return {
            transformer: superjson,

            links: [
                // adds pretty logs to your console in development and logs errors in production
                loggerLink({
                    enabled: (opts) =>
                        process.env.NODE_ENV === 'development' ||
                        (opts.direction === 'down' &&
                            opts.result instanceof Error),
                }),
                httpBatchLink({
                    url: `${getBaseUrl()}/api/trpc`,
                    /**
                     * Set custom request headers on every request from tRPC
                     * @link https://trpc.io/docs/ssr
                     */
                    headers() {
                        if (ctx?.req) {
                            const {
                                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                connection: _connection,
                                ...headers
                            } = ctx.req.headers;
                            return {
                                ...headers,

                                'x-ssr': '1',
                            };
                        }
                        return {};
                    },
                }),
            ],
        };
    },

    ssr: true,
    responseMeta(opts) {
        const ctx = opts.ctx as SSRContext;

        if (ctx.status) {
            // If HTTP status set, propagate that
            return {
                status: ctx.status,
            };
        }

        const error = opts.clientErrors[0];
        if (error) {
            // Propagate http first error from API calls
            return {
                status: error.data?.httpStatus ?? 500,
            };
        }

        // for app caching with SSR see https://trpc.io/docs/caching

        return {};
    },
});
