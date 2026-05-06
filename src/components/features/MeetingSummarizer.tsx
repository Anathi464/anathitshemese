import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileText } from "lucide-react";
import { AIOutput } from "@/components/AIOutput";
import { streamAI } from "@/lib/streamAI";
import { toast } from "sonner";

export const MeetingSummarizer = () => {
  const [notes, setNotes] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const run = async () => {
    if (!notes.trim()) return toast.error("Paste meeting notes first");
    setLoading(true);
    setOutput("");
    try {
      let acc = "";
      await streamAI({ mode: "summarize", input: notes }, (c) => {
        acc += c;
        setOutput(acc);
      });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to summarize");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="space-y-4 p-6">
        <div className="space-y-2">
          <Label>Meeting notes or transcript</Label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Paste raw meeting notes, transcript, or bullet points…"
            rows={14}
          />
        </div>
        <Button onClick={run} disabled={loading} variant="hero" className="w-full">
          <FileText className="mr-2 h-4 w-4" />
          {loading ? "Summarizing…" : "Summarize Meeting"}
        </Button>
      </Card>
      <AIOutput content={output} loading={loading} filename="meeting-summary.md" />
    </div>
  );
};
