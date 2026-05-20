import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const DEMO_PASSWORD = "demo1234";

const DEMO_USERS = [
  {
    id: "demo-student",
    email: "student@oak.local",
    name: "Oak Demo Student",
    role: "student" as const,
  },
  {
    id: "demo-instructor",
    email: "instructor@oak.local",
    name: "สมใจ Demo Instructor",
    role: "instructor" as const,
  },
  {
    id: "demo-admin",
    email: "admin@oak.local",
    name: "Admin Demo",
    role: "admin" as const,
  },
  {
    id: "demo-manager",
    email: "manager@oak.local",
    name: "HR Manager Demo",
    role: "manager" as const,
  },
];

async function main() {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 12);

  for (const user of DEMO_USERS) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: { name: user.name, role: user.role, passwordHash },
      create: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        passwordHash,
      },
    });
    console.log(`✅ Seeded: ${user.role.padEnd(12)} — ${user.email}`);
  }

  console.log("\n🌱 Seed complete. All demo users ready.");
  console.log(`   Password for all accounts: ${DEMO_PASSWORD}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
