// Turns the DIIL co-founders' photos into 3D animated portraits for /founders, one per seat, saved to
// <out>/<role>.<ext> (default public/diil). Uses OPENAI_API_KEY (images/edits) or GEMINI_API_KEY
// from .env.local, or from another env file named by AVATAR_ENV_FILE; AVATAR_MODEL overrides the model
// and AVATAR_OUT the folder. Each run is a paid API call per photo.
//
// usage: node scripts/founder-avatars.mjs hustler=<photo> hacker=<photo> hipster=<photo>

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { extname, join } from "node:path";

// Each portrait sits on its role's sticker colour, so it blends into the tile it's shown in.
const colors = { hustler: "#ffd23d", hacker: "#2ee6d6", hipster: "#a98bff" };

// The look: a 3D avatar-icon set — smooth matte clay render, slightly oversized head, simple friendly
// features — while staying recognisably the person in the photo.
const prompt = (color) =>
  [
    "Turn the person in this photo into a 3D avatar icon, like one character from a polished 3D avatar set:",
    "smooth matte clay-like render, soft rounded shapes, slightly oversized head, simple friendly eyes and a small smile.",
    "Keep him recognizable: same hairstyle and hair color, glasses if he wears them, face shape, facial hair, skin tone and clothing colors.",
    "Bust only (head and shoulders), centered, facing the camera, soft studio lighting with gentle shadows.",
    `Plain flat background in the solid color ${color}.`,
    "Ignore any text, captions, microphones or other people in the photo. Square image, no text, no logo.",
  ].join(" ");

function env() {
  const vars = {};
  for (const file of [".env.local", process.env.AVATAR_ENV_FILE].filter(Boolean)) {
    for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
      const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (m) vars[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  }
  return vars;
}

const mime = (file) => ({ ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg" })[extname(file).toLowerCase()];

async function openai(key, model, file, text) {
  const form = new FormData();
  form.append("model", model);
  form.append("image", new Blob([readFileSync(file)], { type: mime(file) }), "photo" + extname(file));
  form.append("prompt", text);
  form.append("size", "1024x1024");
  form.append("output_format", "webp");
  const res = await fetch("https://api.openai.com/v1/images/edits", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}` },
    body: form,
  });
  const body = await res.json();
  if (!res.ok) throw new Error(`OpenAI ${res.status}: ${body.error?.message ?? "request failed"}`);
  return { data: Buffer.from(body.data[0].b64_json, "base64"), ext: "webp" };
}

async function gemini(key, model, file, text) {
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": key },
    body: JSON.stringify({
      contents: [{ parts: [{ text }, { inline_data: { mime_type: mime(file), data: readFileSync(file).toString("base64") } }] }],
      generationConfig: { responseModalities: ["TEXT", "IMAGE"], imageConfig: { aspectRatio: "1:1" } },
    }),
  });
  const body = await res.json();
  if (!res.ok) throw new Error(`Gemini ${res.status}: ${body.error?.message ?? "request failed"}`);
  const part = body.candidates?.[0]?.content?.parts?.find((p) => p.inlineData || p.inline_data);
  if (!part) throw new Error("Gemini returned no image");
  const inline = part.inlineData ?? part.inline_data;
  return { data: Buffer.from(inline.data, "base64"), ext: (inline.mimeType ?? inline.mime_type ?? "image/png").split("/")[1] };
}

const jobs = process.argv.slice(2).map((arg) => arg.split("="));
if (!jobs.length || jobs.some(([role, file]) => !colors[role] || !file)) {
  console.error("usage: node scripts/founder-avatars.mjs hustler=<photo> hacker=<photo> hipster=<photo>");
  process.exit(1);
}

const vars = env();
const provider = vars.OPENAI_API_KEY ? "openai" : vars.GEMINI_API_KEY ? "gemini" : null;
if (!provider) {
  console.error("Add OPENAI_API_KEY or GEMINI_API_KEY to .env.local first.");
  process.exit(1);
}
// Newest model first; an account without access to one falls through to the next.
const models = vars.AVATAR_MODEL
  ? [vars.AVATAR_MODEL]
  : provider === "openai"
    ? ["gpt-image-2"]
    : ["gemini-3.1-flash-image", "gemini-3.1-flash-image-preview", "gemini-3-pro-image-preview", "gemini-2.5-flash-image"];

async function generate(file, text) {
  for (const model of models) {
    try {
      const result =
        provider === "openai" ? await openai(vars.OPENAI_API_KEY, model, file, text) : await gemini(vars.GEMINI_API_KEY, model, file, text);
      return { ...result, model };
    } catch (e) {
      // Only an unknown or unavailable model moves on; anything else (quota, safety, bad input) stops.
      if (!/\b(404|NOT_FOUND)\b|not found|not supported/i.test(e.message) || model === models.at(-1)) throw e;
      console.log(`${model} unavailable, trying the next model`);
    }
  }
}

const outDir = vars.AVATAR_OUT || process.env.AVATAR_OUT || join("public", "diil");
mkdirSync(outDir, { recursive: true });
console.log(`Using ${provider}`);
for (const [role, file] of jobs) {
  const { data, ext, model } = await generate(file, prompt(colors[role]));
  const out = join(outDir, `${role}.${ext}`);
  writeFileSync(out, data);
  console.log(`${role} → ${out} (${model}, ${Math.round(data.length / 1024)} KB)`);
}
