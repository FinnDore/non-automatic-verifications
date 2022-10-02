import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { authedProcedure } from './protected-procedure';
import { t } from './t';

const findVerifications = async (
    verificationId: string,
    prisma: PrismaClient
) =>
    await prisma.verification.findMany({
        where: {
            verificationSessionId: verificationId,
        },
    });

export const SessionRouter = t.router({
    start: authedProcedure
        .input(
            z.object({
                limit: z.number().min(1).max(100),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const userId = ctx.session.user.id;

            const session = await ctx.prisma.verificationSession.create({
                data: {
                    userId: userId,
                },
            });

            await ctx.prisma
                .$executeRaw`UPDATE Verification SET verificationSessionId = ${session.id} WHERE verificationSessionId IS NULL LIMIT ${input.limit}`;

            const verifications = await findVerifications(
                session.id,
                ctx.prisma
            );

            return {
                sessionId: session.id,
                verifications: verifications,
            };
        }),
    getSession: authedProcedure
        .input(
            z.object({
                sessionId: z.string(),
            })
        )
        .query(async ({ ctx, input }) => {
            const session = await ctx.prisma.verificationSession.findFirst({
                where: { id: input.sessionId, userId: ctx.session.user.id },
            });

            if (!session) {
                throw new Error('Session not found');
            }
            const verifications = await findVerifications(
                input.sessionId,
                ctx.prisma
            );

            return {
                sessionId: session.id,
                verifications,
            };
        }),
    getSessions: authedProcedure.query(async ({ ctx }) => {
        const sessions = await ctx.prisma.verificationSession.findMany({
            where: { userId: ctx.session.user.id },
            select: {
                startedAt: true,
                id: true,
                _count: {
                    select: {
                        Verification: true,
                    },
                },
            },
        });

        return sessions;
    }),
});
