import { VrnStatus } from '@prisma/client';
import { z } from 'zod';
import { authedProcedure } from './protected-procedure';
import { t } from './t';

export const statsRouter = t.router({
    verificationsCountByType: authedProcedure
        .input(
            z.object({
                status: z.nativeEnum(VrnStatus),
            })
        )
        .query(({ ctx, input }) =>
            ctx.prisma.verification.count({
                where: {
                    status: input.status,
                },
            })
        ),
    completeVerifications: authedProcedure.query(({ ctx }) =>
        ctx.prisma.verification.count({
            where: {
                status: { not: VrnStatus.UNVERIFIED },
            },
        })
    ),
});
