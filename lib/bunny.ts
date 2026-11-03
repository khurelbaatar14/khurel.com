import { createHash } from "node:crypto";

// Course videos live in a Bunny Stream library with "Embed view token authentication" on
// (Stream → library → Security), so a player URL only works with a fresh signature.
// Sign only after checking the viewer may watch the lesson.

// Long enough to sit through a long lesson with pauses; reloading the page signs a new URL.
const TTL_SECONDS = 3 * 60 * 60;

/** Signed player URL, or null when Bunny isn't configured (e.g. local dev). */
export function signedEmbedUrl(videoId: string) {
  const library = process.env.BUNNY_STREAM_LIBRARY_ID;
  const key = process.env.BUNNY_STREAM_TOKEN_KEY;
  if (!library || !key) return null;

  const expires = Math.floor(Date.now() / 1000) + TTL_SECONDS;
  const token = createHash("sha256").update(`${key}${videoId}${expires}`).digest("hex");
  return `https://player.mediadelivery.net/embed/${library}/${videoId}?token=${token}&expires=${expires}`;
}
