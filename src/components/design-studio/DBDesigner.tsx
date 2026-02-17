import { useMemo } from "react";
import { motion } from "framer-motion";
import { Table2, Link2 } from "lucide-react";
import type { DBSchema, Entity, Relationship } from "@/types/dbDesign";
import { cn } from "@/lib/utils";

interface DBDesignerProps {
  data: DBSchema;
}

/**
 * Database schema visualization (ER-style).
 * Renders entities as cards and relationships as connectors.
 * Backend can supply real DBSchema; this is ready for API integration.
 */
export default function DBDesigner({ data }: DBDesignerProps) {
  const entityMap = useMemo(() => {
    const m = new Map<string, Entity>();
    data.entities.forEach((e) => m.set(e.id, e));
    return m;
  }, [data.entities]);

  if (!data.entities.length) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center h-full min-h-[320px] text-muted-foreground p-8"
      >
        <Table2 className="w-12 h-12 mb-4 opacity-50" />
        <p className="text-sm">No entities in this schema yet.</p>
        <p className="text-xs mt-1">Generate DB design to see ER diagram.</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full h-full overflow-auto p-6"
    >
      <div className="inline-block min-w-full">
        {/* Entity cards in a simple grid; backend can provide positions later */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {data.entities.map((entity) => (
            <EntityCard key={entity.id} entity={entity} />
          ))}
        </div>

        {/* Relationships section */}
        {data.relationships.length > 0 && (
          <div className="mt-8 pt-6 border-t border-border">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2 mb-4">
              <Link2 className="w-4 h-4" />
              Relationships
            </h3>
            <div className="flex flex-wrap gap-3">
              {data.relationships.map((rel) => {
                const source = entityMap.get(rel.sourceEntityId);
                const target = entityMap.get(rel.targetEntityId);
                return (
                  <div
                    key={rel.id}
                    className="border border-border rounded-lg px-4 py-2 bg-card/80 text-sm"
                  >
                    <span className="font-medium">{source?.displayName ?? rel.sourceEntityId}</span>
                    <span className="mx-2 text-muted-foreground">
                      {rel.type.replace(/-/g, " → ")}
                    </span>
                    <span className="font-medium">{target?.displayName ?? rel.targetEntityId}</span>
                    {rel.name && (
                      <span className="ml-2 text-muted-foreground">({rel.name})</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function EntityCard({ entity }: { entity: Entity }) {
  return (
    <div className="border-gradient rounded-xl overflow-hidden">
      <div className="p-4 border-b border-border/50 bg-card/50">
        <h4 className="font-semibold text-foreground flex items-center gap-2">
          <Table2 className="w-4 h-4 text-primary" />
          {entity.displayName || entity.name}
        </h4>
      </div>
      <div className="p-3 space-y-1.5 bg-card/30">
        {entity.attributes.map((attr) => (
          <div
            key={attr.name}
            className={cn(
              "flex items-center justify-between text-xs font-mono",
              attr.primaryKey && "text-primary"
            )}
          >
            <span>{attr.name}</span>
            <span className="text-muted-foreground">
              {attr.type}
              {attr.primaryKey && " PK"}
              {attr.nullable && "?"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
