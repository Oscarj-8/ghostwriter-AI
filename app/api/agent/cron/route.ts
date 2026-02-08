import { GoogleGenerativeAI } from "@google/generative-ai";
import { Resend } from "resend";
import createPrompt from "@/lib/prompt";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const resend = new Resend(process.env.RESEND_API_KEY);
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export interface Articles {
  title: string;
  description: string;
}

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabaseAdmin = createAdminClient();

    const newsUrl = `https://newsdata.io/api/1/latest?apikey=${process.env.NEWS_API_KEY}&q=real%20estate%20market&language=en`;
    const newsRes = await fetch(newsUrl);
    const newsData = await newsRes.json();
    const articles = newsData.results || [];
    const newsSummary =
      articles.length > 0
        ? articles
            .slice(0, 3)
            .map((a: Articles ) => `${a.title}: ${a.description}`)
            .join("\n")
        : "Market stability continues with minimal interest rate fluctuations.";

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
    const prompt = createPrompt(newsSummary);
    console.log("Prompt: ", prompt);
    const aiResult = await model.generateContent(prompt);
    console.log("AI Result: ", aiResult);
    const ai = JSON.parse(
      aiResult.response
        .text()
        .replace(/```json|```/g, "")
        .trim(),
    );

    if (ai.confidence <= 50) {
      return NextResponse.json({
        message: "Low confidence today, no emails sent.",
      });
    }

    const { data: activeAgents } = await supabaseAdmin
      .from("agent_settings")
      .select("user_id")
      .eq("auto_pilot", true);

    if (!activeAgents || activeAgents.length === 0) {
      return NextResponse.json({ message: "No active agents found." });
    }
    
    const results = await Promise.all(
      activeAgents.map(async (agent) => {
        const userId = agent.user_id;

        // Here i am getting the profie and contacts, so that i can personalize the email
        const [{ data: profile }, { data: contacts }] = await Promise.all([
          supabaseAdmin
            .from("profiles")
            .select("full_name, email")
            .eq("id", userId)
            .single(),
          supabaseAdmin.from("contacts").select("*").eq("user_id", userId),
        ]);

        const realtorName = profile?.full_name || "Your Realtor";

        const personalizedBody = ai.body.replace("[SENDER_NAME]", realtorName);

        const targetType = ai.decision === "sellers" ? "seller" : "buyer";
        const emailList = contacts?.find((c) => c.type === targetType)?.emails;

        let status = "No contacts found";

        // Here i am sending the emails if they exist
        if (emailList) {
          const recipients = emailList
            .split(",")
            .map((e: string) => e.trim())
            .filter((e: string) => e.includes("@"));

          if (recipients.length > 0) {
           const { data } = await resend.emails.send({
              from: `${realtorName} <contact@melajobs.com>`,
              replyTo: profile?.email || "",
              to: recipients,
              subject: ai.subject,
              text: personalizedBody,
              html: `<p>${personalizedBody.replace(/\n/g, "<br>")}</p>`,
            });
            status = `Sent to ${recipients.length} client${recipients.length > 1 ? "s" : ""}`;
            console.log("Email status:", data);
          }

          console.log("Email sent to:", recipients);
        }

        // Here i am saving the logs
        await supabaseAdmin.from("agent_logs").insert([
          {
            user_id: userId,
            event_type: "Daily Auto-Pilot",
            audience: ai.decision,
            status: status,
            ai_reasoning: ai.reasoning,
            body: personalizedBody,
            subject: ai.subject,
            confidence_score: ai.confidence,
          },
        ]);

        return { userId, status };
      }),
    );

    return NextResponse.json({ message: "Processed", total: results.length });
  } catch (error: unknown) {
    console.error("CRON ERROR:", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
