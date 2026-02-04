"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });
  if (authError || !authData.user) {
    console.error("Auth Error:", authError?.message);
    redirect(
      `/register?message=${encodeURIComponent(authError?.message || "Could not create user")}`,
    );
  }

  const userId = authData.user.id;

  const { error: settingsError } = await supabase
    .from("agent_settings")
    .insert([
      {
        user_id: userId,
        auto_pilot: false,
      },
    ]);

  if (settingsError) {
    console.error("Manual Settings Insert Error:", settingsError.message);
  }

  const { error: contactsError } = await supabase.from("contacts").insert([
    { user_id: userId, type: "buyer", emails: "" },
    { user_id: userId, type: "seller", emails: "" },
  ]);

  if (contactsError) {
    console.error("Manual Contacts Insert Error:", contactsError.message);
  }
  return redirect(
    "/login?message=Account created! Please check your email to confirm.",
  );
}
