import type { Metadata } from "next";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "تواصلي معنا | حنينة",
  description: "تواصلي مع فريق حنينة لأي سؤال أو ملاحظة حول طلبك أو منتجاتنا.",
};

export default function ContactPage() {
  return <ContactForm />;
}
