import { useState } from "react";
import { Download, FileJson, FileImage, FileText, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useDesignContext } from "@/store/designContext";
import { cn } from "@/lib/utils";

export type ExportFormat = "json" | "png" | "pdf" | "svg";

interface ExportManagerProps {
  className?: string;
  onExport?: (format: ExportFormat) => void | Promise<void>;
}

/**
 * Export manager: multiple output formats.
 * onExport(format) can call backend or client-side export; structure is ready for API.
 */
export default function ExportManager({ className, onExport }: ExportManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [exporting, setExporting] = useState<ExportFormat | null>(null);
  const { currentPhase, hldResult, dbResult, lldResult } = useDesignContext();

  const hasAnyData = hldResult || dbResult || lldResult;

  const handleExport = async (format: ExportFormat) => {
    setExporting(format);
    try {
      if (onExport) {
        await onExport(format);
      } else {
        // Placeholder: backend can replace with real export API
        await new Promise((r) => setTimeout(r, 600));
        console.log("Export requested:", format, { hldResult: !!hldResult, dbResult: !!dbResult, lldResult: !!lldResult });
      }
    } finally {
      setExporting(null);
      setIsOpen(false);
    }
  };

  const formatLabel: Record<ExportFormat, string> = {
    json: "JSON (full context)",
    png: "PNG (diagram/image)",
    pdf: "PDF (document)",
    svg: "SVG (vector)",
  };

  const formatIcon: Record<ExportFormat, React.ElementType> = {
    json: FileJson,
    png: FileImage,
    pdf: FileText,
    svg: FileImage,
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={!hasAnyData}
          className={cn("gap-2 border-border bg-card hover:bg-muted", className)}
        >
          <Download className="w-4 h-4" />
          Export
          <ChevronDown className="w-4 h-4 opacity-70" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52 border-border bg-card">
        {(Object.entries(formatLabel) as [ExportFormat, string][]).map(([format, label]) => {
          const Icon = formatIcon[format];
          const busy = exporting === format;
          return (
            <DropdownMenuItem
              key={format}
              onClick={() => handleExport(format)}
              disabled={!!exporting}
              className="gap-2"
            >
              <Icon className="w-4 h-4" />
              {label}
              {busy && (
                <span className="ml-auto h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
