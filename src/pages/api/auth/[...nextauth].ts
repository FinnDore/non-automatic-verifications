import NextAuth, { type NextAuthOptions } from 'next-auth';
import KeycloakProvider from 'next-auth/providers/keycloak';

// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { Account } from '@prisma/client';
import { Adapter } from 'next-auth/adapters.js';
import { env } from '../../../env/server.mjs';
import { prisma } from '../../../server/db/client';

type KeyCloakAccount = Account & {
    'not-before-policy': number;
};

const apdater: Adapter = {
    ...PrismaAdapter(prisma),
    async linkAccount(account) {
        const {
            provider,
            providerAccountId,
            type,
            userId,
            access_token,
            refresh_token,
            expires_at,
            id_token,
            scope,
            session_state,
            token_type,
            ...rest
        } = account as KeyCloakAccount;

        await prisma.account.create({
            data: {
                provider,
                providerAccountId,
                type,
                userId,
                not_before_policy: rest['not-before-policy'],
                access_token,
                refresh_token,
                expires_at,
                id_token,
                scope,
                session_state,
                token_type,
            },
        });
    },
};

export const authOptions: NextAuthOptions = {
    // Include user.id on session
    callbacks: {
        session({ session, user }) {
            if (session.user) {
                session.user.id = user.id;
            }
            return session;
        },
    },
    // Configure one or more authentication providers
    adapter: apdater,
    providers: [
        KeycloakProvider({
            clientId: env.KEYCLOAK_ID,
            clientSecret: env.KEYCLOAK_SECRET,
            issuer: env.KEYCLOAK_ISSUER,
        }),
        // ...add more providers here
    ],
};

export default NextAuth(authOptions);
