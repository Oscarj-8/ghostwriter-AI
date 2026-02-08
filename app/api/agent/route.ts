import createPrompt from "@/lib/prompt";
import { createClient } from "@/lib/supabase/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { Articles } from "./cron/route";

const resend = new Resend(process.env.RESEND_API_KEY);
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (!user || authError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [contactsRes, settingsRes] = await Promise.all([
      supabase.from("contacts").select("*"),
      supabase.from("agent_settings").select("auto_pilot").eq("id", 1).single(),
    ]);

    const sellers =
      contactsRes.data?.find((c) => c.type === "seller")?.emails || "";
    const buyers =
      contactsRes.data?.find((c) => c.type === "buyer")?.emails || "";
    const isAutoPilotActive = settingsRes.data?.auto_pilot || false;

    const newsUrl = `https://newsdata.io/api/1/latest?apikey=${process.env.NEWS_API_KEY}&q=real%20estate%20market&language=en`;

    const newsRes = await fetch(newsUrl);
    const newsData = await newsRes.json();

    let articles = newsData.results;

    if (!articles || articles.length === 0) {
      console.log("No live news found, using fallback scenario for demo...");
      articles = [
        {
          title:
            "Mortgage rates hold steady at 6.7% as market awaits Fed decision",
          description:
            "Homebuyers are staying cautious as interest rates remain unchanged this week, impacting new home sales.",
        },
      ];
    }

    const newsSummary = articles
      .slice(0, 3)
      .map(
        (a: Articles) =>
          `${a.title}: ${a.description || "Market update available."}`,
      )
      .join("\n");

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
    const prompt = createPrompt(newsSummary);

    const result = await model.generateContent(prompt);
    const cleanedJson = result.response
      .text()
      .replace(/```json|```/g, "")
      .trim();
    const ai = JSON.parse(cleanedJson);

    const targetEmails = ai.decision === "sellers" ? sellers : buyers;

    const { error: logError } = await supabase.from("agent_logs").insert([
      {
        user_id: user.id,
        event_type: "Daily Market Scan",
        audience: ai.decision,
        news_summary: ai.subject,
        ai_reasoning: ai.reasoning,
        confidence_score: ai.confidence,
        status:
          isAutoPilotActive && ai.confidence > 70 ? "Auto-Sent" : "Drafted",
        subject: ai.subject,
        body: ai.body,
      },
    ]);

    if (logError) console.error("Logging failed:", logError);

    const recipientArray = targetEmails
      .split(",")
      .map((e: string) => e.trim())
      .filter((e: string) => e.includes("@"));

    let status = "Drafted & Waiting Review";

    const personalizedBody = ai.body.replace(
      "[SENDER_NAME]",
      user.user_metadata.full_name ||
        user.user_metadata.display_name ||
        "Agent",
    );

    if (isAutoPilotActive && ai.confidence > 70 && recipientArray.length > 0) {
      console.log("Sending email via Resend...");
      const { error } = await resend.emails.send({
        from: `${user.user_metadata.full_name || user.user_metadata.display_name || "Agent"} <${user.email}>`,
        to: recipientArray,
        subject: ai.subject,
        text: personalizedBody,
        html: `<strong>Real Estate Intelligence</strong><br><br>${ai.body.replace(/\n/g, "<br>")}`,
      });
      if (error) throw new Error(error.message);

      status = `Autonomously Sent to " + ${recipientArray.length} + " client${recipientArray.length > 1 ? "s" : ""}`;
    }

    return NextResponse.json({
      status,
      aiDecision: ai.decision,
      aiReasoning: ai.reasoning,
      draftSubject: ai.subject,
      draftBody: ai.body,
      newsUsed: articles[0].title,
      user: user.email,
    });
  } catch (error: unknown) {
    console.error("AGENT ERROR:", error);
    const message = error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json(
      { error: message },
      { status: 500 },
    );
  }
}
