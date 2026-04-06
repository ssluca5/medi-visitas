<script lang="ts">
  import { Phone, Mail, MapPin, MessageCircle } from 'lucide-svelte';
  import type { Contato, Endereco } from '$lib/types';

  interface Props {
    contatos: Contato[];
    telefone: string | null;
    email: string | null;
    endereco: Endereco | null;
  }

  let { contatos, telefone, email, endereco }: Props = $props();

  const contatoIcon: Record<string, any> = {
    TELEFONE: Phone,
    EMAIL: Mail,
    WHATSAPP: MessageCircle,
    OUTRO: Phone
  };

  const contatoLabel: Record<string, string> = {
    TELEFONE: 'Telefone',
    EMAIL: 'E-mail',
    WHATSAPP: 'WhatsApp',
    OUTRO: 'Outro'
  };
</script>

<div class="space-y-6">
  <!-- Contato principal -->
  {#if telefone || email}
    <div>
      <h3 class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Contato Principal</h3>
      <div class="space-y-2">
        {#if telefone}
          <a href="tel:{telefone.replace(/\D/g, '')}" class="flex items-center gap-2 text-[13px] text-blue-600 hover:text-blue-700 hover:underline">
            <Phone class="w-3.5 h-3.5 text-slate-400" />
            {telefone}
          </a>
        {/if}
        {#if email}
          <a href="mailto:{email}" class="flex items-center gap-2 text-[13px] text-blue-600 hover:text-blue-700 hover:underline break-all">
            <Mail class="w-3.5 h-3.5 text-slate-400" />
            {email}
          </a>
        {/if}
      </div>
    </div>
  {/if}

  <!-- Contatos adicionais -->
  {#if contatos.length > 0}
    <div>
      <h3 class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Contatos Adicionais</h3>
      <div class="space-y-3">
        {#each contatos as contato}
          {@const Icon = contatoIcon[contato.tipo] ?? Phone}
          <div class="flex items-start gap-2">
            <Icon class="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
            <div>
              <span class="block text-[10px] font-semibold text-slate-400 uppercase">{contatoLabel[contato.tipo] ?? contato.tipo}</span>
              <span class="block text-[13px] font-medium text-slate-800">{contato.valor}</span>
              {#if contato.observacao}
                <span class="block text-xs text-slate-500 italic mt-0.5">{contato.observacao}</span>
              {/if}
            </div>
          </div>
        {/each}
      </div>
    </div>
  {/if}

  <!-- Endereço -->
  {#if endereco}
    {@const enderecoStr = [endereco.logradouro, endereco.numero].filter(Boolean).join(', ')}
    {@const cidadeUf = [endereco.cidade, endereco.estado].filter(Boolean).join(' / ')}
    {#if enderecoStr || cidadeUf}
      <div>
        <h3 class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Endereço</h3>
        <div class="flex items-start gap-2">
          <MapPin class="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
          <div>
            {#if enderecoStr}
              <span class="block text-[13px] font-medium text-slate-800">{enderecoStr}</span>
            {/if}
            {#if endereco.bairro}
              <span class="block text-xs text-slate-600 mt-0.5">{endereco.bairro}</span>
            {/if}
            {#if cidadeUf}
              <span class="block text-xs text-slate-500 mt-0.5">{cidadeUf}{endereco.cep ? ` · CEP ${endereco.cep}` : ''}</span>
            {/if}
          </div>
        </div>
      </div>
    {/if}
  {/if}
</div>
