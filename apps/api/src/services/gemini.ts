const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta";
const GEMINI_MODEL = "gemini-2.0-flash";
const TIMEOUT_MS = 30_000;

function getUrl(path: string) {
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY env var required");
  }
  return `${GEMINI_BASE}${path}?key=${GEMINI_API_KEY}`;
}

export async function transcreverAudio(
  buffer: Buffer,
  mimeType: string,
): Promise<string> {
  const audioBase64 = buffer.toString("base64");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(
      getUrl(`/models/${GEMINI_MODEL}:generateContent`),
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { inline_data: { mime_type: mimeType, data: audioBase64 } },
                {
                  text: "Transcreva este áudio para texto em português. Retorne apenas a transcrição, sem comentários adicionais.",
                },
              ],
            },
          ],
        }),
        signal: controller.signal,
      },
    );

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Gemini STT error: ${res.status} - ${text}`);
    }

    const json = (await res.json()) as {
      candidates: Array<{ content: { parts: Array<{ text: string }> } }>;
    };
    return json.candidates[0]?.content?.parts[0]?.text ?? "";
  } finally {
    clearTimeout(timeout);
  }
}

export async function extrairCamposVisita(
  transcricao: string,
): Promise<{ resumo: string; proximaAcao: string; objetivoVisita: string }> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(
      getUrl(`/models/${GEMINI_MODEL}:generateContent`),
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: {
            parts: [
              {
                text:
                  "Você é um assistente médico. Analise a transcrição de uma visita e extraia EXATAMENTE 3 campos em JSON válido.\n\n" +
                  "Responda APENAS com JSON no formato:\n" +
                  '{"resumo": "resumo conciso da visita", "proximaAcao": "próxima ação recomendada", "objetivoVisita": "objetivo principal da visita"}\n\n' +
                  "NÃO adicione texto fora do JSON.",
              },
            ],
          },
          contents: [{ role: "user", parts: [{ text: transcricao }] }],
          generationConfig: {
            temperature: 0.1,
            responseMimeType: "application/json",
          },
        }),
        signal: controller.signal,
      },
    );

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Gemini Chat error: ${res.status} - ${text}`);
    }

    const json = (await res.json()) as {
      candidates: Array<{ content: { parts: Array<{ text: string }> } }>;
    };
    const content = json.candidates[0]?.content?.parts[0]?.text ?? "";

    try {
      const parsed = JSON.parse(content);
      return {
        resumo: parsed.resumo ?? "",
        proximaAcao: parsed.proximaAcao ?? "",
        objetivoVisita: parsed.objetivoVisita ?? "",
      };
    } catch {
      return {
        resumo: transcricao.slice(0, 300),
        proximaAcao: "",
        objetivoVisita: "",
      };
    }
  } finally {
    clearTimeout(timeout);
  }
}
