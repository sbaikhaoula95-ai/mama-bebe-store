"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { submitContactForm } from "@/lib/api";
import { MOROCCAN_PHONE_REGEX } from "@/lib/phone";
import { SITE } from "@/config/site";
import { cn } from "@/lib/utils";

const contactSchema = z.object({
  name: z.string().min(2, "الاسم ضروري"),
  phone: z
    .string()
    .regex(MOROCCAN_PHONE_REGEX, "دخلي رقم هاتف مغربي صحيح"),
  message: z.string().min(10, "الرسالة قصيرة، أضيفي تفاصيل أكثر"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export function ContactForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  async function onSubmit(data: ContactFormData) {
    setIsSubmitting(true);
    setSubmitError("");
    try {
      await submitContactForm({
        ...data,
        sourcePage: window.location.href,
      });
      setIsSubmitted(true);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "وقع مشكل في إرسال رسالتك."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <section className="section-padding bg-gradient-to-b from-cream to-white">
        <div className="container-site max-w-2xl">
          <div className="text-center mb-10">
            <span className="badge-gold mb-4 inline-block">تواصلي معنا</span>
            <h1 className="text-4xl font-bold text-ink mb-3">كيف يمكننا مساعدتك؟</h1>
            <p className="text-ink/60 text-lg">
              لأي سؤال، ملاحظة، أو مشكل في الطلب — كنجيبوك بسرعة.
            </p>
          </div>

          {isSubmitted ? (
            <div className="bg-forest/10 border border-forest/20 rounded-3xl p-10 text-center">
              <div className="text-5xl mb-4">✅</div>
              <h2 className="text-2xl font-bold text-ink mb-3">شكرا على تواصلك!</h2>
              <p className="text-ink/60 text-lg">
                وصلتنا رسالتك. كنجيبوك في أقرب وقت خلال ساعات العمل.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-8 border border-ink/10 shadow-sm">
              <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
                <div>
                  <label className="form-label" htmlFor="name">الاسم الكامل</label>
                  <input
                    id="name"
                    type="text"
                    autoComplete="name"
                    placeholder="اسمك الكامل"
                    className={cn("form-input", errors.name ? "form-input-error" : "")}
                    {...register("name")}
                  />
                  {errors.name && <p className="form-error">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="form-label" htmlFor="phone">رقم الهاتف</label>
                  <input
                    id="phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="0612345678"
                    className={cn("form-input", errors.phone ? "form-input-error" : "")}
                    {...register("phone")}
                  />
                  {errors.phone && <p className="form-error">{errors.phone.message}</p>}
                </div>

                <div>
                  <label className="form-label" htmlFor="message">رسالتك</label>
                  <textarea
                    id="message"
                    rows={5}
                    placeholder="اكتبي رسالتك هنا..."
                    className={cn("form-input resize-none", errors.message ? "form-input-error" : "")}
                    {...register("message")}
                  />
                  {errors.message && <p className="form-error">{errors.message.message}</p>}
                </div>

                {submitError && (
                  <div className="bg-danger/10 text-danger text-sm p-3 rounded-xl font-medium">
                    {submitError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full text-lg py-4"
                >
                  {isSubmitting ? "جاري الإرسال..." : "إرسال الرسالة"}
                </button>
              </form>
            </div>
          )}

          {/* Contact info */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { icon: "📧", label: "البريد الإلكتروني", value: SITE.contact.email },
              { icon: "📞", label: "الهاتف", value: SITE.contact.phone },
              { icon: "🕐", label: "ساعات العمل", value: SITE.contact.hours },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-white rounded-2xl p-5 border border-ink/10 text-center"
              >
                <span className="text-3xl block mb-2" role="img" aria-hidden="true">
                  {item.icon}
                </span>
                <p className="text-ink/50 text-xs mb-1">{item.label}</p>
                <p className="font-semibold text-ink text-sm">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
