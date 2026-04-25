const MINIMAX_API_KEY = process.env.MINIMAX_API_KEY;
const MINIMAX_GROUP_ID = process.env.MINIMAX_GROUP_ID;

const MINIMAX_BASE = "https://api.minimax.chat";
const TIMEOUT_MS = 30_000;

function getHeaders() {
  if (!MINIMAX_API_KEY || !MINIMAX_GROUP_ID) {
    throw new Error("MINIMAX_API_KEY and MINIMAX_GROUP_ID env vars required");
  }
  return {
    Authorization: `Bearer ${MINIMAX_API_KEY}`,
  };
}

export async function transcreverAudio(
  buffer: Buffer,
  mimeType: string,
): Promise<string> {
  const formData = new FormData();
  formData.append(
    "file",
    new Blob([new Uint8Array(buffer)], { type: mimeType }),
    "audio",
  );
  formData.append("model", "speech-01-turbo");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(
      `${MINIMAX_BASE}/v1/audio/transcriptions?GroupId=${MINIMAX_GROUP_ID}`,
      {
        method: "POST",
        headers: getHeaders(),
        body: formData,
        signal: controller.signal,
      },
    );

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`MiniMax STT error: ${res.status} - ${text}`);
    }

    const json = (await res.json()) as { data: { text: string } };
    return json.data.text;
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
      `${MINIMAX_BASE}/v1/text/chatcompletion_v2?GroupId=${MINIMAX_GROUP_ID}`,
      {
        method: "POST",
        headers: {
          ...getHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "MiniMax-Text-01",
          temperature: 0.1,
          messages: [
            {
              role: "system",
              content:
                "Você é um assistente médico. Analise a transcrição de uma visita e extraia EXATAMENTE 3 campos em JSON válido.\n\n" +
                "Responda APENAS com JSON no formato:\n" +
                '{"resumo": "resumo conciso da visita", "proximaAcao": "próxima ação recomendada", "objetivoVisita": "objetivo principal da visita"}\n\n' +
                "NÃO adicione texto fora do JSON.",
            },
            {
              role: "user",
              content: transcricao,
            },
          ],
        }),
        signal: controller.signal,
      },
    );

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`MiniMax Chat error: ${res.status} - ${text}`);
    }

    const json = (await res.json()) as {
      choices: Array<{ message: { content: string } }>;
    };
    const content = json.choices[0]?.message?.content ?? "";

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
