// src/server/router/index.ts

import { SessionRouter } from './session';
import { t } from './t';
import { VerificationRouter } from './verificaiton';

export const appRouter = t.router({
    session: SessionRouter,
    verification: VerificationRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
