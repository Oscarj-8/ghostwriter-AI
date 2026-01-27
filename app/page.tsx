"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { sendManualEmail } from "@/app/actions/email";
import { Loader2, Trash2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ClientsDB from "@/components/ui/clients-db";
import MarketScanner from "@/components/market-scanner";
import { supabase } from "@/lib/supabase/client";
import AutoPilot from "@/components/auto-pilot";
import MainHeader from "@/components/main-header";
import { toast } from "sonner";

export default function AgentDashboard() {
  const [sellers, setSellers] = useState("");
  const [buyers, setBuyers] = useState("");
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<any>(null);
  const [isSending, setIsSending] = useState(false);

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
    await supabase
      .from("contacts")
      .update({ emails: sellers })
      .eq("type", "seller");
    await supabase
      .from("contacts")
      .update({ emails: buyers })
      .eq("type", "buyer");
    setLoading(false);
    toast.success("List of emails Updated!");
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
      console.error("Failed to run agent");
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
    <div className="max-w-6xl mx-auto p-8 space-y-8">
      <div className="flex flex-col md:flex-row items-start justify-between gap-2 md:items-center border-b pb-6">
        <MainHeader />
        <AutoPilot />
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
            <Card className="bg-slate-900 text-white overflow-hidden animate-in fade-in slide-in-from-bottom-4">
              <CardHeader className="border-b border-slate-800 flex flex-row items-center justify-between">
                <CardTitle className="text-blue-400 flex items-center gap-2">
                  <Zap className="w-4 h-4" /> Agent Thinking Process
                </CardTitle>
                <Badge variant="outline" className="text-white border-white">
                  {logs.status}
                </Badge>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-800 p-3 rounded">
                    <p className="text-[10px] text-slate-400 uppercase font-bold">
                      News Analyzed
                    </p>
                    <p className="text-sm font-medium text-slate-200">
                      {logs.newsUsed}
                    </p>
                  </div>
                  <div className="bg-slate-800 p-3 rounded">
                    <p className="text-[10px] text-slate-400 uppercase font-bold">
                      Targeted Audience
                    </p>
                    <p className="text-sm font-bold text-blue-400 uppercase">
                      {logs.aiDecision}
                    </p>
                  </div>
                </div>
                <div className="border-l-2 border-blue-500 pl-4 py-2 italic text-slate-300">
                  &quot;{logs.aiReasoning}&quot;
                </div>
                <div className="bg-black p-4 rounded-md border border-slate-700">
                  <p className="text-xs text-slate-500 mb-2 font-mono">
                    --- EMAIL DRAFT GENERATED ---
                  </p>
                  <p className="font-bold mb-1 text-slate-200">
                    Sub: {logs.draftSubject}
                  </p>
                  <p className="text-sm text-slate-400 whitespace-pre-wrap">
                    {logs.draftBody}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {logs && logs.status === "Drafted & Waiting Review" && (
            <div className="flex gap-4">
              <Button
                onClick={handleApprove}
                disabled={isSending}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold h-12"
              >
                {isSending ? (
                  <Loader2 className="animate-spin mr-2" />
                ) : (
                  <Zap className="w-4 h-4 mr-2" />
                )}
                APPROVE AND SEND NOW
              </Button>

              <Button
                onClick={() => setLogs(null)}
                variant="outline"
                className="flex-1 border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                DISCARD
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
