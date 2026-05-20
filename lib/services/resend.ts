// Resend email — install `resend` package and set RESEND_API_KEY to enable
/* eslint-disable @typescript-eslint/no-explicit-any */

const hasResend = Boolean(process.env.RESEND_API_KEY);
const FROM = "Oak LMS <noreply@oak-lms.com>";

async function getResend() {
  // @ts-ignore — install `resend` package when credentials are available
  const { Resend } = await import("resend");
  return new Resend(process.env.RESEND_API_KEY!);
}

export async function sendWelcomeEmail(to: string, name: string): Promise<void> {
  if (!hasResend) {
    console.log(`[Resend demo] Welcome email → ${to} (${name})`);
    return;
  }
  const resend = await getResend();
  await (resend as any).emails.send({
    from: FROM, to,
    subject: "Welcome to Oak LMS 🎓",
    html: `<h1>Welcome, ${name}!</h1><p>Your account has been created. Start learning today.</p><a href="${process.env.NEXT_PUBLIC_APP_URL}">Go to Oak LMS</a>`,
  });
}

export async function sendPasswordResetEmail(
  to: string, name: string, token: string
): Promise<void> {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;
  if (!hasResend) {
    console.log(`[Resend demo] Password reset email → ${to}`, resetUrl);
    return;
  }
  const resend = await getResend();
  await (resend as any).emails.send({
    from: FROM, to,
    subject: "Reset your Oak LMS password",
    html: `<h1>Password Reset</h1><p>Hi ${name}, click the link below to reset your password. It expires in 1 hour.</p><a href="${resetUrl}">Reset Password</a>`,
  });
}

export async function sendCertificateEmail(
  to: string, name: string, courseTitle: string, certNumber: string
): Promise<void> {
  const certUrl = `${process.env.NEXT_PUBLIC_APP_URL}/certificate/${certNumber}`;
  if (!hasResend) {
    console.log(`[Resend demo] Certificate email → ${to}`, certUrl);
    return;
  }
  const resend = await getResend();
  await (resend as any).emails.send({
    from: FROM, to,
    subject: `🎓 Your certificate for "${courseTitle}" is ready!`,
    html: `<h1>Congratulations, ${name}!</h1><p>You have successfully completed <strong>${courseTitle}</strong>.</p><p>Certificate ID: <code>${certNumber}</code></p><a href="${certUrl}">View & Download Certificate</a>`,
  });
}

export async function sendEnrollmentEmail(
  to: string, name: string, courseTitle: string
): Promise<void> {
  if (!hasResend) {
    console.log(`[Resend demo] Enrollment email → ${to} for "${courseTitle}"`);
    return;
  }
  const resend = await getResend();
  await (resend as any).emails.send({
    from: FROM, to,
    subject: `You're enrolled in "${courseTitle}"`,
    html: `<h1>Enrollment Confirmed 🎉</h1><p>Hi ${name}, you're now enrolled in <strong>${courseTitle}</strong>.</p><a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/student">Go to My Courses</a>`,
  });
}
