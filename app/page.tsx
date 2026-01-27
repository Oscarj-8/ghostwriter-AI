"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { sendManualEmail } from "@/app/actions/email";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Play, ShieldCheck, Trash2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

export default function AgentDashboard() {
  const [sellers, setSellers] = useState("");
  const [buyers, setBuyers] = useState("");
  const [autoPilot, setAutoPilot] = useState(false);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<any>(null);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    setSellers(localStorage.getItem("sellers-list") || "");
    setBuyers(localStorage.getItem("buyers-list") || "");
  }, []);

  const saveLists = () => {
    localStorage.setItem("sellers-list", sellers);
    localStorage.setItem("buyers-list", buyers);
    alert("Client lists saved to local storage!");
  };

  const triggerAgent = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sellers, buyers, autoPilot }),
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
      alert("Email sent successfully!");
    } else {
      alert("Failed to send: " + result.error);
    }
    setIsSending(false);
  };

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-8">
      <div className="flex justify-between items-center border-b pb-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">
            RealEstate.AI
          </h1>
          <p className="text-muted-foreground mt-1">
            Autonomous Marketing Agent
          </p>
        </div>
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
              <Switch checked={autoPilot} onCheckedChange={setAutoPilot} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader className="bg-slate-50">
              <CardTitle className="text-sm flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> Client Database
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div>
                <Label>Sellers (Emails)</Label>
                <Textarea
                  value={sellers}
                  onChange={(e) => setSellers(e.target.value)}
                  placeholder="email1@test.com, email2@test.com"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Buyers (Emails)</Label>
                <Textarea
                  value={buyers}
                  onChange={(e) => setBuyers(e.target.value)}
                  placeholder="email3@test.com, email4@test.com"
                  className="mt-1"
                />
              </div>
              <Button onClick={saveLists} variant="outline" className="w-full">
                Save to LocalStorage
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card className="border-2 border-black">
            <CardContent className="pt-6">
              <Button
                onClick={triggerAgent}
                disabled={loading}
                className="w-full h-16 text-lg font-bold"
              >
                {loading ? (
                  <Loader2 className="animate-spin mr-2" />
                ) : (
                  <Play className="mr-2 fill-current" />
                )}
                TRIGGER MORNING MARKET SCAN
              </Button>
            </CardContent>
          </Card>

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
