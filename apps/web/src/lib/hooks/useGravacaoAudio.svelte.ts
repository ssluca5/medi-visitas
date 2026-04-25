let gravando = $state(false);
let duracaoSegundos = $state(0);
let audioBlob = $state<Blob | null>(null);
let audioUrl = $state<string | null>(null);
let erroPermissao = $state<string | null>(null);
let mimeType = $state("");

let mediaRecorder: MediaRecorder | null = null;
let chunks: BlobPart[] = [];
let timer: ReturnType<typeof setInterval> | null = null;

function detectarMimeType(): string {
  if (typeof MediaRecorder === "undefined") return "audio/webm";
  if (MediaRecorder.isTypeSupported("audio/webm;codecs=opus"))
    return "audio/webm;codecs=opus";
  if (MediaRecorder.isTypeSupported("audio/webm")) return "audio/webm";
  if (MediaRecorder.isTypeSupported("audio/ogg")) return "audio/ogg";
  if (MediaRecorder.isTypeSupported("audio/mp4")) return "audio/mp4";
  return "audio/webm";
}

async function iniciar() {
  erroPermissao = null;
  audioBlob = null;
  if (audioUrl) {
    URL.revokeObjectURL(audioUrl);
    audioUrl = null;
  }
  duracaoSegundos = 0;

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mimeType = detectarMimeType();
    mediaRecorder = new MediaRecorder(stream, { mimeType });
    chunks = [];

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: mimeType });
      audioBlob = blob;
      audioUrl = URL.createObjectURL(blob);
      stream.getTracks().forEach((t) => t.stop());
      gravando = false;
      if (timer) clearInterval(timer);
      timer = null;
    };

    mediaRecorder.start(1000);
    gravando = true;

    timer = setInterval(() => {
      duracaoSegundos++;
      if (duracaoSegundos >= 180) {
        parar();
      }
    }, 1000);
  } catch (err: any) {
    erroPermissao =
      err.name === "NotAllowedError"
        ? "Permissão de microfone negada. Habilite nas configurações do navegador."
        : `Erro ao acessar microfone: ${err.message}`;
  }
}

function parar() {
  if (mediaRecorder && mediaRecorder.state !== "inactive") {
    mediaRecorder.stop();
  }
}

function descartar() {
  if (audioUrl) URL.revokeObjectURL(audioUrl);
  audioBlob = null;
  audioUrl = null;
  duracaoSegundos = 0;
  erroPermissao = null;
}

export function useGravacaoAudio() {
  return {
    get gravando() {
      return gravando;
    },
    get duracaoSegundos() {
      return duracaoSegundos;
    },
    get audioBlob() {
      return audioBlob;
    },
    get audioUrl() {
      return audioUrl;
    },
    get erroPermissao() {
      return erroPermissao;
    },
    get mimeType() {
      return mimeType;
    },
    iniciar,
    parar,
    descartar,
  };
}
