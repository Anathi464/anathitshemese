import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Copy, Download, AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface AIOutputProps {
  content: string;
  loading: boolean;
  filename?: string;
}

export const AIOutput = ({ content, loading, filename = "output.txt" }: AIOutputProps) => {
  const copy = async () => {
    await navigator.clipboard.writeText(content);
    toast.success("Copied to clipboard");
  };

  const download = () => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!content && !loading) {
    return (
      <Card className="flex min-h-[300px] items-center justify-center border-dashed bg-muted/30 p-8 text-center text-sm text-muted-foreground">
        Your AI-generated output will appear here.
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between border-b bg-muted/40 px-4 py-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {loading ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Generating…
            </>
          ) : (
            <span className="font-medium text-foreground">AI Output</span>
          )}
        </div>
        <div className="flex gap-1">
          <Button size="sm" variant="ghost" onClick={copy} disabled={!content}>
            <Copy className="mr-1 h-3.5 w-3.5" /> Copy
          </Button>
          <Button size="sm" variant="ghost" onClick={download} disabled={!content}>
            <Download className="mr-1 h-3.5 w-3.5" /> Export
          </Button>
        </div>
      </div>
      <div className="prose prose-sm max-w-none p-5 dark:prose-invert prose-headings:mb-2 prose-headings:mt-4 prose-p:my-2 prose-table:text-xs">
        <ReactMarkdown>{content || "…"}</ReactMarkdown>
      </div>
      <div className="flex items-start gap-2 border-t bg-accent/40 px-4 py-2 text-[11px] text-accent-foreground">
        <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        <span>
          AI-generated content may contain inaccuracies or bias. Please review and edit before sharing.
        </span>
      </div>
    </Card>
  );
};
