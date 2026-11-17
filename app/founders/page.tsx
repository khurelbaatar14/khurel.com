import type { Metadata } from "next";
import FounderPath from "@/components/founder/FounderPath";
import { getCopy } from "@/lib/copy";

export const metadata: Metadata = {
  title: "DIIL for startups",
  description: "Үүргээ сонго, стартапынхаа шатыг сонго — видео үзэж, даалгавар хийж, оч цуглуулаад үүсгэн байгуулагчидтай уулз.",
};

// A static page with the texts saved at /founders/edit. Saving refreshes it straight away; the
// timer is a backstop for edits made straight in the database.
export const dynamic = "force-static";
export const revalidate = 60;

export default async function FoundersPage() {
  return <FounderPath copy={await getCopy()} />;
}
