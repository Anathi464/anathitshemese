import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Send, Bot, User, AlertTriangle } from "lucide-react";
import { streamAI } from "@/lib/streamAI";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Msg = { role: "user" | "assistant"; content: string };

export const ChatAssistant = () => {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content: "Hi! I'm your workplace assistant. Ask me anything — drafting messages, planning your week, brainstorming, or quick research.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const userMsg: Msg = { role: "user", content: text };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);

    let acc = "";
    setMessages((p) => [...p, { role: "assistant", content: "" }]);
    try {
      await streamAI({ mode: "chat", messages: next }, (c) => {
        acc += c;
        setMessages((p) => p.map((m, i) => (i === p.length - 1 ? { ...m, content: acc } : m)));
      });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
      setMessages((p) => p.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="flex h-[70vh] flex-col overflow-hidden">
      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-6">
        {messages.map((m, i) => (
          <div key={i} className={cn("flex gap-3", m.role === "user" && "flex-row-reverse")}>
            <div
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                m.role === "user" ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground",
              )}
            >
              {m.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
            </div>
            <div
              className={cn(
                "prose prose-sm max-w-[80%] rounded-2xl px-4 py-2.5 dark:prose-invert prose-p:my-1.5 prose-headings:my-2",
                m.role === "user"
                  ? "bg-primary text-primary-foreground prose-invert"
                  : "bg-muted",
              )}
            >
              <ReactMarkdown>{m.content || "…"}</ReactMarkdown>
            </div>
          </div>
        ))}
      </div>
      <div className="border-t bg-card p-4">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            placeholder="Ask anything… (Shift+Enter for newline)"
            rows={1}
            className="min-h-[44px] resize-none"
          />
          <Button onClick={send} disabled={loading} size="icon" variant="hero" className="h-11 w-11 shrink-0">
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <AlertTriangle className="h-3 w-3" />
          AI may produce inaccurate info. Verify important details.
        </div>
      </div>
    </Card>
  );
};
