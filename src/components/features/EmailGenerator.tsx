import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles } from "lucide-react";
import { AIOutput } from "@/components/AIOutput";
import { streamAI } from "@/lib/streamAI";
import { toast } from "sonner";

export const EmailGenerator = () => {
  const [brief, setBrief] = useState("");
  const [tone, setTone] = useState("formal");
  const [audience, setAudience] = useState("client");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!brief.trim()) return toast.error("Describe what the email should say");
    setLoading(true);
    setOutput("");
    try {
      let acc = "";
      await streamAI(
        { mode: "email", input: brief, options: { tone, audience } },
        (c) => {
          acc += c;
          setOutput(acc);
        },
      );
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to generate");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="space-y-4 p-6">
        <div className="space-y-2">
          <Label>What should the email say?</Label>
          <Textarea
            value={brief}
            onChange={(e) => setBrief(e.target.value)}
            placeholder="e.g. Follow up with Acme Corp about the proposal we sent last Tuesday and propose a call next week."
            rows={6}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>Tone</Label>
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="formal">Formal</SelectItem>
                <SelectItem value="informal">Informal</SelectItem>
                <SelectItem value="persuasive">Persuasive</SelectItem>
                <SelectItem value="friendly">Friendly</SelectItem>
                <SelectItem value="apologetic">Apologetic</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Audience</Label>
            <Select value={audience} onValueChange={setAudience}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="client">Client</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="team">Team</SelectItem>
                <SelectItem value="recruiter">Recruiter</SelectItem>
                <SelectItem value="vendor">Vendor</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button onClick={generate} disabled={loading} variant="hero" className="w-full">
          <Sparkles className="mr-2 h-4 w-4" />
          {loading ? "Generating…" : "Generate Email"}
        </Button>
      </Card>
      <AIOutput content={output} loading={loading} filename="email.txt" />
    </div>
  );
};
