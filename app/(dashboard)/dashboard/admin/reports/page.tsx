import { requireRole } from "@/lib/auth/helpers";
import { StatCard } from "@/components/dashboard/stat-card";
import { RevenueChart } from "@/components/dashboard/revenue-chart";

const MOCK_REVENUE = [
  { month: "Dec", revenue: 0 },
  { month: "Jan", revenue: 12400 },
  { month: "Feb", revenue: 18900 },
  { month: "Mar", revenue: 23100 },
  { month: "Apr", revenue: 19500 },
  { month: "May", revenue: 28700 },
];

const MOCK_STATS = {
  totalUsers: 3,
  totalCourses: 8,
  totalEnrollments: 124,
  totalRevenue: 102600,
  completionRate: 68,
  avgQuizScore: 74.2,
};

export default async function AdminReportsPage() {
  await requireRole(["admin", "super_admin"]);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[color:var(--color-ink)]">Analytics & Reports</h1>
        <p className="text-sm text-[color:var(--color-muted)] mt-1">Platform-wide metrics overview</p>
      </div>

      {!Boolean(process.env.DATABASE_URL) && !process.env.DATABASE_URL?.includes("placeholder") && (
        <div className="mb-6 rounded-xl border border-[color:var(--color-accent)]/30 bg-[color:var(--color-accent)]/5 p-4 text-sm text-[color:var(--color-accent)]">
          Demo mode — showing mock analytics. Connect Neon DB for real data.
        </div>
      )}

      {/* KPI stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatCard title="Total Users" value={MOCK_STATS.totalUsers.toLocaleString()} icon="👥" trend={{ value: 12, label: "vs last month" }} />
        <StatCard title="Total Courses" value={MOCK_STATS.totalCourses} icon="📚" />
        <StatCard title="Enrollments" value={MOCK_STATS.totalEnrollments.toLocaleString()} icon="🎓" trend={{ value: 8, label: "vs last month" }} />
        <StatCard title="Total Revenue" value={`฿${MOCK_STATS.totalRevenue.toLocaleString()}`} icon="💰" accent />
        <StatCard title="Completion Rate" value={`${MOCK_STATS.completionRate}%`} icon="✅" sub="Target ≥ 70%" />
        <StatCard title="Avg Quiz Score" value={`${MOCK_STATS.avgQuizScore}%`} icon="📊" sub="Target ≥ 60%" />
      </div>

      {/* Revenue chart */}
      <RevenueChart data={MOCK_REVENUE} title="Monthly Revenue (THB)" />

      {/* Export */}
      <div className="mt-6 flex justify-end">
        <button
          className="rounded-xl border border-[color:var(--color-line)] px-5 py-2.5 text-sm font-medium text-[color:var(--color-ink)] hover:bg-[color:var(--color-line-2)] transition-colors"
          onClick={() => alert("Export CSV — connect Neon DB and Resend to enable this feature.")}
        >
          Export CSV
        </button>
      </div>
    </div>
  );
}
