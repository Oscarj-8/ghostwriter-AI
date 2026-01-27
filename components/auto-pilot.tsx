import { useEffect, useState } from "react";
import { Label } from "./ui/label";
import { supabase } from "@/lib/supabase/client";
import { Switch } from "./ui/switch";
import { toast } from "sonner";

const AutoPilot = () => {
  const [autoPilot, setAutoPilot] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase
        .from("agent_settings")
        .select("auto_pilot")
        .eq("id", 1)
        .single();
      if (data) setAutoPilot(data.auto_pilot);
    };
    fetchSettings();
  }, []);

    const saveAutoPilot = async () => {
    setLoading(true);
    setAutoPilot(!autoPilot);
    await supabase
      .from("agent_settings")
      .update({ auto_pilot: !autoPilot })
      .eq("id", 1);
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
          <Switch disabled={loading} checked={autoPilot} onCheckedChange={saveAutoPilot} />
        </div>
      </div>
    </div>
  );
};

export default AutoPilot;
