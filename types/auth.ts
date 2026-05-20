export type Role = "super_admin" | "admin" | "instructor" | "student" | "manager";

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatarUrl?: string | null;
  createdAt: Date;
}
