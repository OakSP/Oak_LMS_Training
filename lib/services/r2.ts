// Cloudflare R2 — install `@aws-sdk/client-s3` + `@aws-sdk/s3-request-presigner` and set CLOUDFLARE_R2_* env vars
/* eslint-disable @typescript-eslint/no-explicit-any */

const hasR2 = Boolean(
  process.env.CLOUDFLARE_R2_ENDPOINT &&
    process.env.CLOUDFLARE_R2_ACCESS_KEY &&
    process.env.CLOUDFLARE_R2_SECRET_KEY
);

const BUCKET = process.env.CLOUDFLARE_R2_BUCKET ?? "lms-storage";

export interface SignedUrlResult {
  url: string;
  key: string;
}

async function getClient() {
  // @ts-ignore — install `@aws-sdk/client-s3` when credentials are available
  const { S3Client } = await import("@aws-sdk/client-s3");
  return new S3Client({
    region: "auto",
    endpoint: process.env.CLOUDFLARE_R2_ENDPOINT!,
    credentials: {
      accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY!,
      secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_KEY!,
    },
  });
}

export async function getUploadSignedUrl(
  key: string,
  contentType: string
): Promise<SignedUrlResult> {
  if (!hasR2) {
    return { url: `https://demo-r2.example.com/upload/${key}`, key };
  }

  const client = await getClient();
  // @ts-ignore
  const { PutObjectCommand } = await import("@aws-sdk/client-s3");
  // @ts-ignore
  const { getSignedUrl } = await import("@aws-sdk/s3-request-presigner");

  const command = new PutObjectCommand({ Bucket: BUCKET, Key: key, ContentType: contentType });
  const url = await getSignedUrl(client, command, { expiresIn: 600 });
  return { url, key };
}

export async function getDownloadSignedUrl(key: string): Promise<string> {
  if (!hasR2) return `https://demo-r2.example.com/download/${key}`;

  const client = await getClient();
  // @ts-ignore
  const { GetObjectCommand } = await import("@aws-sdk/client-s3");
  // @ts-ignore
  const { getSignedUrl } = await import("@aws-sdk/s3-request-presigner");

  const command = new GetObjectCommand({ Bucket: BUCKET, Key: key });
  return getSignedUrl(client, command, { expiresIn: 3600 });
}

export async function deleteObject(key: string): Promise<void> {
  if (!hasR2) return;

  const client = await getClient();
  // @ts-ignore
  const { DeleteObjectCommand } = await import("@aws-sdk/client-s3");
  await (client as any).send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
}
