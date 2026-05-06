const MINIMAX_API_KEY = process.env.MINIMAX_API_KEY;
const MINIMAX_GROUP_ID = process.env.MINIMAX_GROUP_ID;
const MINIMAX_BASE =
  process.env.MINIMAX_API_URL ?? "https://api.minimax.chat/v1";
const MINIMAX_STT_MODEL = process.env.MINIMAX_STT_MODEL ?? "speech-01-turbo";
const MINIMAX_TEXT_MODEL = process.env.MINIMAX_TEXT_MODEL ?? "MiniMax-Text-01";
const TIMEOUT_MS = 30_000;

type ProximaVisitaSugerida = {
  dataISO: string | null;
  observacao: string;
} | null;

type CamposVisita = {
  resumo: string;
  proximaAcao: string;
  objetivoVisita: string;
  proximaVisitaSugerida: ProximaVisitaSugerida;
  sugestaoEstagio:
    | "PROSPECTADO"
    | "VISITADO"
    | "INTERESSADO"
    | "PRESCRITOR"
    | "FIDELIZADO"
    | null;
};

type MiniMaxTranscriptionResponse = {
  text?: string;
  transcription?: string;
  data?: {
    text?: string;
    transcription?: string;
  };
};

type MiniMaxChatResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
  reply?: string;
  text?: string;
};

function getUrl(path: string) {
  if (!MINIMAX_API_KEY) {
    throw new Error("MINIMAX_API_KEY env var required");
  }
  if (!MINIMAX_GROUP_ID) {
    throw new Error("MINIMAX_GROUP_ID env var required");
  }

  const query = new URLSearchParams({ GroupId: MINIMAX_GROUP_ID });
  return `${MINIMAX_BASE.replace(/\/$/, "")}${path}?${query.toString()}`;
}

function getAudioFilename(mimeType: string) {
  const extension = mimeType.split("/")[1]?.split(";")[0] ?? "webm";
  return `audio.${extension}`;
}

function parseTranscricao(data: MiniMaxTranscriptionResponse) {
  return (
    data.text ??
    data.transcription ??
    data.data?.text ??
    data.data?.transcription ??
    ""
  );
}

function cleanJsonContent(content: string) {
  return content.replace(/```json|```/gi, "").trim();
}

export async function transcreverAudio(
  buffer: Buffer,
  mimeType: string,
): Promise<string> {
  const formData = new FormData();
  const blob = new Blob([new Uint8Array(buffer)], { type: mimeType });
  formData.append("file", blob, getAudioFilename(mimeType));
  formData.append("model", MINIMAX_STT_MODEL);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(getUrl("/audio/transcriptions"), {
      method: "POST",
      headers: { Authorization: `Bearer ${MINIMAX_API_KEY}` },
      body: formData,
      signal: controller.signal,
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`MiniMax STT error: ${res.status} - ${text}`);
    }

    const json = (await res.json()) as MiniMaxTranscriptionResponse;
    return parseTranscricao(json);
  } finally {
    clearTimeout(timeout);
  }
}

export async function extrairCamposVisita(
  transcricao: string,
): Promise<CamposVisita> {
  const prompt =
    "Voce e um assistente de CRM para propagandistas farmaceuticos.\n" +
    "Analise a transcricao de audio abaixo e extraia as informacoes da visita medica.\n\n" +
    `Transcricao:\n"${transcricao}"\n\n` +
    "Retorne APENAS um JSON valido com exatamente estas 5 chaves:\n" +
    "{\n" +
    '  "resumo": "resumo objetivo do que foi discutido e resultado da visita",\n' +
    '  "proximaAcao": "proxima acao planejada com data ou prazo se mencionado",\n' +
    '  "objetivoVisita": "objetivo principal da visita",\n' +
    '  "proximaVisitaSugerida": null ou { "dataISO": "2026-06-15T10:00:00.000Z" ou null, "observacao": "motivo ou contexto do retorno" },\n' +
    '  "sugestaoEstagio": null ou um dos valores: "PROSPECTADO", "VISITADO", "INTERESSADO", "PRESCRITOR", "FIDELIZADO"\n' +
    "}\n\n" +
    "Instrucoes para proximaVisitaSugerida:\n" +
    "- Se o propagandista mencionar que vai retornar, voltar, agendar proxima visita ou follow-up, preencha o objeto.\n" +
    "- dataISO: tente inferir a data com base em expressoes como 'daqui 30 dias', 'semana que vem', 'mes que vem'. Se nao for possivel inferir, use null.\n" +
    "- Se nao houver mencao de retorno, use null para o campo inteiro.\n\n" +
    "Instrucoes para sugestaoEstagio:\n" +
    "- Analise o tom e resultado da visita para sugerir o estagio mais adequado.\n" +
    "- VISITADO: visita realizada sem interesse especial.\n" +
    "- INTERESSADO: medico demonstrou interesse no produto, pediu mais informacoes ou amostras.\n" +
    "- PRESCRITOR: medico confirmou que vai ou ja esta prescrevendo.\n" +
    "- FIDELIZADO: medico e prescrito frequente, relacao consolidada.\n" +
    "- Se nao houver indicacao clara de mudanca de estagio, use null.\n" +
    "- NUNCA sugira regredir o estagio (ex: de PRESCRITOR para VISITADO).\n\n" +
    'Se alguma informacao nao estiver presente, use string vazia "" para textos e null para objetos.\n' +
    "Responda SOMENTE com o JSON, sem markdown, sem explicacoes.";

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(getUrl("/text/chatcompletion_v2"), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${MINIMAX_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MINIMAX_TEXT_MODEL,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.1,
        max_tokens: 500,
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`MiniMax Chat error: ${res.status} - ${text}`);
    }

    const json = (await res.json()) as MiniMaxChatResponse;
    const content =
      json.choices?.[0]?.message?.content ?? json.reply ?? json.text ?? "{}";

    try {
      const parsed = JSON.parse(
        cleanJsonContent(content),
      ) as Partial<CamposVisita>;
      return {
        resumo: typeof parsed.resumo === "string" ? parsed.resumo : "",
        proximaAcao:
          typeof parsed.proximaAcao === "string" ? parsed.proximaAcao : "",
        objetivoVisita:
          typeof parsed.objetivoVisita === "string"
            ? parsed.objetivoVisita
            : "",
        proximaVisitaSugerida: parsed.proximaVisitaSugerida ?? null,
        sugestaoEstagio: parsed.sugestaoEstagio ?? null,
      };
    } catch {
      return {
        resumo: transcricao.slice(0, 300),
        proximaAcao: "",
        objetivoVisita: "",
        proximaVisitaSugerida: null,
        sugestaoEstagio: null,
      };
    }
  } finally {
    clearTimeout(timeout);
  }
}
