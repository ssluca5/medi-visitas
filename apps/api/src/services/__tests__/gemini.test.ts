import { jest, describe, it, expect, beforeEach } from "@jest/globals";

describe("transcreverAudio", () => {
  beforeEach(() => {
    jest.resetModules();
    (globalThis as any).fetch = jest.fn();
    process.env.GEMINI_API_KEY = "test_key";
  });

  it("retorna texto da transcrição", async () => {
    (globalThis.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        candidates: [
          { content: { parts: [{ text: "Transcrição de teste" }] } },
        ],
      }),
    });

    const { transcreverAudio } = await import("../gemini.js");
    const result = await transcreverAudio(Buffer.from("audio"), "audio/webm");
    expect(result).toBe("Transcrição de teste");
  });

  it("envia inline_data com audio base64 e prompt de transcrição", async () => {
    (globalThis.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        candidates: [{ content: { parts: [{ text: "ok" }] } }],
      }),
    });

    const { transcreverAudio } = await import("../gemini.js");
    await transcreverAudio(Buffer.from("audio"), "audio/webm");

    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
    const callArgs = (globalThis.fetch as any).mock.calls[0];
    const url = callArgs[0] as string;
    const options = callArgs[1] as any;
    expect(url).toContain("gemini-2.0-flash:generateContent");
    expect(url).toContain("key=test_key");
    expect(options.method).toBe("POST");
    const body = JSON.parse(options.body);
    expect(body.contents[0].parts[0].inline_data.mime_type).toBe("audio/webm");
    expect(body.contents[0].parts[0].inline_data.data).toBe(
      Buffer.from("audio").toString("base64"),
    );
  });

  it("lança erro quando Gemini retorna status != 200", async () => {
    (globalThis.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 500,
      text: async () => "Internal Server Error",
    });

    const { transcreverAudio } = await import("../gemini.js");
    await expect(
      transcreverAudio(Buffer.from("audio"), "audio/webm"),
    ).rejects.toThrow("Gemini STT error: 500");
  });
});

describe("extrairCamposVisita", () => {
  beforeEach(() => {
    jest.resetModules();
    (globalThis as any).fetch = jest.fn();
    process.env.GEMINI_API_KEY = "test_key";
  });

  it("retorna objeto com resumo, proximaAcao, objetivoVisita", async () => {
    (globalThis.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        candidates: [
          {
            content: {
              parts: [
                {
                  text: '{"resumo":"Paciente com dor","proximaAcao":"Retorno em 7 dias","objetivoVisita":"Avaliação"}',
                },
              ],
            },
          },
        ],
      }),
    });

    const { extrairCamposVisita } = await import("../gemini.js");
    const result = await extrairCamposVisita("transcrição teste");
    expect(result).toEqual({
      resumo: "Paciente com dor",
      proximaAcao: "Retorno em 7 dias",
      objetivoVisita: "Avaliação",
    });
  });

  it("envia prompt correto para generateContent", async () => {
    (globalThis.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        candidates: [
          {
            content: {
              parts: [
                {
                  text: '{"resumo":"r","proximaAcao":"p","objetivoVisita":"o"}',
                },
              ],
            },
          },
        ],
      }),
    });

    const { extrairCamposVisita } = await import("../gemini.js");
    await extrairCamposVisita("texto teste");

    const callArgs = (globalThis.fetch as any).mock.calls[0];
    const url = callArgs[0] as string;
    const options = callArgs[1] as any;
    expect(url).toContain("gemini-2.0-flash:generateContent");
    const body = JSON.parse(options.body);
    expect(body.generationConfig.temperature).toBe(0.1);
    expect(body.generationConfig.responseMimeType).toBe("application/json");
    expect(body.contents[0].role).toBe("user");
    expect(body.contents[0].parts[0].text).toBe("texto teste");
    expect(body.system_instruction.parts[0].text).toContain(
      "assistente médico",
    );
  });

  it("fallback quando JSON inválido — resumo = transcricao.slice(0, 300)", async () => {
    (globalThis.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        candidates: [
          { content: { parts: [{ text: "resposta sem JSON válido" }] } },
        ],
      }),
    });

    const { extrairCamposVisita } = await import("../gemini.js");
    const longText = "x".repeat(500);
    const result = await extrairCamposVisita(longText);
    expect(result.resumo).toBe("x".repeat(300));
    expect(result.proximaAcao).toBe("");
    expect(result.objetivoVisita).toBe("");
  });

  it("lança erro quando Gemini retorna status != 200", async () => {
    (globalThis.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 429,
      text: async () => "Rate limited",
    });

    const { extrairCamposVisita } = await import("../gemini.js");
    await expect(extrairCamposVisita("texto")).rejects.toThrow(
      "Gemini Chat error: 429",
    );
  });
});
