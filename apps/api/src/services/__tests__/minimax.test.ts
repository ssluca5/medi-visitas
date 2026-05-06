import { jest, describe, it, expect, beforeEach } from "@jest/globals";

describe("transcreverAudio", () => {
  beforeEach(() => {
    jest.resetModules();
    (globalThis as any).fetch = jest.fn();
    process.env.MINIMAX_API_KEY = "test_key";
    process.env.MINIMAX_GROUP_ID = "test_group";
  });

  it("retorna texto da transcricao", async () => {
    (globalThis.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ text: "Transcricao de teste" }),
    });

    const { transcreverAudio } = await import("../minimax.js");
    const result = await transcreverAudio(Buffer.from("audio"), "audio/webm");
    expect(result).toBe("Transcricao de teste");
  });

  it("envia arquivo multipart com modelo de transcricao do MiniMax", async () => {
    (globalThis.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ text: "ok" }),
    });

    const { transcreverAudio } = await import("../minimax.js");
    await transcreverAudio(Buffer.from("audio"), "audio/webm");

    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
    const callArgs = (globalThis.fetch as any).mock.calls[0];
    const url = callArgs[0] as string;
    const options = callArgs[1] as any;
    expect(url).toContain("/audio/transcriptions");
    expect(url).toContain("GroupId=test_group");
    expect(options.method).toBe("POST");
    expect(options.headers.Authorization).toBe("Bearer test_key");
    expect(options.body.get("model")).toBe("speech-01-turbo");
    expect(options.body.get("file").type).toBe("audio/webm");
  });

  it("lanca erro quando MiniMax retorna status != 200", async () => {
    (globalThis.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 500,
      text: async () => "Internal Server Error",
    });

    const { transcreverAudio } = await import("../minimax.js");
    await expect(
      transcreverAudio(Buffer.from("audio"), "audio/webm"),
    ).rejects.toThrow("MiniMax STT error: 500");
  });
});

describe("extrairCamposVisita", () => {
  beforeEach(() => {
    jest.resetModules();
    (globalThis as any).fetch = jest.fn();
    process.env.MINIMAX_API_KEY = "test_key";
    process.env.MINIMAX_GROUP_ID = "test_group";
  });

  it("retorna objeto com campos da visita e sugestoes da IA", async () => {
    (globalThis.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        choices: [
          {
            message: {
              content:
                '{"resumo":"Paciente com dor","proximaAcao":"Retorno em 7 dias","objetivoVisita":"Avaliacao","proximaVisitaSugerida":{"dataISO":"2026-06-15T10:00:00.000Z","observacao":"Retornar para follow-up"},"sugestaoEstagio":"INTERESSADO"}',
            },
          },
        ],
      }),
    });

    const { extrairCamposVisita } = await import("../minimax.js");
    const result = await extrairCamposVisita("transcricao teste");
    expect(result).toEqual({
      resumo: "Paciente com dor",
      proximaAcao: "Retorno em 7 dias",
      objetivoVisita: "Avaliacao",
      proximaVisitaSugerida: {
        dataISO: "2026-06-15T10:00:00.000Z",
        observacao: "Retornar para follow-up",
      },
      sugestaoEstagio: "INTERESSADO",
    });
  });

  it("envia prompt correto para chatcompletion_v2", async () => {
    (globalThis.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        choices: [
          {
            message: {
              content: '{"resumo":"r","proximaAcao":"p","objetivoVisita":"o"}',
            },
          },
        ],
      }),
    });

    const { extrairCamposVisita } = await import("../minimax.js");
    await extrairCamposVisita("texto teste");

    const callArgs = (globalThis.fetch as any).mock.calls[0];
    const url = callArgs[0] as string;
    const options = callArgs[1] as any;
    expect(url).toContain("/text/chatcompletion_v2");
    expect(url).toContain("GroupId=test_group");
    expect(options.headers.Authorization).toBe("Bearer test_key");
    const body = JSON.parse(options.body);
    expect(body.model).toBe("MiniMax-Text-01");
    expect(body.temperature).toBe(0.1);
    expect(body.max_tokens).toBe(500);
    expect(body.messages[0].role).toBe("user");
    expect(body.messages[0].content).toContain("texto teste");
    expect(body.messages[0].content).toContain("assistente de CRM");
    expect(body.messages[0].content).toContain("proximaVisitaSugerida");
    expect(body.messages[0].content).toContain("sugestaoEstagio");
    expect(body.messages[0].content).toContain("NUNCA sugira regredir");
  });

  it("fallback quando JSON invalido usa transcricao.slice(0, 300)", async () => {
    (globalThis.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: "resposta sem JSON valido" } }],
      }),
    });

    const { extrairCamposVisita } = await import("../minimax.js");
    const longText = "x".repeat(500);
    const result = await extrairCamposVisita(longText);
    expect(result.resumo).toBe("x".repeat(300));
    expect(result.proximaAcao).toBe("");
    expect(result.objetivoVisita).toBe("");
    expect(result.proximaVisitaSugerida).toBeNull();
    expect(result.sugestaoEstagio).toBeNull();
  });

  it("lanca erro quando MiniMax retorna status != 200", async () => {
    (globalThis.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 429,
      text: async () => "Rate limited",
    });

    const { extrairCamposVisita } = await import("../minimax.js");
    await expect(extrairCamposVisita("texto")).rejects.toThrow(
      "MiniMax Chat error: 429",
    );
  });
});
