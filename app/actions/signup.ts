'use server'

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  console.log("data", data);

  const { error } = await supabase.auth.signUp(data);

  console.log("error", error);

  if (error) redirect("/register?message=Could not create user");

  return redirect("/login?message=Check your email to confirm your account");
}
