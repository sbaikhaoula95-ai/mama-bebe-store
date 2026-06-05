export const TRACKING = {
  metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID || "",
  tiktokPixelId: process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID || "",
  snapPixelId: process.env.NEXT_PUBLIC_SNAP_PIXEL_ID || "",
  enableMeta:
    process.env.NEXT_PUBLIC_ENABLE_META_PIXEL !== "false" &&
    !!process.env.NEXT_PUBLIC_META_PIXEL_ID,
  enableTiktok:
    process.env.NEXT_PUBLIC_ENABLE_TIKTOK_PIXEL !== "false" &&
    !!process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID,
  enableSnap:
    process.env.NEXT_PUBLIC_ENABLE_SNAP_PIXEL !== "false" &&
    !!process.env.NEXT_PUBLIC_SNAP_PIXEL_ID,
  debug: process.env.NEXT_PUBLIC_ENABLE_DEBUG_TRACKING === "true",
};
