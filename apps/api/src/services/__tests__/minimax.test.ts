import { jest, describe, it, expect, beforeEach } from "@jest/globals";

describe("transcreverAudio", () => {
  beforeEach(() => {
    jest.resetModules();
    (globalThis as any).fetch = jest.fn();
    process.env.MINIMAX_API_KEY = "test_key";
    process.env.MINIMAX_GROUP_ID = "test_group";
  });

  it("retorna texto da transcrição", async () => {
    (globalThis.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: { text: "Transcrição de teste" } }),
    });

    const { transcreverAudio } = await import("../minimax.js");
    const result = await transcreverAudio(Buffer.from("audio"), "audio/webm");
    expect(result).toBe("Transcrição de teste");
  });

  it("envia FormData com modelo speech-01-turbo", async () => {
    (globalThis.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: { text: "ok" } }),
    });

    const { transcreverAudio } = await import("../minimax.js");
    await transcreverAudio(Buffer.from("audio"), "audio/webm");

    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
    const callArgs = (globalThis.fetch as any).mock.calls[0];
    const url = callArgs[0] as string;
    const options = callArgs[1] as any;
    expect(url).toContain("/v1/audio/transcriptions");
    expect(url).toContain("GroupId=test_group");
    expect(options.method).toBe("POST");
    expect(options.body).toBeInstanceOf(FormData);
  });

  it("lança erro quando MiniMax retorna status != 200", async () => {
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

  it("retorna objeto com resumo, proximaAcao, objetivoVisita", async () => {
    (globalThis.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        choices: [
          {
            message: {
              content:
                '{"resumo":"Paciente com dor","proximaAcao":"Retorno em 7 dias","objetivoVisita":"Avaliação"}',
            },
          },
        ],
      }),
    });

    const { extrairCamposVisita } = await import("../minimax.js");
    const result = await extrairCamposVisita("transcrição teste");
    expect(result).toEqual({
      resumo: "Paciente com dor",
      proximaAcao: "Retorno em 7 dias",
      objetivoVisita: "Avaliação",
    });
  });

  it("envia prompt correto para chat completion", async () => {
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
    expect(url).toContain("/v1/text/chatcompletion_v2");
    const body = JSON.parse(options.body);
    expect(body.model).toBe("MiniMax-Text-01");
    expect(body.temperature).toBe(0.1);
    expect(body.messages).toHaveLength(2);
    expect(body.messages[0].role).toBe("system");
    expect(body.messages[1].content).toBe("texto teste");
  });

  it("fallback quando JSON inválido — resumo = transcricao.slice(0, 300)", async () => {
    (globalThis.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        choices: [
          {
            message: { content: "resposta sem JSON válido" },
          },
        ],
      }),
    });

    const { extrairCamposVisita } = await import("../minimax.js");
    const longText = "x".repeat(500);
    const result = await extrairCamposVisita(longText);
    expect(result.resumo).toBe("x".repeat(300));
    expect(result.proximaAcao).toBe("");
    expect(result.objetivoVisita).toBe("");
  });

  it("lança erro quando MiniMax retorna status != 200", async () => {
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
