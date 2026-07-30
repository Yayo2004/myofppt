"use server";
import { redirect } from "next/navigation";

export async function submitContactMessage(formData: FormData) {
  const raw = Object.fromEntries(formData);
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: raw.Nom,
      email: raw.Email,
      subject: raw.Sujet,
      message: raw.Message,
    }),
  });
  if (res.ok) {
    redirect("/contact?success=1");
  }
}
