import { Activity, Home, LayoutDashboard } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const MOCK_USAGE = [
  { id: "1", label: "Design Studio runs (today)", value: "3" },
  { id: "2", label: "Tokens used (approx., today)", value: "28,400" },
  { id: "3", label: "Tokens used (this week)", value: "146,200" },
  { id: "4", label: "Most expensive flow", value: "E‑commerce LLD" },
];

export default function TokenUsage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border bg-card/60 backdrop-blur-xl sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent shadow-md shadow-primary/25">
              <Activity className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-sm font-semibold tracking-tight text-foreground">
                Token usage
              </h1>
              <p className="text-[11px] text-muted-foreground">
                Simple overview of LLM consumption
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
        <div className="container mx-auto px-4 py-8 flex-1 flex flex-col gap-6 md:flex-row">
          <div className="flex-1 flex flex-col gap-6">
            <div className="glass-panel rounded-2xl p-6 md:p-8 flex flex-col gap-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-base md:text-lg font-semibold text-foreground">
                    Today&apos;s usage
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Approximate token counts based on recent generations.
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-[11px] rounded-xl px-3"
                  disabled
                >
                  View details
                </Button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {MOCK_USAGE.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-border/60 bg-card/80 px-4 py-3 flex flex-col gap-1"
                  >
                    <span className="text-[11px] text-muted-foreground uppercase tracking-wide">
                      {item.label}
                    </span>
                    <span className="text-lg font-semibold text-foreground">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="w-full md:w-[320px] flex flex-col">
            <div className="glass-panel rounded-2xl p-6 md:p-7 flex flex-col gap-3">
              <h3 className="text-sm font-semibold text-foreground">
                How this works
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                When you generate HLD, DB design, or LLD, the backend talks to
                an LLM provider. This view will later surface real token
                metrics; for now it mirrors the product&apos;s visual language
                with placeholder numbers.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

