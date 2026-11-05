import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import PaymentWatcher from "@/components/checkout/PaymentWatcher";
import { getUser, loginHref } from "@/lib/auth";
import { formatPrice, getCourse } from "@/lib/courses";
import { isOrderId } from "@/lib/orders";
import type { BankLink } from "@/lib/qpay";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Төлбөр | Хүрэлбаатар",
  robots: { index: false },
};

type Props = { params: Promise<{ order: string }> };

export default async function CheckoutPage({ params }: Props) {
  const { order: id } = await params;
  if (!isOrderId(id)) notFound();
  if (!(await getUser())) redirect(loginHref(`/checkout/${id}`));

  // Row-level security: only the buyer can read their order.
  const supabase = await createClient();
  const { data: order } = await supabase
    .from("orders")
    .select("id, course, amount, status, qr_image, links")
    .eq("id", id)
    .maybeSingle();
  const course = order && (await getCourse(order.course));
  if (!order || !course) notFound();

  const courseHref = `/courses/${course.slug}`;
  const first = course.lessons[0];
  const links = (order.links ?? []) as BankLink[];

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-md mx-auto px-6 py-16">
        <Link
          href={courseHref}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10"
        >
          <ArrowLeft className="w-4 h-4" />
          Сургалт руу буцах
        </Link>

        <div className="mb-8 space-y-1">
          <p className="text-sm text-muted-foreground">{course.title}</p>
          <p className="text-3xl font-bold">{formatPrice(order.amount)}</p>
        </div>

        {order.status === "paid" ? (
          <div className="rounded-2xl border border-border p-6 space-y-4 text-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <div className="space-y-1">
              <h1 className="text-xl font-bold">Төлбөр амжилттай</h1>
              <p className="text-sm text-muted-foreground">Сургалт таны бүртгэлд нэмэгдлээ.</p>
            </div>
            <Link
              href={first ? `${courseHref}/${first.slug}` : courseHref}
              className={cn(buttonVariants({ size: "lg" }), "w-full")}
            >
              Үзэж эхлэх
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <h1 className="text-xl font-bold">QPay-ээр төлөх</h1>

            {/* Bank apps open straight to the invoice; only useful on a phone. */}
            {links.length > 0 && (
              <div className="md:hidden space-y-3">
                <p className="text-sm text-muted-foreground">Банкаа сонгоно уу:</p>
                <div className="grid grid-cols-4 gap-3">
                  {links.map((bank) => (
                    <a key={bank.name} href={bank.link} className="flex flex-col items-center gap-1 text-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={bank.logo} alt="" className="w-12 h-12 rounded-xl border border-border" />
                      <span className="text-[11px] leading-tight text-muted-foreground line-clamp-2">
                        {bank.description}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {order.qr_image && (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">Банкны аппаараа QR кодыг уншуулна уу:</p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`data:image/png;base64,${order.qr_image}`}
                  alt="QPay QR код"
                  className="w-64 h-64 mx-auto rounded-xl border border-border bg-white p-2"
                />
              </div>
            )}

            <PaymentWatcher orderId={order.id} />
          </div>
        )}
      </div>
    </main>
  );
}
