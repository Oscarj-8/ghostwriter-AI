import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

const AgentDashboard = async () => {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    console.error("Error fetching user:", error);
    return (
      <div>
        <p>Error fetching user data</p>
      </div>
    );
  }

  if (user) {
    redirect("/dashboard");
  } else {
    redirect("/login");
  }

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-8">
      <p>Hello {user ? user?.email : "Guest"}</p>
      <pre>{JSON.stringify(user, null, 2)}</pre>{" "}
    </div>
  );
};

export default AgentDashboard; // Default export
