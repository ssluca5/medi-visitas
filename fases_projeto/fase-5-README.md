# Fase 5 — IA: Transcrição de Visitas com MiniMax 2.7

> MediVisitas · CRM para propagandistas farmacêuticos
> Stack frontend: **SvelteKit 2 + Svelte 5 Runes + Tailwind CSS v4**
> Pré-requisito: Fase 3 concluída (visitas funcionando)

---

## Objetivo da Fase

Permitir que o propagandista grave um áudio diretamente no browser após uma visita
e receba os campos preenchidos automaticamente pela IA:

- Gravação de áudio via **MediaRecorder API** (browser nativo — sem dependência)
- Transcrição via **MiniMax 2.7** (Speech-to-Text)
- Extração estruturada de **resumo**, **próxima ação** e **objetivo da visita**
- Botão de gravação flutuante na página de visitas
- Usuário escolhe se salva ou descarta o áudio após a transcrição
- Campo `audioUrl` opcional na tabela `Visita` para armazenar o áudio no Supabase Storage

---

## Entregáveis

| #  | Artefato | Localização |
|----|----------|-------------|
| 1  | Migration Prisma: campo `audioUrl` em `Visita` | `packages/database/prisma/migrations/` |
| 2  | `POST /visitas/:id/transcricao` — recebe áudio, retorna campos extraídos | `apps/api/src/routes/visitas/transcricao.ts` |
| 3  | `PATCH /visitas/:id/audio` — salva URL do áudio após decisão do usuário | `apps/api/src/routes/visitas/audio.ts` |
| 4  | Serviço MiniMax — transcrição + extração estruturada | `apps/api/src/services/minimax.ts` |
| 5  | Botão flutuante de gravação | `apps/web/src/lib/components/visitas/BotaoGravacao.svelte` |
| 6  | Modal de gravação e revisão | `apps/web/src/lib/components/visitas/ModalGravacao.svelte` |
| 7  | Hook de gravação de áudio | `apps/web/src/lib/hooks/useGravacaoAudio.svelte.ts` |
| 8  | Integração na página de visitas | `apps/web/src/routes/dashboard/visitas/+page.svelte` |
| 9  | Testes do serviço MiniMax (mock) | `apps/api/src/services/minimax.test.ts` |
| 10 | Testes da rota de transcrição (TDD) | `apps/api/src/routes/visitas/transcricao.test.ts` |

---

## Modelo de Dados (Prisma)

```prisma
// Adicionar campo em Visita — migration simples, sem nova tabela

model Visita {
  // ... campos existentes ...
  audioUrl  String?   // URL do áudio no Supabase Storage (opcional)
  // ... resto dos campos ...
}
```

Migration:
```sql
ALTER TABLE "Visita" ADD COLUMN "audioUrl" TEXT;
```

---

## Fluxo Completo

```
1. Propagandista abre /dashboard/visitas
2. Clica no botão flutuante de microfone (canto inferior direito, ao lado do FAB de nova visita)
3. Modal de gravação abre
4. Seleciona a visita que deseja registrar (dropdown das visitas AGENDADA do dia)
5. Clica em "Gravar" → MediaRecorder inicia
6. Fala o resumo da visita (30–120 segundos)
7. Clica em "Parar"
8. Frontend envia o áudio para POST /visitas/:id/transcricao
9. API envia áudio para MiniMax 2.7 (Speech-to-Text)
10. MiniMax retorna transcrição em texto
11. API envia texto para MiniMax (Chat/Completion) para extração estruturada
12. API retorna: { resumo, proximaAcao, objetivoVisita, transcricaoCompleta }
13. Modal exibe os campos extraídos para revisão do usuário
14. Usuário edita se necessário
15. Modal pergunta: "Salvar áudio?" → Sim ou Não
16. Se Sim → frontend faz upload para Supabase Storage + PATCH /visitas/:id/audio
17. Campos são aplicados na visita via PUT /visitas/:id existente
18. Modal fecha, visita atualizada na listagem
```

---

## Contratos de API

### `POST /visitas/:id/transcricao` → 200

```
Content-Type: multipart/form-data
Body: { audio: File (webm/ogg/mp4) }

Response:
{
  "transcricaoCompleta": "Visitei o Dr. João Silva hoje às 14h...",
  "resumo": "Médico demonstrou interesse no produto X. Solicitou mais informações sobre dosagem.",
  "proximaAcao": "Retornar em 15 dias com bula atualizada e amostras do produto X.",
  "objetivoVisita": "Apresentação do produto X linha cardiologia."
}
```

### `PATCH /visitas/:id/audio` → 200

```json
// Body
{ "audioUrl": "https://supabase.co/storage/v1/object/public/audios/visitas/cuid.webm" }

// Response
{ "id": "cuid...", "audioUrl": "https://..." }
```

---

## Serviço MiniMax — Implementação

```typescript
// apps/api/src/services/minimax.ts

const MINIMAX_API_URL = 'https://api.minimax.chat/v1'
const MINIMAX_GROUP_ID = process.env.MINIMAX_GROUP_ID!
const MINIMAX_API_KEY = process.env.MINIMAX_API_KEY!

// PASSO 1: Transcrição de áudio → texto
export async function transcreverAudio(audioBuffer: Buffer, mimeType: string): Promise<string> {
  const formData = new FormData()
  const blob = new Blob([audioBuffer], { type: mimeType })
  formData.append('file', blob, `audio.${mimeType.split('/')[1] ?? 'webm'}`)
  formData.append('model', 'speech-01-turbo')  // modelo de STT do MiniMax

  const response = await fetch(
    `${MINIMAX_API_URL}/audio/transcriptions?GroupId=${MINIMAX_GROUP_ID}`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${MINIMAX_API_KEY}` },
      body: formData,
    }
  )

  if (!response.ok) {
    const erro = await response.text()
    throw new Error(`MiniMax STT falhou: ${response.status} — ${erro}`)
  }

  const data = await response.json()
  return data.text ?? ''
}

// PASSO 2: Texto → campos estruturados via Chat Completion
export async function extrairCamposVisita(transcricao: string): Promise<{
  resumo: string
  proximaAcao: string
  objetivoVisita: string
}> {
  const prompt = `Você é um assistente de CRM para propagandistas farmacêuticos.
Analise a transcrição de áudio abaixo e extraia as informações da visita médica.

Transcrição:
"${transcricao}"

Retorne APENAS um JSON válido com exatamente estas 3 chaves:
{
  "resumo": "resumo objetivo do que foi discutido e resultado da visita (máx 300 chars)",
  "proximaAcao": "próxima ação planejada com data ou prazo se mencionado (máx 200 chars)",
  "objetivoVisita": "objetivo principal da visita (máx 150 chars)"
}

Se alguma informação não estiver presente na transcrição, use string vazia "".
Responda SOMENTE com o JSON, sem markdown, sem explicações.`

  const response = await fetch(
    `${MINIMAX_API_URL}/text/chatcompletion_v2?GroupId=${MINIMAX_GROUP_ID}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${MINIMAX_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'MiniMax-Text-01',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.1,   // baixa temperatura para respostas consistentes
        max_tokens: 500,
      }),
    }
  )

  if (!response.ok) {
    const erro = await response.text()
    throw new Error(`MiniMax Chat falhou: ${response.status} — ${erro}`)
  }

  const data = await response.json()
  const texto = data.choices?.[0]?.message?.content ?? '{}'

  try {
    const clean = texto.replace(/```json|```/g, '').trim()
    return JSON.parse(clean)
  } catch {
    // Fallback: se não conseguir parsear, coloca tudo no resumo
    return { resumo: transcricao.slice(0, 300), proximaAcao: '', objetivoVisita: '' }
  }
}
```

---

## Rota de Transcrição — Fastify

```typescript
// apps/api/src/routes/visitas/transcricao.ts
import type { FastifyInstance } from 'fastify'
import { verifyClerkToken } from '../../hooks/auth.js'
import { prisma } from '../../lib/prisma.js'
import { transcreverAudio, extrairCamposVisita } from '../../services/minimax.js'

export async function transcricaoRoutes(app: FastifyInstance) {
  // Registrar ANTES de qualquer rota com :id se necessário
  app.post(
    '/visitas/:id/transcricao',
    { preHandler: [verifyClerkToken] },
    async (request, reply) => {
      const userId = request.userId!
      const { id } = request.params as { id: string }

      // Verificar que a visita existe e pertence ao userId
      const visita = await prisma.visita.findFirst({
        where: { id, userId },
      })
      if (!visita) {
        return reply.status(404).send({ error: 'Visita não encontrada' })
      }

      // Receber arquivo de áudio via multipart
      const data = await request.file()
      if (!data) {
        return reply.status(400).send({ error: 'Arquivo de áudio não enviado' })
      }

      // Validar tipo de arquivo
      const tiposPermitidos = ['audio/webm', 'audio/ogg', 'audio/mp4', 'audio/mpeg', 'audio/wav']
      if (!tiposPermitidos.includes(data.mimetype)) {
        return reply.status(400).send({ error: `Tipo de arquivo não suportado: ${data.mimetype}` })
      }

      // Converter stream para buffer
      const chunks: Buffer[] = []
      for await (const chunk of data.file) {
        chunks.push(chunk)
      }
      const audioBuffer = Buffer.concat(chunks)

      // Validar tamanho (máx 25MB)
      if (audioBuffer.length > 25 * 1024 * 1024) {
        return reply.status(400).send({ error: 'Arquivo muito grande. Máximo: 25MB' })
      }

      // Transcrever com MiniMax
      const transcricaoCompleta = await transcreverAudio(audioBuffer, data.mimetype)

      // Extrair campos estruturados
      const campos = await extrairCamposVisita(transcricaoCompleta)

      return {
        transcricaoCompleta,
        resumo: campos.resumo,
        proximaAcao: campos.proximaAcao,
        objetivoVisita: campos.objetivoVisita,
      }
    }
  )

  app.patch(
    '/visitas/:id/audio',
    { preHandler: [verifyClerkToken] },
    async (request, reply) => {
      const userId = request.userId!
      const { id } = request.params as { id: string }
      const { audioUrl } = request.body as { audioUrl: string }

      const visita = await prisma.visita.findFirst({ where: { id, userId } })
      if (!visita) {
        return reply.status(404).send({ error: 'Visita não encontrada' })
      }

      const atualizada = await prisma.visita.update({
        where: { id },
        data: { audioUrl },
      })

      return atualizada
    }
  )
}
```

---

## Estrutura de Pastas — SvelteKit

```
apps/web/src/
├── routes/dashboard/visitas/
│   └── +page.svelte              ← adicionar BotaoGravacao
└── lib/
    ├── hooks/
    │   └── useGravacaoAudio.svelte.ts  ← lógica de gravação reutilizável
    └── components/visitas/
        ├── BotaoGravacao.svelte        ← botão flutuante de microfone
        └── ModalGravacao.svelte        ← modal completo de gravação e revisão
```

---

## Hook de Gravação — useGravacaoAudio.svelte.ts

```typescript
// apps/web/src/lib/hooks/useGravacaoAudio.svelte.ts
// Arquivo .svelte.ts permite usar $state fora de componentes

export function criarGravacaoAudio() {
  let estado = $state<'ocioso' | 'gravando' | 'pausado' | 'concluido'>('ocioso')
  let duracaoSegundos = $state(0)
  let audioBlob = $state<Blob | null>(null)
  let audioUrl = $state<string | null>(null)
  let erroPermissao = $state(false)

  let mediaRecorder: MediaRecorder | null = null
  let chunks: BlobPart[] = []
  let timerInterval: ReturnType<typeof setInterval> | null = null

  async function iniciar() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      // Escolher o formato suportado pelo browser
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm')
          ? 'audio/webm'
          : 'audio/ogg'

      mediaRecorder = new MediaRecorder(stream, { mimeType })
      chunks = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data)
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: mimeType })
        audioBlob = blob
        audioUrl = URL.createObjectURL(blob)
        estado = 'concluido'
        stream.getTracks().forEach(t => t.stop())
      }

      mediaRecorder.start(1000) // coleta chunks a cada 1s
      estado = 'gravando'
      duracaoSegundos = 0

      timerInterval = setInterval(() => {
        duracaoSegundos++
        // Limite de segurança: parar automaticamente em 3 minutos
        if (duracaoSegundos >= 180) parar()
      }, 1000)

    } catch (err) {
      erroPermissao = true
      console.error('Erro ao acessar microfone:', err)
    }
  }

  function parar() {
    if (mediaRecorder && estado === 'gravando') {
      mediaRecorder.stop()
      if (timerInterval) clearInterval(timerInterval)
    }
  }

  function descartar() {
    if (audioUrl) URL.revokeObjectURL(audioUrl)
    audioBlob = null
    audioUrl = null
    estado = 'ocioso'
    duracaoSegundos = 0
    chunks = []
  }

  function formatarDuracao(segundos: number): string {
    const m = Math.floor(segundos / 60).toString().padStart(2, '0')
    const s = (segundos % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  return {
    get estado() { return estado },
    get duracaoSegundos() { return duracaoSegundos },
    get audioBlob() { return audioBlob },
    get audioUrl() { return audioUrl },
    get erroPermissao() { return erroPermissao },
    get duracaoFormatada() { return formatarDuracao(duracaoSegundos) },
    iniciar,
    parar,
    descartar,
  }
}
```

---

## BotaoGravacao.svelte — botão flutuante

```svelte
<script lang="ts">
  import { Mic } from 'lucide-svelte'

  const { onclick } = $props<{ onclick: () => void }>()
</script>

<!--
  Posicionado ao lado do FAB de nova visita.
  FAB principal fica em bottom-6 right-6
  Este fica em bottom-6 right-24 (deslocado para a esquerda)
-->
<button
  class="fixed bottom-6 right-24 z-30 flex h-14 w-14 items-center
         justify-center rounded-full shadow-lg text-white
         transition-all duration-200 ease-out
         hover:-translate-y-[1px] hover:shadow-xl active:scale-[0.97]"
  style="background-color: #7c3aed;"
  {onclick}
  aria-label="Gravar resumo por voz"
  title="Gravar resumo da visita por voz"
>
  <Mic class="w-6 h-6" />
</button>
```

---

## ModalGravacao.svelte — modal completo

```svelte
<script lang="ts">
  import { fly, fade } from 'svelte/transition'
  import { cubicOut } from 'svelte/easing'
  import { Mic, Square, Trash2, Send, Check, X } from 'lucide-svelte'
  import { criarGravacaoAudio } from '$lib/hooks/useGravacaoAudio.svelte'
  import { PUBLIC_API_URL } from '$env/static/public'

  interface Props {
    aberto: boolean
    visitasSelecionaveis: Array<{ id: string; profissional: string; dataVisita: string }>
    sessionToken: string | null
    onFechar: () => void
    onCamposExtraidos: (visitaId: string, campos: CamposExtraidos) => void
  }

  interface CamposExtraidos {
    resumo: string
    proximaAcao: string
    objetivoVisita: string
    transcricaoCompleta: string
  }

  let { aberto, visitasSelecionaveis, sessionToken, onFechar, onCamposExtraidos } = $props()

  // Estados do modal
  let etapa = $state<'selecionar' | 'gravar' | 'processar' | 'revisar' | 'salvar'>('selecionar')
  let visitaIdSelecionada = $state('')
  let transcricando = $state(false)
  let erroTranscricao = $state<string | null>(null)
  let camposExtraidos = $state<CamposExtraidos | null>(null)
  let salvarAudio = $state<boolean | null>(null)  // null = não decidiu ainda

  // Hook de gravação
  const gravacao = criarGravacaoAudio()

  // Campos editáveis pelo usuário
  let resumoEditado = $state('')
  let proximaAcaoEditada = $state('')
  let objetivoEditado = $state('')

  // Quando campos são extraídos, preencher editáveis
  $effect(() => {
    if (camposExtraidos) {
      resumoEditado = camposExtraidos.resumo
      proximaAcaoEditada = camposExtraidos.proximaAcao
      objetivoEditado = camposExtraidos.objetivoVisita
    }
  })

  async function enviarParaTranscricao() {
    if (!gravacao.audioBlob || !visitaIdSelecionada) return

    etapa = 'processar'
    transcricando = true
    erroTranscricao = null

    try {
      const formData = new FormData()
      formData.append('audio', gravacao.audioBlob, 'gravacao.webm')

      const res = await fetch(
        `${PUBLIC_API_URL}/visitas/${visitaIdSelecionada}/transcricao`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${sessionToken}` },
          body: formData,
        }
      )

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error ?? 'Erro na transcrição')
      }

      camposExtraidos = await res.json()
      etapa = 'revisar'
    } catch (err) {
      erroTranscricao = err instanceof Error ? err.message : 'Erro desconhecido'
      etapa = 'gravar'
    } finally {
      transcricando = false
    }
  }

  async function confirmar() {
    if (!camposExtraidos || !visitaIdSelecionada) return

    etapa = 'salvar'

    // Se usuário decidiu salvar o áudio, fazer upload primeiro
    if (salvarAudio && gravacao.audioBlob) {
      await uploadAudio()
    }

    // Aplicar campos na visita via callback
    onCamposExtraidos(visitaIdSelecionada, {
      ...camposExtraidos,
      resumo: resumoEditado,
      proximaAcao: proximaAcaoEditada,
      objetivoVisita: objetivoEditado,
    })

    fechar()
  }

  async function uploadAudio() {
    // Upload para Supabase Storage via API
    const formData = new FormData()
    formData.append('audio', gravacao.audioBlob!, 'gravacao.webm')

    const res = await fetch(
      `${PUBLIC_API_URL}/visitas/${visitaIdSelecionada}/audio-upload`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${sessionToken}` },
        body: formData,
      }
    )

    if (res.ok) {
      const { audioUrl } = await res.json()
      await fetch(`${PUBLIC_API_URL}/visitas/${visitaIdSelecionada}/audio`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${sessionToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ audioUrl }),
      })
    }
  }

  function fechar() {
    gravacao.descartar()
    etapa = 'selecionar'
    visitaIdSelecionada = ''
    camposExtraidos = null
    salvarAudio = null
    erroTranscricao = null
    onFechar()
  }
</script>

{#if aberto}
  <!-- Overlay -->
  <div
    class="fixed inset-0 z-40 bg-black/50"
    transition:fade={{ duration: 200 }}
    onclick={fechar}
  />

  <!-- Modal centralizado — exceção ao padrão Sheet pois é fluxo guiado por etapas -->
  <div
    class="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2
           rounded-2xl shadow-2xl overflow-hidden"
    style="background-color: #ffffff;"
    transition:fly={{ y: 20, duration: 300, easing: cubicOut }}
    onclick|stopPropagation={() => {}}
  >
    <!-- Header -->
    <div class="flex items-center justify-between px-6 py-4 border-b"
      style="border-color: #e5e7eb;">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg flex items-center justify-center"
          style="background-color: #ede9fe;">
          <Mic class="w-4 h-4" style="color: #7c3aed;" />
        </div>
        <div>
          <p class="text-sm font-semibold" style="color: #111827;">Gravar resumo da visita</p>
          <p class="text-xs" style="color: #9ca3af;">
            {#if etapa === 'selecionar'}Selecione a visita
            {:else if etapa === 'gravar'}Grave o resumo em áudio
            {:else if etapa === 'processar'}Processando com IA...
            {:else if etapa === 'revisar'}Revise os campos extraídos
            {:else}Salvando...{/if}
          </p>
        </div>
      </div>
      <button onclick={fechar} class="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
        <X class="w-4 h-4" style="color: #9ca3af;" />
      </button>
    </div>

    <!-- Conteúdo por etapa -->
    <div class="p-6">

      <!-- ETAPA 1: Selecionar visita -->
      {#if etapa === 'selecionar'}
        <p class="text-sm mb-3" style="color: #6b7280;">
          Para qual visita deseja gravar o resumo?
        </p>
        <select
          bind:value={visitaIdSelecionada}
          class="w-full h-10 px-3 text-sm rounded-lg border"
          style="border-color: #e5e7eb; background-color: #ffffff; color: #111827;"
        >
          <option value="">Selecione uma visita...</option>
          {#each visitasSelecionaveis as v}
            <option value={v.id}>{v.profissional} — {v.dataVisita}</option>
          {/each}
        </select>
        <button
          disabled={!visitaIdSelecionada}
          onclick={() => etapa = 'gravar'}
          class="mt-4 w-full h-10 rounded-lg text-sm font-medium text-white
                 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
          style="background-color: #7c3aed; border-radius: 8px;"
        >
          Continuar
        </button>

      <!-- ETAPA 2: Gravar -->
      {:else if etapa === 'gravar'}
        {#if gravacao.erroPermissao}
          <div class="rounded-lg p-4 mb-4" style="background-color: #fee2e2;">
            <p class="text-sm font-medium" style="color: #991b1b;">
              Permissão de microfone negada
            </p>
            <p class="text-xs mt-1" style="color: #991b1b;">
              Acesse as configurações do browser e permita o uso do microfone para este site.
            </p>
          </div>
        {/if}

        {#if erroTranscricao}
          <div class="rounded-lg p-3 mb-4" style="background-color: #fee2e2;">
            <p class="text-sm" style="color: #991b1b;">{erroTranscricao}</p>
          </div>
        {/if}

        <!-- Visualizador de gravação -->
        <div class="flex flex-col items-center gap-6 py-4">
          <!-- Botão principal de gravação -->
          <button
            onclick={gravacao.estado === 'gravando' ? gravacao.parar : gravacao.iniciar}
            class="w-20 h-20 rounded-full flex items-center justify-center
                   shadow-lg transition-all duration-200 ease-out
                   hover:-translate-y-[1px] hover:shadow-xl active:scale-[0.97]"
            style={gravacao.estado === 'gravando'
              ? 'background-color: #dc2626;'
              : 'background-color: #7c3aed;'}
          >
            {#if gravacao.estado === 'gravando'}
              <Square class="w-8 h-8 text-white" />
            {:else}
              <Mic class="w-8 h-8 text-white" />
            {/if}
          </button>

          <!-- Timer -->
          <p class="text-2xl font-mono font-semibold" style="color: #111827;">
            {gravacao.duracaoFormatada}
          </p>

          <!-- Status -->
          <p class="text-sm" style="color: #6b7280;">
            {#if gravacao.estado === 'ocioso'}
              Clique no microfone para começar a gravar
            {:else if gravacao.estado === 'gravando'}
              <span class="inline-flex items-center gap-2">
                <span class="w-2 h-2 rounded-full animate-pulse"
                  style="background-color: #dc2626;"></span>
                Gravando... clique para parar
              </span>
            {:else if gravacao.estado === 'concluido'}
              Gravação concluída — ouça ou envie para transcrição
            {/if}
          </p>

          <!-- Player de revisão (só quando concluído) -->
          {#if gravacao.estado === 'concluido' && gravacao.audioUrl}
            <!-- svelte-ignore a11y_media_has_caption -->
            <audio controls src={gravacao.audioUrl} class="w-full"></audio>
          {/if}
        </div>

        <!-- Ações -->
        {#if gravacao.estado === 'concluido'}
          <div class="flex gap-3 mt-2">
            <button
              onclick={gravacao.descartar}
              class="flex-1 h-10 rounded-lg border text-sm font-medium
                     flex items-center justify-center gap-2 transition-colors hover:bg-gray-50"
              style="border-color: #e5e7eb; color: #374151;"
            >
              <Trash2 class="w-4 h-4" />
              Descartar
            </button>
            <button
              onclick={enviarParaTranscricao}
              class="flex-1 h-10 rounded-lg text-sm font-medium text-white
                     flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
              style="background-color: #7c3aed; border-radius: 8px;"
            >
              <Send class="w-4 h-4" />
              Transcrever com IA
            </button>
          </div>
        {/if}

      <!-- ETAPA 3: Processando -->
      {:else if etapa === 'processar'}
        <div class="flex flex-col items-center gap-4 py-8">
          <div class="w-12 h-12 rounded-full flex items-center justify-center animate-spin"
            style="border: 3px solid #ede9fe; border-top-color: #7c3aed;">
          </div>
          <p class="text-sm font-medium" style="color: #111827;">
            Transcrevendo e extraindo informações...
          </p>
          <p class="text-xs text-center" style="color: #9ca3af;">
            O MiniMax está analisando o áudio e estruturando os campos da visita.
            Isso pode levar alguns segundos.
          </p>
        </div>

      <!-- ETAPA 4: Revisar -->
      {:else if etapa === 'revisar'}
        <div class="space-y-4">
          <div class="space-y-1.5">
            <label class="text-xs font-semibold uppercase tracking-wider"
              style="color: #6b7280;">Objetivo da visita</label>
            <textarea
              bind:value={objetivoEditado}
              rows="2"
              class="w-full px-3 py-2 text-sm rounded-lg border resize-none
                     focus:outline-none focus:ring-2"
              style="border-color: #e5e7eb; color: #111827;
                     --tw-ring-color: #7c3aed40;"
            ></textarea>
          </div>

          <div class="space-y-1.5">
            <label class="text-xs font-semibold uppercase tracking-wider"
              style="color: #6b7280;">Resumo da visita</label>
            <textarea
              bind:value={resumoEditado}
              rows="4"
              class="w-full px-3 py-2 text-sm rounded-lg border resize-none
                     focus:outline-none focus:ring-2"
              style="border-color: #e5e7eb; color: #111827;"
            ></textarea>
          </div>

          <div class="space-y-1.5">
            <label class="text-xs font-semibold uppercase tracking-wider"
              style="color: #6b7280;">Próxima ação</label>
            <textarea
              bind:value={proximaAcaoEditada}
              rows="2"
              class="w-full px-3 py-2 text-sm rounded-lg border resize-none
                     focus:outline-none focus:ring-2"
              style="border-color: #e5e7eb; color: #111827;"
            ></textarea>
          </div>

          <!-- Decisão sobre o áudio -->
          <div class="rounded-lg border p-3" style="border-color: #e5e7eb;">
            <p class="text-xs font-semibold mb-2" style="color: #374151;">
              Deseja salvar o áudio da gravação?
            </p>
            <div class="flex gap-2">
              <button
                onclick={() => salvarAudio = true}
                class="flex-1 h-8 rounded-lg text-xs font-medium border-2 transition-all"
                style={salvarAudio === true
                  ? 'border-color: #7c3aed; background-color: #ede9fe; color: #7c3aed;'
                  : 'border-color: #e5e7eb; color: #6b7280;'}
              >
                Sim, salvar
              </button>
              <button
                onclick={() => salvarAudio = false}
                class="flex-1 h-8 rounded-lg text-xs font-medium border-2 transition-all"
                style={salvarAudio === false
                  ? 'border-color: #374151; background-color: #f9fafb; color: #374151;'
                  : 'border-color: #e5e7eb; color: #6b7280;'}
              >
                Não, descartar
              </button>
            </div>
          </div>
        </div>

        <!-- Ações -->
        <div class="flex gap-3 mt-4">
          <button
            onclick={() => etapa = 'gravar'}
            class="flex-1 h-10 rounded-lg border text-sm font-medium transition-colors hover:bg-gray-50"
            style="border-color: #e5e7eb; color: #374151;"
          >
            ← Regravar
          </button>
          <button
            disabled={salvarAudio === null}
            onclick={confirmar}
            class="flex-1 h-10 rounded-lg text-sm font-medium text-white
                   disabled:opacity-40 disabled:cursor-not-allowed
                   flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
            style="background-color: #2563eb; border-radius: 8px;"
          >
            <Check class="w-4 h-4" />
            Aplicar na visita
          </button>
        </div>
      {/if}

    </div>
  </div>
{/if}
```

---

## Integração na Página de Visitas

```svelte
<!-- apps/web/src/routes/dashboard/visitas/+page.svelte -->
<script lang="ts">
  import BotaoGravacao from '$lib/components/visitas/BotaoGravacao.svelte'
  import ModalGravacao from '$lib/components/visitas/ModalGravacao.svelte'

  let modalGravacaoAberto = $state(false)

  // Visitas AGENDADA do dia para o dropdown de seleção
  let visitasParaGravar = $derived(
    visitas.filter(v => v.status === 'AGENDADA' || v.status === 'REALIZADA')
      .map(v => ({
        id: v.id,
        profissional: v.profissional?.nome ?? 'Profissional',
        dataVisita: formatarData(v.dataVisita),
      }))
  )

  async function aplicarCamposExtraidos(visitaId: string, campos: CamposExtraidos) {
    // Chamar PUT /visitas/:id com os campos extraídos
    await apiFetch(`/visitas/${visitaId}`, sessionToken, {
      method: 'PUT',
      body: JSON.stringify({
        resumo: campos.resumo,
        proximaAcao: campos.proximaAcao,
        objetivoVisita: campos.objetivoVisita,
      }),
    })
    // Recarregar a lista
    await carregarVisitas()
  }
</script>

<!-- Botão flutuante de gravação ao lado do FAB de nova visita -->
<BotaoGravacao onclick={() => modalGravacaoAberto = true} />

<!-- FAB de nova visita — já existente, em bottom-6 right-6 -->

<!-- Modal de gravação -->
<ModalGravacao
  aberto={modalGravacaoAberto}
  visitasSelecionaveis={visitasParaGravar}
  {sessionToken}
  onFechar={() => modalGravacaoAberto = false}
  onCamposExtraidos={aplicarCamposExtraidos}
/>
```

---

## Variáveis de Ambiente

```env
# apps/api/.env
MINIMAX_API_KEY=<sua_chave_minimax>
MINIMAX_GROUP_ID=<seu_group_id_minimax>

# apps/web/.env
PUBLIC_API_URL=http://localhost:3002
```

> O `MINIMAX_GROUP_ID` é encontrado no dashboard da MiniMax em **Account → Group ID**.

---

## Dependência necessária na API

```powershell
# O Fastify precisa do plugin multipart para receber arquivos
pnpm --filter api add @fastify/multipart
```

Registrar no `app.ts`:
```typescript
import multipart from '@fastify/multipart'
await app.register(multipart, { limits: { fileSize: 25 * 1024 * 1024 } })
```

---

## Skills Necessárias

| Skill | Repositório | Obrigatória |
|-------|-------------|-------------|
| `brainstorming` | obra/superpowers | ✅ Sim |
| `write-plan` | obra/superpowers | ✅ Sim |
| `test-driven-development` | obra/superpowers | ✅ Sim |
| `verification-before-completion` | obra/superpowers | ✅ Sim |
| `medivisitas-design` | `.kilocode/skills/` | ✅ Sim |
| `frontend-design` | anthropics/skills | ✅ Sim |
| `fastify` | mcollina/skills | ✅ Sim |
| `node` | mcollina/skills | ✅ Sim |

---

## Sequência de Implementação (TDD)

```
1.  [PLAN]    skill brainstorming → formato de áudio, fallback de mime type, timeout MiniMax
2.  [PLAN]    skill write-plan → subtarefas atômicas

3.  [DB]      Migration: adicionar audioUrl em Visita
4.  [DB]      pnpm --filter database prisma migrate dev --name visita-audio-url

5.  [API]     Instalar @fastify/multipart
6.  [API]     Registrar multipart em app.ts com limite 25MB
7.  [API RED] Testes com mock do MiniMax para minimax.ts (sem chamada real)
8.  [API GRN] Implementar apps/api/src/services/minimax.ts
9.  [API RED] Testes falhando para POST /visitas/:id/transcricao
10. [API GRN] Implementar rota de transcrição
11. [API]     Implementar PATCH /visitas/:id/audio

12. [WEB]     Carregar skill medivisitas-design
13. [WEB]     useGravacaoAudio.svelte.ts — hook com $state
14. [WEB]     BotaoGravacao.svelte — botão roxo flutuante
15. [WEB]     ModalGravacao.svelte — 4 etapas com $state(etapa)
16. [WEB]     Integrar na +page.svelte de visitas

17. [VER]     skill verification-before-completion
```

---

## Checklist de Conclusão da Fase 5

```
Banco de Dados
[ ] Migration aplicada — audioUrl adicionado em Visita

API
[ ] @fastify/multipart instalado e registrado com limite 25MB
[ ] MINIMAX_API_KEY e MINIMAX_GROUP_ID no .env
[ ] minimax.ts: transcreverAudio() funciona com áudio real
[ ] minimax.ts: extrairCamposVisita() retorna JSON válido
[ ] minimax.ts: fallback gracioso se parsing do JSON falhar
[ ] POST /visitas/:id/transcricao → 200 com campos extraídos
[ ] POST /visitas/:id/transcricao → 400 para tipo de arquivo inválido
[ ] POST /visitas/:id/transcricao → 400 para arquivo > 25MB
[ ] POST /visitas/:id/transcricao → 404 para visita de outro userId
[ ] PATCH /visitas/:id/audio → salva audioUrl corretamente
[ ] Testes com mock passando

Frontend
[ ] useGravacaoAudio: iniciar() solicita permissão do microfone
[ ] useGravacaoAudio: $effect cleanup para clearInterval
[ ] useGravacaoAudio: para automaticamente em 3 minutos
[ ] BotaoGravacao: posicionado em bottom-6 right-24 (ao lado do FAB)
[ ] ModalGravacao: 4 etapas funcionando (selecionar → gravar → processar → revisar)
[ ] ModalGravacao: campos editáveis antes de confirmar
[ ] ModalGravacao: decisão de salvar/descartar áudio funciona
[ ] ModalGravacao: erro de permissão de microfone exibido
[ ] ModalGravacao: loading animado na etapa processar
[ ] Campos aplicados na visita via PUT /visitas/:id
[ ] PUBLIC_API_URL importado de $env/static/public (nunca import.meta.env)

Geral
[ ] pnpm test → 100% passando
[ ] pnpm --filter @medivisitas/web build → sem erros TypeScript
[ ] pnpm --filter api build → sem erros TypeScript
[ ] skill verification-before-completion executada
[ ] CLAUDE.md: Fase 5 marcada como Concluída
```

---

## Comandos Úteis (PowerShell)

```powershell
# Migration
pnpm --filter database prisma migrate dev --name visita-audio-url

# Instalar dependência da API
pnpm --filter api add @fastify/multipart

# API (porta 3002)
pnpm --filter api dev

# Frontend (porta 5173)
pnpm --filter @medivisitas/web dev

# Testes
pnpm --filter api test
pnpm --filter @medivisitas/web build
```

---

## Resultado Esperado

Ao concluir a Fase 5, o propagandista poderá:

1. Clicar no botão de microfone roxo na página de visitas
2. Selecionar qual visita deseja registrar
3. Gravar um áudio de até 3 minutos descrevendo o que aconteceu
4. Receber automaticamente os campos resumo, próxima ação e objetivo preenchidos pela IA
5. Revisar e editar os campos antes de aplicar
6. Decidir se salva ou descarta o áudio da gravação
7. Ver a visita atualizada na listagem com os campos preenchidos
