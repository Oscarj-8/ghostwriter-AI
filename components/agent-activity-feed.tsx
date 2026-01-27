"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import AgentActivity, { AgentLog } from "./agent-activity";

const AgentActivityFeed = () => {
  const [data, setData] = useState<AgentLog[]>([]);
  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("agent_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

      setData(data ?? []);
    }

    load();
  }, []);

  return <AgentActivity initialData={data} />;
};

export default AgentActivityFeed;
