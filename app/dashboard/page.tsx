"use client";

import { useState, useEffect } from "react";
import { sendManualEmail } from "@/app/actions/email";
import { Button } from "@/components/ui/button";
import ClientsDB from "@/components/ui/clients-db";
import MarketScanner from "@/components/market-scanner";
import AutoPilot from "@/components/auto-pilot";
import MainHeader from "@/components/main-header";
import { toast } from "sonner";
import AgentActivityFeed from "@/components/agent-activity-feed";
import { logout } from "../actions/login";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/hooks/useUser";
import AgentLogs, { AgentLogProps } from "@/components/agent-log";
import AgentLogButtons from "@/components/agent-log-buttons";

export default function AgentDashboard() {
  const [sellers, setSellers] = useState("");
  const [buyers, setBuyers] = useState("");
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<AgentLogProps | null>(null);
  const [isSending, setIsSending] = useState(false);

  const { user } = useUser();
  const supabase = createClient();

  useEffect(() => {
    const loadData = async () => {
      const { data } = await supabase.from("contacts").select("*");
      setSellers(data?.find((c) => c.type === "seller")?.emails || "");
      setBuyers(data?.find((c) => c.type === "buyer")?.emails || "");
    };
    loadData();
  }, []);

  const saveToSupabase = async () => {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast.error("You must be logged in to save settings");
      setLoading(false);
      return;
    }

    const updateSeller = supabase
      .from("contacts")
      .update({ emails: sellers })
      .eq("type", "seller")
      .eq("user_id", user.id);

    const updateBuyer = supabase
      .from("contacts")
      .update({ emails: buyers })
      .eq("type", "buyer")
      .eq("user_id", user.id);

    const results = await Promise.all([updateSeller, updateBuyer]);

    const error = results.find((r) => r.error);

    if (error) {
      toast.error("Failed to update: " + error?.error?.message);
    } else {
      toast.success("List of emails Updated!");
    }

    setLoading(false);
  };

  const triggerAgent = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      setLogs(data);
    } catch (error) {
      console.error("Failed to run agent", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!logs) return;
    setIsSending(true);

    const targetList = logs.aiDecision === "sellers" ? sellers : buyers;

    const result = await sendManualEmail(
      targetList,
      logs.draftSubject,
      logs.draftBody,
    );

    if (result.success) {
      setLogs({ ...logs, status: "Sent Manually (Approved)" });
      toast.success("Email sent successfully!");
    } else {
      toast.error("Failed to send email:", result.error);
    }
    setIsSending(false);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-8">
      <div className="flex flex-col md:flex-row items-start justify-between gap-2 md:items-center border-b pb-6">
        <MainHeader user={user} />
        <div className="flex flex-col items-end gap-2 self-end">
          <form action={logout}>
            <Button variant="ghost">Sign Out</Button>
          </form>
          <AutoPilot />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <ClientsDB
            sellers={sellers}
            setSellers={setSellers}
            buyers={buyers}
            setBuyers={setBuyers}
            saveLists={saveToSupabase}
          />
        </div>

        <div className="lg:col-span-2 space-y-6">
          <MarketScanner triggerAgent={triggerAgent} loading={loading} />

          {logs && (
          <AgentLogs logs={logs} />
          )}

          {logs && logs.status === "Drafted & Waiting Review" && (
            <AgentLogButtons  handleApprove={handleApprove} isSending={isSending} setLogs={setLogs} />
          )}
        </div>
      </div>
      <AgentActivityFeed />
    </div>
  );
}
