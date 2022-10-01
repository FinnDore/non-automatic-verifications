// src/server/router/index.ts

import { protectedExampleRouter } from './protected-router';
import { t } from './t';

export const appRouter = t.router({
    auth: protectedExampleRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
