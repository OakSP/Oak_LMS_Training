# Oak LMS — ระบบจัดการการเรียนรู้ออนไลน์

ระบบ LMS (Learning Management System) สำหรับคอร์สสอนภาษา (ภาษาอังกฤษ / จีน / ญี่ปุ่น)  
พัฒนาด้วย Next.js 16 App Router พร้อม demo mode ที่รันได้ทันทีโดยไม่ต้องมี credentials

---

## ฟีเจอร์หลัก

| หมวด | รายละเอียด |
|------|-----------|
| **Auth** | สมัครสมาชิก / เข้าสู่ระบบ / ลืมรหัสผ่าน (NextAuth v5) |
| **คอร์ส** | เรียกดู ค้นหา กรอง และซื้อคอร์ส |
| **บทเรียน** | วิดีโอ (Mux) + PDF + ติดตาม progress |
| **แบบทดสอบ** | Quiz มีจับเวลา + แสดงผลคะแนน |
| **ใบประกาศ** | ออกใบประกาศนียบัตรอัตโนมัติเมื่อเรียนจบ |
| **ชำระเงิน** | Stripe Checkout + ดูประวัติการชำระ |
| **Dashboard** | นักเรียน / ผู้สอน / Admin แยกสิทธิ์ชัดเจน |
| **Dark mode** | สลับธีม Light / Dark |
| **Bilingual** | ภาษาไทย / English ในหน้า UI |

---

## เทคโนโลยีที่ใช้

- **Next.js 16.2** — App Router + Turbopack
- **React 19** + TypeScript (strict)
- **Tailwind CSS v4** — config ผ่าน `@theme` ใน CSS
- **NextAuth.js v5** — authentication + RBAC (student / instructor / admin)
- **Prisma 7** + **Neon PostgreSQL** — database
- **Stripe** — ชำระเงิน
- **Mux** — hosting วิดีโอ
- **Cloudflare R2** — เก็บไฟล์ / รูปภาพ
- **Resend** — ส่ง email
- **Upstash Redis** — cache / session

---

## เริ่มต้นใช้งาน (Development)

### 1. ติดตั้ง dependencies

```bash
npm install
```

### 2. ตั้งค่า environment variables

```bash
cp .env.example .env.local
```

แก้ไข `.env.local` ใส่ค่าที่ต้องการ (ดูหัวข้อ [Environment Variables](#environment-variables) ด้านล่าง)

> **หมายเหตุ:** ถ้าไม่ใส่ค่าใด ๆ ระบบจะรันในโหมด demo อัตโนมัติ ไม่ crash

### 3. รัน development server

```bash
npm run dev
```

เปิด [http://localhost:3000](http://localhost:3000) ในเบราว์เซอร์

---

## Environment Variables

คัดลอกจาก `.env.example` แล้วใส่ค่าตามนี้

### Database (Neon PostgreSQL)
```env
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...
```
หลังใส่ค่าแล้วรัน: `npx prisma db push`

### Authentication (NextAuth)
```env
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
```

### Stripe (ชำระเงิน)
```env
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
```

### Mux (วิดีโอ)
```env
MUX_TOKEN_ID=...
MUX_TOKEN_SECRET=...
```

### Cloudflare R2 (ไฟล์/รูป)
```env
CLOUDFLARE_R2_ACCOUNT_ID=...
CLOUDFLARE_R2_ACCESS_KEY_ID=...
CLOUDFLARE_R2_SECRET_ACCESS_KEY=...
CLOUDFLARE_R2_BUCKET_NAME=...
```

### Resend (Email)
```env
RESEND_API_KEY=re_...
```

### Upstash Redis (Cache)
```env
UPSTASH_REDIS_URL=https://...
UPSTASH_REDIS_TOKEN=...
```

---

## โครงสร้างโฟลเดอร์

```
lms-platform/
├── app/
│   ├── (auth)/          # หน้า login / register / forgot-password
│   ├── (public)/        # หน้าสาธารณะ (home, courses, certificate)
│   ├── (dashboard)/     # หน้า protected (student, instructor, admin)
│   └── api/             # API routes
├── components/
│   ├── layout/          # Header, Footer, Sidebar
│   ├── course/          # CourseCard, CourseFilters
│   ├── lesson/          # VideoPlayer, PDFViewer, ProgressBar
│   ├── quiz/            # QuizPlayer, QuizTimer, QuizResult
│   ├── certificate/     # CertificateCard, CertificatePreview
│   ├── dashboard/       # StatCard, Charts
│   ├── payment/         # CheckoutButton, PaymentHistory
│   └── shared/          # Icon, Rating, LoadingSkeleton
├── lib/
│   ├── auth/            # NextAuth config + RBAC helpers
│   ├── services/        # stripe, mux, r2, resend, redis
│   ├── validations/     # Zod schemas
│   └── utils/           # certificate generator, formatters
├── mock/                # ข้อมูล mock สำหรับ demo mode
├── prisma/              # Database schema + seed
└── types/               # TypeScript type definitions
```

---

## ระบบสิทธิ์ (RBAC)

| Role | สิทธิ์ |
|------|--------|
| `student` | ดูคอร์ส / เรียน / ทำ quiz / รับใบประกาศ |
| `instructor` | สร้างและจัดการคอร์สของตัวเอง |
| `admin` | จัดการ users และดู reports ทั้งหมด |

---

## คำสั่งที่ใช้บ่อย

```bash
npm run dev          # รัน development server
npm run build        # build สำหรับ production
npm run start        # รัน production server
npm run lint         # ตรวจสอบ code style

npx prisma db push   # sync schema กับ database
npx prisma studio    # เปิด Prisma Studio (GUI database)
npx prisma db seed   # seed ข้อมูลตัวอย่าง
```

---

## Roadmap

- [x] **Phase 1** — MVP: Auth, Courses, Lessons, Quiz, Certificates, Payments, Dashboard
- [ ] **Phase 2** — Analytics, ฟอรัม, Notifications, Subscriptions
- [ ] **Phase 3** — Mobile app, AI recommendations, Multi-tenant

---

## License

MIT — สามารถนำไปใช้หรือดัดแปลงได้
