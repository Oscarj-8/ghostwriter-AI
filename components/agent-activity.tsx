"use client";

import React, { useEffect, useState } from "react";
import { Badge } from "./ui/badge";

export type AgentLog = {
  id: string;
  created_at: string;
  event_type: string | null;
  audience: string | null;
  news_summary: string | null;
  ai_reasoning: string | null;
  confidence_score: number | null;
  status: string | null;
  subject: string | null;
  body: string | null;
};

type Props = {
  initialData: AgentLog[];
};

const AgentActivity = ({ initialData }: Props) => {
  const [history, setHistory] = useState<AgentLog[]>(initialData);

  useEffect(() => {
    setHistory(initialData);
  }, [initialData]);
  return (
    <div className="mt-10">
      <h2 className="text-xl font-bold mb-4 text-slate-800">
        Recent Agent Activity
      </h2>

      <div className="space-y-4">
        {history.length === 0 ? (
          <p className="text-sm text-slate-500">No recent activity.</p>
        ) : (
          history.map((log) => (
            <div
              key={log.id}
              className="p-4 bg-white border gap-4 border-slate-200 rounded-xl shadow-sm flex justify-between items-center transition-all hover:shadow-md"
            >
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 uppercase text-xs tracking-wider">
                    {log.event_type}
                  </span>
                  <span className="text-slate-400">|</span>
                  <span className="text-slate-600 font-medium capitalize">
                    Target: {log.audience}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  {new Date(log.created_at).toLocaleString()}
                </p>
                {log.ai_reasoning && (
                  <p className="text-sm w-full text-slate-600 italic">
                    &quot;{log.ai_reasoning}&quot;
                  </p>
                )}
              </div>

              <Badge
                variant="outline"
                className={
                  log.status === "Auto-Sent"
                    ? "bg-green-50 border-green-200 text-green-700 font-bold place-self-start"
                    : "bg-blue-50 border-blue-200 text-blue-700 font-bold place-self-start"
                }
              >
                {log.status}
              </Badge>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AgentActivity;
