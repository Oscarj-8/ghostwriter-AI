"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendManualEmail(
  to: string,
  subject: string,
  body: string,
) {
  try {
    if (!to || !subject || !body) {
      throw new Error("Missing email fields.");
    }

    const recipientArray = to
      .split(",")
      .map((e) => e.trim())
      .filter((e) => e.includes("@"));

    const { data, error } = await resend.emails.send({
      from: `Mela Intelligence <${process.env.VERIFIED_SENDER}>`,
      to: recipientArray,
      subject: subject,
      text: body,
      html: `<p>${body.replace(/\n/g, "<br>")}</p>`,
    });
    console.log("data from resend", data);
    if (error) throw new Error(error.message);

    return { success: true };
  } catch (error: any) {
    console.error("Manual Send Error:", error);
    return { success: false, error: error.message };
  }
}
