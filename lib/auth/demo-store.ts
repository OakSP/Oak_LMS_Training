/**
 * In-memory store for users registered in demo mode (no DATABASE_URL).
 * Module-level — persists across requests until server restart.
 * Acceptable for demo/dev use only.
 */

export interface DemoRegisteredUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: string;
}

const store = new Map<string, DemoRegisteredUser>();

export function setDemoUser(user: DemoRegisteredUser): void {
  store.set(user.email.toLowerCase(), user);
}

export function getDemoUser(email: string): DemoRegisteredUser | undefined {
  return store.get(email.toLowerCase());
}

export function hasDemoUser(email: string): boolean {
  return store.has(email.toLowerCase());
}
