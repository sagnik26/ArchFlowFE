import { ClipboardList, Home, LayoutDashboard } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const MOCK_EVENTS = [
  {
    id: "1",
    time: "2 min ago",
    action: "Generated HLD + DB + LLD",
    details: "Design Studio • Food delivery system",
  },
  {
    id: "2",
    time: "18 min ago",
    action: "Saved design",
    details: "HLDForge demo • E‑commerce platform",
  },
  {
    id: "3",
    time: "1 hr ago",
    action: "Signed in",
    details: "New session started",
  },
];

export default function AuditTrails() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border bg-card/60 backdrop-blur-xl sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent shadow-md shadow-primary/25">
              <ClipboardList className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-sm font-semibold tracking-tight text-foreground">
                Audit Trails
              </h1>
              <p className="text-[11px] text-muted-foreground">
                Minimal view of recent activity
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/" className="header-nav-link">
              <Home className="w-4 h-4" />
              Home
            </Link>
            <Link to="/studio" className="header-nav-link">
              <LayoutDashboard className="w-4 h-4" />
              Design Studio
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-stretch">
        <div className="container mx-auto px-4 py-8 flex-1 flex flex-col">
          <div className="glass-panel rounded-2xl p-6 md:p-8 flex flex-col gap-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-base md:text-lg font-semibold text-foreground">
                  Recent activity
                </h2>
                <p className="text-xs text-muted-foreground">
                  Lightweight log of design actions in this workspace.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="text-[11px] rounded-xl px-3"
                disabled
              >
                Export log
              </Button>
            </div>

            <div className="mt-2 rounded-xl border border-border/60 bg-card/70 overflow-hidden">
              <div className="grid grid-cols-[minmax(0,140px)_minmax(0,160px)_minmax(0,1fr)] gap-3 px-4 py-2 text-[11px] text-muted-foreground border-b border-border/60">
                <span>When</span>
                <span>Action</span>
                <span>Details</span>
              </div>
              <div className="divide-y divide-border/60 text-xs">
                {MOCK_EVENTS.map((event) => (
                  <div
                    key={event.id}
                    className="grid grid-cols-[minmax(0,140px)_minmax(0,160px)_minmax(0,1fr)] gap-3 px-4 py-3"
                  >
                    <span className="text-muted-foreground">{event.time}</span>
                    <span className="text-foreground">{event.action}</span>
                    <span className="text-muted-foreground">{event.details}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

