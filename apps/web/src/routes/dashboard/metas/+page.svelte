<script lang="ts">
  import { onMount } from 'svelte';
  import type { Meta } from '$lib/types';
  import { apiFetch } from '$lib/api';
  import { toasts } from '$lib/stores/toast.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import Sheet from '$lib/components/ui/Sheet.svelte';
  import ConfirmDialog from '$lib/components/ui/ConfirmDialog.svelte';
  import {
    Target, Plus, BarChart3, CalendarDays, Pencil, Trash2,
    TrendingUp, Users, Activity, Percent, Award, AlertTriangle,
    Zap, ChevronRight, Medal, Star, Shield, Eye,
    UserRound, Building2, TrendingDown, Sparkles, ArrowUpRight,
    Clock, MapPin, CheckCircle2, ChevronDown, Loader2,
  } from 'lucide-svelte';

  interface Props {
    data: {
      sessionToken: string | null;
      userId: string;
    };
  }

  let { data }: Props = $props();

  // ── Page state ──
  let viewMode = $state<'propagandista' | 'gestor'>('propagandista');
  let metas = $state<Meta[]>([]);
  let loading = $state(true);

  let isEmptyState = $derived(!loading && metas.length === 0);

  // Sheet state
  let sheetOpen = $state(false);
  let metaEmEdicao = $state<Meta | null>(null);
  let saving = $state(false);

  let formNome = $state('');
  let formDescricao = $state('');
  let formDataInicio = $state('');
  let formDataFim = $state('');
  let formMetaVisitas = $state(0);
  let formMetaAvancos = $state(0);
  let formMetaPrescritores = $state(0);
  let formResponsavelId = $state('');
  let formPlano = $state<'PROFISSIONAL' | 'EQUIPE'>('PROFISSIONAL');

  // Confirm dialog
  let deleteConfirmOpen = $state(false);
  let metaParaExcluir = $state<Meta | null>(null);

  let metasFiltradas = $derived(metas);

  // ── Computed dashboard data (mock/premium) ──
  let kpiVisitas = $derived({ atual: 187, meta: 240, pct: 78, delta: 4.2, forecast: 72 });
  let kpiCobertura = $derived({ atual: 62, meta: 80, pct: 78, delta: -1.8, forecast: 65 });
  let kpiFrequencia = $derived({ atual: 3.4, meta: 4.0, pct: 85, delta: 0.3, forecast: 82 });
  let kpiConversao = $derived({ atual: 22, meta: 30, pct: 73, delta: 5.1, forecast: 68 });

  let cascadeEmpresa = $derived({ pct: 86 });
  let cascadeEquipe = $derived({ pct: 82 });
  let cascadeVoce = $derived({ pct: 78 });

  let cascadeGestorEmpresa = $derived({ pct: 86 });
  let cascadeGestorEquipe = $derived({ pct: 79 });
  let cascadeGestorDist = $derived({ pct: 72 });

  let streakDias = $derived(12);
  let streakMax = $derived(18);

  // ── Static data for premium sections ──
  let insights = [
    { type: 'risk', icon: AlertTriangle, text: '<strong>Cobertura de prescritores</strong> esta 8pp abaixo do pace. Se mantenha nesse ritmo, a meta fecha em 72%.', time: 'Ha 2h', cta: 'Ver medicos sugeridos' },
    { type: 'warn', icon: TrendingDown, text: '<strong>Frequencia em Cardiologistas</strong> caiu 22% essa semana. 3 medicos que voce visitava todo mes estao ha 40+ dias sem visita.', time: 'Ha 5h', cta: 'Agendar visitas' },
    { type: 'win', icon: TrendingUp, text: '<strong>Conversao de prescricao</strong> subiu 5pp este mes. Seu indice esta no top 15% dos propagandistas.', time: 'Ha 1d', cta: 'Ver detalhes' },
    { type: 'suggest', icon: Sparkles, text: '<strong>Sugestao IA:</strong> Visitar Dr. Ricardo Alves (Cardio, Alto potencial) pode aumentar sua cobertura em 1.8pp.', time: 'IA', cta: 'Agendar agora' },
  ];

  let suggestions = [
    { name: 'Dr. Ricardo Alves', spec: 'Cardiologia', impact: '+1.8pp cobertura', avatar: 'RA', priority: 'high' as const },
    { name: 'Dra. Marina Costa', spec: 'Endocrinologia', impact: '+0.9pp cobertura', avatar: 'MC', priority: 'high' as const },
    { name: 'Dr. Felipe Santos', spec: 'Clinica Geral', impact: '+2.1 visitas/sem', avatar: 'FS', priority: 'medium' as const },
    { name: 'Dra. Juliana Lima', spec: 'Ginecologia', impact: '+0.6pp frequencia', avatar: 'JL', priority: 'medium' as const },
  ];

  let leaderboard = [
    { rank: 1, name: 'Ana Beatriz', initials: 'AB', avatar: '#7c3aed', pct: 96, trend: 'up' },
    { rank: 2, name: 'Carlos Eduardo', initials: 'CE', avatar: '#2563eb', pct: 92, trend: 'up' },
    { rank: 3, name: 'Lucas Silveira', initials: 'LS', avatar: '#059669', pct: 88, trend: 'up', isYou: true },
    { rank: 4, name: 'Patricia Gomes', initials: 'PG', avatar: '#f59e0b', pct: 82, trend: 'steady' },
    { rank: 5, name: 'Rafael Torres', initials: 'RT', avatar: '#ef4444', pct: 78, trend: 'down' },
    { rank: 6, name: 'Sofia Mendes', initials: 'SM', avatar: '#8b5cf6', pct: 74, trend: 'up' },
    { rank: 7, name: 'Thiago Nunes', initials: 'TN', avatar: '#0891b2', pct: 70, trend: 'down' },
    { rank: 8, name: 'Vanessa Lopes', initials: 'VL', avatar: '#db2777', pct: 68, trend: 'steady' },
    { rank: 9, name: 'Andre Martins', initials: 'AM', avatar: '#ca8a04', pct: 66, trend: 'down' },
    { rank: 10, name: 'Beatriz Costa', initials: 'BC', avatar: '#9333ea', pct: 58, trend: 'up' },
  ];

  let achievements = [
    { icon: Zap, label: 'Sequencia 7 dias', earned: true, color: '#f59e0b' },
    { icon: Medal, label: 'Top 3 Equipe', earned: true, color: '#7c3aed' },
    { icon: Star, label: '100% Cobertura', earned: false, color: '#9ca3af' },
    { icon: Shield, label: 'Visita Perfeita', earned: true, color: '#2563eb' },
    { icon: Target, label: 'Meta Básica', earned: true, color: '#059669' },
    { icon: Award, label: 'Mês Perfeito', earned: false, color: '#9ca3af' },
  ];

  // Gestor view data
  let gestorKPIs = [
    { label: 'Atingimento medio da equipe', value: '79%', delta: '+2.1pp', icon: Target },
    { label: 'Propagandistas acima do pace', value: '9/14', delta: '64%', icon: TrendingUp },
    { label: 'Metas em risco', value: '3', delta: 'Acao necessaria', icon: AlertTriangle },
    { label: 'Forecast da equipe', value: '82%', delta: 'Provavel', icon: TrendingUp },
  ];

  let teamRows = [
    { name: 'Ana Beatriz', initials: 'AB', territory: 'Zona Sul SP', atingimento: 96, visitas: '142/150', cobertura: '91%', conversao: '28%', status: 'Adiantado', forecast: 98 },
    { name: 'Carlos Eduardo', initials: 'CE', territory: 'Zona Norte SP', atingimento: 92, visitas: '138/150', cobertura: '88%', conversao: '25%', status: 'No ritmo', forecast: 94 },
    { name: 'Lucas Silveira', initials: 'LS', territory: 'Zona Oeste SP', atingimento: 88, visitas: '132/150', cobertura: '84%', conversao: '22%', status: 'No ritmo', forecast: 90, isYou: true },
    { name: 'Patricia Gomes', initials: 'PG', territory: 'Grande SP', atingimento: 82, visitas: '123/150', cobertura: '79%', conversao: '20%', status: 'No ritmo', forecast: 85 },
    { name: 'Rafael Torres', initials: 'RT', territory: 'Interior SP', atingimento: 78, visitas: '117/150', cobertura: '75%', conversao: '18%', status: 'Em risco', forecast: 74 },
    { name: 'Sofia Mendes', initials: 'SM', territory: 'Campinas', atingimento: 74, visitas: '111/150', cobertura: '71%', conversao: '19%', status: 'No ritmo', forecast: 76 },
  ];

  let coachingAlerts = [
    { type: 'danger' as const, icon: AlertTriangle, text: '<strong>Rafael Torres</strong> esta 3 semanas abaixo do pace. Agende uma conversa 1:1.', cta: 'Agendar' },
    { type: 'warn' as const, icon: TrendingDown, text: '<strong>Andre Martins</strong> perdeu 4 medicos da sua carteira esse mes. Verificar redistribuicao.', cta: 'Analisar' },
    { type: 'success' as const, icon: Award, text: '<strong>Ana Beatriz</strong> atingiu 96% — reconheca o desempenho publicamente.', cta: 'Reconhecer' },
  ];

  let metasEmRisco = [
    { name: 'Rafael Torres', meta: 'Cobertura Q2', delta: '-12pp', severity: 'high' },
    { name: 'Andre Martins', meta: 'Novos Prescritores', delta: '-8pp', severity: 'medium' },
    { name: 'Vanessa Lopes', meta: 'Visitas Mensais', delta: '-5pp', severity: 'medium' },
  ];

  let especBreakdown = [
    { spec: 'Cardiologia', ating: 84, visitas: '312/370', cob: '82%' },
    { spec: 'Endocrinologia', ating: 78, visitas: '198/254', cob: '76%' },
    { spec: 'Clinica Geral', ating: 81, visitas: '456/560', cob: '80%' },
    { spec: 'Ginecologia', ating: 72, visitas: '167/232', cob: '70%' },
  ];

  // Empty state templates
  const templates = [
    { icon: Target, name: 'Visitas a Medicos', desc: 'Acompanhe o numero de visitas realizadas por mes.', color: 'blue' },
    { icon: Eye, name: 'Cobertura de Prescritores', desc: 'Meca o alcance sobre os medicos-alvo da sua carteira.', color: 'violet' },
    { icon: Activity, name: 'Frequencia de Visitas', desc: 'Monitore a media de visitas por medico no periodo.', color: 'green' },
    { icon: Zap, name: 'Distribuicao de Amostras', desc: 'Controle a quantidade de amostras distribuidas.', color: 'amber' },
    { icon: TrendingUp, name: 'Conversao de Prescricoes', desc: 'Acompanhe a taxa de conversao de prospectado para prescritor.', color: 'teal' },
    { icon: UserRound, name: 'Novos Prescritores', desc: 'Registre quantos novos medicos comecaram a prescrever.', color: 'red' },
  ];

  // ── Helpers ──
  function hojeInput(): string {
    return new Date().toISOString().split('T')[0];
  }
  function fimMesInput(): string {
    const agora = new Date();
    return new Date(agora.getFullYear(), agora.getMonth() + 1, 0).toISOString().split('T')[0];
  }
  function inputDateToIso(value: string, endOfDay = false): string {
    const suffix = endOfDay ? 'T23:59:59' : 'T00:00:00';
    return new Date(`${value}${suffix}`).toISOString();
  }
  function formatarData(iso: string): string {
    return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(iso));
  }
  function diasRestantes(iso: string): number {
    const fim = new Date(iso);
    const hoje = new Date();
    return Math.max(0, Math.ceil((fim.getTime() - hoje.getTime()) / 86400000));
  }
  function statusLabel(status: Meta['status']): string {
    if (status === 'ATINGIDA') return 'Atingida';
    if (status === 'EXPIRADA') return 'Expirada';
    return 'Ativa';
  }
  function statusBadgeStyle(status: Meta['status']): string {
    if (status === 'ATINGIDA') return 'background-color: var(--success-bg); color: var(--success-text);';
    if (status === 'EXPIRADA') return 'background-color: var(--danger-light); color: var(--danger);';
    return 'background-color: var(--brand-light); color: var(--brand-dark);';
  }
  function barColor(percentual: number): string {
    if (percentual >= 100) return 'var(--status-ativo)';
    if (percentual >= 60) return 'var(--brand-primary)';
    if (percentual >= 30) return 'var(--trial-text)';
    return 'var(--danger)';
  }

  // ── API calls ──
  async function fetchMetas() {
    loading = true;
    try {
      const res = await apiFetch('/metas', data.sessionToken);
      if (!res.ok) throw new Error('Erro ao carregar metas.');
      metas = await res.json();
    } catch (err) {
      metas = [];
      toasts.show('error', err instanceof Error ? err.message : 'Erro ao carregar metas.');
    } finally {
      loading = false;
    }
  }

  function limparForm() {
    formNome = '';
    formDescricao = '';
    formDataInicio = hojeInput();
    formDataFim = fimMesInput();
    formMetaVisitas = 0;
    formMetaAvancos = 0;
    formMetaPrescritores = 0;
    formResponsavelId = data.userId ?? '';
    formPlano = 'PROFISSIONAL';
  }

  function handleNovaMeta() { metaEmEdicao = null; limparForm(); sheetOpen = true; }
  function handleNovaMetaFromTemplate(name: string) { metaEmEdicao = null; limparForm(); formNome = name; sheetOpen = true; }

  function handleEditarMeta(meta: Meta) {
    metaEmEdicao = meta;
    formNome = meta.nome;
    formDescricao = meta.descricao ?? '';
    formDataInicio = meta.dataInicio.split('T')[0];
    formDataFim = meta.dataFim.split('T')[0];
    formMetaVisitas = meta.metaVisitas;
    formMetaAvancos = meta.metaAvancosPipeline;
    formMetaPrescritores = meta.metaPrescritores;
    formResponsavelId = meta.responsavelId;
    formPlano = meta.plano;
    sheetOpen = true;
  }

  function handleExcluirMeta(meta: Meta) { metaParaExcluir = meta; deleteConfirmOpen = true; }

  function selecionarPlano(plano: 'PROFISSIONAL' | 'EQUIPE') {
    formPlano = plano;
    if (plano === 'PROFISSIONAL') formResponsavelId = data.userId ?? '';
  }

  function validarForm(): boolean {
    if (!formNome.trim()) { toasts.show('error', 'O nome da meta e obrigatorio.'); return false; }
    if (!formDataInicio || !formDataFim) { toasts.show('error', 'Informe o periodo da meta.'); return false; }
    if (new Date(formDataFim) <= new Date(formDataInicio)) { toasts.show('error', 'A data final deve ser maior que a data inicial.'); return false; }
    if (!formResponsavelId.trim()) { toasts.show('error', 'Informe o responsavel pela meta.'); return false; }
    return true;
  }

  async function handleSalvarMeta() {
    if (!validarForm()) return;
    saving = true;
    const payload = {
      nome: formNome.trim(), descricao: formDescricao.trim() || undefined,
      dataInicio: inputDateToIso(formDataInicio), dataFim: inputDateToIso(formDataFim, true),
      metaVisitas: Number(formMetaVisitas) || 0, metaAvancosPipeline: Number(formMetaAvancos) || 0,
      metaPrescritores: Number(formMetaPrescritores) || 0, responsavelId: formResponsavelId.trim(), plano: formPlano,
    };
    const url = metaEmEdicao ? `/metas/${metaEmEdicao.id}` : '/metas';
    const method = metaEmEdicao ? 'PUT' : 'POST';
    try {
      const res = await apiFetch(url, data.sessionToken, { method, body: JSON.stringify(payload) });
      if (!res.ok) { const body = await res.json().catch(() => null); throw new Error(body?.error ?? 'Erro ao salvar meta.'); }
      const metaAtualizada: Meta = await res.json();
      if (metaEmEdicao) { metas = metas.map((m) => (m.id === metaAtualizada.id ? metaAtualizada : m)); }
      else { metas = [metaAtualizada, ...metas]; }
      sheetOpen = false;
      toasts.show('success', metaEmEdicao ? 'Meta atualizada.' : 'Meta criada.');
    } catch (err) {
      toasts.show('error', err instanceof Error ? err.message : 'Erro ao salvar meta.');
    } finally { saving = false; }
  }

  async function confirmarExclusao() {
    if (!metaParaExcluir) return;
    try {
      const res = await apiFetch(`/metas/${metaParaExcluir.id}`, data.sessionToken, { method: 'DELETE' });
      if (!res.ok) { const body = await res.json().catch(() => null); throw new Error(body?.error ?? 'Erro ao excluir meta.'); }
      metas = metas.filter((m) => m.id !== metaParaExcluir?.id);
      toasts.show('success', 'Meta excluida.');
    } catch (err) {
      toasts.show('error', err instanceof Error ? err.message : 'Erro ao excluir meta.');
    } finally { deleteConfirmOpen = false; metaParaExcluir = null; }
  }

  // ── Heatmap refs & rendering ──
  let _heatmapEl = $state<HTMLDivElement>();
  let _teamHmEl = $state<HTMLDivElement>();

  function renderAnnualHeatmap(container: HTMLDivElement) {
    container.innerHTML = '';
    const weeks = 53;
    const days = 7;
    for (let w = 0; w < weeks; w++) {
      const col = document.createElement('div');
      col.className = 'hm-week';
      for (let d = 0; d < days; d++) {
        const cell = document.createElement('div');
        const r = Math.random();
        const phase = w / weeks;
        const v = r * 0.6 + phase * 0.7;
        const level = v < 0.25 ? 0 : v < 0.5 ? 1 : v < 0.7 ? 2 : v < 0.9 ? 3 : 4;
        cell.className = 'hm-cell l' + level;
        cell.title = `Semana ${w + 1}, dia ${d + 1}`;
        col.appendChild(cell);
      }
      container.appendChild(col);
    }
  }

  function renderTeamHeatmap(container: HTMLDivElement) {
    container.innerHTML = '';
    const reps = ['AB', 'CE', 'LS', 'PG', 'RT', 'SM', 'TN', 'VL', 'AM', 'BC', 'FN', 'GP', 'HR', 'JS'];
    const weeks = 16;
    const hdr = document.createElement('div');
    hdr.className = 'hm-week';
    hdr.innerHTML = '<div style="width:18px;height:13px"></div>';
    reps.forEach((r) => {
      const lbl = document.createElement('div');
      lbl.style.cssText = 'width:13px;height:13px;font-size:8px;display:grid;place-items:center;color:var(--muted-2)';
      lbl.textContent = r;
      hdr.appendChild(lbl);
    });
    container.appendChild(hdr);
    for (let w = 0; w < weeks; w++) {
      const row = document.createElement('div');
      row.className = 'hm-week';
      row.style.flexDirection = 'row';
      const wlbl = document.createElement('div');
      wlbl.style.cssText = 'width:18px;height:13px;font-size:8px;display:grid;place-items:center;color:var(--muted-2)';
      wlbl.textContent = 'S' + (w + 1);
      row.appendChild(wlbl);
      reps.forEach((_, ri) => {
        const cell = document.createElement('div');
        const r = Math.random();
        const phase = w / weeks;
        const repFactor = 0.4 + ri / reps.length * 0.6;
        const v = r * 0.5 + phase * 0.3 + (1 - repFactor) * 0.4;
        const level = v < 0.25 ? 0 : v < 0.5 ? 1 : v < 0.7 ? 2 : v < 0.9 ? 3 : 4;
        cell.className = 'hm-cell l' + level;
        cell.title = `${reps[ri]} Semana ${w + 1}`;
        row.appendChild(cell);
      });
      container.appendChild(row);
    }
  }

  $effect(() => {
    if (_heatmapEl && !isEmptyState && viewMode === 'propagandista') {
      renderAnnualHeatmap(_heatmapEl);
    }
    if (_teamHmEl && !isEmptyState && viewMode === 'gestor') {
      renderTeamHeatmap(_teamHmEl);
    }
  });

  onMount(() => { limparForm(); fetchMetas(); });
</script>

<svelte:head>
  <title>Metas — MediVisitas</title>
</svelte:head>

<!-- ═══ CUSTOM PAGE STYLES ═══ -->
<style>
  /* ── Design tokens (from Metas.html) ── */
  :root {
    --brand: #2563eb;
    --brand-ink: #1e40af;
    --brand-soft: #eff6ff;
    --brand-soft-2: #dbeafe;
    --bg: #f8f9fa;
    --bg-elev: #ffffff;
    --bg-soft: #f3f4f6;
    --border: #e5e7eb;
    --border-strong: #d1d5db;
    --ink: #111827;
    --ink-2: #374151;
    --muted: #6b7280;
    --muted-2: #9ca3af;
    --success: #059669;
    --success-soft: #d1fae5;
    --warning: #d97706;
    --warning-soft: #fef3c7;
    --danger: #dc2626;
    --danger-soft: #fef2f2;
    --gold: #f59e0b;
    --gold-soft: #fef3c7;
    --shadow-sm: 0 1px 2px rgba(0,0,0,.05);
    --shadow-md: 0 4px 12px rgba(0,0,0,.08);
  }

  /* ── Persona toggle ── */
  .persona-toggle {
    display: inline-flex; background: var(--bg-soft); border-radius: 10px; padding: 3px;
    border: 1px solid var(--border);
  }
  .persona-btn {
    padding: 6px 14px; border: none; border-radius: 8px; font-size: 13px; font-weight: 600;
    cursor: pointer; background: transparent; color: var(--muted);
    transition: all .15s ease; font-family: inherit;
  }
  .persona-btn.active { background: var(--bg-elev); color: var(--ink); box-shadow: var(--shadow-sm); }

  /* ── Cascade bars ── */
  .cascade-bar { height: 6px; border-radius: 999px; background: var(--bg-soft); overflow: hidden; }
  .cascade-fill { height: 100%; border-radius: 999px; transition: width .6s ease; }
  .cascade-cell { padding: 12px 16px; background: var(--bg-elev); border: 1px solid var(--border); border-radius: 10px; }
  .cascade-cell.you { border-color: var(--brand); background: var(--brand-soft); }
  .cascade-pct { font-size: 24px; font-weight: 700; letter-spacing: -.02em; }
  .cascade-name { font-size: 13px; font-weight: 600; }
  .cascade-label { font-size: 11px; color: var(--muted); }

  /* ── KPI cards ── */
  .kpi-card { background: var(--bg-elev); border: 1px solid var(--border); border-radius: 12px; padding: 18px; }
  .kpi-card-header { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
  .kpi-card-icon { width: 32px; height: 32px; border-radius: 8px; display: grid; place-items: center; }
  .kpi-label { font-size: 12px; font-weight: 500; color: var(--muted); }
  .kpi-value { font-size: 28px; font-weight: 700; letter-spacing: -.025em; }
  .kpi-meta-row { display: flex; align-items: center; gap: 8px; font-size: 12px; }
  .kpi-delta { font-weight: 600; display: inline-flex; align-items: center; gap: 3px; }
  .kpi-delta.up { color: var(--success); }
  .kpi-delta.down { color: var(--danger); }
  .kpi-bar { height: 3px; border-radius: 999px; background: var(--bg-soft); margin-top: 8px; overflow: hidden; }
  .kpi-bar-fill { height: 100%; border-radius: 999px; }
  .kpi-bar-foot { display: flex; justify-content: space-between; font-size: 10px; color: var(--muted-2); margin-top: 4px; }
  .kpi-spark { width: 100%; height: 36px; }

  /* ── Goal list ── */
  .goals { display: flex; flex-direction: column; }
  .goal {
    padding: 16px 18px; border-bottom: 1px solid var(--border);
    display: grid; grid-template-columns: 36px 1fr 180px 100px 32px;
    gap: 14px; align-items: center; cursor: pointer;
    transition: background .12s ease;
  }
  .goal:hover { background: var(--bg-soft); }
  .goal:last-child { border-bottom: 0; }
  .goal-icon {
    width: 36px; height: 36px; border-radius: 9px;
    display: grid; place-items: center;
    background: var(--brand-soft); color: var(--brand-ink);
  }
  .goal-icon :global(svg) { width: 18px; height: 18px; }
  .goal-name { font-size: 14px; font-weight: 600; letter-spacing: -.005em; }
  .goal-meta { font-size: 12px; color: var(--muted); margin-top: 3px; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
  .goal-meta .dot { width: 3px; height: 3px; border-radius: 50%; background: var(--muted-2); }
  .goal-progress { display: flex; flex-direction: column; gap: 4px; }
  .gp-bar { height: 5px; border-radius: 999px; background: var(--bg-soft); position: relative; overflow: hidden; }
  .gp-fill { height: 100%; border-radius: 999px; position: absolute; left: 0; top: 0; }
  .gp-pace { position: absolute; top: -1px; bottom: -1px; width: 2px; background: var(--ink-2); border-radius: 1px; opacity: .35; }
  .gp-meta { display: flex; justify-content: space-between; font-size: 11px; }
  .goal-numeric { text-align: right; }
  .goal-numeric .num { font-size: 16px; font-weight: 700; font-variant-numeric: tabular-nums; }
  .goal-numeric .delta { font-size: 11px; font-weight: 600; }
  .goal-numeric .delta.up { color: var(--success); }
  .goal-more { color: var(--muted-2); width: 32px; height: 32px; display: grid; place-items: center; border-radius: 6px; }
  .goal-more:hover { background: var(--bg-soft); color: var(--ink); }

  /* ── Status chips ── */
  .chip { font-size: 10px; padding: 2px 7px; border-radius: 4px; font-weight: 600; letter-spacing: .01em; }
  .chip.ontrack { background: var(--success-soft); color: var(--success); }
  .chip.risk { background: var(--warning-soft); color: var(--warning); }
  .chip.ahead { background: var(--brand-soft); color: var(--brand-ink); }

  /* ── Heatmap ── */
  .hm-grid { display: flex; gap: 3px; }
  .hm-week { display: flex; flex-direction: column; gap: 3px; }
  .hm-cell { width: 13px; height: 13px; border-radius: 2px; background: var(--bg-soft); }
  .hm-cell.l0 { background: var(--bg-soft); }
  .hm-cell.l1 { background: #bbf7d0; }
  .hm-cell.l2 { background: #4ade80; }
  .hm-cell.l3 { background: #16a34a; }
  .hm-cell.l4 { background: #166534; }

  /* ── Sidebar / right panel ── */
  .stack { display: flex; flex-direction: column; gap: 14px; }
  .insight {
    padding: 14px 16px; border-bottom: 1px solid var(--border);
    display: flex; gap: 12px; cursor: pointer; border-radius: 0;
  }
  .insight:first-child { border-radius: 10px 10px 0 0; }
  .insight:last-child { border-bottom: 0; border-radius: 0 0 10px 10px; }
  .insight:hover { background: var(--bg-soft); }
  .insight-icon {
    flex-shrink: 0; width: 30px; height: 30px; border-radius: 8px;
    display: grid; place-items: center;
  }
  .insight-icon.risk { background: var(--danger-soft); color: var(--danger); }
  .insight-icon.warn { background: var(--warning-soft); color: var(--warning); }
  .insight-icon.win { background: var(--success-soft); color: var(--success); }
  .insight-icon.suggest { background: var(--brand-soft); color: var(--brand-ink); }
  .insight-icon :global(svg) { width: 14px; height: 14px; }
  .insight-text { font-size: 13px; line-height: 1.45; }
  .insight-text :global(strong) { font-weight: 600; }
  .insight-meta { font-size: 11px; color: var(--muted); margin-top: 4px; display: flex; gap: 8px; align-items: center; }
  .insight-cta { font-size: 11px; color: var(--brand-ink); font-weight: 600; margin-top: 6px; display: inline-flex; align-items: center; gap: 4px; }

  /* ── Suggestions ── */
  .sug { display: flex; align-items: center; gap: 12px; padding: 10px 14px; cursor: pointer; border-bottom: 1px solid var(--border); transition: background .1s; }
  .sug:last-child { border-bottom: 0; }
  .sug:hover { background: var(--bg-soft); }
  .sug-avatar { width: 28px; height: 28px; border-radius: 50%; display: grid; place-items: center; font-size: 11px; font-weight: 700; color: #fff; flex-shrink: 0; }
  .sug-name { font-size: 13px; font-weight: 600; }
  .sug-impact { font-size: 11px; color: var(--success); font-weight: 600; }

  /* ── Leaderboard ── */
  .lb-row { display: flex; align-items: center; gap: 10px; padding: 8px 14px; border-bottom: 1px solid var(--border); font-size: 13px; }
  .lb-row:last-child { border-bottom: 0; }
  .lb-rank { width: 22px; font-weight: 700; color: var(--muted-2); text-align: center; font-size: 12px; }
  .lb-rank.gold { color: var(--gold); }
  .lb-rank.silver { color: #94a3b8; }
  .lb-avatar { width: 24px; height: 24px; border-radius: 50%; display: grid; place-items: center; color: #fff; font-size: 10px; font-weight: 700; flex-shrink: 0; }
  .lb-name { flex: 1; font-weight: 500; }
  .lb-pct { font-weight: 700; font-variant-numeric: tabular-nums; }

  /* ── Streak ── */
  .streak-card { background: linear-gradient(135deg, #2563eb, #7c3aed); border-radius: 12px; padding: 14px 18px; color: #fff; display: flex; align-items: center; gap: 14px; }
  .streak-num { font-size: 32px; font-weight: 800; letter-spacing: -.02em; }
  .streak-text { font-size: 13px; opacity: .85; line-height: 1.4; }
  .streak-text strong { font-weight: 700; opacity: 1; }

  /* ── Achievements ── */
  .ach-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
  .ach { display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 12px 6px; background: var(--bg-soft); border-radius: 8px; text-align: center; }
  .ach.earned { background: var(--bg-elev); border: 1px solid var(--border); }
  .ach-icon { width: 28px; height: 28px; display: grid; place-items: center; border-radius: 6px; }
  .ach-icon.earned { opacity: 1; }
  .ach-icon.locked { opacity: .35; }
  .ach-label { font-size: 10px; font-weight: 500; color: var(--muted); }

  /* ── Empty state ── */
  .empty-templates { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; max-width: 720px; margin: 0 auto; }
  .tmpl {
    border: 1px solid var(--border); background: var(--bg-elev); border-radius: 10px;
    padding: 14px; text-align: left; cursor: pointer; display: flex; flex-direction: column; gap: 8px;
    transition: all .15s ease;
  }
  .tmpl:hover { border-color: var(--brand); transform: translateY(-1px); box-shadow: var(--shadow-md); }
  .tmpl-icon { width: 28px; height: 28px; border-radius: 7px; display: grid; place-items: center; background: var(--brand-soft); color: var(--brand-ink); }
  .tmpl-icon :global(svg) { width: 14px; height: 14px; }
  .tmpl-name { font-size: 13px; font-weight: 600; }
  .tmpl-desc { font-size: 11px; color: var(--muted); line-height: 1.4; }

  /* ── Gestor team table ── */
  .team-table { width: 100%; border-collapse: collapse; font-size: 13px; }
  .team-table th { font-size: 11px; font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: .04em; padding: 8px 12px; text-align: left; border-bottom: 1px solid var(--border-strong); }
  .team-table td { padding: 10px 12px; border-bottom: 1px solid var(--border); }
  .team-table tr:hover td { background: var(--bg-soft); }

  /* ── Gestor distribution bars ── */
  .dist-bar { height: 14px; border-radius: 7px; position: relative; overflow: hidden; }
  .dist-fill { height: 100%; border-radius: 7px; }

  /* ── Coach alerts ── */
  .coach { padding: 12px 14px; border-bottom: 1px solid var(--border); display: flex; gap: 10px; cursor: pointer; }
  .coach:last-child { border-bottom: 0; }
  .coach:hover { background: var(--bg-soft); }
  .coach-icon { flex-shrink: 0; width: 28px; height: 28px; border-radius: 7px; display: grid; place-items: center; }
  .coach-icon.danger { background: var(--danger-soft); color: var(--danger); }
  .coach-icon.warn { background: var(--warning-soft); color: var(--warning); }
  .coach-icon.success { background: var(--success-soft); color: var(--success); }
  .coach-text { font-size: 13px; line-height: 1.4; }
  .coach-text :global(strong) { font-weight: 600; }
  .coach-cta { font-size: 11px; color: var(--brand-ink); font-weight: 600; margin-top: 4px; }

  /* ── Specialty breakdown ── */
  .spec-row { display: flex; align-items: center; gap: 10px; padding: 8px 14px; border-bottom: 1px solid var(--border); font-size: 13px; }
  .spec-row:last-child { border-bottom: 0; }
  .spec-name { font-weight: 600; width: 100px; flex-shrink: 0; }
  .spec-bar-wrap { flex: 1; height: 6px; border-radius: 999px; background: var(--bg-soft); overflow: hidden; }
  .spec-fill { height: 100%; border-radius: 999px; }
  .spec-val { font-weight: 600; font-variant-numeric: tabular-nums; width: 70px; text-align: right; font-size: 12px; }

  /* ── Filter bar ── */
  .filterbar { display: flex; gap: 10px; align-items: center; }
  .filterbar select {
    padding: 7px 32px 7px 12px; border: 1px solid var(--border); border-radius: 8px;
    background: var(--bg-elev); font-size: 12px; font-weight: 500; color: var(--ink);
    cursor: pointer; font-family: inherit; appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' fill='none'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%236b7280' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right 10px center;
  }
</style>

<!-- ═══════════ HEADER ═══════════ -->
<header class="flex flex-wrap items-center justify-between gap-4 mb-6">
  <div class="flex items-center gap-4">
    <div class="w-9 h-9 rounded-lg bg-[var(--brand)] grid place-items-center">
      <Target class="w-5 h-5 text-white" />
    </div>
    <div>
      <h1 class="page-title">Metas</h1>
      <p class="page-description">Defina, acompanhe e analise os objetivos comerciais da equipe</p>
    </div>
  </div>

  <div class="flex items-center gap-3">
    <span class="text-xs font-semibold px-2.5 py-1 rounded-md bg-[var(--brand-soft)] text-[var(--brand-ink)]" id="user-role">
      {viewMode === 'propagandista' ? 'Propagandista' : 'Gestor'}
    </span>

    <div class="persona-toggle" id="personaToggle">
      <button class="persona-btn" class:active={viewMode === 'propagandista'} onclick={() => (viewMode = 'propagandista')}>
        <UserRound class="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
        Eu
      </button>
      <button class="persona-btn" class:active={viewMode === 'gestor'} onclick={() => (viewMode = 'gestor')}>
        <Users class="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
        Equipe
      </button>
    </div>

    {#if !isEmptyState}
      <Button onclick={handleNovaMeta} class="inline-flex gap-2">
        <Plus class="h-4 w-4" /> Nova Meta
      </Button>
    {/if}
  </div>
</header>

<!-- ═══════════ EMPTY STATE ═══════════ -->
{#if isEmptyState}
  <div class="text-center py-16">
    <div class="mb-5">
      <Target class="w-20 h-20 mx-auto text-[var(--muted-2)]" />
    </div>
    <h3 class="text-lg font-semibold mb-1.5">Nenhuma meta criada</h3>
    <p class="text-sm text-[var(--muted)] max-w-[380px] mx-auto mb-6">
      Crie sua primeira meta para comecar a acompanhar seu desempenho. Escolha um dos templates ou crie do zero.
    </p>

    <div class="empty-templates">
      {#each templates as t}
        <button class="tmpl" onclick={() => handleNovaMetaFromTemplate(t.name)}>
          <div class="tmpl-icon">
            <t.icon />
          </div>
          <span class="tmpl-name">{t.name}</span>
          <span class="tmpl-desc">{t.desc}</span>
        </button>
      {/each}
    </div>

    <div class="mt-8">
      <Button onclick={handleNovaMeta} class="inline-flex gap-2">
        <Plus class="h-4 w-4" /> Nova Meta
      </Button>
    </div>
  </div>

{:else}
  <!-- ═══════════ FILLED STATE ═══════════ -->

  {#if loading}
    <div class="flex items-center justify-center rounded-xl border border-[var(--border)] bg-white py-16">
      <Loader2 class="h-6 w-6 animate-spin text-blue-600" />
    </div>

  {:else if viewMode === 'propagandista'}
    <!-- ═══════ PROPAGANDISTA VIEW ═══════ -->

    <!-- Cascade -->
    <div class="grid grid-cols-3 gap-3 mb-6">
      <div class="cascade-cell">
        <div class="cascade-label">Empresa</div>
        <div class="cascade-name flex items-center gap-2">
          <Building2 class="w-3.5 h-3.5 text-[var(--muted)]" />
          Medivisitas
        </div>
        <div class="flex items-end gap-2 mt-1.5">
          <span class="cascade-pct">{cascadeEmpresa.pct}%</span>
        </div>
        <div class="cascade-bar mt-2">
          <div class="cascade-fill" style="width: {cascadeEmpresa.pct}%; background: var(--brand)"></div>
        </div>
      </div>
      <div class="cascade-cell">
        <div class="cascade-label">Equipe</div>
        <div class="cascade-name flex items-center gap-2">
          <Users class="w-3.5 h-3.5 text-[var(--muted)]" />
          Time Sao Paulo
        </div>
        <div class="flex items-end gap-2 mt-1.5">
          <span class="cascade-pct">{cascadeEquipe.pct}%</span>
          <span class="cascade-arrow text-[var(--muted)]">→</span>
        </div>
        <div class="cascade-bar mt-2">
          <div class="cascade-fill" style="width: {cascadeEquipe.pct}%; background: var(--brand)"></div>
        </div>
      </div>
      <div class="cascade-cell you">
        <div class="cascade-label">Voce</div>
        <div class="cascade-name flex items-center gap-2">
          <UserRound class="w-3.5 h-3.5 text-[var(--brand)]" />
          Lucas
        </div>
        <div class="flex items-end gap-2 mt-1.5">
          <span class="cascade-pct">{cascadeVoce.pct}%</span>
          <span class="text-xs text-[var(--muted)]">do pace</span>
        </div>
        <div class="cascade-bar mt-2">
          <div class="cascade-fill" style="width: {cascadeVoce.pct}%; background: var(--brand)"></div>
        </div>
      </div>
    </div>

    <!-- KPI Cockpit Cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <!-- KPI 1: Visitas -->
      <div class="kpi-card">
        <div class="kpi-card-header">
          <div class="kpi-card-icon bg-[var(--brand-soft)] text-[var(--brand-ink)]">
            <Target class="w-4 h-4" />
          </div>
          <span class="kpi-label">Visitas</span>
        </div>
        <span class="kpi-value">{kpiVisitas.atual}<span class="text-sm font-normal text-[var(--muted)]">/{kpiVisitas.meta}</span></span>
        <div class="kpi-meta-row mt-1">
          <span class="kpi-delta up"><ArrowUpRight class="w-3 h-3" /> {kpiVisitas.delta}pp vs pace</span>
          <span class="text-[var(--muted-2)] text-xs">|</span>
          <span class="text-xs text-[var(--muted)]">Forecast IA: <strong class="font-semibold text-[var(--ink)]">{kpiVisitas.forecast}%</strong></span>
        </div>
        <div class="kpi-bar"><div class="kpi-bar-fill" style="width: {kpiVisitas.pct}%; background: var(--brand)"></div></div>
        <div class="kpi-bar-foot"><span>0</span><span>Pace esperado</span><span>{kpiVisitas.meta}</span></div>
      </div>

      <!-- KPI 2: Cobertura -->
      <div class="kpi-card">
        <div class="kpi-card-header">
          <div class="kpi-card-icon bg-[var(--success-soft)] text-[var(--success)]">
            <Eye class="w-4 h-4" />
          </div>
          <span class="kpi-label">Cobertura de Prescritores</span>
        </div>
        <span class="kpi-value">{kpiCobertura.atual}%<span class="text-sm font-normal text-[var(--muted)]">/{kpiCobertura.meta}%</span></span>
        <div class="kpi-meta-row mt-1">
          <span class="kpi-delta down"><TrendingDown class="w-3 h-3" /> {Math.abs(kpiCobertura.delta)}pp vs pace</span>
          <span class="text-[var(--muted-2)] text-xs">|</span>
          <span class="text-xs text-[var(--muted)]">Forecast IA: <strong class="font-semibold text-[var(--ink)]">{kpiCobertura.forecast}%</strong></span>
        </div>
        <div class="kpi-bar"><div class="kpi-bar-fill" style="width: {kpiCobertura.pct}%; background: var(--success)"></div></div>
        <div class="kpi-bar-foot"><span>0</span><span>Pace esperado</span><span>{kpiCobertura.meta}%</span></div>
      </div>

      <!-- KPI 3: Frequencia -->
      <div class="kpi-card">
        <div class="kpi-card-header">
          <div class="kpi-card-icon bg-[var(--warning-soft)] text-[var(--warning)]">
            <Activity class="w-4 h-4" />
          </div>
          <span class="kpi-label">Frequencia de Visitas</span>
        </div>
        <span class="kpi-value">{kpiFrequencia.atual}<span class="text-sm font-normal text-[var(--muted)]">/{kpiFrequencia.meta} por medico</span></span>
        <div class="kpi-meta-row mt-1">
          <span class="kpi-delta up"><ArrowUpRight class="w-3 h-3" /> {kpiFrequencia.delta}pp vs pace</span>
          <span class="text-[var(--muted-2)] text-xs">|</span>
          <span class="text-xs text-[var(--muted)]">Forecast IA: <strong class="font-semibold text-[var(--ink)]">{kpiFrequencia.forecast}%</strong></span>
        </div>
        <div class="kpi-bar"><div class="kpi-bar-fill" style="width: {kpiFrequencia.pct}%; background: var(--warning)"></div></div>
        <div class="kpi-bar-foot"><span>0</span><span>Pace esperado</span><span>{kpiFrequencia.meta}</span></div>
      </div>

      <!-- KPI 4: Conversao -->
      <div class="kpi-card">
        <div class="kpi-card-header">
          <div class="kpi-card-icon bg-[#f1edff] text-[#6940d8]">
            <Percent class="w-4 h-4" />
          </div>
          <span class="kpi-label">Conversao de Prescricoes</span>
        </div>
        <span class="kpi-value">{kpiConversao.atual}%<span class="text-sm font-normal text-[var(--muted)]">/{kpiConversao.meta}%</span></span>
        <div class="kpi-meta-row mt-1">
          <span class="kpi-delta up"><ArrowUpRight class="w-3 h-3" /> {kpiConversao.delta}pp vs pace</span>
          <span class="text-[var(--muted-2)] text-xs">|</span>
          <span class="text-xs text-[var(--muted)]">Forecast IA: <strong class="font-semibold text-[var(--ink)]">{kpiConversao.forecast}%</strong></span>
        </div>
        <div class="kpi-bar"><div class="kpi-bar-fill" style="width: {kpiConversao.pct}%; background: #6940d8"></div></div>
        <div class="kpi-bar-foot"><span>0</span><span>Pace esperado</span><span>{kpiConversao.meta}%</span></div>
      </div>
    </div>

    <!-- Filter bar -->
    <div class="filterbar mb-4">
      <select>
        <option>Todas as metas</option>
        <option>No ritmo</option>
        <option>Em risco</option>
        <option>Adiantado</option>
      </select>
      <select>
        <option>Periodo: Mes atual</option>
        <option>Proximo mes</option>
        <option>Trimestre atual</option>
        <option>Ano atual</option>
      </select>
    </div>

    <!-- Layout: Goals + Sidebar -->
    <div class="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-5 mb-6">
      <!-- LEFT: Goals list -->
      <div class="bg-white rounded-xl border border-[var(--border)] overflow-hidden">
        <!-- Streak Card -->
        <div class="streak-card m-3">
          <div class="streak-num">{streakDias}</div>
          <div>
            <div class="streak-text"><strong>Sequencia de dias</strong> batendo a meta diaria</div>
            <div class="streak-text" style="font-size:11px; opacity:.65; margin-top:2px;">Recorde: {streakMax} dias</div>
          </div>
          <div class="ml-auto">
            <Zap class="w-6 h-6 opacity-80" />
          </div>
        </div>

        <!-- Goals -->
        <div class="goals">
          {#each metasFiltradas as meta, i}
            <div class="goal" onclick={() => handleEditarMeta(meta)} onkeydown={(e) => e.key === 'Enter' && handleEditarMeta(meta)} role="button" tabindex="0">
              <!-- Icon -->
              <div class="goal-icon" class:green={meta.status === 'ATINGIDA'} class:amber={meta.alertas?.emRisco && !meta.alertas?.prazoCritico} class:red={meta.alertas?.prazoCritico}>
                {#if meta.plano === 'EQUIPE'}
                  <Users class="w-4.5 h-4.5" />
                {:else}
                  <Target class="w-4.5 h-4.5" />
                {/if}
              </div>

              <!-- Info -->
              <div>
                <div class="flex items-center gap-2 flex-wrap">
                  <span class="goal-name">{meta.nome}</span>
                  {#if meta.status === 'ATINGIDA'}
                    <span class="chip ahead">Atingida</span>
                  {:else if meta.alertas?.prazoCritico}
                    <span class="chip risk">Prazo critico</span>
                  {:else if meta.alertas?.emRisco}
                    <span class="chip risk">Em risco</span>
                  {:else if meta.progresso.geral >= 90}
                    <span class="chip ahead">Adiantado</span>
                  {:else}
                    <span class="chip ontrack">No ritmo</span>
                  {/if}
                </div>
                <div class="goal-meta">
                  <span>{formatarData(meta.dataInicio)} — {formatarData(meta.dataFim)}</span>
                  <span class="dot"></span>
                  <span>{diasRestantes(meta.dataFim)} dias restantes</span>
                  {#if meta.descricao}
                    <span class="dot"></span>
                    <span class="truncate max-w-[140px]">{meta.descricao}</span>
                  {/if}
                </div>
              </div>

              <!-- Progress bar -->
              <div class="goal-progress">
                <div class="gp-bar">
                  <div class="gp-fill" style="width: {meta.progresso.geral}%; background: {barColor(meta.progresso.geral)}"></div>
                  <div class="gp-pace" style="left: 55%"></div>
                </div>
                <div class="gp-meta">
                  <span style="font-size:10px; color: var(--muted-2)">{meta.progresso.geral}%</span>
                  <span style="font-size:10px; color: var(--muted-2)">pace 55%</span>
                </div>
              </div>

              <!-- Numeric -->
              <div class="goal-numeric">
                <div class="num">{meta.progresso.visitas.realizado}/{meta.metaVisitas}</div>
                <div class="delta up">+2.1pp</div>
              </div>

              <!-- More -->
              <button class="goal-more" onclick={(e: MouseEvent) => { e.stopPropagation(); handleExcluirMeta(meta); }} title="Excluir">
                <Trash2 class="w-3.5 h-3.5" />
              </button>
            </div>
          {:else}
            <div class="px-5 py-10 text-center">
              <p class="text-sm text-[var(--muted)]">Nenhuma meta encontrada. Clique em "Nova Meta" para criar.</p>
            </div>
          {/each}
        </div>
      </div>

      <!-- RIGHT: Insights sidebar -->
      <div class="space-y-4">
        <!-- Insights -->
        <div class="bg-white rounded-xl border border-[var(--border)] overflow-hidden">
          <div class="px-4 py-3 border-b border-[var(--border)]">
            <h3 class="text-sm font-semibold flex items-center gap-2">
              <Sparkles class="w-4 h-4 text-[var(--brand)]" />
              Insights Inteligentes
            </h3>
          </div>
          <div class="stack">
            {#each insights as ins}
              <div class="insight" role="button" tabindex="0">
                <div class="insight-icon {ins.type}">
                  <ins.icon />
                </div>
                <div>
                  <div class="insight-text">{@html ins.text}</div>
                  <div class="insight-meta">
                    <Clock class="w-3 h-3" /> {ins.time}
                  </div>
                  <div class="insight-cta">
                    {ins.cta} <ChevronRight class="w-3 h-3" />
                  </div>
                </div>
              </div>
            {/each}
          </div>
        </div>

        <!-- Suggestions -->
        <div class="bg-white rounded-xl border border-[var(--border)] overflow-hidden">
          <div class="px-4 py-3 border-b border-[var(--border)]">
            <h3 class="text-sm font-semibold">Proximos Medicos Sugeridos</h3>
          </div>
          <div>
            {#each suggestions as sug}
              <div class="sug" role="button" tabindex="0">
                <div class="sug-avatar" style="background: {sug.priority === 'high' ? '#2563eb' : '#6b7280'}">{sug.avatar}</div>
                <div class="flex-1 min-w-0">
                  <div class="sug-name truncate">{sug.name}</div>
                  <div class="text-xs text-[var(--muted)]">{sug.spec}</div>
                </div>
                <div class="sug-impact">{sug.impact}</div>
                <ChevronRight class="w-3.5 h-3.5 text-[var(--muted-2)]" />
              </div>
            {/each}
          </div>
        </div>

        <!-- Leaderboard -->
        <div class="bg-white rounded-xl border border-[var(--border)] overflow-hidden">
          <div class="px-4 py-3 border-b border-[var(--border)] flex items-center justify-between">
            <h3 class="text-sm font-semibold flex items-center gap-2">
              <Medal class="w-4 h-4 text-[var(--gold)]" />
              Ranking da Equipe
            </h3>
            <span class="text-xs text-[var(--muted)]">Mes atual</span>
          </div>
          <div>
            {#each leaderboard.slice(0, 5) as row}
              <div class="lb-row" class:bg-[var(--brand-soft)]={row.isYou}>
                <span class="lb-rank" class:gold={row.rank === 1} class:silver={row.rank === 2}>{row.rank}</span>
                <div class="lb-avatar" style="background-color: {row.avatar}">{row.initials}</div>
                <span class="lb-name">{row.name} {#if row.isYou}<span class="text-xs text-[var(--brand)] font-semibold ml-1">(voce)</span>{/if}</span>
                <span class="lb-pct">{row.pct}%</span>
              </div>
            {/each}
          </div>
        </div>

        <!-- Achievements -->
        <div class="bg-white rounded-xl border border-[var(--border)] p-4">
          <h3 class="text-sm font-semibold mb-3 flex items-center gap-2">
            <Award class="w-4 h-4 text-[var(--gold)]" />
            Conquistas
          </h3>
          <div class="ach-grid">
            {#each achievements as ach}
              <div class="ach" class:earned={ach.earned}>
                <div class="ach-icon" class:earned={ach.earned} class:locked={!ach.earned} style="color: {ach.color}">
                  <ach.icon class="w-5 h-5" />
                </div>
                <span class="ach-label">{ach.label}</span>
              </div>
            {/each}
          </div>
        </div>
      </div>
    </div>

    <!-- Heatmap Annual -->
    <div class="bg-white rounded-xl border border-[var(--border)] p-5 mb-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-sm font-semibold">Ritmo Anual de Visitas</h3>
        <div class="flex items-center gap-1.5 text-xs text-[var(--muted)]">
          <span>Menos</span>
          <div class="hm-cell l0"></div>
          <div class="hm-cell l1"></div>
          <div class="hm-cell l2"></div>
          <div class="hm-cell l3"></div>
          <div class="hm-cell l4"></div>
          <span>Mais</span>
        </div>
      </div>
      <div class="hm-grid" id="heatmap" style="overflow-x: auto; padding-bottom: 4px;">
        <!-- Heatmap rendered by JS below via effect -->
        <div bind:this={_heatmapEl} class="flex gap-[3px] min-w-fit"></div>
      </div>
    </div>

    <!-- Trajectory Chart (simplified SVG) -->
    <div class="bg-white rounded-xl border border-[var(--border)] p-5 mb-6">
      <h3 class="text-sm font-semibold mb-3">Trajetoria de Atingimento</h3>
      <div style="height: 200px; position: relative;">
        <svg viewBox="0 0 800 200" style="width: 100%; height: 100%;" preserveAspectRatio="none">
          <!-- Grid lines -->
          {#each [0, 25, 50, 75, 100] as y}
            <line x1="0" y1={200 - y * 2} x2="800" y2={200 - y * 2} stroke="#e5e7eb" stroke-width="0.5" />
          {/each}
          <!-- Target line -->
          <line x1="0" y1="40" x2="800" y2="40" stroke="#dc2626" stroke-width="1.5" stroke-dasharray="6,4" />
          <!-- Actual line -->
          <polyline
            points="0,190 100,170 200,155 300,140 400,120 500,105 600,95 700,85 800,70"
            fill="none" stroke="#2563eb" stroke-width="2.5"
          />
          <!-- Area fill -->
          <polygon
            points="0,190 100,170 200,155 300,140 400,120 500,105 600,95 700,85 800,70 800,200 0,200"
            fill="url(#blueGrad)" opacity="0.15"
          />
          <!-- Forecast band -->
          <polygon
            points="700,85 730,80 760,75 800,65 800,50 760,58 730,62 700,65"
            fill="#2563eb" opacity="0.08"
          />
          <!-- Forecast line -->
          <polyline points="700,85 730,80 760,75 800,65" fill="none" stroke="#2563eb" stroke-width="1.5" stroke-dasharray="4,3" opacity="0.6" />
          <!-- Today marker -->
          <line x1="650" y1="0" x2="650" y2="200" stroke="#f59e0b" stroke-width="1" stroke-dasharray="3,3" />
          <circle cx="650" cy="95" r="4" fill="#f59e0b" />
          <defs>
            <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#2563eb" stop-opacity="0.4" />
              <stop offset="100%" stop-color="#2563eb" stop-opacity="0" />
            </linearGradient>
          </defs>
        </svg>
        <!-- Legend -->
        <div class="flex items-center justify-center gap-6 mt-2">
          <div class="flex items-center gap-2 text-xs text-[var(--muted)]"><div style="width:12px;height:2px;background:#2563eb"></div> Realizado</div>
          <div class="flex items-center gap-2 text-xs text-[var(--muted)]"><div style="width:12px;height:2px;background:#2563eb;border-top:1px dashed #2563eb"></div> Forecast IA</div>
          <div class="flex items-center gap-2 text-xs text-[var(--muted)]"><div style="width:12px;height:2px;background:#dc2626;border-top:1px dashed #dc2626"></div> Meta</div>
          <div class="flex items-center gap-2 text-xs text-[var(--muted)]"><div style="width:0;height:10px;border-left:1px dashed #f59e0b"></div> Hoje</div>
        </div>
      </div>
    </div>

  {:else}
    <!-- ═══════ GESTOR VIEW ═══════ -->

    <!-- Cascade Gestor -->
    <div class="grid grid-cols-3 gap-3 mb-6">
      <div class="cascade-cell">
        <div class="cascade-label">Empresa</div>
        <div class="cascade-name flex items-center gap-2">
          <Building2 class="w-3.5 h-3.5 text-[var(--muted)]" />
          Medivisitas
        </div>
        <div class="flex items-end gap-2 mt-1.5">
          <span class="cascade-pct">{cascadeGestorEmpresa.pct}%</span>
        </div>
        <div class="cascade-bar mt-2">
          <div class="cascade-fill" style="width: {cascadeGestorEmpresa.pct}%; background: var(--brand)"></div>
        </div>
      </div>
      <div class="cascade-cell you">
        <div class="cascade-label">Sua Equipe</div>
        <div class="cascade-name flex items-center gap-2">
          <Users class="w-3.5 h-3.5 text-[var(--brand)]" />
          Time Sao Paulo
        </div>
        <div class="flex items-end gap-2 mt-1.5">
          <span class="cascade-pct">{cascadeGestorEquipe.pct}%</span>
          <span class="text-xs text-[var(--muted)]">do pace</span>
        </div>
        <div class="cascade-bar mt-2">
          <div class="cascade-fill" style="width: {cascadeGestorEquipe.pct}%; background: var(--brand)"></div>
        </div>
      </div>
      <div class="cascade-cell">
        <div class="cascade-label">Distribuicao</div>
        <div class="cascade-name flex items-center gap-2">
          <UserRound class="w-3.5 h-3.5 text-[var(--muted)]" />
          Media Individual
        </div>
        <div class="flex items-end gap-2 mt-1.5">
          <span class="cascade-pct">{cascadeGestorDist.pct}%</span>
        </div>
        <div class="cascade-bar mt-2">
          <div class="cascade-fill" style="width: {cascadeGestorDist.pct}%; background: var(--brand)"></div>
        </div>
      </div>
    </div>

    <!-- Gestor KPI Cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {#each gestorKPIs as kpi}
        <div class="kpi-card">
          <div class="kpi-card-header">
            <div class="kpi-card-icon bg-[var(--brand-soft)] text-[var(--brand-ink)]">
              <kpi.icon class="w-4 h-4" />
            </div>
            <span class="kpi-label">{kpi.label}</span>
          </div>
          <span class="kpi-value">{kpi.value}</span>
          <div class="kpi-meta-row mt-1">
            <span class="kpi-delta up">{kpi.delta}</span>
          </div>
        </div>
      {/each}
    </div>

    <!-- Filters -->
    <div class="filterbar mb-4">
      <select><option>Todos os territorios</option><option>Zona Sul SP</option><option>Zona Norte SP</option></select>
      <select><option>Mes atual</option><option>Proximo mes</option><option>Trimestre atual</option></select>
      <select><option>Todas as especialidades</option><option>Cardiologia</option><option>Endocrinologia</option></select>
    </div>

    <!-- Layout: team table + side -->
    <div class="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-5 mb-6">
      <!-- LEFT: Team data -->
      <div class="space-y-5">
        <!-- Distribution chart -->
        <div class="bg-white rounded-xl border border-[var(--border)] p-5">
          <h3 class="text-sm font-semibold mb-4">Distribuicao de Atingimento por Propagandista</h3>
          <div class="space-y-2">
            {#each teamRows as rep}
              <div class="flex items-center gap-3">
                <div class="w-20 text-xs font-semibold text-right flex-shrink-0 truncate" title={rep.name}>{rep.name}</div>
                <div class="flex-1 h-3 bg-[var(--bg-soft)] rounded-full overflow-hidden">
                  <div
                    class="h-full rounded-full"
                    style="width: {rep.atingimento}%; background-color: {rep.status === 'Adiantado' ? 'var(--success)' : rep.status === 'Em risco' ? 'var(--danger)' : 'var(--brand)'}"
                  ></div>
                </div>
                <span class="text-xs font-semibold w-9 text-right">{rep.atingimento}%</span>
              </div>
            {/each}
          </div>
        </div>

        <!-- Team roster table -->
        <div class="bg-white rounded-xl border border-[var(--border)] overflow-hidden">
          <div class="px-4 py-3 border-b border-[var(--border)]">
            <h3 class="text-sm font-semibold">Tabela da Equipe</h3>
          </div>
          <div class="overflow-x-auto">
            <table class="team-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Territorio</th>
                  <th>Ating.</th>
                  <th>Visitas</th>
                  <th>Cobertura</th>
                  <th>Conversao</th>
                  <th>Status</th>
                  <th>Forecast</th>
                </tr>
              </thead>
              <tbody>
                {#each teamRows as rep}
                  <tr class:bg-[var(--brand-soft)]={rep.isYou}>
                    <td class="font-semibold">
                      {rep.name}
                      {#if rep.isYou}
                        <span class="text-xs text-[var(--brand)] font-semibold ml-1">(voce)</span>
                      {/if}
                    </td>
                    <td class="text-[var(--muted)]">{rep.territory}</td>
                    <td class="font-semibold">{rep.atingimento}%</td>
                    <td class="text-[var(--muted)]">{rep.visitas}</td>
                    <td class="text-[var(--muted)]">{rep.cobertura}</td>
                    <td class="text-[var(--muted)]">{rep.conversao}</td>
                    <td>
                      <span class="chip" class:ontrack={rep.status === 'No ritmo'} class:ahead={rep.status === 'Adiantado'} class:risk={rep.status === 'Em risco'}>
                        {rep.status}
                      </span>
                    </td>
                    <td class="font-semibold">{rep.forecast}%</td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Heatmap rep x week -->
        <div class="bg-white rounded-xl border border-[var(--border)] p-5">
          <h3 class="text-sm font-semibold mb-3">Heatmap: Pessoa × Semana</h3>
          <div class="overflow-x-auto" id="teamHeatmap">
            <div bind:this={_teamHmEl} class="flex gap-[2px] min-w-fit"></div>
          </div>
          <div class="flex items-center gap-1.5 text-xs text-[var(--muted)] mt-3">
            <span>Menos</span>
            <div class="hm-cell l0"></div>
            <div class="hm-cell l1"></div>
            <div class="hm-cell l2"></div>
            <div class="hm-cell l3"></div>
            <div class="hm-cell l4"></div>
            <span>Mais</span>
          </div>
        </div>
      </div>

      <!-- RIGHT: Gestor sidebar -->
      <div class="space-y-4">
        <!-- Coaching Alerts -->
        <div class="bg-white rounded-xl border border-[var(--border)] overflow-hidden">
          <div class="px-4 py-3 border-b border-[var(--border)]">
            <h3 class="text-sm font-semibold flex items-center gap-2">
              <Sparkles class="w-4 h-4 text-[var(--brand)]" />
              Alertas de Coaching
            </h3>
          </div>
          {#each coachingAlerts as alert}
            <div class="coach" role="button" tabindex="0">
              <div class="coach-icon {alert.type}">
                <alert.icon class="w-3.5 h-3.5" />
              </div>
              <div>
                <div class="coach-text">{@html alert.text}</div>
                <div class="coach-cta">{alert.cta} <ChevronRight class="w-3 h-3 inline" /></div>
              </div>
            </div>
          {/each}
        </div>

        <!-- Metas em Risco -->
        <div class="bg-white rounded-xl border border-[var(--border)] overflow-hidden">
          <div class="px-4 py-3 border-b border-[var(--border)]">
            <h3 class="text-sm font-semibold flex items-center gap-2">
              <AlertTriangle class="w-4 h-4 text-[var(--danger)]" />
              Metas em Risco
            </h3>
          </div>
          {#each metasEmRisco as m}
            <div class="flex items-center gap-3 px-4 py-3 border-b border-[var(--border)] last:border-b-0">
              <div class="w-2 h-2 rounded-full" class:bg-red-500={m.severity === 'high'} class:bg-amber-500={m.severity === 'medium'}></div>
              <div class="flex-1 min-w-0">
                <div class="text-sm font-medium truncate">{m.name}</div>
                <div class="text-xs text-[var(--muted)]">{m.meta}</div>
              </div>
              <span class="text-xs font-semibold" class:text-red-600={m.severity === 'high'} class:text-amber-600={m.severity === 'medium'}>{m.delta}</span>
            </div>
          {/each}
        </div>

        <!-- Specialty Breakdown -->
        <div class="bg-white rounded-xl border border-[var(--border)] overflow-hidden">
          <div class="px-4 py-3 border-b border-[var(--border)]">
            <h3 class="text-sm font-semibold">Quebra por Especialidade</h3>
          </div>
          {#each especBreakdown as esp}
            <div class="spec-row">
              <span class="spec-name">{esp.spec}</span>
              <div class="spec-bar-wrap">
                <div class="spec-fill" style="width: {esp.ating}%; background: var(--brand)"></div>
              </div>
              <span class="spec-val">{esp.ating}%</span>
            </div>
          {/each}
        </div>
      </div>
    </div>
  {/if}
{/if}

<!-- ═══════════ MODALS ═══════════ -->

<Sheet open={sheetOpen} onclose={() => (sheetOpen = false)}>
  {#snippet children()}
    <div class="space-y-5">
      <!-- Header -->
      <div>
        <h3 class="text-lg font-semibold text-[rgb(var(--slate-900))]">
          {metaEmEdicao ? 'Editar Meta' : 'Nova Meta'}
        </h3>
        <p class="text-sm text-[rgb(var(--slate-400))] mt-1">
          {metaEmEdicao ? 'Atualize os dados abaixo' : 'Defina o período e os indicadores de acompanhamento'}
        </p>
      </div>

      <form id="metaForm" class="space-y-5" onsubmit={(event) => { event.preventDefault(); handleSalvarMeta(); }}>
        <section>
          <h4 class="section-header">
            <Target class="h-3.5 w-3.5" />
            Identificação
          </h4>
          <div class="space-y-3">
            <div>
              <label for="meta-nome" class="input-label">Nome <span class="text-red-500">*</span></label>
              <input id="meta-nome" bind:value={formNome} class="input-base" placeholder="Meta mensal de visitas" />
            </div>
            <div>
              <label for="meta-descricao" class="input-label">Descrição</label>
              <textarea id="meta-descricao" rows={3} bind:value={formDescricao} class="input-base resize-none" placeholder="Contexto da meta"></textarea>
              <p class="input-hint">Opcional</p>
            </div>
            <div>
              <span class="input-label">Plano</span>
              <div class="segmented-control" role="group" aria-label="Plano da meta">
                <button type="button" onclick={() => selecionarPlano('PROFISSIONAL')} class="segmented-btn {formPlano === 'PROFISSIONAL' ? 'seg-active-blue' : ''}">
                  Profissional
                </button>
                <button type="button" onclick={() => selecionarPlano('EQUIPE')} class="segmented-btn {formPlano === 'EQUIPE' ? 'seg-active-emerald' : ''}">
                  Equipe
                </button>
              </div>
            </div>
            <div>
              <label for="meta-responsavel" class="input-label">Responsável <span class="text-red-500">*</span></label>
              <input id="meta-responsavel" bind:value={formResponsavelId} disabled={formPlano === 'PROFISSIONAL'} class="input-base disabled:bg-[rgb(var(--slate-100))] disabled:text-[rgb(var(--slate-500))]" placeholder="userId do Clerk" />
              <p class="input-hint">Use o userId do Clerk do propagandista responsável</p>
            </div>
          </div>
        </section>

        <section>
          <h4 class="section-header">
            <CalendarDays class="h-3.5 w-3.5" />
            Período
          </h4>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label for="meta-data-inicio" class="input-label">Data início</label>
              <input id="meta-data-inicio" type="date" bind:value={formDataInicio} class="input-base" />
            </div>
            <div>
              <label for="meta-data-fim" class="input-label">Data fim</label>
              <input id="meta-data-fim" type="date" bind:value={formDataFim} class="input-base" />
            </div>
          </div>
        </section>

        <section>
          <h4 class="section-header">
            <BarChart3 class="h-3.5 w-3.5" />
            Indicadores
          </h4>
          <div class="space-y-3">
            <div>
              <label for="meta-visitas" class="input-label">Meta de Visitas</label>
              <input id="meta-visitas" type="number" min="0" bind:value={formMetaVisitas} class="input-base" />
            </div>
            <div>
              <label for="meta-avancos" class="input-label">Meta de Avanços no Pipeline</label>
              <input id="meta-avancos" type="number" min="0" bind:value={formMetaAvancos} class="input-base" />
            </div>
            <div>
              <label for="meta-prescritores" class="input-label">Meta de Novos Prescritores</label>
              <input id="meta-prescritores" type="number" min="0" bind:value={formMetaPrescritores} class="input-base" />
            </div>
          </div>
        </section>
      </form>

      <div class="flex flex-col-reverse gap-3 pt-2">
        <Button variant="outline" onclick={() => (sheetOpen = false)} class="w-full" disabled={saving}>
          Cancelar
        </Button>
        <Button type="submit" form="metaForm" class="w-full" disabled={saving}>
          {#if saving}
            <Loader2 class="h-4 w-4 animate-spin" />
          {/if}
          {metaEmEdicao ? 'Salvar Meta' : 'Criar Meta'}
        </Button>
      </div>
    </div>
  {/snippet}
</Sheet>

<ConfirmDialog
  open={deleteConfirmOpen}
  onclose={() => { deleteConfirmOpen = false; metaParaExcluir = null; }}
  title="Excluir meta"
  onconfirm={confirmarExclusao}
  variant="danger"
>
  {#snippet description()}
    {#if metaParaExcluir}
      <p>Voce esta prestes a excluir <strong>"{metaParaExcluir.nome}"</strong>.</p>
      <p>Esta acao nao pode ser desfeita.</p>
    {/if}
  {/snippet}
</ConfirmDialog>
