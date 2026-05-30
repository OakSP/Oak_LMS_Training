import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import type { Role } from "@prisma/client";
import { DEMO_USERS, DEMO_PASSWORD, ROLE_HOME } from "@/lib/auth/constants";

export { DEMO_USERS, DEMO_PASSWORD, ROLE_HOME };

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const hasDatabase = Boolean(process.env.DATABASE_URL);
const hasGoogle = Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET);

// In-memory rate limiter — keyed by email (resets on server restart; use Redis in prod)
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

const loginAttempts = new Map<string, { count: number; lockUntil: number }>();

function checkRateLimit(email: string): { allowed: boolean; minutesLeft: number } {
  const now = Date.now();
  const entry = loginAttempts.get(email);

  if (!entry) return { allowed: true, minutesLeft: 0 };
  if (entry.lockUntil > now) {
    const minutesLeft = Math.ceil((entry.lockUntil - now) / 60000);
    return { allowed: false, minutesLeft };
  }
  // Lock expired — reset
  if (entry.count >= RATE_LIMIT_MAX && entry.lockUntil <= now) {
    loginAttempts.delete(email);
    return { allowed: true, minutesLeft: 0 };
  }
  return { allowed: true, minutesLeft: 0 };
}

function recordFailedAttempt(email: string): void {
  const now = Date.now();
  const entry = loginAttempts.get(email) ?? { count: 0, lockUntil: 0 };
  const newCount = entry.count + 1;
  loginAttempts.set(email, {
    count: newCount,
    lockUntil: newCount >= RATE_LIMIT_MAX ? now + RATE_LIMIT_WINDOW_MS : 0,
  });
}

function clearAttempts(email: string): void {
  loginAttempts.delete(email);
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: hasDatabase ? PrismaAdapter(prisma) : undefined,
  providers: [
    ...(hasGoogle
      ? [
          Google({
            clientId: process.env.AUTH_GOOGLE_ID!,
            clientSecret: process.env.AUTH_GOOGLE_SECRET!,
          }),
        ]
      : []),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        // Rate limiting check
        const { allowed, minutesLeft } = checkRateLimit(email);
        if (!allowed) {
          // Return null — NextAuth will surface as "CredentialsSignin" error
          // The minutesLeft info is available on the client via the error message
          void minutesLeft; // used for future: pass via custom error
          return null;
        }

        if (!hasDatabase) {
          // 1. Check hardcoded demo accounts (always use DEMO_PASSWORD)
          const demo = DEMO_USERS[email];
          if (demo) {
            if (password !== DEMO_PASSWORD) {
              recordFailedAttempt(email);
              return null;
            }
            clearAttempts(email);
            return { id: `demo-${email}`, email, name: demo.name, role: demo.role };
          }

          // 2. Check in-memory registered demo users (real password hash)
          const { getDemoUser } = await import("@/lib/auth/demo-store");
          const registered = getDemoUser(email);
          if (!registered) {
            recordFailedAttempt(email);
            return null;
          }

          const valid = await bcrypt.compare(password, registered.passwordHash);
          if (!valid) {
            recordFailedAttempt(email);
            return null;
          }

          clearAttempts(email);
          return { id: registered.id, email: registered.email, name: registered.name, role: registered.role };
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.passwordHash) {
          recordFailedAttempt(email);
          return null;
        }

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) {
          recordFailedAttempt(email);
          return null;
        }

        clearAttempts(email);
        return { id: user.id, email: user.email, name: user.name, role: user.role };
      },
    }),
  ],
  session: { strategy: "jwt", maxAge: 7 * 24 * 60 * 60 }, // 7-day refresh window
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: Role }).role ?? "student";
        token.accessExpires = Math.floor(Date.now() / 1000) + 15 * 60;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as { role?: Role }).role = token.role as Role;
      }
      return session;
    },
    // Redirect to role-specific dashboard after OAuth login
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
});
