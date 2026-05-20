import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import type { Role } from "@prisma/client";

export async function getCurrentUser() {
  const session = await auth();
  return session?.user ?? null;
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireRole(roles: Role[]) {
  const user = await requireUser();
  if (!roles.includes(user.role)) redirect("/dashboard/student");
  return user;
}

// API-level guards — return a 401/403 NextResponse instead of redirecting

export async function apiRequireAuth() {
  const session = await auth();
  if (!session?.user) {
    return { user: null, error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { user: session.user, error: null };
}

export async function apiRequireRole(roles: Role[]) {
  const { user, error } = await apiRequireAuth();
  if (error || !user) return { user: null, error: error ?? NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  if (!roles.includes(user.role as Role)) {
    return { user: null, error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { user, error: null };
}
