import { AuditAction, Prisma, VrnStatus } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { random } from 'lodash-es';
import { z } from 'zod';
import { auditEvent } from '../../utils/audit-event';
import { authedProcedure } from './protected-procedure';
import { t } from './t';

const getRandom = <T>(list: T[]): T => list[random(0, list.length - 1)] as T;
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'.split('');
const countries = [
    'GB',
    'FR',
    'DE',
    'IT',
    'ES',
    'NL',
    'BE',
    'PT',
    'IE',
    'LU',
    'AT',
    'CY',
    'MT',
    'EE',
    'LV',
];
const carType = ['car', 'van', 'motorbike', 'suv', 'jeep wrangler (real)'];
const direction = ['in', 'out', 'north 🤮🤢🚫👎'];

const getVrn = () =>
    Array.from({ length: 7 })
        .map(() => getRandom(alphabet))
        .join('');

const StatusToActionMap = {
    [VrnStatus.ACCEPTED]: AuditAction.VERIFICATION_ACCEPTED,
    [VrnStatus.REJECTED]: AuditAction.VERIFICATION_REJECTED,
    [VrnStatus.CORRECTED]: AuditAction.VERIFICATION_CORRECTED,
};

export const VerificationStatus = z.nativeEnum({
    [VrnStatus.ACCEPTED]: VrnStatus.ACCEPTED,
    [VrnStatus.REJECTED]: VrnStatus.REJECTED,
    [VrnStatus.CORRECTED]: VrnStatus.CORRECTED,
});

export const VerificationRouter = t.router({
    createRandomVerifications: authedProcedure
        .input(
            z.object({
                number: z.number().min(1).max(500),
            })
        )
        .mutation(async ({ ctx, input }) => {
            await ctx.prisma.verification.createMany({
                data: Array.from({ length: input.number }).map(() => ({
                    vrn: getVrn(),
                    metadata: {
                        nationality: getRandom(countries),
                        carType: getRandom(carType),
                        direction: getRandom(direction),
                    } as Prisma.InputJsonObject,
                })),
            });
            auditEvent(AuditAction.VERIFICATION_CREATED, ctx.prisma);
        }),
    submitVerification: authedProcedure
        .input(
            z.object({
                verificationId: z.string(),
                status: VerificationStatus,
                vrn: z.string().min(1).max(7),
                sessionId: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const [verification] = await ctx.prisma.$transaction([
                ctx.prisma.user.update({
                    select: {
                        verificationSession: {
                            select: {
                                userId: true,
                            },
                        },
                    },
                    where: {
                        id: ctx.session.user.id,
                    },
                    data: {
                        verificationSession: {
                            update: {
                                where: {
                                    id: input.sessionId,
                                },
                                data: {
                                    Verification: {
                                        update: {
                                            where: {
                                                id: input.verificationId,
                                            },
                                            data: {
                                                status: input.status,
                                                vrn: input.vrn,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                }),
                ctx.prisma.verificationSession.update({
                    where: {
                        id: input.sessionId,
                    },
                    data: {
                        verificationCursor: {
                            increment: 1,
                        },
                    },
                }),
            ]);

            if (!verification.verificationSession.length) {
                throw new TRPCError({
                    message: 'Verification not found',
                    code: 'BAD_REQUEST',
                });
            } else {
                // audit event
                auditEvent(StatusToActionMap[input.status], ctx.prisma);
            }
        }),
});
