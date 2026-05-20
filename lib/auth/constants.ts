// Client-safe constants — NO server/DB imports here

export const DEMO_PASSWORD = "demo1234";

export const DEMO_USERS: Record<string, { name: string; role: string }> = {
  "student@oak.local":    { name: "Oak Demo Student",     role: "student" },
  "instructor@oak.local": { name: "สมใจ Demo Instructor", role: "instructor" },
  "admin@oak.local":      { name: "Admin Demo",           role: "admin" },
  "manager@oak.local":    { name: "HR Manager Demo",      role: "manager" },
};

export const ROLE_HOME: Record<string, string> = {
  student:     "/dashboard/student",
  instructor:  "/dashboard/instructor",
  admin:       "/dashboard/admin",
  super_admin: "/dashboard/admin",
  manager:     "/dashboard/admin/reports",
};
