import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap } from "lucide-react";
import { User } from "@supabase/supabase-js";

export interface AgentLogProps {
  status: string;
  aiDecision: string;
  aiReasoning: string;
  draftSubject: string;
  draftBody: string;
  newsUsed: string;
  user: User;
}

const AgentLogs = ({ logs }: { logs: AgentLogProps | null }) => {
  if (!logs) {
    return null;
  }
  return (
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
  );
};

export default AgentLogs;
