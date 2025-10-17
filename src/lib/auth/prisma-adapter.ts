import { Adapter } from "next-auth/adapters";
import {prisma} from "@/lib/prisma";
import type { AdapterAccount, AdapterUser } from "next-auth/adapters";
import {cookies} from "next/headers";

export function PrismaAdapter(): Adapter {
    return {
        async createUser(user: AdapterUser) {

            const cookieStore = await cookies();
            const userIdOnCookies = cookieStore.get("@ignite-call:userId")?.value;

            if (!userIdOnCookies){
                throw new Error("Cookie header not found");
            }

            // Depois podes usar os cookies para lógica extra
            const prismaUser = await prisma.user.update({
                where: {
                    id: userIdOnCookies,
                },
                data: {
                    name: user.name ?? "",
                    username: user.email?.split("@")[0] ?? "anon",
                    email: user.email ?? null,
                    avatar_url: user.image ?? null,
                },
            });

            cookieStore.delete("@ignite-call:userId");

            return {
                id: prismaUser.id,
                name: prismaUser.name,
                username: prismaUser.username,
                email: prismaUser.email!,
                emailVerified: null,
                avatar_url: prismaUser.avatar_url!,
            };
        },

        /* Retorna um utilizador pelo ID */
        async getUser(id) {
            const user = await prisma.user.findUnique({
                where: { id },
            });

            if (!user){
                return null;
            }

            return {
                id: user.id,
                name: user.name,
                username: user.username,
                email: user.email!,
                emailVerified: null,
                avatar_url: user.avatar_url!,
            }
        },

        /* Retorna um utilizador pelo e-mail */
        async getUserByEmail(email) {
            const user = await prisma.user.findUnique({
                where: { email },
            });

            if (!user){
                return null;
            }

            return {
                id: user.id,
                name: user.name,
                username: user.username,
                email: user.email!,
                emailVerified: null,
                avatar_url: user.avatar_url!,
            }
        },

        /* Retorna um utilizador associado a uma conta externa */
        async getUserByAccount({ providerAccountId, provider }) {
            const account = await prisma.account.findUnique({
                where: {
                    provider_provider_account_id: {
                        provider,
                        provider_account_id: providerAccountId,
                    },
                },
                include:{
                    user: true,
                },
            });

            if (!account){
                return null;
            }

            const { user } = account

            return {
                id: user.id,
                name: user.name,
                username: user.username,
                email: user.email!,
                emailVerified: null,
                avatar_url: user.avatar_url!,
            }
        },

        /* Atualiza informações do utilizador */
        async updateUser(user) {
           const prismaUser = await prisma.user.update({
                where: {
                    id: user.id,
                },
                data: {
                    name: user.name,
                    email: user.email,
                    avatar_url: user.avatar_url,
                },
            })

            return {
                id: prismaUser.id,
                name: prismaUser.name,
                username: prismaUser.username,
                email: prismaUser.email!,
                emailVerified: null,
                avatar_url: prismaUser.avatar_url!,
            }
        },

        /* Associa uma conta OAuth a um utilizador existente */
        async linkAccount(account: AdapterAccount) {
            await prisma.account.create({
                data: {
                    user_id: account.userId ?? '',
                    type: account.type,
                    provider: account.provider,
                    provider_account_id: String(account.providerAccountId ?? ""),
                    refresh_token: account.refresh_token,
                    access_token: account.access_token,
                    expires_at: account.expires_at,
                    token_type: account.token_type,
                    scope: account.scope,
                    id_token: account.id_token,
                    session_state: account.session_state,
                },
            })
        },

        /* Cria uma sessão de autenticação */
        async createSession({ sessionToken, userId, expires }) {
            await prisma.session.create({
                data: {
                    user_id: userId,
                    expires: expires,
                    session_token: sessionToken,
                }
            })

            return {
                 userId,
                 expires,
                 sessionToken,
            }
        },

        /* Retorna sessão e utilizador associados a um token */
        async getSessionAndUser(sessionToken) {
            const prismaession = await prisma.session.findUnique({
                where: {
                    session_token: sessionToken,
                },
                include: {
                    user: true,
                },
            });

            if (!prismaession){
                return null;
            }

            const { user, ...session } = prismaession

            return {
                session: {
                    userId: session.user_id,
                    expires: session.expires,
                    sessionToken: session.session_token,
                },
                user: {
                    id: user.id,
                    name: user.name,
                    username: user.username,
                    email: user.email!,
                    emailVerified: null,
                    avatar_url: user.avatar_url!,
                },
            }
        },

        /* Remove uma sessão específica */
        async deleteSession(sessionToken) {
            await prisma.session.delete({
                where:{
                    session_token: sessionToken,
                }
            })
        },

    }
}
