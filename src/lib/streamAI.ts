const URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-assist`;

export type StreamPayload = {
  mode: "email" | "summarize" | "planner" | "research" | "chat";
  input?: string;
  options?: Record<string, string>;
  messages?: { role: "user" | "assistant"; content: string }[];
};

export async function streamAI(
  payload: StreamPayload,
  onDelta: (chunk: string) => void,
): Promise<void> {
  const resp = await fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify(payload),
  });

  if (!resp.ok) {
    let msg = "Request failed";
    try {
      const j = await resp.json();
      msg = j.error || msg;
    } catch {}
    if (resp.status === 429) throw new Error("Rate limit exceeded. Please wait a moment.");
    if (resp.status === 402) throw new Error("AI credits exhausted. Add credits to continue.");
    throw new Error(msg);
  }
  if (!resp.body) throw new Error("No response stream");

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let done = false;

  while (!done) {
    const { done: d, value } = await reader.read();
    if (d) break;
    buffer += decoder.decode(value, { stream: true });

    let idx: number;
    while ((idx = buffer.indexOf("\n")) !== -1) {
      let line = buffer.slice(0, idx);
      buffer = buffer.slice(idx + 1);
      if (line.endsWith("\r")) line = line.slice(0, -1);
      if (!line || line.startsWith(":")) continue;
      if (!line.startsWith("data: ")) continue;
      const data = line.slice(6).trim();
      if (data === "[DONE]") {
        done = true;
        break;
      }
      try {
        const parsed = JSON.parse(data);
        const content = parsed.choices?.[0]?.delta?.content;
        if (content) onDelta(content);
      } catch {
        buffer = line + "\n" + buffer;
        break;
      }
    }
  }
}
