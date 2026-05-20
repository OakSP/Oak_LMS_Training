// Mux video service — install `@mux/mux-node` and set MUX_TOKEN_ID + MUX_TOKEN_SECRET to enable
/* eslint-disable @typescript-eslint/no-explicit-any */

const hasMux = Boolean(process.env.MUX_TOKEN_ID && process.env.MUX_TOKEN_SECRET);

export interface UploadUrlResult {
  uploadId: string;
  uploadUrl: string;
}

export interface PlaybackInfo {
  playbackId: string;
  streamUrl: string;
  thumbnailUrl: string;
}

export async function createUploadUrl(): Promise<UploadUrlResult> {
  if (!hasMux) {
    return {
      uploadId: `demo_upload_${Date.now()}`,
      uploadUrl: "https://storage.googleapis.com/mux-video-upload/demo",
    };
  }

  // @ts-ignore — install `@mux/mux-node` when credentials are available
  const Mux = (await import("@mux/mux-node")).default;
  const mux = new Mux({
    tokenId: process.env.MUX_TOKEN_ID!,
    tokenSecret: process.env.MUX_TOKEN_SECRET!,
  });

  const upload = await (mux as any).video.uploads.create({
    cors_origin: process.env.NEXT_PUBLIC_APP_URL ?? "*",
    new_asset_settings: { playback_policy: ["signed"] },
  });

  return { uploadId: upload.id, uploadUrl: upload.url };
}

export async function getPlaybackInfo(assetId: string): Promise<PlaybackInfo> {
  if (!hasMux) {
    return {
      playbackId: `demo_pb_${assetId}`,
      streamUrl: "https://stream.mux.com/demo.m3u8",
      thumbnailUrl: "https://image.mux.com/demo/thumbnail.jpg",
    };
  }

  // @ts-ignore — install `@mux/mux-node` when credentials are available
  const Mux = (await import("@mux/mux-node")).default;
  const mux = new Mux({
    tokenId: process.env.MUX_TOKEN_ID!,
    tokenSecret: process.env.MUX_TOKEN_SECRET!,
  });

  const asset = await (mux as any).video.assets.retrieve(assetId);
  const playbackId = asset.playback_ids?.[0]?.id ?? "";

  return {
    playbackId,
    streamUrl: `https://stream.mux.com/${playbackId}.m3u8`,
    thumbnailUrl: `https://image.mux.com/${playbackId}/thumbnail.jpg`,
  };
}

export async function deleteAsset(assetId: string): Promise<void> {
  if (!hasMux) return;

  // @ts-ignore — install `@mux/mux-node` when credentials are available
  const Mux = (await import("@mux/mux-node")).default;
  const mux = new Mux({
    tokenId: process.env.MUX_TOKEN_ID!,
    tokenSecret: process.env.MUX_TOKEN_SECRET!,
  });

  await (mux as any).video.assets.delete(assetId);
}
