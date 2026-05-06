import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarClock } from "lucide-react";
import { AIOutput } from "@/components/AIOutput";
import { streamAI } from "@/lib/streamAI";
import { toast } from "sonner";

export const TaskPlanner = () => {
  const [tasks, setTasks] = useState("");
  const [timeframe, setTimeframe] = useState("today");
  const [hours, setHours] = useState("8");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const run = async () => {
    if (!tasks.trim()) return toast.error("List your tasks first");
    setLoading(true);
    setOutput("");
    try {
      let acc = "";
      await streamAI(
        { mode: "planner", input: tasks, options: { timeframe, available_hours: hours } },
        (c) => {
          acc += c;
          setOutput(acc);
        },
      );
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="space-y-4 p-6">
        <div className="space-y-2">
          <Label>Your tasks & goals</Label>
          <Textarea
            value={tasks}
            onChange={(e) => setTasks(e.target.value)}
            placeholder="One per line. Add deadlines or context where helpful."
            rows={10}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>Timeframe</Label>
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="this week">This week</SelectItem>
                <SelectItem value="next 2 weeks">Next 2 weeks</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Hours/day available</Label>
            <Select value={hours} onValueChange={setHours}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {[2, 4, 6, 8, 10].map((h) => (
                  <SelectItem key={h} value={String(h)}>{h} hours</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button onClick={run} disabled={loading} variant="hero" className="w-full">
          <CalendarClock className="mr-2 h-4 w-4" />
          {loading ? "Planning…" : "Generate Plan"}
        </Button>
      </Card>
      <AIOutput content={output} loading={loading} filename="task-plan.md" />
    </div>
  );
};
