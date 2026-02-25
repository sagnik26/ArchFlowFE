import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Boxes,
  Database,
  Code2,
  ArrowRight,
  Sparkles,
  LayoutDashboard,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const MODULES = [
  {
    id: "hld",
    icon: Boxes,
    title: "High-Level Design",
    subtitle: "System architecture",
    description:
      "Generate system architecture diagrams from a single prompt. Interactive React Flow canvas with layers and components.",
    color: "from-primary to-primary/80",
    href: "/generate",
    cta: "Start HLD",
  },
  {
    id: "db",
    icon: Database,
    title: "DB Design",
    subtitle: "Database schema & ER",
    description:
      "HLD context flows into ER schemas. Define entities, relationships, and get a clear database design.",
    color: "from-accent to-accent/80",
    href: "/db-design",
    cta: "Go to DB Design",
  },
  {
    id: "lld",
    icon: Code2,
    title: "LLD Generation",
    subtitle: "Classes & APIs",
    description:
      "Class diagrams and API specs built on HLD + DB context. Ready for implementation.",
    color: "from-primary to-accent",
    href: "/lld",
    cta: "Go to LLD",
  },
] as const;

export default function Landing() {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Hero background */}
      <div className="fixed inset-0 hero-gradient-mesh hero-grid hero-spotlight pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_60%_40%_at_70%_0%,hsl(var(--primary)/0.12),transparent)] pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_40%_60%_at_20%_100%,hsl(var(--accent)/0.1),transparent)] pointer-events-none" />

      <div className="relative">
        {/* Nav */}
        <nav className="border-b border-border/50 bg-background/50 backdrop-blur-xl sticky top-0 z-50">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/20">
                <Boxes className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">
                HLDForge
              </span>
            </Link>
            <div className="flex items-center gap-1 sm:gap-0 flex-wrap justify-end">
              <Link
                to="/#modules"
                className="header-nav-link hidden sm:inline-flex"
              >
                Modules
              </Link>
              <Link to="/generate" className="header-nav-link">
                Quick HLD
              </Link>
              <Link to="/db-design" className="header-nav-link">
                DB Design
              </Link>
              <Link to="/lld" className="header-nav-link mr-4">
                LLD
              </Link>
              <Button
                size="sm"
                className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25"
                asChild
              >
                <Link to="/studio">
                  Design Studio
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </nav>

        {/* Hero */}
        <section className="container mx-auto px-4 pt-20 pb-28 md:pt-28 md:pb-36">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div
              variants={item}
              className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm text-primary mb-8"
            >
              <Sparkles className="w-4 h-4" />
              <span>HLD → DB Design → LLD in one flow</span>
            </motion.div>
            <motion.h1
              variants={item}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-6"
            >
              <span className="block">Design systems</span>
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] animate-gradient-shift">
                from idea to schema
              </span>
            </motion.h1>
            <motion.p
              variants={item}
              className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
            >
              Generate high-level architecture, database schemas, and low-level
              design in a single guided flow. Context flows between phases—no
              starting from scratch.
            </motion.p>
            <motion.div
              variants={item}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Button
                size="lg"
                className="gap-2 w-full sm:w-auto text-base px-8 py-6 bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl shadow-primary/30 hover:shadow-primary/40 transition-shadow"
                asChild
              >
                <Link to="/studio">
                  <LayoutDashboard className="w-5 h-5" />
                  Open Design Studio
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </section>

        {/* Modules – what the product offers (navigation target) */}
        <section
          id="modules"
          className="container mx-auto px-4 py-16 md:py-24 scroll-mt-20"
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              What HLDForge offers
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Three modules in one flow: start with system architecture, add
              database design, then generate low-level design. Jump to any
              module below.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {MODULES.map((module, i) => (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.1 }}
                className="group"
              >
                <Link to={module.href}>
                  <div className="relative h-full rounded-2xl p-[1px] bg-gradient-to-b from-primary/50 via-accent/50 to-primary/50 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/10">
                    <div className="relative h-full rounded-2xl bg-card border border-border/50 p-6 flex flex-col text-left transition-colors group-hover:bg-card/90">
                      <div
                        className={cn(
                          "inline-flex p-3 rounded-xl bg-gradient-to-br mb-4 w-fit",
                          module.color,
                        )}
                      >
                        <module.icon className="w-6 h-6 text-white" />
                      </div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                        {module.subtitle}
                      </p>
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        {module.title}
                      </h3>
                      <p className="text-sm text-muted-foreground flex-1">
                        {module.description}
                      </p>
                      <span className="inline-flex items-center gap-1.5 text-sm text-primary font-medium mt-4 group-hover:gap-2 transition-all">
                        {module.cta}
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA strip – same max width as feature cards above */}
        <section className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-3xl p-[1px] bg-gradient-to-r from-primary via-accent to-primary overflow-hidden max-w-5xl mx-auto"
          >
            <div className="rounded-3xl bg-card/95 backdrop-blur p-8 md:p-12 text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                Ready to design?
              </h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Start with a system topic and get HLD, DB schema, and LLD in one
                flow.
              </p>
              <Button
                size="lg"
                className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
                asChild
              >
                <Link to="/studio">
                  Open Design Studio
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border/50 py-8 mt-8">
          <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Boxes className="w-5 h-5 text-primary" />
              <span className="font-semibold text-foreground">HLDForge</span>
            </div>
            <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2">
              <Link to="/" className="header-nav-link">
                Home
              </Link>
              <Link to="/generate" className="header-nav-link">
                Quick HLD
              </Link>
              <Link to="/db-design" className="header-nav-link">
                DB Design
              </Link>
              <Link to="/lld" className="header-nav-link">
                LLD
              </Link>
              <Link to="/studio" className="header-nav-link">
                Design Studio
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
