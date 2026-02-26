import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.LLM_API_KEY ?? "",
});

const DEFAULT_MODEL = "gpt-4o-mini";

/**
 * Call LLM with JSON mode; returns raw string for caller to parse/validate.
 */
export async function generateStructured(
  systemPrompt: string,
  userPrompt: string,
  options?: { model?: string }
): Promise<string> {
  const model = options?.model ?? DEFAULT_MODEL;
  const response = await openai.chat.completions.create({
    model,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    response_format: { type: "json_object" },
    temperature: 0.3,
  });
  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error("Empty response from LLM");
  return content;
}
