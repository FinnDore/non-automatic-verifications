import { AuditAction, PrismaClient } from '@prisma/client';
const roundToNearestMinute = (date = new Date()) => {
    const minutes = 1;
    const ms = 1000 * 60 * minutes;

    // 👇️ replace Math.round with Math.ceil to always round UP
    return new Date(Math.ceil(date.getTime() / ms) * ms);
};

export const auditEvent = (action: AuditAction, prisma: PrismaClient) => {
    const timestamp = roundToNearestMinute();

    prisma.auditEvent
        .upsert({
            where: {
                timestamp_action: {
                    action,
                    timestamp,
                },
            },
            update: {
                count: {
                    increment: 1,
                },
            },
            create: {
                timestamp,
                action,
            },
        })
        .catch((err) =>
            console.error(
                `Couldn't create audit event ${action} ${err.message}`
            )
        );
};
