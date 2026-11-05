import Link from "next/link";
import { logout } from "@/app/login/actions";
import { getUser, loginHref } from "@/lib/auth";
import { isConfigured } from "@/lib/supabase/server";

/** "Нэвтрэх" link, or the signed-in email with "Гарах". `here` is where to come back to. */
export default async function Account({ here }: { here: string }) {
  if (!isConfigured) return null;
  const user = await getUser();

  if (!user) {
    return (
      <Link href={loginHref(here)} className="text-sm font-medium hover:text-primary transition-colors">
        Нэвтрэх
      </Link>
    );
  }

  return (
    <form action={logout} className="flex items-center gap-3 text-sm min-w-0">
      <input type="hidden" name="next" value={here} />
      <span className="text-muted-foreground truncate">{user.email}</span>
      <button type="submit" className="font-medium hover:text-primary transition-colors shrink-0">
        Гарах
      </button>
    </form>
  );
}
