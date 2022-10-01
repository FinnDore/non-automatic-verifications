import { z } from 'zod';
import { authedProcedure } from './protected-procedure';
import { t } from './t';

export const protectedExampleRouter = t.router({
    getSession: authedProcedure
        .input(
            z.object({
                name: z.string(),
            })
        )
        .query(({ ctx, input }) => ctx.session),
});
