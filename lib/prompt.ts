const createPrompt = (newsSummary: string) => `
  You are an Autonomous Real Estate Strategist. 
  Analyze this news: "${newsSummary}"

  Task:
  1. Decide if this is a signal for "buyers" or "sellers".
  2. Write a short, professional email newsletter.
  3. Provide a 'Confidence Score' (0-100).
  4. IMPORTANT: Use the placeholder [SENDER_NAME] for my signature. 
     Do not use a real name. Start with "Dear Client".

  Return ONLY a JSON object:
  {
    "decision": "buyers" | "sellers",
    "reasoning": "string",
    "subject": "string",
    "body": "string",
    "confidence": number
  }`;

export default createPrompt;
