import { requireRole } from "@/lib/auth/helpers";
import { TableSkeleton } from "@/components/shared/loading-skeleton";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

async function fetchUsers(): Promise<User[]> {
  const hasDatabase = Boolean(process.env.DATABASE_URL) && !process.env.DATABASE_URL?.includes("placeholder");
  if (!hasDatabase) {
    return [
      { id: "1", name: "Oak Demo Student", email: "student@oak.local", role: "student", createdAt: new Date().toISOString() },
      { id: "2", name: "Demo Instructor", email: "instructor@oak.local", role: "instructor", createdAt: new Date().toISOString() },
      { id: "3", name: "Admin User", email: "admin@oak.local", role: "admin", createdAt: new Date().toISOString() },
    ];
  }

  const { prisma } = await import("@/lib/db/prisma");
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, createdAt: true },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  return users.map((u: { id: string; name: string; email: string; role: string; createdAt: Date }) => ({ ...u, createdAt: u.createdAt.toISOString() }));
}

const ROLE_STYLES: Record<string, string> = {
  super_admin: "bg-red-100 text-red-700",
  admin: "bg-purple-100 text-purple-700",
  instructor: "bg-blue-100 text-blue-700",
  student: "bg-[color:var(--color-success)]/10 text-[color:var(--color-success)]",
  manager: "bg-orange-100 text-orange-700",
};

export default async function AdminUsersPage() {
  await requireRole(["admin", "super_admin"]);
  const users = await fetchUsers();

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[color:var(--color-ink)]">User Management</h1>
          <p className="text-sm text-[color:var(--color-muted)] mt-1">{users.length} total users</p>
        </div>
      </div>

      {!Boolean(process.env.DATABASE_URL) && !process.env.DATABASE_URL?.includes("placeholder") && (
        <div className="mb-6 rounded-xl border border-[color:var(--color-accent)]/30 bg-[color:var(--color-accent)]/5 p-4 text-sm text-[color:var(--color-accent)]">
          Demo mode — showing mock users. Connect Neon DB for real data.
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-[color:var(--color-line)]">
        <table className="w-full text-sm">
          <thead className="bg-[color:var(--color-line-2)]">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[color:var(--color-muted)] uppercase tracking-wide">User</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[color:var(--color-muted)] uppercase tracking-wide">Role</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-[color:var(--color-muted)] uppercase tracking-wide">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[color:var(--color-line)] bg-[color:var(--color-card)]">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-[color:var(--color-line-2)]/50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-[color:var(--color-primary)] flex items-center justify-center text-xs font-bold text-white shrink-0">
                      {user.name[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-[color:var(--color-ink)]">{user.name}</p>
                      <p className="text-xs text-[color:var(--color-muted)]">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${ROLE_STYLES[user.role] ?? "bg-gray-100 text-gray-600"}`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-right text-[color:var(--color-muted)] text-xs">
                  {new Date(user.createdAt).toLocaleDateString("th-TH")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export { TableSkeleton };
