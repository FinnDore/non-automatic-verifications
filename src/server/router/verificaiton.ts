import { Prisma, VrnStatus } from '@prisma/client';
import { random } from 'lodash-es';
import { z } from 'zod';
import { authedProcedure } from './protected-procedure';
import { t } from './t';

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
const getRandom = <T>(list: T[]): T => list[random(0, list.length - 1)] as T;

const getVrn = () =>
    Array.from({ length: 7 })
        .map(() => getRandom(alphabet))
        .join('');

export const VerificationStatus = z.nativeEnum(VrnStatus);

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
        }),
    submitVerification: authedProcedure
        .input(
            z.object({
                verificationId: z.string(),
                status: VerificationStatus,
                sessionId: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const verification = await ctx.prisma.user.update({
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
                                    updateMany: {
                                        where: {
                                            id: input.verificationId,
                                        },
                                        data: {
                                            status: input.status,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            });

            if (!verification.verificationSession.length) {
                throw new Error('Verification not found');
            }
        }),
});
