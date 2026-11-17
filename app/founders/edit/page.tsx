import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import FounderPath from "@/components/founder/FounderPath";
import { getUser, loginHref } from "@/lib/auth";
import { getCopy } from "@/lib/copy";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Засварлах · DIIL for startups",
  robots: { index: false, follow: false },
};

/** The /founders landing with every text editable in place, for the people in copy_editors. */
export default async function EditFoundersPage() {
  const user = await getUser();
  if (!user) redirect(loginHref("/founders/edit"));

  const supabase = await createClient();
  const { data: editor } = await supabase.from("copy_editors").select("user_id").eq("user_id", user.id).maybeSingle();

  if (!editor) {
    return (
      <div className="grid min-h-screen place-items-center bg-black px-4 font-[family-name:var(--font-display)] text-white">
        <div className="max-w-md text-center">
          <p className="text-3xl font-black tracking-tight">Засах эрх алга</p>
          <p className="mt-3 font-medium leading-relaxed text-[#9a9aa6]">
            {user.email ? `${user.email} хаягаар нэвтэрсэн байна. ` : ""}
            Энэ хуудсыг зөвхөн DIIL-ийн баг засна.
          </p>
          <Link href="/founders" className="mt-6 inline-block rounded-2xl bg-[#37f59a] px-5 py-3 font-black text-black">
            Сайт руу буцах
          </Link>
        </div>
      </div>
    );
  }

  return <FounderPath copy={await getCopy()} edit />;
}
