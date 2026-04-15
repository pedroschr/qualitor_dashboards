<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>WTP Test</title>
<style>
  :root {
    --bg: #f5f6f8;
    --surface: #ffffff;
    --surface2: #f0f2f5;
    --border: rgba(0,0,0,0.07);
    --accent1: #2563eb;
    --accent2: #d97706;
    --accent3: #059669;
    --accent4: #7c3aed;
    --text: #111827;
    --muted: #6b7280;
    --tag-env: #dbeafe;
    --tag-neg: #fef3c7;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: 'Nunito', sans-serif;
    font-weight: 400;
    min-height: 100vh;
    overflow-x: hidden;
  }

  /* Subtle grid bg */
  body::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image:
      linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px);
    background-size: 48px 48px;
    pointer-events: none;
    z-index: 0;
  }

  .page {
    position: relative;
    z-index: 1;
    max-width: 1400px;
    margin: 0 auto;
    padding: 48px 32px 64px;
  }

  /* ── Header ── */
  header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 48px;
    padding-bottom: 32px;
    border-bottom: 1px solid var(--border);
  }
  .header-left {}
  .header-eyebrow {
    font-size: 11px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--accent1);
    margin-bottom: 10px;
    font-weight: 500;
  }
  .header-title {
    font-weight: 800;
    font-family: 'Nunito', sans-serif;
    font-size: clamp(28px, 4vw, 44px);
    line-height: 1.1;
    color: var(--text);
    letter-spacing: -0.5px;
  }
  .header-title em {
    font-style: italic;
    color: var(--accent1);
  }
  .header-right {
    text-align: right;
  }
  .header-date {
    font-size: 12px;
    color: var(--muted);
    font-weight: 400;
    letter-spacing: 0.5px;
  }
  .header-badge {
    margin-top: 8px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(5,150,105,0.08);
    border: 1px solid rgba(5,150,105,0.2);
    color: #059669;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 1px;
    text-transform: uppercase;
    padding: 5px 12px;
    border-radius: 20px;
  }
  .dot { width: 6px; height: 6px; border-radius: 50%; background: #10b981; animation: pulse 2s infinite; }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }

  /* ── Filter notice ── */
  .filter-notice {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 36px;
    align-items: center;
  }
  .filter-label {
    font-size: 11px;
    color: var(--muted);
    letter-spacing: 1px;
    text-transform: uppercase;
    font-weight: 500;
    margin-right: 4px;
  }
  .filter-tag {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 11px;
    font-weight: 500;
    padding: 4px 10px;
    border-radius: 4px;
    border: 1px solid;
  }
  .ft-env { background: #dbeafe; border-color: #bfdbfe; color: #1d4ed8; }
  .ft-neg { background: #fef3c7; border-color: #fde68a; color: #92400e; }
  .ft-excl { background: #fee2e2; border-color: #fecaca; color: #b91c1c; }
  .ft-date { background: #d1fae5; border-color: #a7f3d0; color: #065f46; }

  /* ── KPI Row ── */
  .kpi-row {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-bottom: 28px;
  }
  @media(max-width:900px){ .kpi-row { grid-template-columns: repeat(2,1fr); } }
  @media(max-width:500px){ .kpi-row { grid-template-columns: 1fr; } }

  .kpi-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 24px 24px 20px;
    position: relative;
    overflow: hidden;
    transition: transform .2s, box-shadow .2s;
  }
  .kpi-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.08); }
  .kpi-card::after {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: var(--card-accent, var(--accent1));
  }
  .kpi-card:nth-child(1) { --card-accent: var(--accent1); }
  .kpi-card:nth-child(2) { --card-accent: var(--accent2); }
  .kpi-card:nth-child(3) { --card-accent: var(--accent3); }
  .kpi-card:nth-child(4) { --card-accent: var(--accent4); }

  .kpi-icon {
    font-size: 18px;
    margin-bottom: 12px;
    opacity: .8;
  }
  .kpi-label {
    font-size: 11px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: var(--muted);
    font-weight: 600;
    margin-bottom: 8px;
  }
  .kpi-value {
    font-weight: 700;
    font-family: 'Nunito', sans-serif;
    font-size: clamp(24px,3vw,36px);
    line-height: 1;
    color: var(--text);
    margin-bottom: 6px;
  }
  .kpi-sub {
    font-size: 12px;
    color: var(--muted);
  }
  .kpi-sub span { color: var(--card-accent, var(--accent1)); font-weight: 600; }

  /* ── Main grid ── */
  .grid-main {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 20px;
  }
  .grid-bottom {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }
  @media(max-width:900px){
    .grid-main, .grid-bottom { grid-template-columns: 1fr; }
  }

  /* ── Cards ── */
  .card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 28px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  }
  .card-full {
    grid-column: 1 / -1;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 24px;
  }
  .card-title {
    font-weight: 700;
    font-family: 'Nunito', sans-serif;
    font-size: 18px;
    color: var(--text);
  }
  .card-subtitle {
    font-size: 12px;
    color: var(--muted);
    margin-top: 3px;
  }
  .card-badge {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: .5px;
    padding: 4px 10px;
    border-radius: 20px;
    border: 1px solid var(--border);
    color: var(--muted);
    background: var(--surface2);
  }

  canvas { max-height: 260px; }

  /* ── Etapa comparison ── */
  .etapa-comparison {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-top: 8px;
  }
  .etapa-block {
    border-radius: 10px;
    padding: 20px;
    position: relative;
    overflow: hidden;
  }
  .eb-env {
    background: #eff6ff;
    border: 1px solid #bfdbfe;
  }
  .eb-neg {
    background: #fffbeb;
    border: 1px solid #fde68a;
  }
  .eb-label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    margin-bottom: 14px;
  }
  .eb-env .eb-label { color: #1d4ed8; }
  .eb-neg .eb-label { color: #92400e; }
  .eb-num {
    font-family: 'Nunito', sans-serif;
    font-size: 42px;
    line-height: 1;
    margin-bottom: 4px;
  }
  .eb-env .eb-num { color: #1d4ed8; }
  .eb-neg .eb-num { color: #d97706; }
  .eb-desc { font-size: 12px; color: var(--muted); margin-bottom: 14px; }
  .eb-value {
    font-size: 17px;
    font-weight: 600;
    letter-spacing: -0.3px;
  }
  .eb-env .eb-value { color: #1d4ed8; }
  .eb-neg .eb-value { color: #92400e; }
  .eb-pct {
    position: absolute;
    bottom: 16px; right: 16px;
    font-size: 11px;
    font-weight: 600;
    opacity: .4;
    color: var(--text);
  }

  /* ── Client bars ── */
  .client-list { margin-top: 4px; }
  .client-row {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    gap: 12px;
    padding: 8px 0;
    border-bottom: 1px solid var(--border);
  }
  .client-row:last-child { border-bottom: none; }
  .client-name { font-size: 13px; color: var(--text); font-weight: 400; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .client-bar-wrap { grid-column: 1/-1; margin-top: -4px; }
  .client-bar-bg { background: rgba(255,255,255,0.05); border-radius: 2px; height: 3px; overflow: hidden; }
  .client-bar-fill { height: 100%; border-radius: 2px; background: linear-gradient(90deg, var(--accent1), var(--accent4)); transition: width 1s ease; }
  .client-value { font-size: 12px; font-weight: 500; color: var(--muted); white-space: nowrap; }

  /* ── Resp table ── */
  .resp-table { width: 100%; border-collapse: collapse; margin-top: 4px; }
  .resp-table th {
    font-size: 10px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: var(--muted);
    font-weight: 500;
    text-align: left;
    padding: 0 0 12px;
    border-bottom: 1px solid var(--border);
  }
  .resp-table th:not(:first-child) { text-align: right; }
  .resp-table td {
    font-size: 13px;
    padding: 12px 0;
    border-bottom: 1px solid var(--border);
    color: var(--text);
  }
  .resp-table tr:last-child td { border-bottom: none; }
  .resp-table td:not(:first-child) { text-align: right; }
  .resp-table td.value { font-weight: 500; color: var(--accent3); }
  .resp-dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; margin-right: 8px; }

  .resp-bar-cell { padding: 4px 0 12px !important; }
  .resp-bar-bg { background: rgba(255,255,255,0.05); border-radius: 2px; height: 3px; overflow: hidden; }
  .resp-bar-fill { height: 100%; border-radius: 2px; }

  /* ── Status do Projeto ── */
  .status-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 14px;
    margin-top: 4px;
  }
  .status-block {
    border-radius: 10px;
    padding: 18px 16px;
    position: relative;
    overflow: hidden;
    text-align: center;
  }
  .sb-alta  { background: #ecfdf5;  border: 1px solid #a7f3d0; }
  .sb-media { background: #fffbeb;  border: 1px solid #fde68a; }
  .sb-baixa { background: #fef2f2;  border: 1px solid #fecaca; }
  .sb-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    margin-bottom: 10px;
  }
  .sb-alta  .sb-label { color: #065f46; }
  .sb-media .sb-label { color: #92400e; }
  .sb-baixa .sb-label { color: #991b1b; }
  .sb-num {
    font-family: 'Nunito', sans-serif;
    font-size: 36px;
    line-height: 1;
    margin-bottom: 4px;
  }
  .sb-alta  .sb-num { color: #059669; }
  .sb-media .sb-num { color: #d97706; }
  .sb-baixa .sb-num { color: #dc2626; }
  .sb-desc { font-size: 11px; color: var(--muted); margin-bottom: 10px; }
  .sb-value { font-size: 13px; font-weight: 600; }
  .sb-alta  .sb-value { color: #065f46; }
  .sb-media .sb-value { color: #92400e; }
  .sb-baixa .sb-value { color: #991b1b; }
  .sb-val2 {
    font-size: 11px;
    color: var(--muted);
    margin-top: 5px;
    margin-bottom: 2px;
  }
  .sb-alta  .sb-val2 span { color: #059669; font-weight: 600; }
  .sb-media .sb-val2 span { color: #d97706; font-weight: 600; }
  .sb-baixa .sb-val2 span { color: #dc2626; font-weight: 600; }
  .sb-pct {
    font-size: 10px;
    font-weight: 500;
    opacity: .5;
    margin-top: 2px;
  }
  .status-donut-wrap {
    display: flex;
    align-items: center;
    gap: 24px;
    margin-top: 4px;
  }
  .status-donut-wrap canvas { max-height: 220px; width: 220px !important; flex-shrink: 0; }
  .status-legend { flex: 1; }
  .sl-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid var(--border);
    gap: 12px;
  }
  .sl-row:last-child { border-bottom: none; }
  .sl-left { display: flex; align-items: center; gap: 10px; }
  .sl-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
  .sl-name { font-size: 13px; color: var(--text); }
  .sl-right { text-align: right; }
  .sl-qtd { font-size: 12px; color: var(--muted); }
  .sl-val { font-size: 13px; font-weight: 500; }

  /* ── Cruzamento Status x Mês ── */
  .cross-grid {
    display: grid;
    grid-template-columns: 1.2fr 1fr;
    gap: 24px;
    margin-top: 28px;
    padding-top: 24px;
    border-top: 1px solid var(--border);
  }
  @media(max-width:700px){ .cross-grid { grid-template-columns: 1fr; } }

  /* ══════════════════════════════
     MOBILE RESPONSIVO
  ══════════════════════════════ */
  @media(max-width:640px) {
    .page { padding: 24px 16px 48px; }

    /* Header */
    header { flex-direction: column; align-items: flex-start; gap: 16px; margin-bottom: 28px; padding-bottom: 20px; }
    .header-right { text-align: left; }

    /* Filtros */
    .filter-notice { gap: 6px; margin-bottom: 24px; }

    /* KPIs — 2 colunas no mobile */
    .kpi-row { grid-template-columns: repeat(2,1fr); gap: 10px; }
    .kpi-card { padding: 16px; }
    .kpi-value { font-size: 22px; }

    /* Grids principais */
    .grid-main, .grid-bottom { grid-template-columns: 1fr; gap: 12px; }

    /* Cards */
    .card { padding: 18px; }
    .card-title { font-size: 15px; }

    /* Etapa comparison */
    .etapa-comparison { grid-template-columns: 1fr; }

    /* Status row */
    .status-row { grid-template-columns: 1fr; gap: 10px; }

    /* Donut wrap */
    .status-donut-wrap { flex-direction: column; align-items: center; }
    .status-donut-wrap canvas { width: 180px !important; max-height: 180px; }
    .status-legend { width: 100%; }

    /* Cross grid */
    .cross-grid { grid-template-columns: 1fr; }

    /* Tabela resp — scroll horizontal */
    .resp-table { font-size: 11px; }
    .resp-table th, .resp-table td { padding: 8px 6px; }

    /* Seção 2 título */
    h2.header-title { font-size: 22px !important; }
  }

  @media(max-width:400px) {
    .kpi-row { grid-template-columns: 1fr; }
  }
  .cross-table { width: 100%; border-collapse: collapse; }
  .cross-table th {
    font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase;
    color: var(--muted); font-weight: 500; padding: 0 8px 10px 0;
    text-align: left; border-bottom: 1px solid var(--border);
  }
  .cross-table th:not(:first-child) { text-align: center; }
  .cross-table td {
    padding: 10px 8px 10px 0; font-size: 12px; color: var(--text);
    border-bottom: 1px solid var(--border); vertical-align: middle;
  }
  .cross-table tr:last-child td { border-bottom: none; }
  .cross-table td:not(:first-child) { text-align: center; }
  .cross-table td.mes-label { font-weight: 500; color: #94a3b8; font-size: 12px; white-space: nowrap; }
  .cell-pill {
    display: inline-flex; align-items: center; justify-content: center;
    min-width: 32px; padding: 3px 8px; border-radius: 4px; font-size: 12px; font-weight: 500;
  }
  .pill-alta  { background: #d1fae5; color: #065f46; }
  .pill-media { background: #fef3c7; color: #92400e; }
  .pill-baixa { background: #fee2e2; color: #991b1b; }
  .pill-zero  { color: rgba(0,0,0,0.2); font-size: 11px; }
  .cross-insight { }
  .cross-insight-title {
    font-size: 10px; font-weight: 600; letter-spacing: 1.5px;
    text-transform: uppercase; color: var(--muted); margin-bottom: 14px;
  }
  .insight-item {
    display: flex; align-items: flex-start; gap: 12px;
    padding: 11px 0; border-bottom: 1px solid var(--border);
  }
  .insight-item:last-child { border-bottom: none; }
  .insight-icon { font-size: 15px; flex-shrink: 0; margin-top: 1px; }
  .insight-text { font-size: 12px; color: #374151; line-height: 1.55; }
  .insight-text strong { color: var(--text); font-weight: 600; }

  /* ── Footer ── */
  footer {
    margin-top: 48px;
    padding-top: 20px;
    border-top: 1px solid var(--border);
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
  }
  footer p { font-size: 11px; color: var(--muted); }

  /* Animate on load */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .kpi-card, .card { animation: fadeUp .5s ease both; }
  .kpi-card:nth-child(1){animation-delay:.05s}
  .kpi-card:nth-child(2){animation-delay:.1s}
  .kpi-card:nth-child(3){animation-delay:.15s}
  .kpi-card:nth-child(4){animation-delay:.2s}

  /* ── Abas ── */
  .tab-nav {
    display: flex;
    gap: 4px;
    background: #fff;
    border-bottom: 2px solid var(--border);
    padding: 0 32px;
    position: sticky;
    top: 0;
    z-index: 100;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  }
  .tab-btn {
    padding: 16px 24px;
    font-family: 'Nunito', sans-serif;
    font-size: 13px;
    font-weight: 700;
    color: var(--muted);
    border: none;
    background: none;
    cursor: pointer;
    border-bottom: 3px solid transparent;
    margin-bottom: -2px;
    transition: all .2s;
    display: flex;
    align-items: center;
    gap: 8px;
    white-space: nowrap;
  }
  .tab-btn:hover { color: var(--accent1); }
  .tab-btn.active { color: var(--accent1); border-bottom-color: var(--accent1); }
  .tab-panel { display: none; }
  .tab-panel.active { display: block; }
  /* Modal */
  .modal-overlay {
    display:none;position:fixed;inset:0;background:rgba(0,0,0,0.45);
    z-index:1000;align-items:center;justify-content:center;padding:16px;
  }
  .modal-overlay.open { display:flex; }
  .modal-box {
    background:#fff;border-radius:14px;width:100%;max-width:820px;
    max-height:88vh;display:flex;flex-direction:column;
    box-shadow:0 20px 60px rgba(0,0,0,0.2);overflow:hidden;
  }
  .modal-header {
    padding:18px 22px;border-bottom:1px solid var(--border);
    display:flex;align-items:center;justify-content:space-between;flex-shrink:0;
  }
  .modal-body { overflow-y:auto;padding:0; }
  .modal-close {
    background:none;border:none;font-size:20px;cursor:pointer;
    color:var(--muted);line-height:1;padding:4px 8px;border-radius:6px;
  }
  .modal-close:hover { background:var(--surface2);color:var(--text); }
  tr.clickable-row { cursor:pointer; }
  tr.clickable-row:hover td { background:#f0f7ff !important; }
  @media(max-width:640px){
    .tab-nav { padding: 0 16px; overflow-x: auto; }
    .tab-btn { padding: 14px 16px; font-size: 12px; }
  }
</style>
</head>
<body>
<nav class="tab-nav">
  <button class="tab-btn active" onclick="switchTab('pipeline', this)">📊 Pipeline de Projetos</button>
  <button class="tab-btn" onclick="switchTab('gestao', this)">📁 Gestão de Contratos</button>
  <button class="tab-btn" onclick="switchTab('wtp', this)">🎯 Where to Play</button>
  <button class="tab-btn" onclick="switchTab('changelog', this)" style="margin-left:auto;font-size:11px;opacity:0.75;">📋 Histórico de Alterações</button>
</nav>
<div class="content">
<div id="tab-pipeline" class="tab-panel active"><div style="padding:20px">Pipeline</div></div>
<div id="tab-wtp" class="tab-panel">
<div class="page">

  <header>
    <div class="header-left">
      <div class="header-eyebrow">Where to Play · Playing to Win</div>
      <h1 class="header-title">Análise de<br><span style="color:var(--accent4);">Segmentos</span></h1>
    </div>
    <div class="header-right">
      <div class="header-badge"><span class="dot" style="background:var(--accent4);"></span>64 proj · 134 contratos · 134 clientes na carteira</div>
    </div>
  </header>

<!-- Intro metodologia -->
  <div style="background:#fff;border:1px solid #e5e7eb;border-radius:16px;padding:28px;margin-bottom:32px;">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:32px;">
      <!-- Texto -->
      <div>
        <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#7c3aed;margin-bottom:10px;">A Metodologia</div>
        <div style="font-size:18px;font-weight:800;color:#111827;margin-bottom:12px;line-height:1.3;">Playing to Win · <span style="color:#7c3aed;">Where to Play?</span></div>
        <p style="font-size:13px;color:#374151;line-height:1.7;margin-bottom:12px;">Desenvolvida por Roger Martin e A.G. Lafley (ex-CEO da P&G), a metodologia <strong>Playing to Win</strong> define que estratégia é um conjunto de escolhas integradas que posicionam a empresa para vencer. A pergunta <em>"Where to Play?"</em> é a segunda das cinco escolhas estratégicas e define <strong>em quais arenas a empresa vai competir</strong> — e, tão importante, onde <em>não</em> vai.</p>
        <p style="font-size:13px;color:#374151;line-height:1.7;">Sem essa escolha deliberada, a empresa tenta atender a todos e não vence em lugar nenhum. A escolha de <em>onde jogar</em> define o campo; a escolha de <em>como vencer</em> define o jogo.</p>
      </div>
      <!-- Cascata estratégica -->
      <div>
        <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#9ca3af;margin-bottom:10px;">A Cascata Estratégica</div>
        <div style="display:flex;flex-direction:column;gap:8px;">
          <div style="display:flex;align-items:center;gap:10px;padding:8px 12px;background:#f8fafc;border-radius:8px;"><span style="font-size:16px;">🏆</span><div><span style="font-size:11px;font-weight:700;color:#9ca3af;">1.</span> <span style="font-size:12px;font-weight:600;color:#374151;">Winning Aspiration</span> <span style="font-size:11px;color:#9ca3af;">— Qual é nossa ambição?</span></div></div>
          <div style="display:flex;align-items:center;gap:10px;padding:8px 12px;background:#f5f3ff;border-radius:8px;border:1px solid #ede9fe;"><span style="font-size:16px;">🎯</span><div><span style="font-size:11px;font-weight:700;color:#7c3aed;">2.</span> <span style="font-size:12px;font-weight:700;color:#7c3aed;">Where to Play</span> <span style="font-size:11px;color:#7c3aed;">— Em quais segmentos competir?</span></div></div>
          <div style="display:flex;align-items:center;gap:10px;padding:8px 12px;background:#f8fafc;border-radius:8px;"><span style="font-size:16px;">⚔️</span><div><span style="font-size:11px;font-weight:700;color:#9ca3af;">3.</span> <span style="font-size:12px;font-weight:600;color:#374151;">How to Win</span> <span style="font-size:11px;color:#9ca3af;">— Como vencer nessas arenas?</span></div></div>
          <div style="display:flex;align-items:center;gap:10px;padding:8px 12px;background:#f8fafc;border-radius:8px;"><span style="font-size:16px;">💪</span><div><span style="font-size:11px;font-weight:700;color:#9ca3af;">4.</span> <span style="font-size:12px;font-weight:600;color:#374151;">Capabilities</span> <span style="font-size:11px;color:#9ca3af;">— Quais capacidades precisamos?</span></div></div>
          <div style="display:flex;align-items:center;gap:10px;padding:8px 12px;background:#f8fafc;border-radius:8px;"><span style="font-size:16px;">⚙️</span><div><span style="font-size:11px;font-weight:700;color:#9ca3af;">5.</span> <span style="font-size:12px;font-weight:600;color:#374151;">Management Systems</span> <span style="font-size:11px;color:#9ca3af;">— Quais sistemas de gestão?</span></div></div>
        </div>
      </div>
    </div>
  </div>

<!-- H1 H2 H3 Section -->
<div style="background:#fff;border:1px solid var(--border);border-radius:16px;padding:24px 28px;margin-bottom:28px;">
  <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:16px;margin-bottom:20px;">
  <div>
    <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:var(--muted);margin-bottom:6px;">Framework Estratégico</div>
    <div style="font-size:18px;font-weight:800;color:#111827;margin-bottom:6px;">Três Horizontes de Crescimento</div>
    <div style="font-size:13px;color:#6b7280;max-width:580px;">Baseado no modelo McKinsey Three Horizons, classifica cada segmento pelo estágio atual de maturidade da presença da Qualitor — orientando onde defender, onde investir e onde explorar.</div>  </div>
  <div style="display:flex;gap:8px;flex-wrap:wrap;">
    <span style="background:#f0fdf4;border:1px solid #bbf7d0;color:#059669;font-size:11px;font-weight:700;padding:5px 14px;border-radius:99px;">H1 · 6 segmentos</span>
    <span style="background:#fffbeb;border:1px solid #fde68a;color:#d97706;font-size:11px;font-weight:700;padding:5px 14px;border-radius:99px;">H2 · 3 segmentos</span>
    <span style="background:#f8fafc;border:1px solid #e5e7eb;color:#6b7280;font-size:11px;font-weight:700;padding:5px 14px;border-radius:99px;">H3 · 3 segmentos</span>
  </div>
  </div>
  <div style="background:#f8fafc;border:1px solid var(--border);border-radius:12px;padding:16px 18px;">
    <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:var(--muted);margin-bottom:12px;">📐 Como esta análise é feita — Score por segmento</div>
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;">
      <div style="background:#fff;border-radius:10px;padding:12px;border:1px solid #e5e7eb;">
        <div style="font-size:22px;font-weight:800;color:#2563eb;margin-bottom:4px;">30%</div>
        <div style="font-size:12px;font-weight:700;color:#111827;">Share de Pipeline</div>
        <div style="font-size:11px;color:#6b7280;margin-top:4px;">% dos projetos ativos da Qualitor que pertencem a este segmento</div>
      </div>
      <div style="background:#fff;border-radius:10px;padding:12px;border:1px solid #e5e7eb;">
        <div style="font-size:22px;font-weight:800;color:#059669;margin-bottom:4px;">40%</div>
        <div style="font-size:12px;font-weight:700;color:#111827;">Taxa de Conversão</div>
        <div style="font-size:11px;color:#6b7280;margin-top:4px;">% dos projetos ativos que se converteram em projetos fechados</div>
      </div>
      <div style="background:#fff;border-radius:10px;padding:12px;border:1px solid #e5e7eb;">
        <div style="font-size:22px;font-weight:800;color:#7c3aed;margin-bottom:4px;">20%</div>
        <div style="font-size:12px;font-weight:700;color:#111827;">Share de MRR</div>
        <div style="font-size:11px;color:#6b7280;margin-top:4px;">% do MRR total da carteira gerado por contratos deste segmento</div>
      </div>
      <div style="background:#fff;border-radius:10px;padding:12px;border:1px solid #e5e7eb;">
        <div style="font-size:22px;font-weight:800;color:#0891b2;margin-bottom:4px;">10%</div>
        <div style="font-size:12px;font-weight:700;color:#111827;">Share de Contratos</div>
        <div style="font-size:11px;color:#6b7280;margin-top:4px;">% dos contratos ativos da carteira que estão neste segmento</div>
      </div>
    </div>
    <div style="margin-top:12px;font-size:11px;color:#6b7280;display:flex;align-items:center;gap:8px;">
      <span style="background:#dcfce7;color:#166534;font-size:10px;font-weight:700;padding:2px 10px;border-radius:99px;">H1 Score ≥ 6 + MRR ≥ 8%</span>
      <span style="background:#fef3c7;color:#92400e;font-size:10px;font-weight:700;padding:2px 10px;border-radius:99px;">H2 Score ≥ 3 ou MRR ≥ 5% ou Pipeline ≥ 8%</span>
      <span style="background:#f1f5f9;color:#475569;font-size:10px;font-weight:700;padding:2px 10px;border-radius:99px;">H3 demais casos</span>
    </div>
  </div>
</div>

<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-bottom:32px;">
  <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:16px;overflow:hidden;"><div style="padding:20px 20px 16px;border-bottom:1px solid #bbf7d0;"><div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px;"><div><div style="display:inline-flex;align-items:center;gap:8px;background:#059669;color:#fff;font-size:12px;font-weight:800;padding:4px 14px;border-radius:99px;margin-bottom:8px;">H1 · 6 segmentos</div><div style="font-size:16px;font-weight:800;color:#111827;margin-bottom:4px;">Núcleo — Defender e Rentabilizar</div><div style="font-size:12px;color:#6b7280;">Segmentos com base sólida de receita recorrente e pipeline ativo consistente</div></div></div><div style="background:#05966915;border:1px solid #bbf7d0;border-radius:10px;padding:10px 14px;display:flex;align-items:flex-start;gap:8px;"><span style="font-size:16px;flex-shrink:0;">⚡</span><div><div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#059669;margin-bottom:3px;">Ação Recomendada</div><div style="font-size:12px;color:#374151;font-weight:500;">Proteger a base instalada, aumentar wallet share por cliente, acelerar renovações e expandir contratos existentes.</div></div></div></div><div style="padding:16px 20px;"><div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#9ca3af;margin-bottom:10px;">Segmentos neste horizonte</div><div style="display:flex;flex-direction:column;gap:8px;"><div style="background:#fff;border:1px solid #2563eb30;border-left:3px solid #2563eb;border-radius:10px;padding:12px 14px;"><div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;"><div style="display:flex;align-items:center;gap:6px;"><span style="font-size:15px;">💻</span><span style="font-size:12px;font-weight:700;color:#111827;">Tecnologia & TI</span></div><span style="font-size:10px;font-weight:700;color:#2563eb;background:#2563eb15;padding:2px 8px;border-radius:99px;">score 15.3</span></div><div style="display:flex;gap:6px;flex-wrap:wrap;"><span style="font-size:10px;color:#6b7280;background:#f8fafc;padding:2px 8px;border-radius:6px;">🔵 35 proj</span><span style="font-size:10px;color:#059669;background:#f0fdf4;padding:2px 8px;border-radius:6px;">📋 31 contr</span><span style="font-size:10px;color:#7c3aed;background:#f5f3ff;padding:2px 8px;border-radius:6px;">💰 R$ 77K/mês</span><span style="font-size:10px;color:#2563eb;background:#eff6ff;padding:2px 8px;border-radius:6px;">🎯 conv. 10.3%</span></div></div>
<div style="background:#fff;border:1px solid #7c3aed30;border-left:3px solid #7c3aed;border-radius:10px;padding:12px 14px;"><div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;"><div style="display:flex;align-items:center;gap:6px;"><span style="font-size:15px;">🏗️</span><span style="font-size:12px;font-weight:700;color:#111827;">Serviços & Infraestrutura</span></div><span style="font-size:10px;font-weight:700;color:#7c3aed;background:#7c3aed15;padding:2px 8px;border-radius:99px;">score 12.9</span></div><div style="display:flex;gap:6px;flex-wrap:wrap;"><span style="font-size:10px;color:#6b7280;background:#f8fafc;padding:2px 8px;border-radius:6px;">🔵 19 proj</span><span style="font-size:10px;color:#059669;background:#f0fdf4;padding:2px 8px;border-radius:6px;">📋 21 contr</span><span style="font-size:10px;color:#7c3aed;background:#f5f3ff;padding:2px 8px;border-radius:6px;">💰 R$ 71K/mês</span><span style="font-size:10px;color:#2563eb;background:#eff6ff;padding:2px 8px;border-radius:6px;">🎯 conv. 13.6%</span></div></div>
<div style="background:#fff;border:1px solid #4f46e530;border-left:3px solid #4f46e5;border-radius:10px;padding:12px 14px;"><div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;"><div style="display:flex;align-items:center;gap:6px;"><span style="font-size:15px;">💳</span><span style="font-size:12px;font-weight:700;color:#111827;">Financeiro & Seguros</span></div><span style="font-size:10px;font-weight:700;color:#4f46e5;background:#4f46e515;padding:2px 8px;border-radius:99px;">score 9.2</span></div><div style="display:flex;gap:6px;flex-wrap:wrap;"><span style="font-size:10px;color:#6b7280;background:#f8fafc;padding:2px 8px;border-radius:6px;">🔵 24 proj</span><span style="font-size:10px;color:#059669;background:#f0fdf4;padding:2px 8px;border-radius:6px;">📋 12 contr</span><span style="font-size:10px;color:#7c3aed;background:#f5f3ff;padding:2px 8px;border-radius:6px;">💰 R$ 69K/mês</span><span style="font-size:10px;color:#2563eb;background:#eff6ff;padding:2px 8px;border-radius:6px;">🎯 conv. 4.0%</span></div></div>
<div style="background:#fff;border:1px solid #05966930;border-left:3px solid #059669;border-radius:10px;padding:12px 14px;"><div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;"><div style="display:flex;align-items:center;gap:6px;"><span style="font-size:15px;">🏥</span><span style="font-size:12px;font-weight:700;color:#111827;">Saúde</span></div><span style="font-size:10px;font-weight:700;color:#059669;background:#05966915;padding:2px 8px;border-radius:99px;">score 9.1</span></div><div style="display:flex;gap:6px;flex-wrap:wrap;"><span style="font-size:10px;color:#6b7280;background:#f8fafc;padding:2px 8px;border-radius:6px;">🔵 21 proj</span><span style="font-size:10px;color:#059669;background:#f0fdf4;padding:2px 8px;border-radius:6px;">📋 14 contr</span><span style="font-size:10px;color:#7c3aed;background:#f5f3ff;padding:2px 8px;border-radius:6px;">💰 R$ 119K/mês</span><span style="font-size:10px;color:#2563eb;background:#eff6ff;padding:2px 8px;border-radius:6px;">🎯 conv. 0.0%</span></div></div>
<div style="background:#fff;border:1px solid #d9770630;border-left:3px solid #d97706;border-radius:10px;padding:12px 14px;"><div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;"><div style="display:flex;align-items:center;gap:6px;"><span style="font-size:15px;">🏭</span><span style="font-size:12px;font-weight:700;color:#111827;">Indústria</span></div><span style="font-size:10px;font-weight:700;color:#d97706;background:#d9770615;padding:2px 8px;border-radius:99px;">score 12.6</span></div><div style="display:flex;gap:6px;flex-wrap:wrap;"><span style="font-size:10px;color:#6b7280;background:#f8fafc;padding:2px 8px;border-radius:6px;">🔵 16 proj</span><span style="font-size:10px;color:#059669;background:#f0fdf4;padding:2px 8px;border-radius:6px;">📋 16 contr</span><span style="font-size:10px;color:#7c3aed;background:#f5f3ff;padding:2px 8px;border-radius:6px;">💰 R$ 62K/mês</span><span style="font-size:10px;color:#2563eb;background:#eff6ff;padding:2px 8px;border-radius:6px;">🎯 conv. 15.8%</span></div></div>
<div style="background:#fff;border:1px solid #ea580c30;border-left:3px solid #ea580c;border-radius:10px;padding:12px 14px;"><div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;"><div style="display:flex;align-items:center;gap:6px;"><span style="font-size:15px;">🍽️</span><span style="font-size:12px;font-weight:700;color:#111827;">Alimentos & Bebidas</span></div><span style="font-size:10px;font-weight:700;color:#ea580c;background:#ea580c15;padding:2px 8px;border-radius:99px;">score 9.5</span></div><div style="display:flex;gap:6px;flex-wrap:wrap;"><span style="font-size:10px;color:#6b7280;background:#f8fafc;padding:2px 8px;border-radius:6px;">🔵 7 proj</span><span style="font-size:10px;color:#059669;background:#f0fdf4;padding:2px 8px;border-radius:6px;">📋 9 contr</span><span style="font-size:10px;color:#7c3aed;background:#f5f3ff;padding:2px 8px;border-radius:6px;">💰 R$ 70K/mês</span><span style="font-size:10px;color:#2563eb;background:#eff6ff;padding:2px 8px;border-radius:6px;">🎯 conv. 12.5%</span></div></div></div></div><div style="padding:12px 20px 16px;border-top:1px solid #bbf7d0;"><button onclick="this.nextElementSibling.style.display=this.nextElementSibling.style.display==='none'?'block':'none';this.querySelector('.met-arrow').textContent=this.nextElementSibling.style.display==='none'?'▶ Ver':'▼ Ocultar';" style="background:none;border:none;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#059669;cursor:pointer;display:flex;align-items:center;gap:4px;"><span class="met-arrow">▶ Ver</span> metodologia desta classificação</button><div style="display:none;margin-top:10px;font-size:11px;color:#6b7280;line-height:1.7;background:#f8fafc;border-radius:8px;padding:12px 14px;"><strong>Critérios H1:</strong> Score composto ≥ 6,0 <em>e</em> participação no MRR da carteira ≥ 8%. O score é calculado por: <strong>30% share de pipeline</strong> + <strong>40% taxa de conversão</strong> + <strong>20% share de MRR</strong> + <strong>10% share de contratos ativos</strong>. Segmentos H1 têm tanto presença estabelecida na carteira quanto geração ativa de negócios no pipeline — indicando que a empresa já tem credibilidade e capacidade de entrega comprovada nesse mercado.</div></div></div>
  <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:16px;overflow:hidden;"><div style="padding:20px 20px 16px;border-bottom:1px solid #fde68a;"><div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px;"><div><div style="display:inline-flex;align-items:center;gap:8px;background:#d97706;color:#fff;font-size:12px;font-weight:800;padding:4px 14px;border-radius:99px;margin-bottom:8px;">H2 · 3 segmentos</div><div style="font-size:16px;font-weight:800;color:#111827;margin-bottom:4px;">Emergente — Investir e Desenvolver</div><div style="font-size:12px;color:#6b7280;">Segmentos com potencial real mas ainda desequilibrados entre pipeline e carteira</div></div></div><div style="background:#d9770615;border:1px solid #fde68a;border-radius:10px;padding:10px 14px;display:flex;align-items:flex-start;gap:8px;"><span style="font-size:16px;flex-shrink:0;">⚡</span><div><div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#d97706;margin-bottom:3px;">Ação Recomendada</div><div style="font-size:12px;color:#374151;font-weight:500;">Identificar os maiores clientes desses segmentos na carteira, criar propostas de expansão, e aumentar investimento em prospecção qualificada.</div></div></div></div><div style="padding:16px 20px;"><div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#9ca3af;margin-bottom:10px;">Segmentos neste horizonte</div><div style="display:flex;flex-direction:column;gap:8px;"><div style="background:#fff;border:1px solid #db277730;border-left:3px solid #db2777;border-radius:10px;padding:12px 14px;"><div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;"><div style="display:flex;align-items:center;gap:6px;"><span style="font-size:15px;">🛍️</span><span style="font-size:12px;font-weight:700;color:#111827;">Varejo & Moda</span></div><span style="font-size:10px;font-weight:700;color:#db2777;background:#db277715;padding:2px 8px;border-radius:99px;">score 7.0</span></div><div style="display:flex;gap:6px;flex-wrap:wrap;"><span style="font-size:10px;color:#6b7280;background:#f8fafc;padding:2px 8px;border-radius:6px;">🔵 12 proj</span><span style="font-size:10px;color:#059669;background:#f0fdf4;padding:2px 8px;border-radius:6px;">📋 11 contr</span><span style="font-size:10px;color:#7c3aed;background:#f5f3ff;padding:2px 8px;border-radius:6px;">💰 R$ 28K/mês</span><span style="font-size:10px;color:#2563eb;background:#eff6ff;padding:2px 8px;border-radius:6px;">🎯 conv. 7.7%</span></div></div>
<div style="background:#fff;border:1px solid #0891b230;border-left:3px solid #0891b2;border-radius:10px;padding:12px 14px;"><div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;"><div style="display:flex;align-items:center;gap:6px;"><span style="font-size:15px;">📡</span><span style="font-size:12px;font-weight:700;color:#111827;">Telecom & Mídia</span></div><span style="font-size:10px;font-weight:700;color:#0891b2;background:#0891b215;padding:2px 8px;border-radius:99px;">score 8.5</span></div><div style="display:flex;gap:6px;flex-wrap:wrap;"><span style="font-size:10px;color:#6b7280;background:#f8fafc;padding:2px 8px;border-radius:6px;">🔵 5 proj</span><span style="font-size:10px;color:#059669;background:#f0fdf4;padding:2px 8px;border-radius:6px;">📋 7 contr</span><span style="font-size:10px;color:#7c3aed;background:#f5f3ff;padding:2px 8px;border-radius:6px;">💰 R$ 11K/mês</span><span style="font-size:10px;color:#2563eb;background:#eff6ff;padding:2px 8px;border-radius:6px;">🎯 conv. 16.7%</span></div></div>
<div style="background:#fff;border:1px solid #0d948830;border-left:3px solid #0d9488;border-radius:10px;padding:12px 14px;"><div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;"><div style="display:flex;align-items:center;gap:6px;"><span style="font-size:15px;">🌱</span><span style="font-size:12px;font-weight:700;color:#111827;">Meio Ambiente</span></div><span style="font-size:10px;font-weight:700;color:#0d9488;background:#0d948815;padding:2px 8px;border-radius:99px;">score 15.5</span></div><div style="display:flex;gap:6px;flex-wrap:wrap;"><span style="font-size:10px;color:#6b7280;background:#f8fafc;padding:2px 8px;border-radius:6px;">🔵 8 proj</span><span style="font-size:10px;color:#059669;background:#f0fdf4;padding:2px 8px;border-radius:6px;">📋 4 contr</span><span style="font-size:10px;color:#7c3aed;background:#f5f3ff;padding:2px 8px;border-radius:6px;">💰 R$ 14K/mês</span><span style="font-size:10px;color:#2563eb;background:#eff6ff;padding:2px 8px;border-radius:6px;">🎯 conv. 33.3%</span></div></div></div></div><div style="padding:12px 20px 16px;border-top:1px solid #fde68a;"><button onclick="this.nextElementSibling.style.display=this.nextElementSibling.style.display==='none'?'block':'none';this.querySelector('.met-arrow').textContent=this.nextElementSibling.style.display==='none'?'▶ Ver':'▼ Ocultar';" style="background:none;border:none;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#d97706;cursor:pointer;display:flex;align-items:center;gap:4px;"><span class="met-arrow">▶ Ver</span> metodologia desta classificação</button><div style="display:none;margin-top:10px;font-size:11px;color:#6b7280;line-height:1.7;background:#f8fafc;border-radius:8px;padding:12px 14px;"><strong>Critérios H2:</strong> Score ≥ 3,0 <em>ou</em> share de MRR ≥ 5% <em>ou</em> share de pipeline ≥ 8%, mas sem atingir o limiar de H1. Esses segmentos mostram presença relevante em pelo menos uma dimensão — pipeline promissor sem carteira consolidada (ex: Telecom com 16,7% de conversão), ou carteira ativa com pipeline fraco (ex: Varejo com 11 contratos mas conversão de apenas 7,7%). Precisam de investimento direcionado para equilibrar as duas dimensões.</div></div></div>
  <div style="background:#f8fafc;border:1px solid #e5e7eb;border-radius:16px;overflow:hidden;"><div style="padding:20px 20px 16px;border-bottom:1px solid #e5e7eb;"><div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px;"><div><div style="display:inline-flex;align-items:center;gap:8px;background:#6b7280;color:#fff;font-size:12px;font-weight:800;padding:4px 14px;border-radius:99px;margin-bottom:8px;">H3 · 3 segmentos</div><div style="font-size:16px;font-weight:800;color:#111827;margin-bottom:4px;">Exploração — Testar com Cautela</div><div style="font-size:12px;color:#6b7280;">Segmentos com baixa presença hoje, mas que podem representar apostas futuras</div></div></div><div style="background:#6b728015;border:1px solid #e5e7eb;border-radius:10px;padding:10px 14px;display:flex;align-items:flex-start;gap:8px;"><span style="font-size:16px;flex-shrink:0;">⚡</span><div><div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#6b7280;margin-bottom:3px;">Ação Recomendada</div><div style="font-size:12px;color:#374151;font-weight:500;">Manter presença mínima, monitorar sinais de mercado, e só aumentar investimento se houver validação de demanda consistente.</div></div></div></div><div style="padding:16px 20px;"><div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#9ca3af;margin-bottom:10px;">Segmentos neste horizonte</div><div style="display:flex;flex-direction:column;gap:8px;"><div style="background:#fff;border:1px solid #65a30d30;border-left:3px solid #65a30d;border-radius:10px;padding:12px 14px;"><div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;"><div style="display:flex;align-items:center;gap:6px;"><span style="font-size:15px;">🌾</span><span style="font-size:12px;font-weight:700;color:#111827;">Agronegócio</span></div><span style="font-size:10px;font-weight:700;color:#65a30d;background:#65a30d15;padding:2px 8px;border-radius:99px;">score 2.8</span></div><div style="display:flex;gap:6px;flex-wrap:wrap;"><span style="font-size:10px;color:#6b7280;background:#f8fafc;padding:2px 8px;border-radius:6px;">🔵 11 proj</span><span style="font-size:10px;color:#059669;background:#f0fdf4;padding:2px 8px;border-radius:6px;">📋 6 contr</span><span style="font-size:10px;color:#7c3aed;background:#f5f3ff;padding:2px 8px;border-radius:6px;">💰 R$ 13K/mês</span><span style="font-size:10px;color:#2563eb;background:#eff6ff;padding:2px 8px;border-radius:6px;">🎯 conv. 0.0%</span></div></div>
<div style="background:#fff;border:1px solid #9333ea30;border-left:3px solid #9333ea;border-radius:10px;padding:12px 14px;"><div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;"><div style="display:flex;align-items:center;gap:6px;"><span style="font-size:15px;">🎓</span><span style="font-size:12px;font-weight:700;color:#111827;">Educação</span></div><span style="font-size:10px;font-weight:700;color:#9333ea;background:#9333ea15;padding:2px 8px;border-radius:99px;">score 1.8</span></div><div style="display:flex;gap:6px;flex-wrap:wrap;"><span style="font-size:10px;color:#6b7280;background:#f8fafc;padding:2px 8px;border-radius:6px;">🔵 8 proj</span><span style="font-size:10px;color:#059669;background:#f0fdf4;padding:2px 8px;border-radius:6px;">📋 3 contr</span><span style="font-size:10px;color:#7c3aed;background:#f5f3ff;padding:2px 8px;border-radius:6px;">💰 R$ 5K/mês</span><span style="font-size:10px;color:#2563eb;background:#eff6ff;padding:2px 8px;border-radius:6px;">🎯 conv. 0.0%</span></div></div>
<div style="background:#fff;border:1px solid #47556930;border-left:3px solid #475569;border-radius:10px;padding:12px 14px;"><div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;"><div style="display:flex;align-items:center;gap:6px;"><span style="font-size:15px;">🏛️</span><span style="font-size:12px;font-weight:700;color:#111827;">Governo & Público</span></div><span style="font-size:10px;font-weight:700;color:#475569;background:#47556915;padding:2px 8px;border-radius:99px;">score 1.3</span></div><div style="display:flex;gap:6px;flex-wrap:wrap;"><span style="font-size:10px;color:#6b7280;background:#f8fafc;padding:2px 8px;border-radius:6px;">🔵 5 proj</span><span style="font-size:10px;color:#059669;background:#f0fdf4;padding:2px 8px;border-radius:6px;">📋 3 contr</span><span style="font-size:10px;color:#7c3aed;background:#f5f3ff;padding:2px 8px;border-radius:6px;">💰 R$ 7K/mês</span><span style="font-size:10px;color:#2563eb;background:#eff6ff;padding:2px 8px;border-radius:6px;">🎯 conv. 0.0%</span></div></div></div></div><div style="padding:12px 20px 16px;border-top:1px solid #e5e7eb;"><button onclick="this.nextElementSibling.style.display=this.nextElementSibling.style.display==='none'?'block':'none';this.querySelector('.met-arrow').textContent=this.nextElementSibling.style.display==='none'?'▶ Ver':'▼ Ocultar';" style="background:none;border:none;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#6b7280;cursor:pointer;display:flex;align-items:center;gap:4px;"><span class="met-arrow">▶ Ver</span> metodologia desta classificação</button><div style="display:none;margin-top:10px;font-size:11px;color:#6b7280;line-height:1.7;background:#f8fafc;border-radius:8px;padding:12px 14px;"><strong>Critérios H3:</strong> Score &lt; 3,0, share de MRR &lt; 5% e share de pipeline &lt; 8%. Baixa representatividade nos dois lados (pipeline <em>e</em> carteira). Não significa que o segmento não tem valor estratégico — significa que a empresa ainda não tem escala suficiente para considerar como foco. A entrada deve ser deliberada e testada, com aprendizados antes de comprometer recursos significativos.</div></div></div>
</div>

<div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:var(--muted);margin:0 0 14px;">📌 Insights Estratégicos</div>
<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:32px;"><div style="background:var(--surface);border:1px solid var(--border);border-top:3px solid #059669;border-radius:12px;padding:20px 18px;"><div style="font-size:22px;margin-bottom:10px;">💰</div><div style="font-size:12px;font-weight:700;color:var(--text);margin-bottom:6px;">Maior MRR na carteira</div><div style="font-size:12px;color:var(--muted);line-height:1.6;"><strong style="color:#059669">Saúde</strong> lidera com <strong>R$ 119K</strong>/mês (14 contratos ativos).</div></div><div style="background:var(--surface);border:1px solid var(--border);border-top:3px solid #2563eb;border-radius:12px;padding:20px 18px;"><div style="font-size:22px;margin-bottom:10px;">🎯</div><div style="font-size:12px;font-weight:700;color:var(--text);margin-bottom:6px;">Melhor conversão no pipeline</div><div style="font-size:12px;color:var(--muted);line-height:1.6;"><strong style="color:#0d9488">Meio Ambiente</strong> converte <strong>33.3%</strong> dos projetos ativos.</div></div><div style="background:var(--surface);border:1px solid var(--border);border-top:3px solid #7c3aed;border-radius:12px;padding:20px 18px;"><div style="font-size:22px;margin-bottom:10px;">🔓</div><div style="font-size:12px;font-weight:700;color:var(--text);margin-bottom:6px;">Clientes exclusivos da carteira</div><div style="font-size:12px;color:var(--muted);line-height:1.6;"><strong style="color:#7c3aed;">Tecnologia & TI</strong> tem <strong>13</strong> clientes só na carteira sem projetos ativos — oportunidade imediata de expansão.</div></div><div style="background:var(--surface);border:1px solid var(--border);border-top:3px solid #dc2626;border-radius:12px;padding:20px 18px;"><div style="font-size:22px;margin-bottom:10px;">⚡</div><div style="font-size:12px;font-weight:700;color:var(--text);margin-bottom:6px;">Base instalada sem expansão</div><div style="font-size:12px;color:var(--muted);line-height:1.6;"><strong>Saúde</strong><strong>, </strong><strong>Agronegócio</strong><strong>, </strong><strong>Educação</strong> têm receita recorrente ativa mas <strong style="color:#dc2626;">0% de conversão</strong> no pipeline.</div></div></div>
<div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:var(--muted);margin:0 0 14px;">Ranking por Segmento · Pipeline × Carteira</div>
<div class="card">
  <div class="card-header"><div><div class="card-title">Onde estamos jogando hoje?</div><div class="card-subtitle">Clique em qualquer linha para ver projetos e contratos · Carteira = S3M4 excl. cancelados · Conv. = Fechados ÷ Ativos</div></div></div>
  <div style="overflow-x:auto;"><table style="width:100%;border-collapse:collapse;">
    <thead><tr style="background:var(--surface2);"><th style="padding:11px 16px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:var(--muted);border-bottom:1px solid var(--border);">Segmento</th><th style="padding:11px 16px;text-align:center;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:var(--muted);border-bottom:1px solid var(--border);">Pipeline</th><th style="padding:11px 16px;text-align:center;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#059669;border-bottom:1px solid var(--border);">Carteira</th><th style="padding:11px 16px;text-align:right;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#059669;border-bottom:1px solid var(--border);">MRR Carteira</th><th style="padding:11px 16px;text-align:center;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#2563eb;border-bottom:1px solid var(--border);">Conv.</th><th style="padding:11px 16px;text-align:center;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#7c3aed;border-bottom:1px solid var(--border);">Só Carteira</th><th style="padding:11px 16px;text-align:center;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:var(--muted);border-bottom:1px solid var(--border);">Recomendação</th></tr></thead>
    <tbody><tr class="clickable-row" onclick="wtpDrilldown('Tecnologia & TI')" style="background:var(--surface);border-bottom:1px solid var(--border);"><td style="padding:11px 16px;"><div style="display:flex;align-items:center;gap:10px;"><span style="font-size:18px;">💻</span><div><div style="font-size:13px;font-weight:600;color:var(--text);">Tecnologia & TI</div><div style="font-size:11px;color:var(--muted);">40 clientes</div></div></div></td><td style="padding:11px 16px;text-align:center;"><span style="background:#2563eb18;color:#2563eb;font-size:12px;font-weight:700;padding:3px 12px;border-radius:99px;">35</span></td><td style="padding:11px 16px;text-align:center;"><span style="background:#f0fdf4;color:#059669;font-size:12px;font-weight:700;padding:3px 12px;border-radius:99px;">31</span></td><td style="padding:11px 16px;text-align:right;font-size:13px;font-weight:600;color:#059669;">R$ 77K</td><td style="padding:11px 16px;text-align:center;font-size:13px;font-weight:700;color:#d97706;">10.3%</td><td style="padding:11px 16px;text-align:center;"><span style="background:#f5f3ff;color:#7c3aed;font-size:12px;font-weight:700;padding:3px 10px;border-radius:99px;">13</span></td><td style="padding:11px 16px;text-align:center;"><span style="background:#dcfce7;color:#166534;font-size:11px;font-weight:700;padding:3px 12px;border-radius:99px;">Jogar</span></td></tr>
<tr class="clickable-row" onclick="wtpDrilldown('Serviços & Infraestrutura')" style="background:var(--surface2);border-bottom:1px solid var(--border);"><td style="padding:11px 16px;"><div style="display:flex;align-items:center;gap:10px;"><span style="font-size:18px;">🏗️</span><div><div style="font-size:13px;font-weight:600;color:var(--text);">Serviços & Infraestrutura</div><div style="font-size:11px;color:var(--muted);">24 clientes</div></div></div></td><td style="padding:11px 16px;text-align:center;"><span style="background:#7c3aed18;color:#7c3aed;font-size:12px;font-weight:700;padding:3px 12px;border-radius:99px;">19</span></td><td style="padding:11px 16px;text-align:center;"><span style="background:#f0fdf4;color:#059669;font-size:12px;font-weight:700;padding:3px 12px;border-radius:99px;">21</span></td><td style="padding:11px 16px;text-align:right;font-size:13px;font-weight:600;color:#059669;">R$ 71K</td><td style="padding:11px 16px;text-align:center;font-size:13px;font-weight:700;color:#d97706;">13.6%</td><td style="padding:11px 16px;text-align:center;"><span style="background:#f5f3ff;color:#7c3aed;font-size:12px;font-weight:700;padding:3px 10px;border-radius:99px;">12</span></td><td style="padding:11px 16px;text-align:center;"><span style="background:#dcfce7;color:#166534;font-size:11px;font-weight:700;padding:3px 12px;border-radius:99px;">Jogar</span></td></tr>
<tr class="clickable-row" onclick="wtpDrilldown('Financeiro & Seguros')" style="background:var(--surface);border-bottom:1px solid var(--border);"><td style="padding:11px 16px;"><div style="display:flex;align-items:center;gap:10px;"><span style="font-size:18px;">💳</span><div><div style="font-size:13px;font-weight:600;color:var(--text);">Financeiro & Seguros</div><div style="font-size:11px;color:var(--muted);">11 clientes</div></div></div></td><td style="padding:11px 16px;text-align:center;"><span style="background:#4f46e518;color:#4f46e5;font-size:12px;font-weight:700;padding:3px 12px;border-radius:99px;">24</span></td><td style="padding:11px 16px;text-align:center;"><span style="background:#f0fdf4;color:#059669;font-size:12px;font-weight:700;padding:3px 12px;border-radius:99px;">12</span></td><td style="padding:11px 16px;text-align:right;font-size:13px;font-weight:600;color:#059669;">R$ 69K</td><td style="padding:11px 16px;text-align:center;font-size:13px;font-weight:700;color:#dc2626;">4.0%</td><td style="padding:11px 16px;text-align:center;"><span style="background:#f5f3ff;color:#7c3aed;font-size:12px;font-weight:700;padding:3px 10px;border-radius:99px;">4</span></td><td style="padding:11px 16px;text-align:center;"><span style="background:#fef3c7;color:#92400e;font-size:11px;font-weight:700;padding:3px 12px;border-radius:99px;">Explorar</span></td></tr>
<tr class="clickable-row" onclick="wtpDrilldown('Saúde')" style="background:var(--surface2);border-bottom:1px solid var(--border);"><td style="padding:11px 16px;"><div style="display:flex;align-items:center;gap:10px;"><span style="font-size:18px;">🏥</span><div><div style="font-size:13px;font-weight:600;color:var(--text);">Saúde</div><div style="font-size:11px;color:var(--muted);">19 clientes</div></div></div></td><td style="padding:11px 16px;text-align:center;"><span style="background:#05966918;color:#059669;font-size:12px;font-weight:700;padding:3px 12px;border-radius:99px;">21</span></td><td style="padding:11px 16px;text-align:center;"><span style="background:#f0fdf4;color:#059669;font-size:12px;font-weight:700;padding:3px 12px;border-radius:99px;">14</span></td><td style="padding:11px 16px;text-align:right;font-size:13px;font-weight:600;color:#059669;">R$ 119K</td><td style="padding:11px 16px;text-align:center;font-size:13px;font-weight:700;color:#dc2626;">0.0%</td><td style="padding:11px 16px;text-align:center;"><span style="background:#f5f3ff;color:#7c3aed;font-size:12px;font-weight:700;padding:3px 10px;border-radius:99px;">7</span></td><td style="padding:11px 16px;text-align:center;"><span style="background:#fef3c7;color:#92400e;font-size:11px;font-weight:700;padding:3px 12px;border-radius:99px;">Explorar</span></td></tr>
<tr class="clickable-row" onclick="wtpDrilldown('Indústria')" style="background:var(--surface);border-bottom:1px solid var(--border);"><td style="padding:11px 16px;"><div style="display:flex;align-items:center;gap:10px;"><span style="font-size:18px;">🏭</span><div><div style="font-size:13px;font-weight:600;color:var(--text);">Indústria</div><div style="font-size:11px;color:var(--muted);">20 clientes</div></div></div></td><td style="padding:11px 16px;text-align:center;"><span style="background:#d9770618;color:#d97706;font-size:12px;font-weight:700;padding:3px 12px;border-radius:99px;">16</span></td><td style="padding:11px 16px;text-align:center;"><span style="background:#f0fdf4;color:#059669;font-size:12px;font-weight:700;padding:3px 12px;border-radius:99px;">16</span></td><td style="padding:11px 16px;text-align:right;font-size:13px;font-weight:600;color:#059669;">R$ 62K</td><td style="padding:11px 16px;text-align:center;font-size:13px;font-weight:700;color:#059669;">15.8%</td><td style="padding:11px 16px;text-align:center;"><span style="background:#f5f3ff;color:#7c3aed;font-size:12px;font-weight:700;padding:3px 10px;border-radius:99px;">11</span></td><td style="padding:11px 16px;text-align:center;"><span style="background:#dcfce7;color:#166534;font-size:11px;font-weight:700;padding:3px 12px;border-radius:99px;">Jogar</span></td></tr>
<tr class="clickable-row" onclick="wtpDrilldown('Varejo & Moda')" style="background:var(--surface2);border-bottom:1px solid var(--border);"><td style="padding:11px 16px;"><div style="display:flex;align-items:center;gap:10px;"><span style="font-size:18px;">🛍️</span><div><div style="font-size:13px;font-weight:600;color:var(--text);">Varejo & Moda</div><div style="font-size:11px;color:var(--muted);">12 clientes</div></div></div></td><td style="padding:11px 16px;text-align:center;"><span style="background:#db277718;color:#db2777;font-size:12px;font-weight:700;padding:3px 12px;border-radius:99px;">12</span></td><td style="padding:11px 16px;text-align:center;"><span style="background:#f0fdf4;color:#059669;font-size:12px;font-weight:700;padding:3px 12px;border-radius:99px;">11</span></td><td style="padding:11px 16px;text-align:right;font-size:13px;font-weight:600;color:#059669;">R$ 28K</td><td style="padding:11px 16px;text-align:center;font-size:13px;font-weight:700;color:#d97706;">7.7%</td><td style="padding:11px 16px;text-align:center;"><span style="background:#f5f3ff;color:#7c3aed;font-size:12px;font-weight:700;padding:3px 10px;border-radius:99px;">7</span></td><td style="padding:11px 16px;text-align:center;"><span style="background:#fef3c7;color:#92400e;font-size:11px;font-weight:700;padding:3px 12px;border-radius:99px;">Explorar</span></td></tr>
<tr class="clickable-row" onclick="wtpDrilldown('Agronegócio')" style="background:var(--surface);border-bottom:1px solid var(--border);"><td style="padding:11px 16px;"><div style="display:flex;align-items:center;gap:10px;"><span style="font-size:18px;">🌾</span><div><div style="font-size:13px;font-weight:600;color:var(--text);">Agronegócio</div><div style="font-size:11px;color:var(--muted);">8 clientes</div></div></div></td><td style="padding:11px 16px;text-align:center;"><span style="background:#65a30d18;color:#65a30d;font-size:12px;font-weight:700;padding:3px 12px;border-radius:99px;">11</span></td><td style="padding:11px 16px;text-align:center;"><span style="background:#f0fdf4;color:#059669;font-size:12px;font-weight:700;padding:3px 12px;border-radius:99px;">6</span></td><td style="padding:11px 16px;text-align:right;font-size:13px;font-weight:600;color:#059669;">R$ 13K</td><td style="padding:11px 16px;text-align:center;font-size:13px;font-weight:700;color:#dc2626;">0.0%</td><td style="padding:11px 16px;text-align:center;"><span style="background:#f5f3ff;color:#7c3aed;font-size:12px;font-weight:700;padding:3px 10px;border-radius:99px;">2</span></td><td style="padding:11px 16px;text-align:center;"><span style="background:#fee2e2;color:#991b1b;font-size:11px;font-weight:700;padding:3px 12px;border-radius:99px;">Avaliar</span></td></tr>
<tr class="clickable-row" onclick="wtpDrilldown('Alimentos & Bebidas')" style="background:var(--surface2);border-bottom:1px solid var(--border);"><td style="padding:11px 16px;"><div style="display:flex;align-items:center;gap:10px;"><span style="font-size:18px;">🍽️</span><div><div style="font-size:13px;font-weight:600;color:var(--text);">Alimentos & Bebidas</div><div style="font-size:11px;color:var(--muted);">11 clientes</div></div></div></td><td style="padding:11px 16px;text-align:center;"><span style="background:#ea580c18;color:#ea580c;font-size:12px;font-weight:700;padding:3px 12px;border-radius:99px;">7</span></td><td style="padding:11px 16px;text-align:center;"><span style="background:#f0fdf4;color:#059669;font-size:12px;font-weight:700;padding:3px 12px;border-radius:99px;">9</span></td><td style="padding:11px 16px;text-align:right;font-size:13px;font-weight:600;color:#059669;">R$ 70K</td><td style="padding:11px 16px;text-align:center;font-size:13px;font-weight:700;color:#d97706;">12.5%</td><td style="padding:11px 16px;text-align:center;"><span style="background:#f5f3ff;color:#7c3aed;font-size:12px;font-weight:700;padding:3px 10px;border-radius:99px;">5</span></td><td style="padding:11px 16px;text-align:center;"><span style="background:#fef3c7;color:#92400e;font-size:11px;font-weight:700;padding:3px 12px;border-radius:99px;">Explorar</span></td></tr>
<tr class="clickable-row" onclick="wtpDrilldown('Telecom & Mídia')" style="background:var(--surface);border-bottom:1px solid var(--border);"><td style="padding:11px 16px;"><div style="display:flex;align-items:center;gap:10px;"><span style="font-size:18px;">📡</span><div><div style="font-size:13px;font-weight:600;color:var(--text);">Telecom & Mídia</div><div style="font-size:11px;color:var(--muted);">8 clientes</div></div></div></td><td style="padding:11px 16px;text-align:center;"><span style="background:#0891b218;color:#0891b2;font-size:12px;font-weight:700;padding:3px 12px;border-radius:99px;">5</span></td><td style="padding:11px 16px;text-align:center;"><span style="background:#f0fdf4;color:#059669;font-size:12px;font-weight:700;padding:3px 12px;border-radius:99px;">7</span></td><td style="padding:11px 16px;text-align:right;font-size:13px;font-weight:600;color:#059669;">R$ 11K</td><td style="padding:11px 16px;text-align:center;font-size:13px;font-weight:700;color:#059669;">16.7%</td><td style="padding:11px 16px;text-align:center;"><span style="background:#f5f3ff;color:#7c3aed;font-size:12px;font-weight:700;padding:3px 10px;border-radius:99px;">4</span></td><td style="padding:11px 16px;text-align:center;"><span style="background:#dcfce7;color:#166534;font-size:11px;font-weight:700;padding:3px 12px;border-radius:99px;">Jogar</span></td></tr>
<tr class="clickable-row" onclick="wtpDrilldown('Meio Ambiente')" style="background:var(--surface2);border-bottom:1px solid var(--border);"><td style="padding:11px 16px;"><div style="display:flex;align-items:center;gap:10px;"><span style="font-size:18px;">🌱</span><div><div style="font-size:13px;font-weight:600;color:var(--text);">Meio Ambiente</div><div style="font-size:11px;color:var(--muted);">7 clientes</div></div></div></td><td style="padding:11px 16px;text-align:center;"><span style="background:#0d948818;color:#0d9488;font-size:12px;font-weight:700;padding:3px 12px;border-radius:99px;">8</span></td><td style="padding:11px 16px;text-align:center;"><span style="background:#f0fdf4;color:#059669;font-size:12px;font-weight:700;padding:3px 12px;border-radius:99px;">4</span></td><td style="padding:11px 16px;text-align:right;font-size:13px;font-weight:600;color:#059669;">R$ 14K</td><td style="padding:11px 16px;text-align:center;font-size:13px;font-weight:700;color:#059669;">33.3%</td><td style="padding:11px 16px;text-align:center;"><span style="background:#f5f3ff;color:#7c3aed;font-size:12px;font-weight:700;padding:3px 10px;border-radius:99px;">2</span></td><td style="padding:11px 16px;text-align:center;"><span style="background:#dcfce7;color:#166534;font-size:11px;font-weight:700;padding:3px 12px;border-radius:99px;">Jogar</span></td></tr>
<tr class="clickable-row" onclick="wtpDrilldown('Educação')" style="background:var(--surface);border-bottom:1px solid var(--border);"><td style="padding:11px 16px;"><div style="display:flex;align-items:center;gap:10px;"><span style="font-size:18px;">🎓</span><div><div style="font-size:13px;font-weight:600;color:var(--text);">Educação</div><div style="font-size:11px;color:var(--muted);">7 clientes</div></div></div></td><td style="padding:11px 16px;text-align:center;"><span style="background:#9333ea18;color:#9333ea;font-size:12px;font-weight:700;padding:3px 12px;border-radius:99px;">8</span></td><td style="padding:11px 16px;text-align:center;"><span style="background:#f0fdf4;color:#059669;font-size:12px;font-weight:700;padding:3px 12px;border-radius:99px;">3</span></td><td style="padding:11px 16px;text-align:right;font-size:13px;font-weight:600;color:#059669;">R$ 5K</td><td style="padding:11px 16px;text-align:center;font-size:13px;font-weight:700;color:#dc2626;">0.0%</td><td style="padding:11px 16px;text-align:center;"><span style="background:#f5f3ff;color:#7c3aed;font-size:12px;font-weight:700;padding:3px 10px;border-radius:99px;">1</span></td><td style="padding:11px 16px;text-align:center;"><span style="background:#fee2e2;color:#991b1b;font-size:11px;font-weight:700;padding:3px 12px;border-radius:99px;">Avaliar</span></td></tr>
<tr class="clickable-row" onclick="wtpDrilldown('Governo & Público')" style="background:var(--surface2);border-bottom:1px solid var(--border);"><td style="padding:11px 16px;"><div style="display:flex;align-items:center;gap:10px;"><span style="font-size:18px;">🏛️</span><div><div style="font-size:13px;font-weight:600;color:var(--text);">Governo & Público</div><div style="font-size:11px;color:var(--muted);">3 clientes</div></div></div></td><td style="padding:11px 16px;text-align:center;"><span style="background:#47556918;color:#475569;font-size:12px;font-weight:700;padding:3px 12px;border-radius:99px;">5</span></td><td style="padding:11px 16px;text-align:center;"><span style="background:#f0fdf4;color:#059669;font-size:12px;font-weight:700;padding:3px 12px;border-radius:99px;">3</span></td><td style="padding:11px 16px;text-align:right;font-size:13px;font-weight:600;color:#059669;">R$ 7K</td><td style="padding:11px 16px;text-align:center;font-size:13px;font-weight:700;color:#dc2626;">0.0%</td><td style="padding:11px 16px;text-align:center;"><span style="background:#f5f3ff;color:#7c3aed;font-size:12px;font-weight:700;padding:3px 10px;border-radius:99px;">0</span></td><td style="padding:11px 16px;text-align:center;"><span style="background:#fee2e2;color:#991b1b;font-size:11px;font-weight:700;padding:3px 12px;border-radius:99px;">Avaliar</span></td></tr></tbody>
  </table></div>
  <div style="padding:10px 16px;background:var(--surface2);border-top:1px solid var(--border);display:flex;gap:16px;font-size:11px;color:var(--muted);flex-wrap:wrap;align-items:center;"><span><span style="background:#dcfce7;color:#166534;font-size:10px;font-weight:700;padding:2px 8px;border-radius:99px;">Jogar</span> Score ≥ 8</span><span><span style="background:#fef3c7;color:#92400e;font-size:10px;font-weight:700;padding:2px 8px;border-radius:99px;">Explorar</span> Score 4–8</span><span><span style="background:#fee2e2;color:#991b1b;font-size:10px;font-weight:700;padding:2px 8px;border-radius:99px;">Avaliar</span> Score &lt; 4</span></div>
</div>
<div id="wtp-drilldown" style="display:none;margin-bottom:24px;" class="card"><div class="card-header"><div><div id="wtp-dd-title" class="card-title"></div><div id="wtp-dd-sub" class="card-subtitle"></div></div><button onclick="wtpClose()" style="background:none;border:1px solid var(--border);border-radius:8px;padding:6px 14px;font-size:12px;font-weight:600;color:var(--muted);cursor:pointer;">✕ Fechar</button></div><div style="display:flex;border-bottom:1px solid var(--border);margin:-4px 0 0;"><button id="wtp-tab-proj" onclick="wtpTab('proj')" style="padding:10px 20px;font-size:12px;font-weight:700;background:none;border:none;border-bottom:2px solid var(--accent1);color:var(--text);cursor:pointer;">📊 Pipeline</button><button id="wtp-tab-contr" onclick="wtpTab('contr')" style="padding:10px 20px;font-size:12px;font-weight:700;background:none;border:none;border-bottom:2px solid transparent;color:var(--muted);cursor:pointer;">📋 Carteira</button></div><div style="overflow-x:auto;"><table style="width:100%;border-collapse:collapse;"><thead id="wtp-dd-thead"></thead><tbody id="wtp-dd-tbody"></tbody></table></div></div>
<script>
(function(){
var D={"Tecnologia & TI": {"pipe_ativos": 18, "pipe_vt": 447889.77, "pipe_enviados": 18, "pipe_negoc": 0, "pipe_fechados": 4, "pipe_vt_fech": 68821.6, "conv_pct": 18.2, "contr_ativos": 31, "contr_cancel": 0, "contr_mrr": 76889.25, "contr_arr": 144806.17, "contr_vt": 972088.01, "n_cli_pipe": 26, "n_cli_contr": 31, "n_cli_ambos": 19, "n_cli_so_contr": 12, "n_cli_so_pipe": 7, "projetos": [{"np": "NP-116385", "cliente": "CONNECTION SEGURANÇA E GESTÃO DE TI", "etapa": "Projeto Enviado", "vt": 1200.0, "dias": null, "tipo": "ativo"}, {"np": "NP-116081", "cliente": "NETCENTER INFORMATICA", "etapa": "Projeto Faturado", "vt": 3800.0, "dias": null, "tipo": "fechado"}, {"np": "NP-115870", "cliente": "WAY DATA SOLUTION S/A", "etapa": "Projeto Enviado", "vt": 17700.0, "dias": null, "tipo": "ativo"}, {"np": "NP-115812", "cliente": "BRASTORAGE - THINK", "etapa": "Projeto Faturado", "vt": 1140.0, "dias": null, "tipo": "fechado"}, {"np": "NP-115715", "cliente": "CORPFLEX INFORMATICA LTDA", "etapa": "Projeto Faturado", "vt": 992.0, "dias": null, "tipo": "fechado"}, {"np": "NP-115404", "cliente": "Solo Network", "etapa": "Projeto Enviado", "vt": 0.0, "dias": null, "tipo": "ativo"}, {"np": "NP-115314", "cliente": "GGT SOLUÇÃO TECNOLOGICAS LTDA (ANGOLAPRE", "etapa": "Projeto Enviado", "vt": 17670.0, "dias": null, "tipo": "ativo"}, {"np": "NP-115265", "cliente": "Solucap Sistemas", "etapa": "Projeto Enviado", "vt": 58200.0, "dias": null, "tipo": "ativo"}, {"np": "NP-115157", "cliente": "STEFANINI", "etapa": "Projeto Faturado", "vt": 62889.6, "dias": null, "tipo": "fechado"}, {"np": "NP-114418", "cliente": "RAPIDONET SISTEMAS", "etapa": "Projeto Enviado", "vt": 36000.0, "dias": null, "tipo": "ativo"}, {"np": "NP-114405", "cliente": "S3CURITY", "etapa": "Projeto Enviado", "vt": 7600.0, "dias": null, "tipo": "ativo"}, {"np": "NP-114383", "cliente": "BRASTORAGE - THINK", "etapa": "Projeto Enviado", "vt": 21600.0, "dias": null, "tipo": "ativo"}, {"np": "NP-114249", "cliente": "CONNECTION SEGURANÇA E GESTÃO DE TI", "etapa": "Projeto Enviado", "vt": 760.0, "dias": null, "tipo": "ativo"}, {"np": "NP-113970", "cliente": "Data Engenharia", "etapa": "Projeto Enviado", "vt": 172116.0, "dias": null, "tipo": "ativo"}, {"np": "NP-113740", "cliente": "GOVERNANÇA BRASIL", "etapa": "Projeto Enviado", "vt": 3800.0, "dias": null, "tipo": "ativo"}, {"np": "NP-113639", "cliente": "INTERSISTEMAS INFORMATICA LTDA - NETLOGI", "etapa": "Projeto Enviado", "vt": 3007.0, "dias": null, "tipo": "ativo"}, {"np": "NP-113582", "cliente": "SAFEWEB", "etapa": "Projeto Enviado", "vt": 30636.0, "dias": null, "tipo": "ativo"}, {"np": "NP-113199", "cliente": "S3CURITY", "etapa": "Projeto Enviado", "vt": 5700.0, "dias": null, "tipo": "ativo"}, {"np": "NP-113096", "cliente": "BRASTORAGE - THINK", "etapa": "Projeto Enviado", "vt": 10640.0, "dias": null, "tipo": "ativo"}, {"np": "NP-112404", "cliente": "NETCENTER INFORMATICA", "etapa": "Projeto Enviado", "vt": 32780.0, "dias": null, "tipo": "ativo"}, {"np": "NP-112211", "cliente": "GOLDEN TECHNOLOGIA", "etapa": "Projeto Enviado", "vt": 12436.77, "dias": null, "tipo": "ativo"}, {"np": "NP-112132", "cliente": "DATACOM", "etapa": "Projeto Enviado", "vt": 16044.0, "dias": null, "tipo": "ativo"}], "contratos": [{"np": "115078", "cliente": "CONNECTION SEGURANÇA E GESTÃO DE TI", "etapa": "Análise de Requisição", "venc": "ago/26", "mrr": 949.43, "arr": 6242.03}, {"np": "115077", "cliente": "NETCENTER INFORMATICA", "etapa": "Em análise pelo cliente", "venc": "jan/26", "mrr": 0.0, "arr": 2254.0}, {"np": "115073", "cliente": "WAY DATA SOLUTION S/A", "etapa": "Renovado", "venc": "jan/26", "mrr": 0.0, "arr": 2930.46}, {"np": "115070", "cliente": "VANTIX TECNOLOGIA COMÉRCIO E SERVIÇOS DE", "etapa": "Análise de Requisição", "venc": "jul/26", "mrr": 0.0, "arr": 10194.0}, {"np": "115058", "cliente": "TEEVO COM E SERVS DE INFORMÁTICA (MI)", "etapa": "Análise de Requisição", "venc": "dez/26", "mrr": 82.0, "arr": 0.0}, {"np": "115057", "cliente": "TECCLOUD SERVICOS DE TECNOLOGIA AHU LTDA", "etapa": "Em análise pelo cliente", "venc": "jan/26", "mrr": 0.0, "arr": 13500.0}, {"np": "115055", "cliente": "STEFANINI", "etapa": "Análise de Requisição", "venc": "ago/26", "mrr": 5918.55, "arr": 0.0}, {"np": "115052", "cliente": "SOLVER", "etapa": "Análise de Requisição", "venc": "dez/26", "mrr": 3125.72, "arr": 0.0}, {"np": "115051", "cliente": "SERVIX", "etapa": "Análise de Requisição", "venc": "abr/26", "mrr": 856.45, "arr": 0.0}, {"np": "115038", "cliente": "SAFEWEB", "etapa": "Análise de Requisição", "venc": "mai/26", "mrr": 10688.0, "arr": 0.0}, {"np": "115036", "cliente": "S3CURITY", "etapa": "Análise de Requisição", "venc": "mai/26", "mrr": 0.0, "arr": 7183.0}, {"np": "115032", "cliente": "RCXIT NETWORK IT EXPERTS", "etapa": "Análise de Requisição", "venc": "ago/26", "mrr": 0.0, "arr": 11010.0}, {"np": "115030", "cliente": "RAPIDONET SISTEMAS", "etapa": "Análise de Requisição", "venc": "set/26", "mrr": 1012.92, "arr": 9464.89}, {"np": "115028", "cliente": "QINTESS", "etapa": "Análise de Requisição", "venc": "out/26", "mrr": 1250.0, "arr": 0.0}, {"np": "115025", "cliente": "PERTO S/A PERIFÉRICOS P/ AUTOMAÇÃO - GRA", "etapa": "Análise de Requisição", "venc": "set/26", "mrr": 0.0, "arr": 0.0}, {"np": "115019", "cliente": "MULTISUPORTE TECNOLOGIA", "etapa": "Análise de Requisição", "venc": "dez/26", "mrr": 0.0, "arr": 1620.93}, {"np": "115010", "cliente": "LG SISTEMAS", "etapa": "Análise de Requisição", "venc": "out/26", "mrr": 21863.99, "arr": 0.0}, {"np": "115005", "cliente": "JME INFORMÁTICA", "etapa": "Análise de Requisição", "venc": "jul/26", "mrr": 2234.19, "arr": 0.0}, {"np": "115002", "cliente": "INTERSISTEMAS INFORMATICA LTDA - NETLOGI", "etapa": "Renovado", "venc": "fev/26", "mrr": 618.05, "arr": 0.0}, {"np": "114999", "cliente": "INOVATECH SOLUÇÕES EM INFORMÁTICA LTDA -", "etapa": "Análise de Requisição", "venc": "mai/26", "mrr": 0.0, "arr": 4046.44}, {"np": "114998", "cliente": "INCORP TECHNOLOGY INFORMATICA LTDA - EPP", "etapa": "Processo Financeiro", "venc": "fev/26", "mrr": 0.0, "arr": 6388.02}, {"np": "114994", "cliente": "HT SOLUTIONS", "etapa": "Análise de Requisição", "venc": "jun/26", "mrr": 185.0, "arr": 0.0}, {"np": "114985", "cliente": "GOVERNANÇA BRASIL", "etapa": "Análise de Requisição", "venc": "out/26", "mrr": 10087.0, "arr": 0.0}, {"np": "114983", "cliente": "GOLDEN TECHNOLOGIA", "etapa": "Análise de Requisição", "venc": "mai/26", "mrr": 1810.17, "arr": 0.0}, {"np": "114982", "cliente": "GGT SOLUÇÃO TECNOLOGICAS LTDA (ANGOLAPRE", "etapa": "Em análise pelo cliente", "venc": "mar/26", "mrr": 0.0, "arr": 54090.0}, {"np": "114977", "cliente": "FLOWTI", "etapa": "Análise de Requisição", "venc": "jun/26", "mrr": 4216.81, "arr": 0.0}, {"np": "114972", "cliente": "EQUALITI E SOLUCOES EM TI LTDA", "etapa": "Análise de Requisição", "venc": "abr/26", "mrr": 0.0, "arr": 2832.72}, {"np": "114970", "cliente": "DATACOM", "etapa": "Análise de Requisição", "venc": "dez/26", "mrr": 0.0, "arr": 6820.06}, {"np": "114958", "cliente": "Celk Sistemas", "etapa": "Análise de Requisição", "venc": "out/26", "mrr": 10135.49, "arr": 0.0}, {"np": "114954", "cliente": "BRASTORAGE - THINK", "etapa": "Análise de Requisição", "venc": "out/26", "mrr": 1855.48, "arr": 0.0}, {"np": "114945", "cliente": "ATP", "etapa": "Análise de Requisição", "venc": "set/26", "mrr": 0.0, "arr": 6229.62}], "ativos": 35, "vt_pipeline": 509434.88, "vt_fechados": 68821.6, "enviados": 19}, "Serviços & Infraestrutura": {"pipe_ativos": 8, "pipe_vt": 382514.0, "pipe_enviados": 8, "pipe_negoc": 0, "pipe_fechados": 3, "pipe_vt_fech": 130601.0, "conv_pct": 27.3, "contr_ativos": 21, "contr_cancel": 0, "contr_mrr": 70962.89, "contr_arr": 86277.05, "contr_vt": 937831.73, "n_cli_pipe": 13, "n_cli_contr": 21, "n_cli_ambos": 10, "n_cli_so_contr": 11, "n_cli_so_pipe": 3, "projetos": [{"np": "NP-115351", "cliente": "AUXILIADORA PREDIAL", "etapa": "Projeto Enviado", "vt": 266832.0, "dias": null, "tipo": "ativo"}, {"np": "NP-115335", "cliente": "CPA", "etapa": "Projeto Enviado", "vt": 0.0, "dias": null, "tipo": "ativo"}, {"np": "NP-115262", "cliente": "INTERCITY", "etapa": "Projeto Faturado", "vt": 76721.0, "dias": null, "tipo": "fechado"}, {"np": "NP-114700", "cliente": "Planem Engenharia", "etapa": "Projeto Enviado", "vt": 16100.0, "dias": null, "tipo": "ativo"}, {"np": "NP-114660", "cliente": "M.L.GOMES", "etapa": "Projeto Faturado", "vt": 6080.0, "dias": null, "tipo": "fechado"}, {"np": "NP-113863", "cliente": "ROYAL PALM HOTELS & RESORTS (GRUPO ARCEL", "etapa": "Projeto Enviado", "vt": 12872.0, "dias": null, "tipo": "ativo"}, {"np": "NP-113660", "cliente": "AUXILIADORA PREDIAL", "etapa": "Projeto Enviado", "vt": 950.0, "dias": null, "tipo": "ativo"}, {"np": "NP-113545", "cliente": "AUTOGLASS", "etapa": "Projeto Enviado", "vt": 70160.0, "dias": null, "tipo": "ativo"}, {"np": "NP-113067", "cliente": "EBM Incorporações S/A", "etapa": "Projeto Faturado", "vt": 47800.0, "dias": null, "tipo": "fechado"}, {"np": "NP-111979", "cliente": "CONSTRUTORA NORBERTO ODEBRECHT S.A.", "etapa": "Projeto Enviado", "vt": 6720.0, "dias": null, "tipo": "ativo"}, {"np": "NP-111866", "cliente": "VIAÇÃO OURO E PRATA S.A", "etapa": "Projeto Enviado", "vt": 8880.0, "dias": null, "tipo": "ativo"}], "contratos": [{"np": "115072", "cliente": "VIAÇÃO OURO E PRATA S.A", "etapa": "Análise de Requisição", "venc": "jun/26", "mrr": 932.17, "arr": 0.0}, {"np": "115071", "cliente": "VERZANI & SANDRINI LTDA", "etapa": "Em análise pelo cliente", "venc": "jan/26", "mrr": 0.0, "arr": 0.0}, {"np": "115062", "cliente": "TRISUL", "etapa": "Análise de Requisição", "venc": "ago/26", "mrr": 450.0, "arr": 7250.0}, {"np": "115054", "cliente": "SOTRAN LOGÍSTICA E TRANSPORTE", "etapa": "Análise de Requisição", "venc": "ago/26", "mrr": 4325.58, "arr": 36745.45}, {"np": "115044", "cliente": "SCGAS - COMPANHIA DE GAS DE SANTA CATARI", "etapa": "Análise de Requisição", "venc": "mar/26", "mrr": 0.0, "arr": 6986.0}, {"np": "115035", "cliente": "ROYAL PALM HOTELS & RESORTS (GRUPO ARCEL", "etapa": "Análise de Requisição", "venc": "out/26", "mrr": 2943.8, "arr": 0.0}, {"np": "115027", "cliente": "PLANSERVI ENGENHARIA", "etapa": "Renovado", "venc": "fev/26", "mrr": 0.0, "arr": 4909.09}, {"np": "115016", "cliente": "M.L.GOMES", "etapa": "Análise de Requisição", "venc": "ago/26", "mrr": 2056.69, "arr": 0.0}, {"np": "115015", "cliente": "LUXCEL MAXLOG", "etapa": "Análise de Requisição", "venc": "set/26", "mrr": 941.26, "arr": 0.0}, {"np": "115001", "cliente": "INTERCITY", "etapa": "Renovado", "venc": "jan/26", "mrr": 3424.0, "arr": 0.0}, {"np": "114978", "cliente": "FORSALES MECANET", "etapa": "Análise de Requisição", "venc": "jul/26", "mrr": 1399.82, "arr": 0.0}, {"np": "114974", "cliente": "EZEX", "etapa": "Análise de Requisição", "venc": "dez/26", "mrr": 0.0, "arr": 3333.54}, {"np": "114969", "cliente": "CPA", "etapa": "Análise de Requisição", "venc": "nov/26", "mrr": 0.0, "arr": 10657.47}, {"np": "114966", "cliente": "CONSTRUTORA NORBERTO ODEBRECHT S.A.", "etapa": "Análise de Requisição", "venc": "ago/26", "mrr": 4207.0, "arr": 0.0}, {"np": "114965", "cliente": "CONSTRUTORA MARQUISE", "etapa": "Análise de Requisição", "venc": "mai/26", "mrr": 0.0, "arr": 14510.0}, {"np": "114964", "cliente": "CONSTRUCAP CCPS", "etapa": "Análise de Requisição", "venc": "set/26", "mrr": 913.85, "arr": 0.0}, {"np": "114949", "cliente": "AUXILIADORA PREDIAL", "etapa": "Renovado", "venc": "mar/26", "mrr": 34357.34, "arr": 0.0}, {"np": "114947", "cliente": "AUTOGLASS", "etapa": "Análise de Requisição", "venc": "nov/26", "mrr": 6348.61, "arr": 0.0}, {"np": "114946", "cliente": "ATRIO HOTÉIS", "etapa": "Análise de Requisição", "venc": "jul/26", "mrr": 441.58, "arr": 1885.5}, {"np": "114941", "cliente": "ANDRADE GUTIERREZ", "etapa": "Análise de Requisição", "venc": "ago/26", "mrr": 6072.19, "arr": 0.0}, {"np": "114939", "cliente": "ADESTE PARTICIPACOES E EMPREENDIMENTOS L", "etapa": "Análise de Requisição", "venc": "ago/26", "mrr": 2149.0, "arr": 0.0}], "ativos": 19, "vt_pipeline": 403654.0, "vt_fechados": 130601.0, "enviados": 8}, "Financeiro & Seguros": {"pipe_ativos": 6, "pipe_vt": 79580.0, "pipe_enviados": 6, "pipe_negoc": 2, "pipe_fechados": 1, "pipe_vt_fech": 9600.0, "conv_pct": 14.3, "contr_ativos": 11, "contr_cancel": 0, "contr_mrr": 49211.1, "contr_arr": 35845.75, "contr_vt": 626386.35, "n_cli_pipe": 7, "n_cli_contr": 10, "n_cli_ambos": 6, "n_cli_so_contr": 4, "n_cli_so_pipe": 1, "projetos": [{"np": "NP-116364", "cliente": "BULLLA SA", "etapa": "Projeto Enviado", "vt": 7600.0, "dias": null, "tipo": "ativo"}, {"np": "NP-116363", "cliente": "BULLLA SA", "etapa": "Projeto Enviado", "vt": 9120.0, "dias": null, "tipo": "ativo"}, {"np": "NP-115830", "cliente": "BULLLA SA", "etapa": "Projeto Enviado", "vt": 9500.0, "dias": null, "tipo": "ativo"}, {"np": "NP-114416", "cliente": "Argenta Participacoes LTDA", "etapa": "Projeto Enviado", "vt": 1360.0, "dias": null, "tipo": "ativo"}, {"np": "NP-113663", "cliente": "BULLLA SA", "etapa": "Projeto Enviado", "vt": 38400.0, "dias": null, "tipo": "ativo"}, {"np": "NP-112107", "cliente": "SABEMI SEGURADORA", "etapa": "Projeto Faturado", "vt": 9600.0, "dias": null, "tipo": "fechado"}, {"np": "NP-111880", "cliente": "Argenta Participacoes LTDA", "etapa": "Projeto Enviado", "vt": 13600.0, "dias": null, "tipo": "ativo"}], "contratos": [{"np": "NP-116108", "cliente": "Argenta Participacoes LTDA", "etapa": "Análise de Requisição", "venc": "dez/26", "mrr": 19752.92, "arr": 0.0}, {"np": "NP-115702", "cliente": "Argenta Participacoes LTDA", "etapa": "Análise de Requisição", "venc": "mai/26", "mrr": 3988.05, "arr": 0.0}, {"np": "115079", "cliente": "BULLLA SA", "etapa": "Análise de Requisição", "venc": "nov/26", "mrr": 2970.6, "arr": 0.0}, {"np": "115048", "cliente": "SEPROL", "etapa": "Renovado", "venc": "jan/26", "mrr": 746.27, "arr": 0.0}, {"np": "115043", "cliente": "SAQUE PAGUE", "etapa": "Renovado", "venc": "fev/26", "mrr": 5081.9, "arr": 0.0}, {"np": "115037", "cliente": "SABEMI SEGURADORA", "etapa": "Renovado", "venc": "fev/26", "mrr": 1923.8, "arr": 0.0}, {"np": "115026", "cliente": "Pestana Leilões", "etapa": "Análise de Requisição", "venc": "mai/26", "mrr": 0.0, "arr": 7387.08}, {"np": "114950", "cliente": "BEG", "etapa": "Análise de Requisição", "venc": "out/26", "mrr": 0.0, "arr": 3309.0}, {"np": "114948", "cliente": "AUTTAR - GETNET", "etapa": "Análise de Requisição", "venc": "jun/26", "mrr": 0.0, "arr": 20834.0}, {"np": "114940", "cliente": "AGIPLAN SERVIÇOS FINANCEIROS (AGIBANK)", "etapa": "Análise de Requisição", "venc": "jul/26", "mrr": 14747.56, "arr": 0.0}, {"np": "114796", "cliente": "ABBC - Associação Brasileira de Bancos", "etapa": "Análise de Requisição", "venc": "out/26", "mrr": 0.0, "arr": 4315.67}], "ativos": 24, "vt_pipeline": 189595.0, "vt_fechados": 9600.0, "enviados": 5}, "Saúde": {"pipe_ativos": 7, "pipe_vt": 88140.0, "pipe_enviados": 7, "pipe_negoc": 0, "pipe_fechados": 0, "pipe_vt_fech": 0.0, "conv_pct": 0.0, "contr_ativos": 14, "contr_cancel": 1, "contr_mrr": 118721.32, "contr_arr": 168058.29, "contr_vt": 1557440.37, "n_cli_pipe": 11, "n_cli_contr": 14, "n_cli_ambos": 8, "n_cli_so_contr": 6, "n_cli_so_pipe": 3, "projetos": [{"np": "NP-115925", "cliente": "KleyHertz Farmacêutica", "etapa": "Projeto Enviado", "vt": 35520.0, "dias": null, "tipo": "ativo"}, {"np": "NP-114550", "cliente": "SANTA CASA DE MISERICÓRDIA DE PORTO ALEG", "etapa": "Projeto Enviado", "vt": 15200.0, "dias": null, "tipo": "ativo"}, {"np": "NP-114513", "cliente": "SANTA CASA DE MISERICÓRDIA DE PORTO ALEG", "etapa": "Projeto Enviado", "vt": 5700.0, "dias": null, "tipo": "ativo"}, {"np": "NP-114397", "cliente": "UNIMED PORTO ALEGRE", "etapa": "Projeto Enviado", "vt": 6840.0, "dias": null, "tipo": "ativo"}, {"np": "NP-114210", "cliente": "KleyHertz Farmacêutica", "etapa": "Projeto Enviado", "vt": 3600.0, "dias": null, "tipo": "ativo"}, {"np": "NP-114061", "cliente": "SANTA CASA DE MISERICÓRDIA DE PORTO ALEG", "etapa": "Projeto Enviado", "vt": 1520.0, "dias": null, "tipo": "ativo"}, {"np": "NP-113847", "cliente": "FUNDAÇÃO SÃO FRANCISCO XAVIER - FSFX", "etapa": "Projeto Enviado", "vt": 19760.0, "dias": null, "tipo": "ativo"}], "contratos": [{"np": "115066", "cliente": "UNIMED VALES DO TAQUARI E RIO PARDO LTDA", "etapa": "Renovado", "venc": "fev/26", "mrr": 0.0, "arr": 38120.85}, {"np": "115065", "cliente": "UNIMED PORTO ALEGRE", "etapa": "Renovado", "venc": "mar/26", "mrr": 11068.22, "arr": 0.0}, {"np": "115040", "cliente": "SANTA CASA DE MISERICÓRDIA DE PORTO ALEG", "etapa": "Renovado", "venc": "mar/26", "mrr": 0.0, "arr": 3646.9}, {"np": "115039", "cliente": "SANTA CASA DE MISERICORDIA DA BAHIA", "etapa": "Em análise pelo cliente", "venc": "abr/26", "mrr": 1183.08, "arr": 0.0}, {"np": "115011", "cliente": "LIFE EMPRESARIAL SAÚDE LTDA", "etapa": "Análise de Requisição", "venc": "nov/26", "mrr": 14838.17, "arr": 0.0}, {"np": "115008", "cliente": "KleyHertz Farmacêutica", "etapa": "Análise de Requisição", "venc": "ago/26", "mrr": 0.0, "arr": 12823.0}, {"np": "114993", "cliente": "HOSPITAL MAE DE DEUS (AESC)", "etapa": "Análise de Requisição", "venc": "jul/26", "mrr": 7880.0, "arr": 0.0}, {"np": "114992", "cliente": "HOSPITAL DE CLINICAS (HCPA)", "etapa": "Análise de Requisição", "venc": "set/26", "mrr": 2529.0, "arr": 0.0}, {"np": "114991", "cliente": "HOSPITAL CARE", "etapa": "Análise de Requisição", "venc": "jun/26", "mrr": 24903.05, "arr": 0.0}, {"np": "114981", "cliente": "FUNDAÇÃO SÃO FRANCISCO XAVIER - FSFX", "etapa": "Análise de Requisição", "venc": "set/26", "mrr": 9723.8, "arr": 30466.42}, {"np": "114959", "cliente": "CENTRO HOSPITALAR DE SETÚBAL, EPE (TCSI)", "etapa": "Análise de Requisição", "venc": "nov/26", "mrr": 0.0, "arr": 83001.12}, {"np": "114951", "cliente": "BIONOVIS S.A. - COMPANHIA BRASILEIRA DE ", "etapa": "Análise de Requisição", "venc": "dez/26", "mrr": 0.0, "arr": 0.0}, {"np": "114944", "cliente": "ASSOCIACAO HOSPITALAR MOINHOS DE VENTO", "etapa": "Em análise pelo cliente", "venc": "mar/26", "mrr": 3757.0, "arr": 0.0}, {"np": "114797", "cliente": "ACHE LABORATÓRIOS FARMACÊUTICOS SA", "etapa": "Análise de Requisição", "venc": "out/26", "mrr": 42839.0, "arr": 0.0}], "ativos": 21, "vt_pipeline": 212603.0, "vt_fechados": 0.0, "enviados": 7}, "Indústria": {"pipe_ativos": 7, "pipe_vt": 350336.0, "pipe_enviados": 7, "pipe_negoc": 0, "pipe_fechados": 3, "pipe_vt_fech": 3600.0, "conv_pct": 30.0, "contr_ativos": 15, "contr_cancel": 0, "contr_mrr": 59027.52, "contr_arr": 37477.67, "contr_vt": 745807.91, "n_cli_pipe": 11, "n_cli_contr": 15, "n_cli_ambos": 8, "n_cli_so_contr": 7, "n_cli_so_pipe": 3, "projetos": [{"np": "NP-116022", "cliente": "IRANI PAPEL E EMBALAGEM S.A", "etapa": "Projeto Enviado", "vt": 16720.0, "dias": null, "tipo": "ativo"}, {"np": "NP-115653", "cliente": "FRIGELAR", "etapa": "Projeto Faturado", "vt": 0.0, "dias": null, "tipo": "fechado"}, {"np": "NP-115316", "cliente": "FRIGELAR", "etapa": "Projeto Faturado", "vt": 3600.0, "dias": null, "tipo": "fechado"}, {"np": "NP-114776", "cliente": "IMPORTADORA BAGE S/A", "etapa": "Projeto Enviado", "vt": 1140.0, "dias": null, "tipo": "ativo"}, {"np": "NP-114662", "cliente": "IRANI PAPEL E EMBALAGEM S.A", "etapa": "Projeto Faturado", "vt": 0.0, "dias": null, "tipo": "fechado"}, {"np": "NP-114308", "cliente": "SPRINGER CARRIER (MIDEA)", "etapa": "Projeto Enviado", "vt": 10776.0, "dias": null, "tipo": "ativo"}, {"np": "NP-114241", "cliente": "PANATLANTICA", "etapa": "Projeto Enviado", "vt": 11400.0, "dias": null, "tipo": "ativo"}, {"np": "NP-113859", "cliente": "FRIGELAR", "etapa": "Projeto Enviado", "vt": 24000.0, "dias": null, "tipo": "ativo"}, {"np": "NP-113270", "cliente": "IMPORTADORA BAGE S/A", "etapa": "Projeto Enviado", "vt": 6300.0, "dias": null, "tipo": "ativo"}, {"np": "NP-112013", "cliente": "FRIGELAR", "etapa": "Projeto Enviado", "vt": 280000.0, "dias": null, "tipo": "ativo"}], "contratos": [{"np": "NP-116088", "cliente": "BOMBRIL S.A", "etapa": "Análise de Requisição", "venc": "out/26", "mrr": 10397.0, "arr": 0.0}, {"np": "115049", "cliente": "SERILON BRASIL", "etapa": "Análise de Requisição", "venc": "out/26", "mrr": 0.0, "arr": 3744.37}, {"np": "115033", "cliente": "RESERVA BRASILEIRA INDUSTRIA E COMERCIO ", "etapa": "Em análise pelo cliente", "venc": "abr/26", "mrr": 3050.76, "arr": 0.0}, {"np": "115024", "cliente": "PANATLANTICA", "etapa": "Análise de Requisição", "venc": "mai/26", "mrr": 277.36, "arr": 0.0}, {"np": "NP-115022", "cliente": "OCYAN", "etapa": "Renovado", "venc": "jan/26", "mrr": 0.0, "arr": 9176.64}, {"np": "115018", "cliente": "MARELLI", "etapa": "Análise de Requisição", "venc": "ago/26", "mrr": 0.0, "arr": 3763.92}, {"np": "115017", "cliente": "MARCOPOLO", "etapa": "Análise de Requisição", "venc": "out/26", "mrr": 0.0, "arr": 2914.25}, {"np": "115006", "cliente": "KEPLER WEBER", "etapa": "Análise de Requisição", "venc": "set/26", "mrr": 0.0, "arr": 10679.5}, {"np": "115003", "cliente": "IRANI PAPEL E EMBALAGEM S.A", "etapa": "Análise de Requisição", "venc": "ago/26", "mrr": 14743.0, "arr": 0.0}, {"np": "114997", "cliente": "INBETTA", "etapa": "Análise de Requisição", "venc": "ago/26", "mrr": 4407.74, "arr": 0.0}, {"np": "114996", "cliente": "IMPORTADORA BAGE S/A", "etapa": "Análise de Requisição", "venc": "ago/26", "mrr": 3124.0, "arr": 0.0}, {"np": "114979", "cliente": "FRIGELAR", "etapa": "Análise de Requisição", "venc": "ago/26", "mrr": 13387.17, "arr": 0.0}, {"np": "114976", "cliente": "FERBASA", "etapa": "Análise de Requisição", "venc": "out/26", "mrr": 4011.49, "arr": 7198.99}, {"np": "114975", "cliente": "FCC - FORNECEDORA COMPONENTES QUÍMICOS E", "etapa": "Análise de Requisição", "venc": "ago/26", "mrr": 2929.0, "arr": 0.0}, {"np": "114953", "cliente": "BRASKEM", "etapa": "Análise de Requisição", "venc": "abr/26", "mrr": 2700.0, "arr": 0.0}], "ativos": 16, "vt_pipeline": 356336.0, "vt_fechados": 3600.0, "enviados": 7}, "Varejo & Moda": {"pipe_ativos": 4, "pipe_vt": 42108.0, "pipe_enviados": 4, "pipe_negoc": 0, "pipe_fechados": 0, "pipe_vt_fech": 0.0, "conv_pct": 0.0, "contr_ativos": 11, "contr_cancel": 0, "contr_mrr": 28112.36, "contr_arr": 89101.97, "contr_vt": 426450.29, "n_cli_pipe": 8, "n_cli_contr": 11, "n_cli_ambos": 7, "n_cli_so_contr": 4, "n_cli_so_pipe": 1, "projetos": [{"np": "NP-115495", "cliente": "SEPHORA DO BRASIL PARTICIPAÇÕES S.A.", "etapa": "Projeto Enviado", "vt": 1200.0, "dias": null, "tipo": "ativo"}, {"np": "NP-115323", "cliente": "SEPHORA DO BRASIL PARTICIPAÇÕES S.A.", "etapa": "Projeto Enviado", "vt": 20900.0, "dias": null, "tipo": "ativo"}, {"np": "NP-113798", "cliente": "SAO JOAO FARMACIAS", "etapa": "Projeto Enviado", "vt": 15048.0, "dias": null, "tipo": "ativo"}, {"np": "NP-113762", "cliente": "TORRA TORRA", "etapa": "Projeto Enviado", "vt": 4960.0, "dias": null, "tipo": "ativo"}], "contratos": [{"np": "115061", "cliente": "TORRA TORRA", "etapa": "Análise de Requisição", "venc": "ago/26", "mrr": 4424.57, "arr": 0.0}, {"np": "115047", "cliente": "SEPHORA DO BRASIL PARTICIPAÇÕES S.A.", "etapa": "Análise de Requisição", "venc": "dez/26", "mrr": 0.0, "arr": 19264.2}, {"np": "115041", "cliente": "SAO JOAO FARMACIAS", "etapa": "Análise de Requisição", "venc": "ago/26", "mrr": 2905.27, "arr": 0.0}, {"np": "115014", "cliente": "LOJAS LEBES", "etapa": "Análise de Requisição", "venc": "out/26", "mrr": 5420.61, "arr": 0.0}, {"np": "115013", "cliente": "LOJAS RENNER", "etapa": "Análise de Requisição", "venc": "dez/26", "mrr": 521.2, "arr": 0.0}, {"np": "115012", "cliente": "LOJAS COLOMBO S/A", "etapa": "Análise de Requisição", "venc": "mai/26", "mrr": 863.0, "arr": 0.0}, {"np": "114995", "cliente": "IGUATEMI EMPRESA DE SHOPPING CENTERS S/A", "etapa": "Análise de Requisição", "venc": "jul/26", "mrr": 7141.4, "arr": 0.0}, {"np": "114989", "cliente": "GRUPO THATHI - PANAMBY", "etapa": "Análise de Requisição", "venc": "abr/26", "mrr": 3160.16, "arr": 0.0}, {"np": "114987", "cliente": "GRUPO MARINGÁ", "etapa": "Análise de Requisição", "venc": "dez/26", "mrr": 1466.15, "arr": 7198.99}, {"np": "114956", "cliente": "CALÇADOS BEIRA RIO", "etapa": "Renovado", "venc": "jan/26", "mrr": 0.0, "arr": 9062.78}, {"np": "114942", "cliente": "AREZZO INDUSTRIA E COMERCIO LTDA", "etapa": "Análise de Requisição", "venc": "ago/26", "mrr": 2210.0, "arr": 53576.0}], "ativos": 12, "vt_pipeline": 42868.0, "vt_fechados": 1140.0, "enviados": 4}, "Agronegócio": {"pipe_ativos": 4, "pipe_vt": 392868.0, "pipe_enviados": 4, "pipe_negoc": 0, "pipe_fechados": 0, "pipe_vt_fech": 0.0, "conv_pct": 0.0, "contr_ativos": 6, "contr_cancel": 0, "contr_mrr": 8328.63, "contr_arr": 68581.0, "contr_vt": 168524.56, "n_cli_pipe": 6, "n_cli_contr": 6, "n_cli_ambos": 4, "n_cli_so_contr": 2, "n_cli_so_pipe": 2, "projetos": [{"np": "NP-115875", "cliente": "CASTROLANDA", "etapa": "Projeto Enviado", "vt": 23472.0, "dias": null, "tipo": "ativo"}, {"np": "NP-113753", "cliente": "COOPERATIVA AGRO-INDUSTRIAL HOLAMBRA", "etapa": "Projeto Enviado", "vt": 343404.0, "dias": null, "tipo": "ativo"}, {"np": "NP-113547", "cliente": "TIMAC AGRO", "etapa": "Projeto Enviado", "vt": 24192.0, "dias": null, "tipo": "ativo"}, {"np": "NP-113058", "cliente": "CASTROLANDA", "etapa": "Projeto Enviado", "vt": 1800.0, "dias": null, "tipo": "ativo"}], "contratos": [{"np": "115074", "cliente": "ZILOR ENERGIA E ALIMENTOS", "etapa": "Análise de Requisição", "venc": "ago/26", "mrr": 3204.47, "arr": 0.0}, {"np": "115069", "cliente": "USINA SAO JOSE DA ESTIVA", "etapa": "Análise de Requisição", "venc": "ago/26", "mrr": 1967.37, "arr": 0.0}, {"np": "115068", "cliente": "USINA SANTA ISABEL", "etapa": "Renovado", "venc": "fev/26", "mrr": 1435.0, "arr": 0.0}, {"np": "115060", "cliente": "TIMAC AGRO", "etapa": "Análise de Requisição", "venc": "dez/26", "mrr": 0.0, "arr": 11826.0}, {"np": "114968", "cliente": "COTRIBÁ", "etapa": "Renovado", "venc": "mar/26", "mrr": 623.79, "arr": 0.0}, {"np": "114957", "cliente": "CASTROLANDA", "etapa": "Análise de Requisição", "venc": "set/26", "mrr": 1098.0, "arr": 56755.0}], "ativos": 11, "vt_pipeline": 392868.0, "vt_fechados": 0.0, "enviados": 4}, "Alimentos & Bebidas": {"pipe_ativos": 2, "pipe_vt": 133487.0, "pipe_enviados": 2, "pipe_negoc": 0, "pipe_fechados": 1, "pipe_vt_fech": 760.0, "conv_pct": 33.3, "contr_ativos": 9, "contr_cancel": 0, "contr_mrr": 69931.62, "contr_arr": 34501.98, "contr_vt": 873674.1, "n_cli_pipe": 8, "n_cli_contr": 9, "n_cli_ambos": 6, "n_cli_so_contr": 3, "n_cli_so_pipe": 2, "projetos": [{"np": "NP-114520", "cliente": "Nutrire Indústria de Alimentos", "etapa": "Projeto Enviado", "vt": 23087.0, "dias": null, "tipo": "ativo"}, {"np": "NP-114454", "cliente": "KICALDO", "etapa": "Projeto Faturado", "vt": 760.0, "dias": null, "tipo": "fechado"}, {"np": "NP-113068", "cliente": "CERVEJARIA PETRÓPOLIS", "etapa": "Projeto Enviado", "vt": 110400.0, "dias": null, "tipo": "ativo"}], "contratos": [{"np": "NP-116091", "cliente": "CERVEJARIA PETRÓPOLIS", "etapa": "Análise de Requisição", "venc": "dez/26", "mrr": 21968.61, "arr": 0.0}, {"np": "115076", "cliente": "FORNO DE MINAS", "etapa": "Processo Financeiro", "venc": "jan/26", "mrr": 0.0, "arr": 777.0}, {"np": "115064", "cliente": "UNIDASUL DISTRIBUIDORA ALIMENTÍCIA S.A.", "etapa": "Análise de Requisição", "venc": "set/26", "mrr": 24390.47, "arr": 0.0}, {"np": "115059", "cliente": "TENDA ATACADO", "etapa": "Análise de Requisição", "venc": "out/26", "mrr": 0.0, "arr": 19865.53}, {"np": "115042", "cliente": "Sapore", "etapa": "Análise de Requisição", "venc": "mar/26", "mrr": 14196.9, "arr": 0.0}, {"np": "115021", "cliente": "NISSIN FOODS DO BRASIL LTDA", "etapa": "Análise de Requisição", "venc": "dez/26", "mrr": 3670.0, "arr": 0.0}, {"np": "115007", "cliente": "KICALDO", "etapa": "Análise de Requisição", "venc": "fev/26", "mrr": 0.0, "arr": 2052.45}, {"np": "114984", "cliente": "Gourmet Sports Hospitality Serviços de A", "etapa": "Análise de Requisição", "venc": "out/26", "mrr": 5705.64, "arr": 0.0}, {"np": "114980", "cliente": "FRUKI", "etapa": "Análise de Requisição", "venc": "ago/26", "mrr": 0.0, "arr": 11807.0}], "ativos": 7, "vt_pipeline": 144491.0, "vt_fechados": 760.0, "enviados": 2}, "Telecom & Mídia": {"pipe_ativos": 2, "pipe_vt": 23392.0, "pipe_enviados": 2, "pipe_negoc": 0, "pipe_fechados": 1, "pipe_vt_fech": 43056.0, "conv_pct": 33.3, "contr_ativos": 6, "contr_cancel": 0, "contr_mrr": 9158.62, "contr_arr": 80504.28, "contr_vt": 189025.38, "n_cli_pipe": 5, "n_cli_contr": 6, "n_cli_ambos": 3, "n_cli_so_contr": 3, "n_cli_so_pipe": 2, "projetos": [{"np": "NP-115120", "cliente": "RBS - Televisão Gaúcha SA", "etapa": "Projeto Enviado", "vt": 7600.0, "dias": null, "tipo": "ativo"}, {"np": "NP-115119", "cliente": "RBS - Televisão Gaúcha SA", "etapa": "Projeto Enviado", "vt": 15792.0, "dias": null, "tipo": "ativo"}, {"np": "NP-114632", "cliente": "Novvacore Jr & Js - Telecom LTDA", "etapa": "Projeto Faturado", "vt": 43056.0, "dias": null, "tipo": "fechado"}], "contratos": [{"np": "NP-116092", "cliente": "CORTEL", "etapa": "Análise de Requisição", "venc": "nov/26", "mrr": 1377.72, "arr": 0.0}, {"np": "115031", "cliente": "RBS - Televisão Gaúcha SA", "etapa": "Análise de Requisição", "venc": "set/26", "mrr": 0.0, "arr": 59339.73}, {"np": "115020", "cliente": "Nauterra", "etapa": "Análise de Requisição", "venc": "dez/26", "mrr": 0.0, "arr": 13048.0}, {"np": "115009", "cliente": "LETTEL", "etapa": "Análise de Requisição", "venc": "set/26", "mrr": 0.0, "arr": 8116.55}, {"np": "114986", "cliente": "GRPCOM GRUPO PARANAENSE DE COMUNICAÇÃO", "etapa": "Análise de Requisição", "venc": "jul/26", "mrr": 6869.0, "arr": 0.0}, {"np": "114971", "cliente": "ENERGY TELECOM", "etapa": "Análise de Requisição", "venc": "nov/26", "mrr": 911.9, "arr": 0.0}], "ativos": 5, "vt_pipeline": 23392.0, "vt_fechados": 43056.0, "enviados": 2}, "Meio Ambiente": {"pipe_ativos": 1, "pipe_vt": 67387.0, "pipe_enviados": 1, "pipe_negoc": 0, "pipe_fechados": 4, "pipe_vt_fech": 86432.0, "conv_pct": 80.0, "contr_ativos": 4, "contr_cancel": 0, "contr_mrr": 14469.32, "contr_arr": 51254.37, "contr_vt": 224886.21, "n_cli_pipe": 6, "n_cli_contr": 4, "n_cli_ambos": 3, "n_cli_so_contr": 1, "n_cli_so_pipe": 3, "projetos": [{"np": "NP-116294", "cliente": "Cetrel - Central de Tratamento de Efluen", "etapa": "Projeto Faturado", "vt": 2400.0, "dias": null, "tipo": "fechado"}, {"np": "NP-116129", "cliente": "Cetrel - Central de Tratamento de Efluen", "etapa": "Projeto Faturado", "vt": 3600.0, "dias": null, "tipo": "fechado"}, {"np": "NP-115586", "cliente": "Cetrel - Central de Tratamento de Efluen", "etapa": "Projeto Faturado", "vt": 1520.0, "dias": null, "tipo": "fechado"}, {"np": "NP-115250", "cliente": "RRP ENERGIA", "etapa": "Projeto Enviado", "vt": 67387.0, "dias": null, "tipo": "ativo"}, {"np": "NP-114581", "cliente": "SOLVI PARTICIPAÇÕES", "etapa": "Projeto Faturado", "vt": 78912.0, "dias": null, "tipo": "fechado"}], "contratos": [{"np": "115053", "cliente": "SOLVI PARTICIPAÇÕES", "etapa": "Análise de Requisição", "venc": "dez/26", "mrr": 12792.0, "arr": 0.0}, {"np": "115023", "cliente": "ORIZON", "etapa": "Análise de Requisição", "venc": "mai/26", "mrr": 1677.32, "arr": 23122.0}, {"np": "114973", "cliente": "ESTRE AMBIENTAL", "etapa": "Análise de Requisição", "venc": "dez/26", "mrr": 0.0, "arr": 16810.0}, {"np": "114961", "cliente": "Cetrel - Central de Tratamento de Efluen", "etapa": "Análise de Requisição", "venc": "dez/26", "mrr": 0.0, "arr": 11322.37}], "ativos": 8, "vt_pipeline": 70987.0, "vt_fechados": 86432.0, "enviados": 1}, "Educação": {"pipe_ativos": 4, "pipe_vt": 182084.0, "pipe_enviados": 4, "pipe_negoc": 1, "pipe_fechados": 0, "pipe_vt_fech": 0.0, "conv_pct": 0.0, "contr_ativos": 3, "contr_cancel": 0, "contr_mrr": 5282.72, "contr_arr": 50366.01, "contr_vt": 113758.65, "n_cli_pipe": 5, "n_cli_contr": 3, "n_cli_ambos": 2, "n_cli_so_contr": 1, "n_cli_so_pipe": 3, "projetos": [{"np": "NP-115719", "cliente": "UNIVALI", "etapa": "Projeto Enviado", "vt": 0.0, "dias": null, "tipo": "ativo"}, {"np": "NP-115363", "cliente": "SENAC RJ", "etapa": "Projeto Enviado", "vt": 13680.0, "dias": null, "tipo": "ativo"}, {"np": "NP-114712", "cliente": "Associação dos Engenheiros da Sabesp", "etapa": "Projeto Enviado", "vt": 142404.0, "dias": null, "tipo": "ativo"}, {"np": "NP-113350", "cliente": "Associação Leopoldina Juvenil (ALJ)", "etapa": "Projeto Enviado", "vt": 26000.0, "dias": null, "tipo": "ativo"}], "contratos": [{"np": "115067", "cliente": "UNIVALI", "etapa": "Análise de Requisição", "venc": "out/26", "mrr": 4353.0, "arr": 0.0}, {"np": "115046", "cliente": "SENAC RJ", "etapa": "Análise de Requisição", "venc": "mai/26", "mrr": 0.0, "arr": 44543.0}, {"np": "115000", "cliente": "INSTITUTO FALCAO BAUER DA QUALIDADE", "etapa": "Em análise pelo cliente", "venc": "abr/26", "mrr": 929.72, "arr": 5823.01}], "ativos": 8, "vt_pipeline": 360127.28, "vt_fechados": 0.0, "enviados": 4}, "Governo & Público": {"pipe_ativos": 1, "pipe_vt": 73700.0, "pipe_enviados": 1, "pipe_negoc": 0, "pipe_fechados": 0, "pipe_vt_fech": 0.0, "conv_pct": 0.0, "contr_ativos": 3, "contr_cancel": 0, "contr_mrr": 6561.56, "contr_arr": 37234.16, "contr_vt": 151101.12, "n_cli_pipe": 3, "n_cli_contr": 3, "n_cli_ambos": 3, "n_cli_so_contr": 0, "n_cli_so_pipe": 0, "projetos": [{"np": "NP-113992", "cliente": "SECRETARIA DA FAZENDA DO ESTADO DO ALAGO", "etapa": "Projeto Enviado", "vt": 73700.0, "dias": null, "tipo": "ativo"}], "contratos": [{"np": "115063", "cliente": "Trt Da 4ª Região", "etapa": "Em análise pelo cliente", "venc": "jan/26", "mrr": 6561.56, "arr": 0.0}, {"np": "115050", "cliente": "SERVIÇO SOCIAL DO COMÉRCIO - ADMINISTRAÇ", "etapa": "Análise de Requisição", "venc": "set/26", "mrr": 0.0, "arr": 0.0}, {"np": "115045", "cliente": "SECRETARIA DA FAZENDA DO ESTADO DO ALAGO", "etapa": "Análise de Requisição", "venc": "set/26", "mrr": 0.0, "arr": 37234.16}], "ativos": 5, "vt_pipeline": 153044.0, "vt_fechados": 0.0, "enviados": 1}};
var EC={"Projeto Enviado": ["#dbeafe", "#1e40af"], "Negociação": ["#fef3c7", "#92400e"], "Elaboração de Projeto": ["#f3e8ff", "#6b21a8"], "Estimativa de Esforço": ["#f0fdf4", "#166534"], "Qualificação": ["#f1f5f9", "#334155"], "Qualificação Concluída": ["#ecfdf5", "#065f46"], "Elaboração de Caderno Técnico": ["#fff7ed", "#9a3412"], "Projeto Aprovado": ["#dcfce7", "#14532d"], "Processo Financeiro": ["#fdf4ff", "#701a75"], "Projeto Faturado": ["#dcfce7", "#14532d"], "Análise de Requisição": ["#f8fafc", "#334155"], "Em análise pelo cliente": ["#fef9c3", "#854d0e"], "Renovado": ["#dcfce7", "#166534"], "Desistência": ["#f9fafb", "#6b7280"]};
var SC={"Tecnologia & TI": "#2563eb", "Saúde": "#059669", "Serviços & Infraestrutura": "#7c3aed", "Indústria": "#d97706", "Telecom & Mídia": "#0891b2", "Varejo & Moda": "#db2777", "Financeiro & Seguros": "#4f46e5", "Agronegócio": "#65a30d", "Meio Ambiente": "#0d9488", "Educação": "#9333ea", "Alimentos & Bebidas": "#ea580c", "Governo & Público": "#475569", "Outros": "#9ca3af"};
var SEG=null;
function bdg(e){var c=EC[e]||["#f1f5f9","#334155"];return'<span style="background:'+c[0]+';color:'+c[1]+';font-size:10px;font-weight:600;padding:2px 8px;border-radius:99px;white-space:nowrap;">'+e+'</span>';}
function age(d){if(d==null)return"—";var c,bg;if(d>60){c="#dc2626";bg="#fef2f2";}else if(d>=30){c="#d97706";bg="#fffbeb";}else{c="#16a34a";bg="#f0fdf4";}return'<span style="display:inline-flex;align-items:center;gap:3px;background:'+bg+';color:'+c+';font-size:10px;font-weight:700;padding:2px 8px;border-radius:99px;"><span style="width:6px;height:6px;border-radius:50%;background:'+c+';flex-shrink:0;"></span>'+d+'d</span>';}
function brf(v){if(!v)return'<span style="color:#d1d5db;">—</span>';return"R$ "+v.toLocaleString("pt-BR",{minimumFractionDigits:2});}
function renderP(info){
  document.getElementById("wtp-dd-thead").innerHTML='<tr style="background:var(--surface2)"><th style="padding:9px 16px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:var(--muted);border-bottom:1px solid var(--border);">NP</th><th style="padding:9px 16px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:var(--muted);border-bottom:1px solid var(--border);">Cliente</th><th style="padding:9px 16px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:var(--muted);border-bottom:1px solid var(--border);">Etapa</th><th style="padding:9px 16px;text-align:right;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:var(--muted);border-bottom:1px solid var(--border);">Valor Total</th><th style="padding:9px 16px;text-align:center;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:var(--muted);border-bottom:1px solid var(--border);">Idade</th></tr>';
  document.getElementById("wtp-dd-tbody").innerHTML=(info.projetos||[]).map(function(p,i){
    var bg=i%2===0?"var(--surface)":"var(--surface2)";var nc=p.tipo==="fechado"?"#059669":"var(--accent1)";
    return'<tr style="background:'+bg+';border-bottom:1px solid var(--border);">'+
      '<td style="padding:9px 16px;font-family:monospace;font-size:11px;font-weight:600;color:'+nc+';">'+p.np+'</td>'+
      '<td style="padding:9px 16px;font-size:13px;color:var(--text);">'+p.cliente+'</td>'+
      '<td style="padding:9px 16px;">'+bdg(p.etapa)+'</td>'+
      '<td style="padding:9px 16px;text-align:right;font-size:12px;font-weight:700;">'+brf(p.vt)+'</td>'+
      '<td style="padding:9px 16px;text-align:center;">'+age(p.dias)+'</td></tr>';
  }).join("");
}
function renderC(info){
  document.getElementById("wtp-dd-thead").innerHTML='<tr style="background:var(--surface2)"><th style="padding:9px 16px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:var(--muted);border-bottom:1px solid var(--border);">NP</th><th style="padding:9px 16px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:var(--muted);border-bottom:1px solid var(--border);">Cliente</th><th style="padding:9px 16px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:var(--muted);border-bottom:1px solid var(--border);">Etapa</th><th style="padding:9px 16px;text-align:center;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:var(--muted);border-bottom:1px solid var(--border);">Vencimento</th><th style="padding:9px 16px;text-align:right;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#7c3aed;border-bottom:1px solid var(--border);">MRR</th><th style="padding:9px 16px;text-align:right;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#0891b2;border-bottom:1px solid var(--border);">ARR</th></tr>';
  document.getElementById("wtp-dd-tbody").innerHTML=(info.contratos||[]).map(function(p,i){
    var bg=i%2===0?"var(--surface)":"var(--surface2)";
    return'<tr style="background:'+bg+';border-bottom:1px solid var(--border);">'+
      '<td style="padding:9px 16px;font-family:monospace;font-size:11px;font-weight:600;color:#059669;">'+p.np+'</td>'+
      '<td style="padding:9px 16px;font-size:13px;color:var(--text);">'+p.cliente+'</td>'+
      '<td style="padding:9px 16px;">'+bdg(p.etapa)+'</td>'+
      '<td style="padding:9px 16px;text-align:center;font-size:12px;color:var(--muted);">'+p.vencimento+'</td>'+
      '<td style="padding:9px 16px;text-align:right;font-size:12px;font-weight:600;color:#7c3aed;">'+brf(p.mrr)+'</td>'+
      '<td style="padding:9px 16px;text-align:right;font-size:12px;font-weight:600;color:#0891b2;">'+brf(p.arr)+'</td></tr>';
  }).join("");
}
window.wtpDrilldown=function(seg){
  SEG=seg;var info=D[seg];if(!info)return;var color=SC[seg]||"var(--accent1)";
  document.getElementById("wtp-dd-title").textContent=seg;
  document.getElementById("wtp-dd-title").style.color=color;
  document.getElementById("wtp-dd-sub").textContent=(info.projetos||[]).length+" projetos · "+(info.contratos||[]).length+" contratos · conv. "+info.conv_pct+"%";
  var bp=document.getElementById("wtp-tab-proj"),bc=document.getElementById("wtp-tab-contr");
  bp.style.borderBottomColor=color;bp.style.color="var(--text)";bc.style.borderBottomColor="transparent";bc.style.color="var(--muted)";
  renderP(info);
  var panel=document.getElementById("wtp-drilldown");panel.style.display="block";
  panel.scrollIntoView({behavior:"smooth",block:"nearest"});
};
window.wtpTab=function(tab){
  if(!SEG)return;var info=D[SEG];var color=SC[SEG]||"var(--accent1)";
  var bp=document.getElementById("wtp-tab-proj"),bc=document.getElementById("wtp-tab-contr");
  if(tab==="proj"){bp.style.borderBottomColor=color;bp.style.color="var(--text)";bc.style.borderBottomColor="transparent";bc.style.color="var(--muted)";renderP(info);}
  else{bc.style.borderBottomColor=color;bc.style.color="var(--text)";bp.style.borderBottomColor="transparent";bp.style.color="var(--muted)";renderC(info);}
};
window.wtpClose=function(){document.getElementById("wtp-drilldown").style.display="none";};
})();
</script>
</div>
</div> <!-- fim tab-wtp -->
</div>
<script>
function switchTab(tab, btn) {
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('tab-' + tab).classList.add('active');
  if (btn) btn.classList.add('active');
}
</script>
</body>
</html>
