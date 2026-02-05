"use client";

import { useEffect, useState } from "react";
import { Label } from "./ui/label";
import { createClient } from "@/lib/supabase/client";
import { Switch } from "./ui/switch";
import { toast } from "sonner";
import { User } from "@supabase/supabase-js";

const AutoPilot = () => {
  const [autoPilot, setAutoPilot] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const supabase = createClient();

  useEffect(() => {
    const initialize = async () => {
      const {
        data: { user: authUser },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !authUser) {
        console.log("No session found");
        return;
      }

      setUser(authUser);
      const { data, error } = await supabase
        .from("agent_settings")
        .select("auto_pilot")
        .eq("user_id", authUser.id)
        .single();

       if (error) {
         console.error("Error fetching settings:", error.message);
         return;
       }

      if (data) setAutoPilot(data.auto_pilot);
    };

    initialize();
  }, []);

  const saveAutoPilot = async () => {
    if (!user) return;
    setLoading(true);
    setAutoPilot(!autoPilot);
    await supabase
      .from("agent_settings")
      .update({ auto_pilot: !autoPilot })
      .eq("user_id", user?.id);
    setLoading(false);
    toast.success("Agent Autonomy Updated!", { position: "top-center" });
  };

  return (
    <div className="flex items-center gap-4 bg-slate-100 p-4 rounded-xl border">
      <div className="flex flex-col items-end">
        <Label className="font-bold text-xs uppercase mb-1">
          Agent Autonomy
        </Label>
        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-medium ${autoPilot ? "text-green-600" : "text-slate-500"}`}
          >
            {autoPilot ? "AUTO-PILOT ACTIVE" : "MANUAL REVIEW"}
          </span>
          <Switch
            disabled={loading}
            checked={autoPilot}
            onCheckedChange={saveAutoPilot}
          />
        </div>
      </div>
    </div>
  );
};

export default AutoPilot;
