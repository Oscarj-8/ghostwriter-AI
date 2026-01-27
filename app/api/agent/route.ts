import { supabase } from "@/lib/supabase/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
export async function POST(req: Request) {
  try {
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
        (a: any) =>
          `${a.title}: ${a.description || "Market update available."}`,
      )
      .join("\n");

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `
      You are an Autonomous Real Estate Strategist. 
      Analyze this news: "${newsSummary}"

      Task:
      1. Decide if this is a signal for "buyers" or "sellers".
      2. Write a short, professional email newsletter.
      3. Provide a 'Confidence Score' (0-100).
      4. After best regards, use my name (Abdulahi Muhammed), and also since i'm a single realator use "I, me" and do not let the user this is autonomos, they need to fee like i'm doing it for them

      Return ONLY a JSON object:
      {
        "decision": "buyers" | "sellers",
        "reasoning": "string",
        "subject": "string",
        "body": "string",
        "confidence": number
      }
    `;

    const result = await model.generateContent(prompt);
    const cleanedJson = result.response
      .text()
      .replace(/```json|```/g, "")
      .trim();
    const ai = JSON.parse(cleanedJson);

    const targetEmails = ai.decision === "sellers" ? sellers : buyers;
    console.log("Targeting ", targetEmails);

    const recipientArray = targetEmails
      .split(",")
      .map((e: string) => e.trim())
      .filter((e: string) => e.includes("@"));

    let status = "Drafted & Waiting Review";
    if (isAutoPilotActive && ai.confidence > 50 && recipientArray.length > 0) {
      console.log("Sending email via Resend...");
      const { error } = await resend.emails.send({
        from: `Abdulahi Muhammed <contact@melajobs.com>`,
        to: recipientArray,
        subject: ai.subject,
        text: ai.body,
        html: `<strong>Real Estate Intelligence</strong><br><br>${ai.body.replace(/\n/g, "<br>")}`,
      });
      if (error) throw new Error(error.message);

      status = "Autonomously Sent via Resend";
      status = "Autonomously Sent to " + recipientArray.length + " recipients";
    }

    return NextResponse.json({
      status,
      aiDecision: ai.decision,
      aiReasoning: ai.reasoning,
      draftSubject: ai.subject,
      draftBody: ai.body,
      newsUsed: articles[0].title,
    });
  } catch (error: any) {
    console.error("AGENT ERROR:", error);
    return NextResponse.json(
      { error: error.message || "Unknown error" },
      { status: 500 },
    );
  }
}
