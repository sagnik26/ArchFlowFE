import { useState, useCallback } from "react";
import { DiagramResponse } from "@/types/diagram";
import { sampleDiagramData } from "@/data/sampleDiagram";

interface UseDiagramGeneratorOptions {
  apiEndpoint?: string;
  /** When true, generate() returns sample data instead of calling the API. Use when backend is not available. */
  useMockData?: boolean;
}

export const useDiagramGenerator = (options?: UseDiagramGeneratorOptions) => {
  const [data, setData] = useState<DiagramResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(
    async (topic: string, designType: string): Promise<DiagramResponse | null> => {
      setIsLoading(true);
      setError(null);

      if (options?.useMockData) {
        await new Promise((r) => setTimeout(r, 3500));
        const result: DiagramResponse = {
          ...sampleDiagramData,
          topic,
          type: designType,
          title: `${topic} – ${designType}`,
          description: `Sample diagram for "${topic}" (${designType}). Connect the API to get real diagrams.`,
        };
        setData(result);
        setIsLoading(false);
        return result;
      }

      try {
        const apiEndpoint =
          options?.apiEndpoint || "http://localhost:8080/api/v1/diagram";

        console.log("body", { topic, type: designType });
        const response = await fetch(apiEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ topic, type: designType }),
        });

        if (!response.ok) {
          const errorData = await response
            .json()
            .catch(() => ({ message: response.statusText }));
          const msg =
            errorData.message || `HTTP error! status: ${response.status}`;
          setError(msg);
          throw new Error(msg);
        }

        const result: DiagramResponse = await response.json();
        console.log("result", result);
        setData(result);
        return result;
      } catch (err) {
        if (err instanceof Error && err.message) {
          setError(err.message);
        } else {
          setError("Failed to generate diagram");
        }
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [options?.apiEndpoint, options?.useMockData]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
  }, []);

  return {
    data,
    isLoading,
    error,
    generate,
    reset,
  };
};
