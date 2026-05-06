import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen } from "lucide-react";
import { AIOutput } from "@/components/AIOutput";
import { streamAI } from "@/lib/streamAI";
import { toast } from "sonner";

export const ResearchAssistant = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const run = async () => {
    if (!input.trim()) return toast.error("Enter a topic or paste an article");
    setLoading(true);
    setOutput("");
    try {
      let acc = "";
      await streamAI({ mode: "research", input }, (c) => {
        acc += c;
        setOutput(acc);
      });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to research");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="space-y-4 p-6">
        <div className="space-y-2">
          <Label>Topic or article text</Label>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter a topic to research, or paste an article to summarize…"
            rows={14}
          />
        </div>
        <Button onClick={run} disabled={loading} variant="hero" className="w-full">
          <BookOpen className="mr-2 h-4 w-4" />
          {loading ? "Researching…" : "Research & Summarize"}
        </Button>
      </Card>
      <AIOutput content={output} loading={loading} filename="research.md" />
    </div>
  );
};
