import { AuditAction, VrnStatus } from '@prisma/client';
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

    getTimelineData:
        // get timeline data for the last 30 days for verification audits
        authedProcedure
            .input(
                z.object({
                    action: z.nativeEnum(AuditAction),
                })
            )
            .query(async ({ ctx, input }) => {
                return await ctx.prisma.auditEvent.findMany({
                    where: {
                        action: input.action,
                    },
                    select: {
                        count: true,
                        timestamp: true,
                    },
                    orderBy: {
                        timestamp: 'asc',
                    },
                });
            }),
});

// createdAt: {
//     gte: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000),
// },#

// where: {
//     action: {
//         in: [
//             'VERIFICATION_ACCEPTED',
//             'VERIFICATION_REJECTED',
//             'VERIFICATION_CORRECTED',
//         ],
//     },

// },
// groupBy: { dateCol: { 'year': 1 }
