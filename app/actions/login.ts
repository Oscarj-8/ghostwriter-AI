"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";


type LoginState = {
  error?: string;
};
export async function login(
  prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return redirect("/login?message=Could not authneticate user");
  }

  return redirect("/dashboard");
}


export async function logout () {
    const supabase = await createClient();
    await supabase.auth.signOut();
    return redirect('/login');
}