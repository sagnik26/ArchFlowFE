import { useState } from "react";
import { motion } from "framer-motion";
import { Code2, Braces, BookOpen } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { LLDDesign, ClassDefinition, ApiSpec } from "@/types/lldDesign";
import { cn } from "@/lib/utils";

interface LLDDesignerProps {
  data: LLDDesign;
}

/**
 * LLD phase: class diagrams and API design.
 * Backend can supply real LLDDesign; this is ready for API integration.
 */
export default function LLDDesigner({ data }: LLDDesignerProps) {
  const [activeTab, setActiveTab] = useState<"classes" | "apis">("classes");

  const hasClasses = data.classes?.length > 0;
  const hasApis = data.apis?.length > 0 && data.apis.some((a) => a.endpoints?.length > 0);

  if (!hasClasses && !hasApis) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center h-full min-h-[320px] text-muted-foreground p-8"
      >
        <Code2 className="w-12 h-12 mb-4 opacity-50" />
        <p className="text-sm">No classes or APIs in this design yet.</p>
        <p className="text-xs mt-1">Generate LLD to see class diagram and API spec.</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full h-full flex flex-col min-h-0 overflow-hidden"
    >
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "classes" | "apis")} className="flex-1 flex flex-col min-h-0">
        <TabsList className="w-full justify-start rounded-none border-b border-border bg-transparent p-0 h-11">
          <TabsTrigger
            value="classes"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Classes
          </TabsTrigger>
          <TabsTrigger
            value="apis"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            <Braces className="w-4 h-4 mr-2" />
            API Design
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-auto p-6">
          <TabsContent value="classes" className="m-0 focus-visible:ring-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {data.classes?.map((cls) => (
                <ClassCard key={cls.id} cls={cls} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="apis" className="m-0 focus-visible:ring-0">
            <div className="space-y-8">
              {data.apis?.map((spec) => (
                <ApiSpecBlock key={spec.id} spec={spec} />
              ))}
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </motion.div>
  );
}

function ClassCard({ cls }: { cls: ClassDefinition }) {
  return (
    <div className="border-gradient rounded-xl overflow-hidden">
      <div className="p-4 border-b border-border/50 bg-card/50">
        <h4 className="font-semibold text-foreground font-mono">{cls.name}</h4>
        {(cls.extends || cls.implements?.length) && (
          <p className="text-xs text-muted-foreground mt-1">
            {cls.extends && `extends ${cls.extends}`}
            {cls.extends && cls.implements?.length ? " " : ""}
            {cls.implements?.length ? `implements ${cls.implements.join(", ")}` : ""}
          </p>
        )}
      </div>
      <div className="p-3 space-y-3 bg-card/30 text-sm">
        {cls.properties?.length > 0 && (
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase mb-2">Properties</p>
            <div className="space-y-1 font-mono text-xs">
              {cls.properties.map((p) => (
                <div key={p.name} className="flex gap-2">
                  <span className={cn("text-muted-foreground", p.visibility === "private" && "text-destructive/80")}>
                    {p.visibility === "private" ? "−" : p.visibility === "protected" ? "#" : "+"}
                    {p.name}
                  </span>
                  <span className="text-muted-foreground">: {p.type}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {cls.methods?.length > 0 && (
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase mb-2">Methods</p>
            <div className="space-y-1 font-mono text-xs">
              {cls.methods.map((m) => (
                <div key={m.name}>
                  <span className={cn("text-muted-foreground", m.visibility === "private" && "text-destructive/80")}>
                    {m.visibility === "private" ? "−" : m.visibility === "protected" ? "#" : "+"}
                    {m.name}
                  </span>
                  <span className="text-muted-foreground">
                    ({m.parameters?.map((p) => `${p.name}: ${p.type}`).join(", ")}) : {m.returnType}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ApiSpecBlock({ spec }: { spec: ApiSpec }) {
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <div className="p-4 border-b border-border bg-card/50">
        <h4 className="font-semibold text-foreground flex items-center gap-2">
          <Braces className="w-4 h-4 text-primary" />
          {spec.name}
        </h4>
        {spec.basePath && (
          <p className="text-xs text-muted-foreground font-mono mt-1">{spec.basePath}</p>
        )}
      </div>
      <div className="divide-y divide-border">
        {spec.endpoints?.map((ep) => (
          <div key={ep.id} className="p-4 flex flex-wrap items-center gap-3 bg-card/30">
            <MethodBadge method={ep.method} />
            <span className="font-mono text-sm">{ep.path}</span>
            {ep.summary && (
              <span className="text-muted-foreground text-sm">{ep.summary}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function MethodBadge({ method }: { method: string }) {
  const colors: Record<string, string> = {
    GET: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    POST: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    PUT: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    PATCH: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    DELETE: "bg-red-500/20 text-red-400 border-red-500/30",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded border px-2 py-0.5 text-xs font-semibold",
        colors[method] ?? "bg-muted text-muted-foreground border-border"
      )}
    >
      {method}
    </span>
  );
}
