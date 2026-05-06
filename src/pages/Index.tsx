import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, FileText, CalendarClock, BookOpen, MessageCircle, Sparkles } from "lucide-react";
import { EmailGenerator } from "@/components/features/EmailGenerator";
import { MeetingSummarizer } from "@/components/features/MeetingSummarizer";
import { TaskPlanner } from "@/components/features/TaskPlanner";
import { ResearchAssistant } from "@/components/features/ResearchAssistant";
import { ChatAssistant } from "@/components/features/ChatAssistant";

const Index = () => {
  return (
    <div className="min-h-screen bg-[image:var(--gradient-subtle)]">
      <header className="border-b bg-card/60 backdrop-blur-md sticky top-0 z-10">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-glow)]">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-base font-semibold leading-tight">Flow</h1>
              <p className="text-[11px] text-muted-foreground leading-tight">AI Productivity Assistant</p>
            </div>
          </div>
          <a
            href="#features"
            className="hidden text-xs text-muted-foreground hover:text-foreground sm:block"
          >
            Built with Lovable AI
          </a>
        </div>
      </header>

      <main className="container py-10">
        <section className="mx-auto mb-10 max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1 text-xs text-muted-foreground">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
            Powered by Lovable AI
          </div>
          <h2 className="mb-3 bg-[image:var(--gradient-primary)] bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl">
            Your AI workplace co-pilot
          </h2>
          <p className="text-base text-muted-foreground">
            Draft emails, summarize meetings, plan your day, and research topics — all in one clean workspace.
          </p>
        </section>

        <section id="features">
          <Tabs defaultValue="email" className="w-full">
            <TabsList className="mx-auto mb-6 grid h-auto w-full max-w-3xl grid-cols-2 gap-1 sm:grid-cols-5">
              <TabsTrigger value="email" className="flex-col gap-1 py-2.5 text-xs sm:flex-row sm:text-sm">
                <Mail className="h-4 w-4" /> Email
              </TabsTrigger>
              <TabsTrigger value="meeting" className="flex-col gap-1 py-2.5 text-xs sm:flex-row sm:text-sm">
                <FileText className="h-4 w-4" /> Meeting
              </TabsTrigger>
              <TabsTrigger value="planner" className="flex-col gap-1 py-2.5 text-xs sm:flex-row sm:text-sm">
                <CalendarClock className="h-4 w-4" /> Planner
              </TabsTrigger>
              <TabsTrigger value="research" className="flex-col gap-1 py-2.5 text-xs sm:flex-row sm:text-sm">
                <BookOpen className="h-4 w-4" /> Research
              </TabsTrigger>
              <TabsTrigger value="chat" className="flex-col gap-1 py-2.5 text-xs sm:flex-row sm:text-sm">
                <MessageCircle className="h-4 w-4" /> Chat
              </TabsTrigger>
            </TabsList>

            <TabsContent value="email"><EmailGenerator /></TabsContent>
            <TabsContent value="meeting"><MeetingSummarizer /></TabsContent>
            <TabsContent value="planner"><TaskPlanner /></TabsContent>
            <TabsContent value="research"><ResearchAssistant /></TabsContent>
            <TabsContent value="chat"><ChatAssistant /></TabsContent>
          </Tabs>
        </section>

        <footer className="mx-auto mt-16 max-w-2xl text-center text-xs text-muted-foreground">
          AI-generated content may be inaccurate or biased. Always review before sending or making decisions.
        </footer>
      </main>
    </div>
  );
};

export default Index;
