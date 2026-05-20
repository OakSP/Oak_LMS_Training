import { randomBytes } from "crypto";

export function generateCertNumber(): string {
  const prefix = "OAK";
  const year = new Date().getFullYear();
  const random = randomBytes(4).toString("hex").toUpperCase();
  return `${prefix}-${year}-${random}`;
}

export interface CertData {
  certNumber: string;
  studentName: string;
  courseTitle: string;
  issuedAt: string;
  verifyUrl: string;
}

export function buildCertificateHtml(data: CertData): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Georgia', serif; background: #fff; }
  .cert {
    width: 794px; height: 562px;
    border: 12px solid #B8763A;
    padding: 40px 60px;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    text-align: center; position: relative;
  }
  .inner { border: 2px solid #B8763A; width: 100%; height: 100%; padding: 30px; display: flex; flex-direction: column; align-items: center; justify-content: center; }
  .title { font-size: 13px; letter-spacing: 4px; text-transform: uppercase; color: #B8763A; margin-bottom: 12px; }
  .heading { font-size: 34px; font-weight: bold; color: #0B1F3D; margin-bottom: 8px; }
  .sub { font-size: 14px; color: #4A5773; margin-bottom: 24px; }
  .student { font-size: 28px; font-style: italic; color: #0B1F3D; border-bottom: 1.5px solid #B8763A; padding-bottom: 8px; margin-bottom: 20px; display: inline-block; min-width: 300px; }
  .course-label { font-size: 13px; color: #4A5773; margin-bottom: 6px; }
  .course { font-size: 20px; font-weight: bold; color: #0B1F3D; margin-bottom: 24px; }
  .footer { display: flex; justify-content: space-between; width: 100%; font-size: 11px; color: #7B8699; margin-top: 20px; }
  .cert-id { font-family: monospace; font-size: 11px; color: #7B8699; }
</style>
</head>
<body>
<div class="cert">
  <div class="inner">
    <div class="title">Certificate of Completion</div>
    <div class="heading">Oak LMS</div>
    <div class="sub">This is to certify that</div>
    <div class="student">${data.studentName}</div>
    <div class="course-label">has successfully completed</div>
    <div class="course">${data.courseTitle}</div>
    <div class="footer">
      <span>Issued: ${new Date(data.issuedAt).toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" })}</span>
      <span class="cert-id">ID: ${data.certNumber}</span>
      <span>Verify: ${data.verifyUrl}</span>
    </div>
  </div>
</div>
</body>
</html>`;
}
