import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPTS: Record<string, string> = {
  email: `You are an expert email writer. Generate a complete, professional email based on the user's brief.
Output format (markdown):
**Subject:** <subject line>

<email body with greeting, body paragraphs, and sign-off>

Adapt tone and audience exactly as specified. Be concise, clear, and ready-to-send.`,

  summarize: `You are an expert meeting notes summarizer. Given raw meeting notes or a transcript, produce a structured summary in markdown:

## Summary
<2-3 sentence overview>

## Key Points
- ...

## Decisions
- ...

## Action Items
| Task | Owner | Deadline |
|------|-------|----------|
| ... | ... | ... |

If a section has no content, write "None identified."`,

  planner: `You are an expert productivity coach and task planner. Given a list of tasks/goals and a timeframe, produce a prioritized plan in markdown:

## Prioritized Plan
Use the Eisenhower matrix (Urgent/Important). For each task assign: Priority (P1/P2/P3), estimated time, and suggested time block.

## Daily/Weekly Schedule
Provide a realistic schedule with time blocks.

## Productivity Tips
3-5 specific suggestions to optimize focus and reduce friction.`,

  research: `You are an expert research assistant. Given a topic or article text, produce in markdown:

## TL;DR
<3 sentences max>

## Key Insights
- ...

## Recommendations / Next Steps
- ...

## Simplified Explanation
Explain the topic as if to a smart non-expert in 1 short paragraph.

If the user pasted an article, summarize it. If they gave a topic, share what you know but note knowledge cutoff and suggest verifying recent facts.`,

  chat: `You are a helpful, friendly workplace productivity assistant. Help with emails, meetings, planning, research, and general work questions. Be concise and use markdown formatting. Remind users to verify AI output for important decisions when relevant.`,
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { mode, messages, input, options } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const system = SYSTEM_PROMPTS[mode] || SYSTEM_PROMPTS.chat;

    let chatMessages;
    if (mode === "chat") {
      chatMessages = [{ role: "system", content: system }, ...(messages || [])];
    } else {
      let userContent = input || "";
      if (options && Object.keys(options).length) {
        const opts = Object.entries(options)
          .filter(([_, v]) => v)
          .map(([k, v]) => `- ${k}: ${v}`)
          .join("\n");
        if (opts) userContent = `Parameters:\n${opts}\n\nInput:\n${input}`;
      }
      chatMessages = [
        { role: "system", content: system },
        { role: "user", content: userContent },
      ];
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: chatMessages,
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits in Settings." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errText = await response.text();
      console.error("Gateway error:", response.status, errText);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("ai-assist error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
