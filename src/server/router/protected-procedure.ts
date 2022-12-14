import { TRPCError } from '@trpc/server';
import { t } from './t';

const middleware = t.middleware(({ ctx, next }) => {
    if (!ctx.session || !ctx.session.user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    return next({
        ctx: {
            ...ctx,
            // infers that `session` is non-nullable to downstream resolvers
            session: { ...ctx.session, user: ctx.session.user },
        },
    });
});

export const authedProcedure = t.procedure.use(middleware);
