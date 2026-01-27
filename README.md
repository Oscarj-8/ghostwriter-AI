# 🤖 Ghostwriter-AI — Autonomous Real Estate Agent

**Ghostwriter-AI** is a production-ready, autonomous AI agent designed for realtors to bridge the gap between global market shifts and client communication.

It monitors the real estate market 24/7, analyzes news with professional-grade reasoning, and executes high-impact outreach strategies — either fully autonomously or with human oversight.

---

## 🌟 Key Features

### 🕗 Morning Market Scan
An automated daily **“heartbeat”** that triggers a full market intelligence sweep at **8:00 AM**.

### ⚙️ Dual-Mode Operation
- **Auto-Pilot Mode**  
  High-confidence insights are sent directly to clients using a pre-verified **Resend** email infrastructure.

- **Human-in-the-Loop (HITL)**  
  Low-confidence or sensitive insights are generated as drafts for the realtor to **review, edit, or approve** before sending.

### 🧠 AI Reasoning Engine
Powered by **Google Gemini 1.5 Flash**, the agent:
- Analyzes real-estate-related news
- Categorizes impact specifically for **Buyers** or **Sellers**
- Assigns a **Confidence Score** to each insight

### ☁️ Cloud-Synchronized CRM
Migrated from browser-local storage to a centralized **Supabase PostgreSQL** backend, enabling:
- Cross-device persistence
- Headless, autonomous execution
- Secure storage of contacts, settings, and agent history

---

## 🛠 Technical Stack

| Layer        | Technology                    | Purpose |
|-------------|-------------------------------|--------|
| Framework   | Next.js 16 (App Router)        | Modern full-stack architecture with Server Actions |
| Intelligence| Google Gemini 1.5 Flash        | Context-aware market analysis and professional drafting |
| Database    | Supabase (PostgreSQL)          | Centralized storage for contacts, settings, and agent history |
| Email API   | Resend                         | High-deliverability transactional email service |
| Automation  | Google Apps Script             | Serverless daily cron job for autonomous scans |

---

## 📐 System Architecture

### 1️⃣ Trigger
At **8:00 AM**, a **Google Apps Script** sends a secure `POST` request to the Next.js API endpoint.

### 2️⃣ Context Fetch
The agent retrieves:
- Client contact emails
- `agent_settings` (Auto-Pilot status)
from **Supabase**.

### 3️⃣ Intelligence
The agent:
- Fetches real-estate news from **NewsData.io**
- Uses **Gemini** to determine:
  - Which client segment is affected (**Buyers vs. Sellers**)
  - The **Confidence Score** of the insight

### 4️⃣ Action
- **If Auto-Pilot is ON** and **Confidence > 70%**  
  → Sends the email automatically via **Resend**
- **Otherwise**  
  → Saves a draft to the **Activity Feed** for manual approval using a **Server Action**

---

## 🚀 Why Mela Intelligence?

Ghostwriter AI transforms raw market data into **actionable, personalized communication**, allowing realtors to:
- Stay ahead of market shifts
- Communicate consistently and professionally
- Scale client outreach without losing human control

---

