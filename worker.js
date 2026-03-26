export default {
  async fetch(r,env){
    const S="Qualitor!@#25",C="qlt_auth",T="qualitor2026ok";
    const u=new URL(r.url),ck=r.headers.get("Cookie")||"";
    const ok=ck.includes(C+"="+T);
    if(r.method==="POST"&&u.pathname==="/login"){
      const b=await r.formData(),p=b.get("senha")||"";
      if(p===S)return new Response("",{status:302,headers:{"Location":"/","Set-Cookie":C+"="+T+"; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=28800"}});
      return new Response(login("Senha incorreta."),{status:401,headers:{"Content-Type":"text/html; charset=utf-8"}});
    }
    if(u.pathname==="/logout")return new Response("",{status:302,headers:{"Location":"/","Set-Cookie":C+"=; Path=/; Max-Age=0"}});
    if(!ok)return new Response(login(""),{status:200,headers:{"Content-Type":"text/html; charset=utf-8"}});
    const d=`<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Dashboard de Projetos — Pipeline Comercial</title>
<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js"></script>
<link href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,700&display=swap" rel="stylesheet">
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

<!-- ── Tela de senha ── -->
<div id="passwordScreen" style="
  position:fixed;inset:0;z-index:9999;
  background:#f5f6f8;
  display:flex;align-items:center;justify-content:center;
  font-family:'Nunito',sans-serif;
">
  <div style="
    background:#fff;border-radius:16px;
    padding:48px 40px;width:100%;max-width:380px;
    box-shadow:0 8px 40px rgba(0,0,0,0.10);
    text-align:center;
  ">
    <div style="font-size:36px;margin-bottom:16px;">🔒</div>
    <div style="font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#2563eb;margin-bottom:8px;">Pipeline de Projetos · 2026</div>
    <h2 style="font-size:22px;font-weight:800;color:#111827;margin-bottom:6px;">Acesso Restrito</h2>
    <p style="font-size:13px;color:#6b7280;margin-bottom:28px;">Digite a senha para visualizar o dashboard</p>
    <input id="pwdInput" type="password" placeholder="Senha"
      style="
        width:100%;padding:12px 16px;border:1.5px solid #e5e7eb;
        border-radius:10px;font-size:15px;font-family:'Nunito',sans-serif;
        outline:none;margin-bottom:12px;box-sizing:border-box;
        transition:border-color .2s;
      "
      onkeydown="if(event.key==='Enter') checkPwd()"
      onfocus="this.style.borderColor='#2563eb'"
      onblur="this.style.borderColor='#e5e7eb'"
    />
    <div id="pwdError" style="font-size:12px;color:#dc2626;margin-bottom:12px;min-height:16px;"></div>
    <button onclick="checkPwd()" style="
      width:100%;padding:13px;background:#2563eb;color:#fff;
      border:none;border-radius:10px;font-size:15px;font-weight:700;
      font-family:'Nunito',sans-serif;cursor:pointer;
      transition:background .2s;
    "
    onmouseover="this.style.background='#1d4ed8'"
    onmouseout="this.style.background='#2563eb'"
    >Entrar</button>
  </div>
</div>

<script>
function checkPwd() {
  const input = document.getElementById('pwdInput').value;
  if (input === 'Qualitor!@#25') {
    document.getElementById('passwordScreen').style.display = 'none';
    document.getElementById('mainContent').style.display = 'block';
    document.getElementById('mainContent').style.display = 'block';
  } else {
    document.getElementById('pwdError').textContent = 'Senha incorreta. Tente novamente.';
    document.getElementById('pwdInput').value = '';
    document.getElementById('pwdInput').focus();
  }
}
</script>
<div id="mainContent" style="display:none;">

<!-- ── Navegação de Abas ── -->
<nav class="tab-nav">
  <button class="tab-btn active" onclick="switchTab('pipeline', this)">📊 Pipeline de Projetos</button>
  <button class="tab-btn" onclick="switchTab('gestao', this)">📁 Gestão de Contratos</button>
  <button class="tab-btn" onclick="switchTab('wtp', this)">🎯 Where to Play</button>
  <button class="tab-btn" onclick="switchTab('changelog', this)" style="margin-left:auto;font-size:11px;opacity:0.75;">📋 Histórico de Alterações</button>
</nav>
<script>
function switchTab(tab, btn) {
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('tab-' + tab).classList.add('active');
  if (btn) btn.classList.add('active');
}
</script>

<!-- ══ ABA 1: PIPELINE ══ -->
<div id="tab-pipeline" class="tab-panel active">

<style>
  .p26-page {
    max-width: 1100px;
    margin: 0 auto;
    padding: 48px 32px 80px;
    font-family: 'Nunito', sans-serif;
  }

  /* ── Header ─────────────────────────────── */
  .p26-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 52px;
    padding-bottom: 28px;
    border-bottom: 1px solid var(--border);
  }
  .p26-eyebrow {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: var(--accent1);
    margin-bottom: 8px;
  }
  .p26-title {
    font-size: clamp(28px, 4vw, 44px);
    font-weight: 800;
    color: var(--text);
    line-height: 1.1;
    letter-spacing: -1px;
  }
  .p26-title span { color: var(--accent1); }
  .p26-meta {
    text-align: right;
    font-size: 11px;
    color: var(--muted);
    font-weight: 600;
    letter-spacing: 0.5px;
  }
  .p26-meta strong {
    display: block;
    font-size: 13px;
    color: var(--text);
    font-weight: 700;
    margin-top: 2px;
  }

  /* ── Section label ─────────────────────── */
  .p26-section-label {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: var(--muted);
    margin-bottom: 16px;
  }

  /* ── KPI grid — top row (4 cards) ───────── */
  .p26-kpi-row {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 14px;
    margin-bottom: 14px;
  }
  .p26-kpi {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 24px 22px 20px;
    position: relative;
    overflow: hidden;
    transition: transform .15s ease, box-shadow .15s ease;
  }
  .p26-kpi:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0,0,0,.07);
  }
  .p26-kpi::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: var(--kpi-accent, var(--accent1));
    border-radius: 16px 16px 0 0;
  }
  .p26-kpi-label {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1.8px;
    color: var(--muted);
    margin-bottom: 12px;
  }
  .p26-kpi-number {
    font-size: 42px;
    font-weight: 800;
    color: var(--text);
    line-height: 1;
    letter-spacing: -2px;
    margin-bottom: 8px;
  }
  .p26-kpi-sub {
    font-size: 12px;
    color: var(--muted);
    font-weight: 500;
  }
  .p26-kpi-sub strong {
    color: var(--kpi-accent, var(--accent1));
    font-weight: 700;
  }

  /* ── Fechados card (full width) ─────────── */
  .p26-fech-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 28px 28px 24px;
    position: relative;
    overflow: hidden;
    margin-top: 0;
  }
  .p26-fech-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: var(--accent3);
    border-radius: 16px 16px 0 0;
  }
  .p26-fech-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: 0;
  }
  .p26-fech-item {
    padding: 8px 20px 8px 0;
  }
  .p26-fech-item + .p26-fech-item {
    padding-left: 20px;
    border-left: 1px solid var(--border);
  }
  .p26-fech-label {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1.8px;
    color: var(--muted);
    margin-bottom: 10px;
  }
  .p26-fech-number {
    font-size: 36px;
    font-weight: 800;
    color: var(--accent3);
    line-height: 1;
    letter-spacing: -1.5px;
    margin-bottom: 6px;
  }
  .p26-fech-number.large { font-size: 28px; }
  .p26-fech-sub {
    font-size: 11px;
    color: var(--muted);
    font-weight: 500;
  }
  .p26-fech-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 20px;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--border);
  }
  .p26-fech-title {
    font-size: 13px;
    font-weight: 700;
    color: var(--text);
    letter-spacing: -0.2px;
  }
  .p26-fech-badge {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    background: #d1fae5;
    color: #065f46;
    padding: 4px 12px;
    border-radius: 99px;
  }

  /* ── Animations ──────────────────────────── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .p26-kpi    { animation: fadeUp .4s ease both; }
  .p26-kpi:nth-child(1) { animation-delay: .05s; }
  .p26-kpi:nth-child(2) { animation-delay: .10s; }
  .p26-kpi:nth-child(3) { animation-delay: .15s; }
  .p26-kpi:nth-child(4) { animation-delay: .20s; }
  .p26-fech-card { animation: fadeUp .4s .25s ease both; }

  @media (max-width: 768px) {
    .p26-kpi-row    { grid-template-columns: 1fr 1fr; }
    .p26-fech-grid  { grid-template-columns: 1fr 1fr; }
    .p26-fech-item + .p26-fech-item { border-left: none; padding-left: 0; }
    .p26-fech-item:nth-child(3),
    .p26-fech-item:nth-child(4) { padding-top: 16px; border-top: 1px solid var(--border); }
    .p26-header { flex-direction: column; align-items: flex-start; gap: 12px; }
    .p26-meta { text-align: left; }
  }
  @media (max-width: 480px) {
    .p26-kpi-row   { grid-template-columns: 1fr; }
    .p26-fech-grid { grid-template-columns: 1fr; }
    .p26-page { padding: 28px 16px 60px; }
  }
</style>

<div class="p26-page">

  <!-- Header -->
  <div class="p26-header">
    <div>
      <div class="p26-eyebrow">Pipeline de Projetos · 2026</div>
      <h1 class="p26-title">Pipeline de <br><span>Projetos</span></h1>
    </div>
    <div class="p26-meta">
      Fonte: Relatório de Projetos (3)
      <strong>23 / 03 / 2026</strong>
    </div>
  </div>

  <!-- Seção 1 — Visão Geral -->
  <div class="p26-section-label">Visão Geral</div>
  <div class="p26-kpi-row">

    <!-- Ativos -->
    <div class="p26-kpi" style="--kpi-accent:#2563eb">
      <div class="p26-kpi-label">Projetos Ativos</div>
      <div class="p26-kpi-number">157</div>
      <div class="p26-kpi-sub">Exclui <strong>Cancelados</strong> e Encerrados</div>
    </div>

    <!-- Enviados -->
    <div class="p26-kpi" style="--kpi-accent:#7c3aed">
      <div class="p26-kpi-label">Proj. Enviados</div>
      <div class="p26-kpi-number">65</div>
      <div class="p26-kpi-sub">Etapa <strong>Projeto Enviado</strong></div>
    </div>

    <!-- Negociação -->
    <div class="p26-kpi" style="--kpi-accent:#d97706">
      <div class="p26-kpi-label">Em Negociação</div>
      <div class="p26-kpi-number">4</div>
      <div class="p26-kpi-sub">Etapa <strong>Negociação</strong></div>
    </div>

    <!-- Valor Total -->
    <div class="p26-kpi" style="--kpi-accent:#0891b2">
      <div class="p26-kpi-label">Valor Total Enviados</div>
      <div class="p26-kpi-number" style="font-size:30px;letter-spacing:-1px;">R$ 2,41M</div>
      <div class="p26-kpi-sub">Etapa <strong>Projeto Enviado</strong></div>
    </div>

  </div>

  <!-- Seção 4 — Projetos por Responsável -->
  <div class="p26-section-label" style="margin-top:40px;">Projetos por Responsável</div>

  <!-- Cards -->
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:24px;">
    
    <div class="resp-card" data-resp="Pedro Schreck" onclick="openDrilldown('Pedro Schreck')"
      style="background:#fff;border:1px solid #e5e7eb;border-radius:14px;
             padding:18px 20px;cursor:pointer;transition:all .18s ease;
             border-left:4px solid #2563eb;">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px;">
        <div>
          <div style="font-size:11px;font-weight:700;text-transform:uppercase;
            letter-spacing:1.5px;color:#2563eb;margin-bottom:3px;">Pedro</div>
          <div style="font-size:13px;font-weight:600;color:#374151;">Pedro Schreck</div>
        </div>
        <div style="font-size:34px;font-weight:800;color:#111827;letter-spacing:-1.5px;line-height:1;">71</div>
      </div>
      <div style="height:4px;background:#f1f5f9;border-radius:2px;margin-bottom:8px;">
        <div style="height:4px;width:47.0%;background:#2563eb;border-radius:2px;transition:width .6s .1s ease;"></div>
      </div>
      <div style="font-size:11px;color:#9ca3af;font-weight:500;">47.0% do total · clique para detalhar</div>
    </div>
    <div class="resp-card" data-resp="Anderson Bamberg" onclick="openDrilldown('Anderson Bamberg')"
      style="background:#fff;border:1px solid #e5e7eb;border-radius:14px;
             padding:18px 20px;cursor:pointer;transition:all .18s ease;
             border-left:4px solid #7c3aed;">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px;">
        <div>
          <div style="font-size:11px;font-weight:700;text-transform:uppercase;
            letter-spacing:1.5px;color:#7c3aed;margin-bottom:3px;">Anderson</div>
          <div style="font-size:13px;font-weight:600;color:#374151;">Anderson Bamberg</div>
        </div>
        <div style="font-size:34px;font-weight:800;color:#111827;letter-spacing:-1.5px;line-height:1;">49</div>
      </div>
      <div style="height:4px;background:#f1f5f9;border-radius:2px;margin-bottom:8px;">
        <div style="height:4px;width:32.5%;background:#7c3aed;border-radius:2px;transition:width .6s .1s ease;"></div>
      </div>
      <div style="font-size:11px;color:#9ca3af;font-weight:500;">32.5% do total · clique para detalhar</div>
    </div>
    <div class="resp-card" data-resp="Talita Rodrigues" onclick="openDrilldown('Talita Rodrigues')"
      style="background:#fff;border:1px solid #e5e7eb;border-radius:14px;
             padding:18px 20px;cursor:pointer;transition:all .18s ease;
             border-left:4px solid #0891b2;">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px;">
        <div>
          <div style="font-size:11px;font-weight:700;text-transform:uppercase;
            letter-spacing:1.5px;color:#0891b2;margin-bottom:3px;">Talita</div>
          <div style="font-size:13px;font-weight:600;color:#374151;">Talita Rodrigues</div>
        </div>
        <div style="font-size:34px;font-weight:800;color:#111827;letter-spacing:-1.5px;line-height:1;">26</div>
      </div>
      <div style="height:4px;background:#f1f5f9;border-radius:2px;margin-bottom:8px;">
        <div style="height:4px;width:17.2%;background:#0891b2;border-radius:2px;transition:width .6s .1s ease;"></div>
      </div>
      <div style="font-size:11px;color:#9ca3af;font-weight:500;">17.2% do total · clique para detalhar</div>
    </div>
    <div class="resp-card" data-resp="Ines Cristine Nunes Diogo" onclick="openDrilldown('Ines Cristine Nunes Diogo')"
      style="background:#fff;border:1px solid #e5e7eb;border-radius:14px;
             padding:18px 20px;cursor:pointer;transition:all .18s ease;
             border-left:4px solid #d97706;">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px;">
        <div>
          <div style="font-size:11px;font-weight:700;text-transform:uppercase;
            letter-spacing:1.5px;color:#d97706;margin-bottom:3px;">Ines</div>
          <div style="font-size:13px;font-weight:600;color:#374151;">Ines Cristine Nunes Diogo</div>
        </div>
        <div style="font-size:34px;font-weight:800;color:#111827;letter-spacing:-1.5px;line-height:1;">5</div>
      </div>
      <div style="height:4px;background:#f1f5f9;border-radius:2px;margin-bottom:8px;">
        <div style="height:4px;width:3.3%;background:#d97706;border-radius:2px;transition:width .6s .1s ease;"></div>
      </div>
      <div style="font-size:11px;color:#9ca3af;font-weight:500;">3.3% do total · clique para detalhar</div>
    </div>
  </div>

  <!-- Drilldown panel -->
  <div id="resp-drilldown" style="display:none;background:#fff;border:1px solid #e5e7eb;
    border-radius:16px;overflow:hidden;animation:fadeUp .25s ease both;">

    <!-- Header -->
    <div id="dd-header" style="display:flex;justify-content:space-between;align-items:center;
      padding:16px 20px;border-bottom:1px solid #e5e7eb;">
      <div>
        <div id="dd-title" style="font-size:14px;font-weight:700;color:#111827;"></div>
        <div id="dd-sub"   style="font-size:12px;color:#6b7280;margin-top:2px;"></div>
      </div>
      <button onclick="closeDrilldown()" style="background:none;border:1px solid #e5e7eb;
        border-radius:8px;padding:6px 12px;font-size:12px;font-weight:600;
        color:#6b7280;cursor:pointer;">✕ Fechar</button>
    </div>

    <!-- Tabela -->
    <div style="overflow-x:auto;">
      <table style="width:100%;border-collapse:collapse;">
        <thead>
          <tr style="background:#f8fafc;">
            <th style="padding:9px 16px;text-align:left;font-size:10px;font-weight:700;
              text-transform:uppercase;letter-spacing:1.5px;color:#9ca3af;
              border-bottom:1px solid #e5e7eb;">NP</th>
            <th style="padding:9px 16px;text-align:left;font-size:10px;font-weight:700;
              text-transform:uppercase;letter-spacing:1.5px;color:#9ca3af;
              border-bottom:1px solid #e5e7eb;">Cliente</th>
            <th style="padding:9px 16px;text-align:left;font-size:10px;font-weight:700;
              text-transform:uppercase;letter-spacing:1.5px;color:#9ca3af;
              border-bottom:1px solid #e5e7eb;">Etapa</th>
            <th style="padding:9px 16px;text-align:right;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#9ca3af;border-bottom:1px solid #e5e7eb;">Valor Total</th>
            <th style="padding:9px 16px;text-align:center;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#9ca3af;border-bottom:1px solid #e5e7eb;">Dias</th>
          </tr>
        </thead>
        <tbody id="dd-tbody"></tbody>
      </table>
    </div>
  </div>

  <script>
  (function() {
    var respData = {"Pedro Schreck": {"qtd": 71, "projetos": [{"np": "NP-112683", "cliente": "HOSPITAL MAE DE DEUS (AESC)", "etapa": "Elaboração de Caderno Técnico", "vt": 10500.0, "abertura": "25/08/2025", "dias": 210}, {"np": "NP-113781", "cliente": "AUXILIADORA PREDIAL", "etapa": "Elaboração de Projeto", "vt": 0.0, "abertura": "21/10/2025", "dias": 153}, {"np": "NP-113311", "cliente": "Argenta Participacoes LTDA", "etapa": "Elaboração de Projeto", "vt": 0.0, "abertura": "24/09/2025", "dias": 180}, {"np": "NP-113229", "cliente": "SAFEWEB", "etapa": "Elaboração de Projeto", "vt": 0.0, "abertura": "18/09/2025", "dias": 186}, {"np": "NP-113135", "cliente": "AUXILIADORA PREDIAL", "etapa": "Elaboração de Projeto", "vt": 0.0, "abertura": "12/09/2025", "dias": 192}, {"np": "NP-113083", "cliente": "AREZZO INDUSTRIA E COMERCIO LTDA", "etapa": "Elaboração de Projeto", "vt": 0.0, "abertura": "10/09/2025", "dias": 194}, {"np": "NP-113081", "cliente": "AREZZO INDUSTRIA E COMERCIO LTDA", "etapa": "Elaboração de Projeto", "vt": 0.0, "abertura": "10/09/2025", "dias": 194}, {"np": "NP-113080", "cliente": "AREZZO INDUSTRIA E COMERCIO LTDA", "etapa": "Elaboração de Projeto", "vt": 0.0, "abertura": "10/09/2025", "dias": 194}, {"np": "NP-112886", "cliente": "BULLLA SA", "etapa": "Elaboração de Projeto", "vt": 0.0, "abertura": "03/09/2025", "dias": 201}, {"np": "NP-112728", "cliente": "CASTROLANDA", "etapa": "Elaboração de Projeto", "vt": 0.0, "abertura": "27/08/2025", "dias": 208}, {"np": "NP-112695", "cliente": "Celk Sistemas", "etapa": "Elaboração de Projeto", "vt": 0.0, "abertura": "25/08/2025", "dias": 210}, {"np": "NP-112633", "cliente": "CORTEL", "etapa": "Elaboração de Projeto", "vt": 0.0, "abertura": "21/08/2025", "dias": 214}, {"np": "NP-112622", "cliente": "KleyHertz Farmacêutica", "etapa": "Elaboração de Projeto", "vt": 0.0, "abertura": "21/08/2025", "dias": 214}, {"np": "NP-112505", "cliente": "Randon SA Implementos e Participações", "etapa": "Elaboração de Projeto", "vt": 0.0, "abertura": "15/08/2025", "dias": 220}, {"np": "NP-112300", "cliente": "AREZZO INDUSTRIA E COMERCIO LTDA", "etapa": "Elaboração de Projeto", "vt": 0.0, "abertura": "06/08/2025", "dias": 229}, {"np": "NP-112214", "cliente": "Trt Da 4ª Região", "etapa": "Elaboração de Projeto", "vt": 0.0, "abertura": "31/07/2025", "dias": 235}, {"np": "NP-112157", "cliente": "HOSPITAL MAE DE DEUS (AESC)", "etapa": "Elaboração de Projeto", "vt": 0.0, "abertura": "28/07/2025", "dias": 238}, {"np": "NP-112130", "cliente": "SEBRAE-PR", "etapa": "Elaboração de Projeto", "vt": 0.0, "abertura": "28/07/2025", "dias": 238}, {"np": "NP-111928", "cliente": "SAFEWEB", "etapa": "Elaboração de Projeto", "vt": 0.0, "abertura": "16/07/2025", "dias": 250}, {"np": "NP-116178", "cliente": "Argenta Participacoes LTDA", "etapa": "Estimativa de Esforço", "vt": 0.0, "abertura": "16/03/2026", "dias": 7}, {"np": "NP-116143", "cliente": "GOVERNANÇA BRASIL", "etapa": "Estimativa de Esforço", "vt": 0.0, "abertura": "12/03/2026", "dias": 11}, {"np": "NP-116052", "cliente": "AREZZO INDUSTRIA E COMERCIO LTDA", "etapa": "Estimativa de Esforço", "vt": 0.0, "abertura": "06/03/2026", "dias": 17}, {"np": "NP-116025", "cliente": "HOSPITAL MAE DE DEUS (AESC)", "etapa": "Estimativa de Esforço", "vt": 0.0, "abertura": "05/03/2026", "dias": 18}, {"np": "NP-115755", "cliente": "SAQUE PAGUE", "etapa": "Estimativa de Esforço", "vt": 0.0, "abertura": "18/02/2026", "dias": 33}, {"np": "NP-115657", "cliente": "GOVERNANÇA BRASIL", "etapa": "Estimativa de Esforço", "vt": 0.0, "abertura": "10/02/2026", "dias": 41}, {"np": "NP-115397", "cliente": "CASTROLANDA", "etapa": "Estimativa de Esforço", "vt": 0.0, "abertura": "28/01/2026", "dias": 54}, {"np": "NP-115283", "cliente": "STEFANINI", "etapa": "Estimativa de Esforço", "vt": 0.0, "abertura": "20/01/2026", "dias": 62}, {"np": "NP-114780", "cliente": "CASTROLANDA", "etapa": "Estimativa de Esforço", "vt": 0.0, "abertura": "05/01/2026", "dias": 77}, {"np": "NP-114475", "cliente": "HOSPITAL MAE DE DEUS (AESC)", "etapa": "Estimativa de Esforço", "vt": 0.0, "abertura": "08/12/2025", "dias": 105}, {"np": "NP-114404", "cliente": "BRASTORAGE - THINK", "etapa": "Estimativa de Esforço", "vt": 0.0, "abertura": "02/12/2025", "dias": 111}, {"np": "NP-113706", "cliente": "Trt Da 4ª Região", "etapa": "Estimativa de Esforço", "vt": 0.0, "abertura": "15/10/2025", "dias": 159}, {"np": "NP-113581", "cliente": "Trt Da 4ª Região", "etapa": "Estimativa de Esforço", "vt": 0.0, "abertura": "08/10/2025", "dias": 166}, {"np": "NP-113530", "cliente": "AUXILIADORA PREDIAL", "etapa": "Estimativa de Esforço", "vt": 0.0, "abertura": "06/10/2025", "dias": 168}, {"np": "NP-113414", "cliente": "IRANI PAPEL E EMBALAGEM S.A", "etapa": "Estimativa de Esforço", "vt": 0.0, "abertura": "29/09/2025", "dias": 175}, {"np": "NP-111949", "cliente": "Qualitor S.A.", "etapa": "Estimativa de Esforço", "vt": 0.0, "abertura": "17/07/2025", "dias": 249}, {"np": "NP-114406", "cliente": "SENAC RJ", "etapa": "Negociação", "vt": 178043.28, "abertura": "02/12/2025", "dias": 111}, {"np": "NP-113114", "cliente": "SABEMI SEGURADORA", "etapa": "Negociação", "vt": 3040.0, "abertura": "12/09/2025", "dias": 192}, {"np": "NP-116022", "cliente": "IRANI PAPEL E EMBALAGEM S.A", "etapa": "Projeto Enviado", "vt": 16720.0, "abertura": "05/03/2026", "dias": 18}, {"np": "NP-115870", "cliente": "WAY DATA SOLUTION S/A", "etapa": "Projeto Enviado", "vt": 17700.0, "abertura": "24/02/2026", "dias": 27}, {"np": "NP-115830", "cliente": "BULLLA SA", "etapa": "Projeto Enviado", "vt": 9500.0, "abertura": "23/02/2026", "dias": 28}, {"np": "NP-115495", "cliente": "SEPHORA DO BRASIL PARTICIPAÇÕES S.A.", "etapa": "Projeto Enviado", "vt": 1200.0, "abertura": "03/02/2026", "dias": 48}, {"np": "NP-115363", "cliente": "SENAC RJ", "etapa": "Projeto Enviado", "vt": 13680.0, "abertura": "26/01/2026", "dias": 56}, {"np": "NP-115351", "cliente": "AUXILIADORA PREDIAL", "etapa": "Projeto Enviado", "vt": 266832.0, "abertura": "23/01/2026", "dias": 59}, {"np": "NP-115323", "cliente": "SEPHORA DO BRASIL PARTICIPAÇÕES S.A.", "etapa": "Projeto Enviado", "vt": 20900.0, "abertura": "21/01/2026", "dias": 61}, {"np": "NP-115314", "cliente": "GGT SOLUÇÃO TECNOLOGICAS LTDA (ANGOLAPREV)", "etapa": "Projeto Enviado", "vt": 17670.0, "abertura": "21/01/2026", "dias": 61}, {"np": "NP-114416", "cliente": "Argenta Participacoes LTDA", "etapa": "Projeto Enviado", "vt": 1360.0, "abertura": "02/12/2025", "dias": 111}, {"np": "NP-114397", "cliente": "UNIMED PORTO ALEGRE", "etapa": "Projeto Enviado", "vt": 6840.0, "abertura": "02/12/2025", "dias": 111}, {"np": "NP-114383", "cliente": "BRASTORAGE - THINK", "etapa": "Projeto Enviado", "vt": 21600.0, "abertura": "01/12/2025", "dias": 112}, {"np": "NP-113992", "cliente": "SECRETARIA DA FAZENDA DO ESTADO DO ALAGOAS (SEFAZ AL)", "etapa": "Projeto Enviado", "vt": 73700.0, "abertura": "04/11/2025", "dias": 139}, {"np": "NP-113859", "cliente": "FRIGELAR", "etapa": "Projeto Enviado", "vt": 24000.0, "abertura": "24/10/2025", "dias": 150}, {"np": "NP-113847", "cliente": "FUNDAÇÃO SÃO FRANCISCO XAVIER - FSFX", "etapa": "Projeto Enviado", "vt": 19760.0, "abertura": "23/10/2025", "dias": 151}, {"np": "NP-113798", "cliente": "SAO JOAO FARMACIAS", "etapa": "Projeto Enviado", "vt": 15048.0, "abertura": "21/10/2025", "dias": 153}, {"np": "NP-113762", "cliente": "TORRA TORRA", "etapa": "Projeto Enviado", "vt": 4960.0, "abertura": "20/10/2025", "dias": 154}, {"np": "NP-113753", "cliente": "COOPERATIVA AGRO-INDUSTRIAL HOLAMBRA", "etapa": "Projeto Enviado", "vt": 343404.0, "abertura": "20/10/2025", "dias": 154}, {"np": "NP-113740", "cliente": "GOVERNANÇA BRASIL", "etapa": "Projeto Enviado", "vt": 3800.0, "abertura": "17/10/2025", "dias": 157}, {"np": "NP-113660", "cliente": "AUXILIADORA PREDIAL", "etapa": "Projeto Enviado", "vt": 950.0, "abertura": "13/10/2025", "dias": 161}, {"np": "NP-113639", "cliente": "INTERSISTEMAS INFORMATICA LTDA - NETLOGIC", "etapa": "Projeto Enviado", "vt": 3007.0, "abertura": "13/10/2025", "dias": 161}, {"np": "NP-113582", "cliente": "SAFEWEB", "etapa": "Projeto Enviado", "vt": 30636.0, "abertura": "08/10/2025", "dias": 166}, {"np": "NP-113096", "cliente": "BRASTORAGE - THINK", "etapa": "Projeto Enviado", "vt": 10640.0, "abertura": "10/09/2025", "dias": 194}, {"np": "NP-113068", "cliente": "CERVEJARIA PETRÓPOLIS", "etapa": "Projeto Enviado", "vt": 110400.0, "abertura": "09/09/2025", "dias": 195}, {"np": "NP-113058", "cliente": "CASTROLANDA", "etapa": "Projeto Enviado", "vt": 1800.0, "abertura": "09/09/2025", "dias": 195}, {"np": "NP-112991", "cliente": "AEL SISTEMAS S.A", "etapa": "Projeto Enviado", "vt": 30400.0, "abertura": "05/09/2025", "dias": 199}, {"np": "NP-112262", "cliente": "Real Hospital Português", "etapa": "Projeto Enviado", "vt": 31360.0, "abertura": "03/08/2025", "dias": 232}, {"np": "NP-112013", "cliente": "FRIGELAR", "etapa": "Projeto Enviado", "vt": 280000.0, "abertura": "22/07/2025", "dias": 244}, {"np": "NP-111880", "cliente": "Argenta Participacoes LTDA", "etapa": "Projeto Enviado", "vt": 13600.0, "abertura": "15/07/2025", "dias": 251}, {"np": "NP-111873", "cliente": "Hospital Ernesto Dornelles", "etapa": "Projeto Enviado", "vt": 82603.0, "abertura": "15/07/2025", "dias": 251}, {"np": "NP-115704", "cliente": "Qualitor S.A.", "etapa": "Qualificação", "vt": 0.0, "abertura": "12/02/2026", "dias": 39}, {"np": "NP-116258", "cliente": "Unimed Central de Serviços - RS", "etapa": "Qualificação Concluída", "vt": 0.0, "abertura": "20/03/2026", "dias": 3}, {"np": "NP-116159", "cliente": "REDE BRASIL GESTÃO DE ATIVOS", "etapa": "Qualificação Concluída", "vt": 0.0, "abertura": "13/03/2026", "dias": 10}, {"np": "NP-115797", "cliente": "ALPARGATAS", "etapa": "Qualificação Concluída", "vt": 0.0, "abertura": "19/02/2026", "dias": 32}, {"np": "NP-113826", "cliente": "Argenta Participacoes LTDA", "etapa": "Qualificação Concluída", "vt": 6800.0, "abertura": "22/10/2025", "dias": 152}]}, "Anderson Bamberg": {"qtd": 49, "projetos": [{"np": "NP-113065", "cliente": "BRNEO INOVAÇÕES EMPRESARIAL", "etapa": "Desistência", "vt": 0.0, "abertura": "09/09/2025", "dias": 195}, {"np": "NP-115818", "cliente": "KleyHertz Farmacêutica", "etapa": "Elaboração de Projeto", "vt": 0.0, "abertura": "20/02/2026", "dias": 31}, {"np": "NP-115600", "cliente": "ZILOR ENERGIA E ALIMENTOS", "etapa": "Elaboração de Projeto", "vt": 0.0, "abertura": "06/02/2026", "dias": 45}, {"np": "NP-114592", "cliente": "ATP", "etapa": "Elaboração de Projeto", "vt": 0.0, "abertura": "16/12/2025", "dias": 97}, {"np": "NP-114151", "cliente": "SERVIX", "etapa": "Elaboração de Projeto", "vt": 6144.0, "abertura": "13/11/2025", "dias": 130}, {"np": "NP-113462", "cliente": "RBS - Televisão Gaúcha SA", "etapa": "Elaboração de Projeto", "vt": 0.0, "abertura": "02/10/2025", "dias": 172}, {"np": "NP-113281", "cliente": "LUXCEL MAXLOG", "etapa": "Elaboração de Projeto", "vt": 0.0, "abertura": "22/09/2025", "dias": 182}, {"np": "NP-111926", "cliente": "VIAÇÃO OURO E PRATA S.A", "etapa": "Elaboração de Projeto", "vt": 0.0, "abertura": "16/07/2025", "dias": 250}, {"np": "NP-116139", "cliente": "ZILOR ENERGIA E ALIMENTOS", "etapa": "Estimativa de Esforço", "vt": 0.0, "abertura": "12/03/2026", "dias": 11}, {"np": "NP-116087", "cliente": "SANTA CASA DE MISERICÓRDIA DE PORTO ALEGRE", "etapa": "Estimativa de Esforço", "vt": 0.0, "abertura": "10/03/2026", "dias": 13}, {"np": "NP-115788", "cliente": "USINA SAO JOSE DA ESTIVA", "etapa": "Estimativa de Esforço", "vt": 0.0, "abertura": "18/02/2026", "dias": 33}, {"np": "NP-115517", "cliente": "IMPORTADORA BAGE S/A", "etapa": "Estimativa de Esforço", "vt": 0.0, "abertura": "03/02/2026", "dias": 48}, {"np": "NP-115261", "cliente": "LUXCEL MAXLOG", "etapa": "Estimativa de Esforço", "vt": 0.0, "abertura": "17/01/2026", "dias": 65}, {"np": "NP-115156", "cliente": "TORRA TORRA", "etapa": "Estimativa de Esforço", "vt": 0.0, "abertura": "12/01/2026", "dias": 70}, {"np": "NP-113438", "cliente": "LG SISTEMAS", "etapa": "Estimativa de Esforço", "vt": 0.0, "abertura": "01/10/2025", "dias": 173}, {"np": "NP-114516", "cliente": "AUTTAR - GETNET", "etapa": "Negociação", "vt": 37475.0, "abertura": "10/12/2025", "dias": 103}, {"np": "NP-113976", "cliente": "SERVIÇO SOCIAL DO COMÉRCIO - ADMINISTRAÇÃO REGIONAL NO ESTADO DO RIO DE JANEIRO (SESC/ ARRJ)", "etapa": "Negociação", "vt": 51300.0, "abertura": "03/11/2025", "dias": 140}, {"np": "NP-115925", "cliente": "KleyHertz Farmacêutica", "etapa": "Projeto Enviado", "vt": 35520.0, "abertura": "26/02/2026", "dias": 25}, {"np": "NP-115719", "cliente": "UNIVALI", "etapa": "Projeto Enviado", "vt": 0.0, "abertura": "13/02/2026", "dias": 38}, {"np": "NP-115404", "cliente": "Solo Network", "etapa": "Projeto Enviado", "vt": 0.0, "abertura": "28/01/2026", "dias": 54}, {"np": "NP-115335", "cliente": "CPA", "etapa": "Projeto Enviado", "vt": 0.0, "abertura": "22/01/2026", "dias": 60}, {"np": "NP-115265", "cliente": "Solucap Sistemas", "etapa": "Projeto Enviado", "vt": 58200.0, "abertura": "19/01/2026", "dias": 63}, {"np": "NP-115250", "cliente": "RRP ENERGIA", "etapa": "Projeto Enviado", "vt": 67387.0, "abertura": "16/01/2026", "dias": 66}, {"np": "NP-115120", "cliente": "RBS - Televisão Gaúcha SA", "etapa": "Projeto Enviado", "vt": 7600.0, "abertura": "08/01/2026", "dias": 74}, {"np": "NP-115119", "cliente": "RBS - Televisão Gaúcha SA", "etapa": "Projeto Enviado", "vt": 15792.0, "abertura": "08/01/2026", "dias": 74}, {"np": "NP-114776", "cliente": "IMPORTADORA BAGE S/A", "etapa": "Projeto Enviado", "vt": 1140.0, "abertura": "05/01/2026", "dias": 77}, {"np": "NP-114700", "cliente": "Planem Engenharia", "etapa": "Projeto Enviado", "vt": 16100.0, "abertura": "24/12/2025", "dias": 89}, {"np": "NP-114550", "cliente": "SANTA CASA DE MISERICÓRDIA DE PORTO ALEGRE", "etapa": "Projeto Enviado", "vt": 15200.0, "abertura": "12/12/2025", "dias": 101}, {"np": "NP-114513", "cliente": "SANTA CASA DE MISERICÓRDIA DE PORTO ALEGRE", "etapa": "Projeto Enviado", "vt": 5700.0, "abertura": "10/12/2025", "dias": 103}, {"np": "NP-114418", "cliente": "RAPIDONET SISTEMAS", "etapa": "Projeto Enviado", "vt": 36000.0, "abertura": "02/12/2025", "dias": 111}, {"np": "NP-114405", "cliente": "S3CURITY", "etapa": "Projeto Enviado", "vt": 7600.0, "abertura": "02/12/2025", "dias": 111}, {"np": "NP-114333", "cliente": "PERTO S/A PERIFÉRICOS P/ AUTOMAÇÃO - GRAVATAI ( Digicom )", "etapa": "Projeto Enviado", "vt": 25001.11, "abertura": "27/11/2025", "dias": 116}, {"np": "NP-114308", "cliente": "SPRINGER CARRIER (MIDEA)", "etapa": "Projeto Enviado", "vt": 10776.0, "abertura": "26/11/2025", "dias": 117}, {"np": "NP-114249", "cliente": "CONNECTION SEGURANÇA E GESTÃO DE TI", "etapa": "Projeto Enviado", "vt": 760.0, "abertura": "21/11/2025", "dias": 122}, {"np": "NP-114241", "cliente": "PANATLANTICA", "etapa": "Projeto Enviado", "vt": 11400.0, "abertura": "20/11/2025", "dias": 123}, {"np": "NP-114210", "cliente": "KleyHertz Farmacêutica", "etapa": "Projeto Enviado", "vt": 3600.0, "abertura": "18/11/2025", "dias": 125}, {"np": "NP-114061", "cliente": "SANTA CASA DE MISERICÓRDIA DE PORTO ALEGRE", "etapa": "Projeto Enviado", "vt": 1520.0, "abertura": "07/11/2025", "dias": 136}, {"np": "NP-113863", "cliente": "ROYAL PALM HOTELS & RESORTS (GRUPO ARCEL)", "etapa": "Projeto Enviado", "vt": 12872.0, "abertura": "24/10/2025", "dias": 150}, {"np": "NP-113547", "cliente": "TIMAC AGRO", "etapa": "Projeto Enviado", "vt": 24192.0, "abertura": "07/10/2025", "dias": 167}, {"np": "NP-113350", "cliente": "Associação Leopoldina Juvenil (ALJ)", "etapa": "Projeto Enviado", "vt": 26000.0, "abertura": "25/09/2025", "dias": 179}, {"np": "NP-113270", "cliente": "IMPORTADORA BAGE S/A", "etapa": "Projeto Enviado", "vt": 6300.0, "abertura": "22/09/2025", "dias": 182}, {"np": "NP-113199", "cliente": "S3CURITY", "etapa": "Projeto Enviado", "vt": 5700.0, "abertura": "17/09/2025", "dias": 187}, {"np": "NP-112404", "cliente": "NETCENTER INFORMATICA", "etapa": "Projeto Enviado", "vt": 32780.0, "abertura": "12/08/2025", "dias": 223}, {"np": "NP-112211", "cliente": "GOLDEN TECHNOLOGIA", "etapa": "Projeto Enviado", "vt": 12436.77, "abertura": "30/07/2025", "dias": 236}, {"np": "NP-112132", "cliente": "DATACOM", "etapa": "Projeto Enviado", "vt": 16044.0, "abertura": "28/07/2025", "dias": 238}, {"np": "NP-111866", "cliente": "VIAÇÃO OURO E PRATA S.A", "etapa": "Projeto Enviado", "vt": 8880.0, "abertura": "15/07/2025", "dias": 251}, {"np": "NP-116205", "cliente": "SOFIA PET", "etapa": "Qualificação", "vt": 0.0, "abertura": "17/03/2026", "dias": 6}, {"np": "NP-115242", "cliente": "Brasdiesel SA Comercial e Importadora", "etapa": "Qualificação", "vt": 0.0, "abertura": "15/01/2026", "dias": 67}, {"np": "NP-114676", "cliente": "Ditel", "etapa": "Qualificação", "vt": 0.0, "abertura": "22/12/2025", "dias": 91}]}, "Talita Rodrigues": {"qtd": 26, "projetos": [{"np": "NP-115697", "cliente": "BULLLA SA", "etapa": "Elaboração de Projeto", "vt": 0.0, "abertura": "12/02/2026", "dias": 39}, {"np": "NP-115271", "cliente": "ABBC - Associação Brasileira de Bancos", "etapa": "Elaboração de Projeto", "vt": 0.0, "abertura": "19/01/2026", "dias": 63}, {"np": "NP-113967", "cliente": "BOMBRIL S.A", "etapa": "Elaboração de Projeto", "vt": 0.0, "abertura": "03/11/2025", "dias": 140}, {"np": "NP-113604", "cliente": "CONSTRUTORA NORBERTO ODEBRECHT S.A.", "etapa": "Elaboração de Projeto", "vt": 0.0, "abertura": "09/10/2025", "dias": 165}, {"np": "NP-113488", "cliente": "BULLLA SA", "etapa": "Elaboração de Projeto", "vt": 0.0, "abertura": "02/10/2025", "dias": 172}, {"np": "NP-113285", "cliente": "BULLLA SA", "etapa": "Elaboração de Projeto", "vt": 0.0, "abertura": "22/09/2025", "dias": 182}, {"np": "NP-112412", "cliente": "CONSTRUTORA NORBERTO ODEBRECHT S.A.", "etapa": "Elaboração de Projeto", "vt": 16500.0, "abertura": "13/08/2025", "dias": 222}, {"np": "NP-115992", "cliente": "SOLVI PARTICIPAÇÕES", "etapa": "Estimativa de Esforço", "vt": 0.0, "abertura": "04/03/2026", "dias": 19}, {"np": "NP-115991", "cliente": "BULLLA SA", "etapa": "Estimativa de Esforço", "vt": 0.0, "abertura": "03/03/2026", "dias": 20}, {"np": "NP-111919", "cliente": "LIFE EMPRESARIAL SAÚDE LTDA", "etapa": "Estimativa de Esforço", "vt": 0.0, "abertura": "16/07/2025", "dias": 250}, {"np": "NP-115724", "cliente": "BULLLA SA", "etapa": "Projeto Aprovado", "vt": 16720.0, "abertura": "13/02/2026", "dias": 38}, {"np": "NP-115606", "cliente": "BULLLA SA", "etapa": "Projeto Aprovado", "vt": 30020.0, "abertura": "09/02/2026", "dias": 42}, {"np": "NP-114712", "cliente": "Associação dos Engenheiros da Sabesp", "etapa": "Projeto Enviado", "vt": 142404.0, "abertura": "26/12/2025", "dias": 87}, {"np": "NP-113970", "cliente": "Data Engenharia", "etapa": "Projeto Enviado", "vt": 172116.0, "abertura": "03/11/2025", "dias": 140}, {"np": "NP-113663", "cliente": "BULLLA SA", "etapa": "Projeto Enviado", "vt": 38400.0, "abertura": "13/10/2025", "dias": 161}, {"np": "NP-113545", "cliente": "AUTOGLASS", "etapa": "Projeto Enviado", "vt": 70160.0, "abertura": "06/10/2025", "dias": 168}, {"np": "NP-111979", "cliente": "CONSTRUTORA NORBERTO ODEBRECHT S.A.", "etapa": "Projeto Enviado", "vt": 6720.0, "abertura": "18/07/2025", "dias": 248}, {"np": "NP-115993", "cliente": "Sapore", "etapa": "Qualificação", "vt": 0.0, "abertura": "04/03/2026", "dias": 19}, {"np": "NP-115951", "cliente": "SOLVI PARTICIPAÇÕES", "etapa": "Qualificação", "vt": 0.0, "abertura": "02/03/2026", "dias": 21}, {"np": "NP-114746", "cliente": "Sapore", "etapa": "Qualificação", "vt": 0.0, "abertura": "30/12/2025", "dias": 83}, {"np": "NP-114714", "cliente": "SOLVI PARTICIPAÇÕES", "etapa": "Qualificação", "vt": 0.0, "abertura": "26/12/2025", "dias": 87}, {"np": "NP-114669", "cliente": "Associação Educadora e Beneficente", "etapa": "Qualificação", "vt": 0.0, "abertura": "22/12/2025", "dias": 91}, {"np": "NP-116078", "cliente": "Essencis Soluções Ambientais", "etapa": "Qualificação Concluída", "vt": 0.0, "abertura": "09/03/2026", "dias": 14}, {"np": "NP-116069", "cliente": "Cetrel - Central de Tratamento de Efluentes Líquidos", "etapa": "Qualificação Concluída", "vt": 0.0, "abertura": "09/03/2026", "dias": 14}, {"np": "NP-115259", "cliente": "Packing Group", "etapa": "Qualificação Concluída", "vt": 0.0, "abertura": "16/01/2026", "dias": 66}, {"np": "NP-113665", "cliente": "LIFE EMPRESARIAL SAÚDE LTDA", "etapa": "Qualificação Concluída", "vt": 0.0, "abertura": "13/10/2025", "dias": 161}]}, "Ines Cristine Nunes Diogo": {"qtd": 5, "projetos": [{"np": "NP-115875", "cliente": "CASTROLANDA", "etapa": "Projeto Enviado", "vt": 23472.0, "abertura": "24/02/2026", "dias": 27}, {"np": "NP-114520", "cliente": "Nutrire Indústria de Alimentos", "etapa": "Projeto Enviado", "vt": 23087.0, "abertura": "11/12/2025", "dias": 102}, {"np": "NP-116190", "cliente": "WHZ S.A", "etapa": "Qualificação", "vt": 0.0, "abertura": "17/03/2026", "dias": 6}, {"np": "NP-115823", "cliente": "GGT SOLUÇÃO TECNOLOGICAS LTDA (ANGOLAPREV)", "etapa": "Qualificação", "vt": 0.0, "abertura": "20/02/2026", "dias": 31}, {"np": "115730", "cliente": "IMPORTADORA BAGE S/A", "etapa": "Qualificação", "vt": 0.0, "abertura": "13/02/2026", "dias": 38}]}};

    var etapaColors = {
      "Projeto Enviado":               ["#dbeafe","#1e40af"],
      "Negociação":                    ["#fef3c7","#92400e"],
      "Elaboração de Projeto":         ["#f3e8ff","#6b21a8"],
      "Estimativa de Esforço":         ["#f0fdf4","#166534"],
      "Qualificação":                  ["#f1f5f9","#334155"],
      "Qualificação Concluída":        ["#ecfdf5","#065f46"],
      "Elaboração de Caderno Técnico": ["#fff7ed","#9a3412"],
      "Projeto Aprovado":              ["#dcfce7","#14532d"],
      "Processo Financeiro":           ["#fdf4ff","#701a75"],
      "Desistência":                   ["#f9fafb","#6b7280"],
      "Projeto Reprovado":             ["#fef2f2","#991b1b"]
    };

    function badge(etapa) {
      var c = etapaColors[etapa] || ["#f1f5f9","#334155"];
      return '<span style="background:'+c[0]+';color:'+c[1]+';font-size:10px;font-weight:600;padding:2px 8px;border-radius:99px;white-space:nowrap;">'+etapa+'</span>';
    }

    function ageDot(dias) {
      if (dias === null || dias === undefined) return '';
      var color, bg;
      if (dias > 60)      { color = '#dc2626'; bg = '#fef2f2'; }
      else if (dias >= 30){ color = '#d97706'; bg = '#fffbeb'; }
      else                { color = '#16a34a'; bg = '#f0fdf4'; }
      return '<span title="'+dias+' dias em aberto" style="display:inline-flex;align-items:center;gap:4px;'+
        'background:'+bg+';color:'+color+';font-size:10px;font-weight:700;'+
        'padding:2px 8px;border-radius:99px;white-space:nowrap;">'+
        '<span style="width:6px;height:6px;border-radius:50%;background:'+color+';flex-shrink:0;"></span>'+
        dias+'d</span>';
    }

    function brFmt(v) {
      if (!v || v === 0) return '<span style="color:#d1d5db;">—</span>';
      return 'R$ ' + v.toLocaleString('pt-BR', {minimumFractionDigits:2, maximumFractionDigits:2});
    }

    window.openDrilldown = function(resp) {
      var info = respData[resp];
      if (!info) return;

      document.querySelectorAll('.resp-card').forEach(function(c) {
        c.style.opacity   = c.dataset.resp === resp ? '1' : '0.45';
        c.style.transform = c.dataset.resp === resp ? 'translateY(-2px)' : 'none';
        c.style.boxShadow = c.dataset.resp === resp ? '0 6px 20px rgba(0,0,0,.08)' : 'none';
      });

      document.getElementById('dd-title').textContent = resp;
      document.getElementById('dd-sub').textContent   =
        info.qtd + ' projetos ativos · excl. Cancelado e Encerrado';

      var tbody = document.getElementById('dd-tbody');
      tbody.innerHTML = info.projetos.map(function(p, i) {
        var bg = i % 2 === 0 ? '#ffffff' : '#fafafa';
        return '<tr style="background:'+bg+';border-bottom:1px solid #f3f4f6;">' +
          '<td style="padding:10px 16px;font-family:monospace;font-size:11px;font-weight:600;color:#2563eb;white-space:nowrap;">'+p.np+'</td>' +
          '<td style="padding:10px 16px;font-size:13px;font-weight:500;color:#111827;">'+p.cliente+'</td>' +
          '<td style="padding:10px 16px;">'+badge(p.etapa)+'</td>' +
          '<td style="padding:10px 16px;text-align:right;font-size:12px;font-weight:700;color:#111827;">'+brFmt(p.vt)+'</td>' +
          '<td style="padding:10px 16px;text-align:center;">'+ageDot(p.dias)+'</td>' +
          '</tr>';
      }).join('');

      var panel = document.getElementById('resp-drilldown');
      panel.style.display = 'block';
      panel.scrollIntoView({behavior:'smooth', block:'nearest'});
    };

    window.closeDrilldown = function() {
      document.getElementById('resp-drilldown').style.display = 'none';
      document.querySelectorAll('.resp-card').forEach(function(c) {
        c.style.opacity   = '1';
        c.style.transform = 'none';
        c.style.boxShadow = 'none';
      });
    };

    document.querySelectorAll('.resp-card').forEach(function(c) {
      c.addEventListener('mouseenter', function() {
        if (c.style.opacity !== '0.45') c.style.boxShadow = '0 4px 16px rgba(0,0,0,.07)';
      });
      c.addEventListener('mouseleave', function() {
        if (c.style.opacity !== '0.45') c.style.boxShadow = 'none';
      });
    });
  })();
  </script>

  <!-- Seção: Em Negociação -->
  <div class="p26-section-label" style="margin-top:40px;">Em Negociação</div>
  <div style="background:#fff;border:1px solid #fde68a;border-left:4px solid #d97706;border-radius:14px;overflow:hidden;margin-bottom:0;">
    <div style="display:flex;justify-content:space-between;align-items:center;padding:18px 20px 14px;border-bottom:1px solid #fef9c3;">
      <div>
        <div style="font-size:13px;font-weight:700;color:#92400e;">Projetos em fase de Negociação</div>
        <div style="font-size:12px;color:#a16207;margin-top:2px;">Fechamento previsto para Março/2026</div>
      </div>
      <div style="display:flex;gap:10px;align-items:center;">
        <span style="background:#fef9c3;color:#92400e;font-size:12px;font-weight:700;padding:5px 14px;border-radius:99px;">4 projetos</span>
        <span style="background:#fffbeb;color:#d97706;font-size:12px;font-weight:700;padding:5px 14px;border-radius:99px;border:1px solid #fde68a;">R$ 269.858,28</span>
      </div>
    </div>
    <div style="overflow-x:auto;">
      <table style="width:100%;border-collapse:collapse;">
        <thead>
          <tr style="background:#fffbeb;">
            <th style="padding:10px 16px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#a16207;border-bottom:1px solid #fde68a;">NP</th>
            <th style="padding:10px 16px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#a16207;border-bottom:1px solid #fde68a;">Cliente</th>
            <th style="padding:10px 16px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#a16207;border-bottom:1px solid #fde68a;">Responsável</th>
            <th style="padding:10px 16px;text-align:center;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#a16207;border-bottom:1px solid #fde68a;">Projeção</th>
            <th style="padding:10px 16px;text-align:right;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#a16207;border-bottom:1px solid #fde68a;">Valor Total</th>
          </tr>
        </thead>
        <tbody><tr style="background:#ffffff;border-bottom:1px solid #f3f4f6;"><td style="padding:12px 16px;font-family:monospace;font-size:11px;font-weight:700;color:#d97706;">NP-114406</td><td style="padding:12px 16px;font-size:13px;font-weight:600;color:#111827;">SENAC RJ</td><td style="padding:12px 16px;font-size:12px;color:#6b7280;">Pedro Schreck</td><td style="padding:12px 16px;text-align:center;"><span style="background:#fef9c3;color:#92400e;font-size:11px;font-weight:700;padding:3px 12px;border-radius:99px;">Mar/2026</span></td><td style="padding:12px 16px;text-align:right;font-size:13px;font-weight:700;color:#111827;">R$ 178.043,28</td></tr><tr style="background:#f8fafc;border-bottom:1px solid #f3f4f6;"><td style="padding:12px 16px;font-family:monospace;font-size:11px;font-weight:700;color:#d97706;">NP-113976</td><td style="padding:12px 16px;font-size:13px;font-weight:600;color:#111827;">SERVIÇO SOCIAL DO COMÉRCIO</td><td style="padding:12px 16px;font-size:12px;color:#6b7280;">Anderson Bamberg</td><td style="padding:12px 16px;text-align:center;"><span style="background:#fef9c3;color:#92400e;font-size:11px;font-weight:700;padding:3px 12px;border-radius:99px;">Mar/2026</span></td><td style="padding:12px 16px;text-align:right;font-size:13px;font-weight:700;color:#111827;">R$ 51.300,00</td></tr><tr style="background:#ffffff;border-bottom:1px solid #f3f4f6;"><td style="padding:12px 16px;font-family:monospace;font-size:11px;font-weight:700;color:#d97706;">NP-114516</td><td style="padding:12px 16px;font-size:13px;font-weight:600;color:#111827;">AUTTAR - GETNET</td><td style="padding:12px 16px;font-size:12px;color:#6b7280;">Anderson Bamberg</td><td style="padding:12px 16px;text-align:center;"><span style="background:#fef9c3;color:#92400e;font-size:11px;font-weight:700;padding:3px 12px;border-radius:99px;">Mar/2026</span></td><td style="padding:12px 16px;text-align:right;font-size:13px;font-weight:700;color:#111827;">R$ 37.475,00</td></tr><tr style="background:#f8fafc;border-bottom:1px solid #f3f4f6;"><td style="padding:12px 16px;font-family:monospace;font-size:11px;font-weight:700;color:#d97706;">NP-113114</td><td style="padding:12px 16px;font-size:13px;font-weight:600;color:#111827;">SABEMI SEGURADORA</td><td style="padding:12px 16px;font-size:12px;color:#6b7280;">Pedro Schreck</td><td style="padding:12px 16px;text-align:center;"><span style="background:#fef9c3;color:#92400e;font-size:11px;font-weight:700;padding:3px 12px;border-radius:99px;">Mar/2026</span></td><td style="padding:12px 16px;text-align:right;font-size:13px;font-weight:700;color:#111827;">R$ 3.040,00</td></tr></tbody>
        <tfoot>
          <tr style="background:#fef9c3;border-top:2px solid #fde68a;">
            <td colspan="4" style="padding:12px 16px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#92400e;">Total · 4 projetos</td>
            <td style="padding:12px 16px;text-align:right;font-size:13px;font-weight:800;color:#92400e;">R$ 269.858,28</td>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>


  <!-- Seção 2 — Projetos Fechados -->
  <div class="p26-section-label" style="margin-top:32px;">Projetos Fechados — 2026</div>
  <div class="p26-fech-card">
    <div class="p26-fech-header">
      <div class="p26-fech-title">Aprovados a partir de Janeiro / 2026</div>
      <div class="p26-fech-badge">Data de aprovação ≥ jan/2026</div>
    </div>
    <div class="p26-fech-grid">

      <div class="p26-fech-item">
        <div class="p26-fech-label">Quantidade</div>
        <div class="p26-fech-number">15</div>
        <div class="p26-fech-sub">projetos faturados</div>
      </div>

      <div class="p26-fech-item">
        <div class="p26-fech-label">Valor Total</div>
        <div class="p26-fech-number large">R$ 340.090,60</div>
        <div class="p26-fech-sub">soma dos VT dos projetos</div>
      </div>

      <div class="p26-fech-item">
        <div class="p26-fech-label">MRR</div>
        <div class="p26-fech-number large">R$ 18.254,00</div>
        <div class="p26-fech-sub">receita recorrente mensal</div>
      </div>

      <div class="p26-fech-item">
        <div class="p26-fech-label">ARR</div>
        <div class="p26-fech-number large">R$ 121.033,00</div>
        <div class="p26-fech-sub">receita para os próximos 12 meses</div>
      </div>

    </div>
  </div>

  <!-- Seção 3 — Detalhe Projetos Fechados -->
  <div class="p26-section-label" style="margin-top:40px;">Detalhe — Projetos Fechados 2026</div>
  <div style="background:#fff;border:1px solid var(--border);border-radius:16px;overflow:hidden;">
    <div style="display:flex;justify-content:space-between;align-items:center;padding:18px 20px 14px;border-bottom:1px solid var(--border);">
      <div><div style="font-size:13px;font-weight:700;color:#111827;">Aprovados ≥ Jan / 2026</div><div style="font-size:12px;color:#6b7280;margin-top:2px;">15 projetos · ordenado por data de aprovação</div></div>
      <div style="display:flex;gap:16px;font-size:11px;font-weight:700;color:#6b7280;align-items:center;"><span style="background:#dcfce7;color:#166534;font-size:12px;font-weight:700;padding:5px 14px;border-radius:99px;">15 projetos</span><span>VT <strong style="color:#111827;margin-left:4px;">R$ 340.090,60</strong></span><span style="color:#7c3aed;">MRR <strong style="margin-left:4px;">R$ 18.254,00</strong></span><span style="color:#0891b2;">ARR <strong style="margin-left:4px;">R$ 121.033,00</strong></span></div></div>
    <div style="overflow-x:auto;"><table style="width:100%;border-collapse:collapse;">
      <thead><tr style="background:#f8fafc;"><th style="padding:10px 16px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#059669;border-bottom:1px solid #e5e7eb;">NP</th><th style="padding:10px 16px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#059669;border-bottom:1px solid #e5e7eb;">Cliente</th><th style="padding:10px 16px;text-align:center;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#059669;border-bottom:1px solid #e5e7eb;">Aprovação</th><th style="padding:10px 16px;text-align:right;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#059669;border-bottom:1px solid #e5e7eb;">Valor Total</th><th style="padding:10px 16px;text-align:right;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#7c3aed;border-bottom:1px solid #e5e7eb;">MRR</th><th style="padding:10px 16px;text-align:right;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#0891b2;border-bottom:1px solid #e5e7eb;">ARR</th></tr></thead>
      <tbody><tr><td colspan="4" style="padding:10px 16px 8px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#059669;background:#f0fdf4;border-bottom:1px solid #d1fae5;">Janeiro / 2026</td></tr><tr style="background:#ffffff;border-bottom:1px solid #f3f4f6;"><td style="padding:11px 16px;font-family:monospace;font-size:11px;font-weight:600;color:#059669;">NP-115316</td><td style="padding:11px 16px;font-size:13px;font-weight:500;color:#111827;">FRIGELAR</td><td style="padding:11px 16px;text-align:center;"><span style="background:#dcfce7;color:#166534;font-size:11px;font-weight:700;padding:3px 12px;border-radius:99px;">jan/26</span></td><td style="padding:11px 16px;text-align:right;font-size:12px;font-weight:700;color:#111827;">R$ 3.600,00</td><td style="padding:11px 16px;text-align:right;font-size:12px;font-weight:600;color:#7c3aed;">R$ 300,00</td><td style="padding:11px 16px;text-align:right;font-size:12px;font-weight:600;color:#0891b2;"><span style="color:#d1d5db;">—</span></td></tr><tr style="background:#fafafa;border-bottom:1px solid #f3f4f6;"><td style="padding:11px 16px;font-family:monospace;font-size:11px;font-weight:600;color:#059669;">NP-115262</td><td style="padding:11px 16px;font-size:13px;font-weight:500;color:#111827;">INTERCITY</td><td style="padding:11px 16px;text-align:center;"><span style="background:#dcfce7;color:#166534;font-size:11px;font-weight:700;padding:3px 12px;border-radius:99px;">jan/26</span></td><td style="padding:11px 16px;text-align:right;font-size:12px;font-weight:700;color:#111827;">R$ 76.721,00</td><td style="padding:11px 16px;text-align:right;font-size:12px;font-weight:600;color:#7c3aed;"><span style="color:#d1d5db;">—</span></td><td style="padding:11px 16px;text-align:right;font-size:12px;font-weight:600;color:#0891b2;">R$ 76.721,00</td></tr><tr style="background:#ffffff;border-bottom:1px solid #f3f4f6;"><td style="padding:11px 16px;font-family:monospace;font-size:11px;font-weight:600;color:#059669;">NP-115157</td><td style="padding:11px 16px;font-size:13px;font-weight:500;color:#111827;">STEFANINI</td><td style="padding:11px 16px;text-align:center;"><span style="background:#dcfce7;color:#166534;font-size:11px;font-weight:700;padding:3px 12px;border-radius:99px;">jan/26</span></td><td style="padding:11px 16px;text-align:right;font-size:12px;font-weight:700;color:#111827;">R$ 62.889,60</td><td style="padding:11px 16px;text-align:right;font-size:12px;font-weight:600;color:#7c3aed;">R$ 5.240,00</td><td style="padding:11px 16px;text-align:right;font-size:12px;font-weight:600;color:#0891b2;"><span style="color:#d1d5db;">—</span></td></tr><tr style="background:#fafafa;border-bottom:1px solid #f3f4f6;"><td style="padding:11px 16px;font-family:monospace;font-size:11px;font-weight:600;color:#059669;">NP-114662</td><td style="padding:11px 16px;font-size:13px;font-weight:500;color:#111827;">IRANI PAPEL E EMBALAGEM S.A</td><td style="padding:11px 16px;text-align:center;"><span style="background:#dcfce7;color:#166534;font-size:11px;font-weight:700;padding:3px 12px;border-radius:99px;">jan/26</span></td><td style="padding:11px 16px;text-align:right;font-size:12px;font-weight:700;color:#111827;"><span style="color:#d1d5db;">—</span></td><td style="padding:11px 16px;text-align:right;font-size:12px;font-weight:600;color:#7c3aed;"><span style="color:#d1d5db;">—</span></td><td style="padding:11px 16px;text-align:right;font-size:12px;font-weight:600;color:#0891b2;"><span style="color:#d1d5db;">—</span></td></tr><tr style="background:#ffffff;border-bottom:1px solid #f3f4f6;"><td style="padding:11px 16px;font-family:monospace;font-size:11px;font-weight:600;color:#059669;">NP-114581</td><td style="padding:11px 16px;font-size:13px;font-weight:500;color:#111827;">SOLVI PARTICIPAÇÕES</td><td style="padding:11px 16px;text-align:center;"><span style="background:#dcfce7;color:#166534;font-size:11px;font-weight:700;padding:3px 12px;border-radius:99px;">jan/26</span></td><td style="padding:11px 16px;text-align:right;font-size:12px;font-weight:700;color:#111827;">R$ 78.912,00</td><td style="padding:11px 16px;text-align:right;font-size:12px;font-weight:600;color:#7c3aed;">R$ 6.576,00</td><td style="padding:11px 16px;text-align:right;font-size:12px;font-weight:600;color:#0891b2;"><span style="color:#d1d5db;">—</span></td></tr><tr style="background:#fafafa;border-bottom:1px solid #f3f4f6;"><td style="padding:11px 16px;font-family:monospace;font-size:11px;font-weight:600;color:#059669;">NP-114514</td><td style="padding:11px 16px;font-size:13px;font-weight:500;color:#111827;">TORRA TORRA</td><td style="padding:11px 16px;text-align:center;"><span style="background:#dcfce7;color:#166534;font-size:11px;font-weight:700;padding:3px 12px;border-radius:99px;">jan/26</span></td><td style="padding:11px 16px;text-align:right;font-size:12px;font-weight:700;color:#111827;">R$ 1.140,00</td><td style="padding:11px 16px;text-align:right;font-size:12px;font-weight:600;color:#7c3aed;"><span style="color:#d1d5db;">—</span></td><td style="padding:11px 16px;text-align:right;font-size:12px;font-weight:600;color:#0891b2;">R$ 1.140,00</td></tr><tr style="background:#ffffff;border-bottom:1px solid #f3f4f6;"><td style="padding:11px 16px;font-family:monospace;font-size:11px;font-weight:600;color:#059669;">NP-114454</td><td style="padding:11px 16px;font-size:13px;font-weight:500;color:#111827;">KICALDO</td><td style="padding:11px 16px;text-align:center;"><span style="background:#dcfce7;color:#166534;font-size:11px;font-weight:700;padding:3px 12px;border-radius:99px;">jan/26</span></td><td style="padding:11px 16px;text-align:right;font-size:12px;font-weight:700;color:#111827;">R$ 760,00</td><td style="padding:11px 16px;text-align:right;font-size:12px;font-weight:600;color:#7c3aed;"><span style="color:#d1d5db;">—</span></td><td style="padding:11px 16px;text-align:right;font-size:12px;font-weight:600;color:#0891b2;">R$ 760,00</td></tr><tr style="background:#fafafa;border-bottom:1px solid #f3f4f6;"><td style="padding:11px 16px;font-family:monospace;font-size:11px;font-weight:600;color:#059669;">NP-113067</td><td style="padding:11px 16px;font-size:13px;font-weight:500;color:#111827;">EBM Incorporações S/A</td><td style="padding:11px 16px;text-align:center;"><span style="background:#dcfce7;color:#166534;font-size:11px;font-weight:700;padding:3px 12px;border-radius:99px;">jan/26</span></td><td style="padding:11px 16px;text-align:right;font-size:12px;font-weight:700;color:#111827;">R$ 47.800,00</td><td style="padding:11px 16px;text-align:right;font-size:12px;font-weight:600;color:#7c3aed;">R$ 1.450,00</td><td style="padding:11px 16px;text-align:right;font-size:12px;font-weight:600;color:#0891b2;">R$ 30.400,00</td></tr><tr style="background:#ffffff;border-bottom:1px solid #f3f4f6;"><td style="padding:11px 16px;font-family:monospace;font-size:11px;font-weight:600;color:#059669;">NP-112107</td><td style="padding:11px 16px;font-size:13px;font-weight:500;color:#111827;">SABEMI SEGURADORA</td><td style="padding:11px 16px;text-align:center;"><span style="background:#dcfce7;color:#166534;font-size:11px;font-weight:700;padding:3px 12px;border-radius:99px;">jan/26</span></td><td style="padding:11px 16px;text-align:right;font-size:12px;font-weight:700;color:#111827;">R$ 9.600,00</td><td style="padding:11px 16px;text-align:right;font-size:12px;font-weight:600;color:#7c3aed;">R$ 800,00</td><td style="padding:11px 16px;text-align:right;font-size:12px;font-weight:600;color:#0891b2;"><span style="color:#d1d5db;">—</span></td></tr><tr><td colspan="4" style="padding:10px 16px 8px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#059669;background:#f0fdf4;border-bottom:1px solid #d1fae5;">Fevereiro / 2026</td></tr><tr style="background:#fafafa;border-bottom:1px solid #f3f4f6;"><td style="padding:11px 16px;font-family:monospace;font-size:11px;font-weight:600;color:#059669;">NP-114660</td><td style="padding:11px 16px;font-size:13px;font-weight:500;color:#111827;">M.L.GOMES</td><td style="padding:11px 16px;text-align:center;"><span style="background:#dcfce7;color:#166534;font-size:11px;font-weight:700;padding:3px 12px;border-radius:99px;">fev/26</span></td><td style="padding:11px 16px;text-align:right;font-size:12px;font-weight:700;color:#111827;">R$ 6.080,00</td><td style="padding:11px 16px;text-align:right;font-size:12px;font-weight:600;color:#7c3aed;"><span style="color:#d1d5db;">—</span></td><td style="padding:11px 16px;text-align:right;font-size:12px;font-weight:600;color:#0891b2;">R$ 6.080,00</td></tr><tr style="background:#ffffff;border-bottom:1px solid #f3f4f6;"><td style="padding:11px 16px;font-family:monospace;font-size:11px;font-weight:600;color:#059669;">NP-114632</td><td style="padding:11px 16px;font-size:13px;font-weight:500;color:#111827;">Novvacore Jr & Js - Telecom LTDA</td><td style="padding:11px 16px;text-align:center;"><span style="background:#dcfce7;color:#166534;font-size:11px;font-weight:700;padding:3px 12px;border-radius:99px;">fev/26</span></td><td style="padding:11px 16px;text-align:right;font-size:12px;font-weight:700;color:#111827;">R$ 43.056,00</td><td style="padding:11px 16px;text-align:right;font-size:12px;font-weight:600;color:#7c3aed;">R$ 3.588,00</td><td style="padding:11px 16px;text-align:right;font-size:12px;font-weight:600;color:#0891b2;"><span style="color:#d1d5db;">—</span></td></tr><tr><td colspan="4" style="padding:10px 16px 8px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#059669;background:#f0fdf4;border-bottom:1px solid #d1fae5;">Março / 2026</td></tr><tr style="background:#fafafa;border-bottom:1px solid #f3f4f6;"><td style="padding:11px 16px;font-family:monospace;font-size:11px;font-weight:600;color:#059669;">NP-116129</td><td style="padding:11px 16px;font-size:13px;font-weight:500;color:#111827;">Cetrel - Central de Tratamento de Efluentes Líquidos</td><td style="padding:11px 16px;text-align:center;"><span style="background:#dcfce7;color:#166534;font-size:11px;font-weight:700;padding:3px 12px;border-radius:99px;">mar/26</span></td><td style="padding:11px 16px;text-align:right;font-size:12px;font-weight:700;color:#111827;">R$ 3.600,00</td><td style="padding:11px 16px;text-align:right;font-size:12px;font-weight:600;color:#7c3aed;">R$ 300,00</td><td style="padding:11px 16px;text-align:right;font-size:12px;font-weight:600;color:#0891b2;"><span style="color:#d1d5db;">—</span></td></tr><tr style="background:#ffffff;border-bottom:1px solid #f3f4f6;"><td style="padding:11px 16px;font-family:monospace;font-size:11px;font-weight:600;color:#059669;">NP-116081</td><td style="padding:11px 16px;font-size:13px;font-weight:500;color:#111827;">NETCENTER INFORMATICA</td><td style="padding:11px 16px;text-align:center;"><span style="background:#dcfce7;color:#166534;font-size:11px;font-weight:700;padding:3px 12px;border-radius:99px;">mar/26</span></td><td style="padding:11px 16px;text-align:right;font-size:12px;font-weight:700;color:#111827;">R$ 3.800,00</td><td style="padding:11px 16px;text-align:right;font-size:12px;font-weight:600;color:#7c3aed;"><span style="color:#d1d5db;">—</span></td><td style="padding:11px 16px;text-align:right;font-size:12px;font-weight:600;color:#0891b2;">R$ 3.800,00</td></tr><tr style="background:#fafafa;border-bottom:1px solid #f3f4f6;"><td style="padding:11px 16px;font-family:monospace;font-size:11px;font-weight:600;color:#059669;">NP-115812</td><td style="padding:11px 16px;font-size:13px;font-weight:500;color:#111827;">BRASTORAGE - THINK</td><td style="padding:11px 16px;text-align:center;"><span style="background:#dcfce7;color:#166534;font-size:11px;font-weight:700;padding:3px 12px;border-radius:99px;">mar/26</span></td><td style="padding:11px 16px;text-align:right;font-size:12px;font-weight:700;color:#111827;">R$ 1.140,00</td><td style="padding:11px 16px;text-align:right;font-size:12px;font-weight:600;color:#7c3aed;"><span style="color:#d1d5db;">—</span></td><td style="padding:11px 16px;text-align:right;font-size:12px;font-weight:600;color:#0891b2;">R$ 1.140,00</td></tr><tr style="background:#ffffff;border-bottom:1px solid #f3f4f6;"><td style="padding:11px 16px;font-family:monospace;font-size:11px;font-weight:600;color:#059669;">NP-115715</td><td style="padding:11px 16px;font-size:13px;font-weight:500;color:#111827;">CORPFLEX INFORMATICA LTDA</td><td style="padding:11px 16px;text-align:center;"><span style="background:#dcfce7;color:#166534;font-size:11px;font-weight:700;padding:3px 12px;border-radius:99px;">mar/26</span></td><td style="padding:11px 16px;text-align:right;font-size:12px;font-weight:700;color:#111827;">R$ 992,00</td><td style="padding:11px 16px;text-align:right;font-size:12px;font-weight:600;color:#7c3aed;"><span style="color:#d1d5db;">—</span></td><td style="padding:11px 16px;text-align:right;font-size:12px;font-weight:600;color:#0891b2;">R$ 992,00</td></tr></tbody>
      <tfoot><tr style="background:#f0fdf4;border-top:2px solid #bbf7d0;"><td colspan="3" style="padding:12px 16px;font-size:11px;font-weight:700;text-transform:uppercase;color:#059669;">Total · 15 projetos</td><td style="padding:12px 16px;text-align:right;font-weight:800;color:#111827;">R$ 340.090,60</td><td style="padding:12px 16px;text-align:right;font-weight:800;color:#7c3aed;">R$ 18.254,00</td><td style="padding:12px 16px;text-align:right;font-weight:800;color:#0891b2;">R$ 121.033,00</td></tr></tfoot>
    </table></div>
  </div>

<!-- Seção 5 — Fechados por Mês -->
  <div class="p26-section-label" style="margin-top:40px;">Fechados por Mês — 2026</div>
  <div style="background:#fff;border:1px solid var(--border);border-radius:16px;overflow:hidden;">
    <div style="display:flex;justify-content:space-between;align-items:center;padding:18px 20px 14px;border-bottom:1px solid var(--border);">
      <div><div style="font-size:13px;font-weight:700;color:#111827;">Volume por Mês de Aprovação</div><div style="font-size:12px;color:#6b7280;margin-top:2px;">Projetos aprovados ≥ Jan/2026 · agrupado por mês</div></div>
      <span style="background:#f0fdf4;color:#059669;font-size:12px;font-weight:700;padding:5px 14px;border-radius:99px;border:1px solid #bbf7d0;">Total: R$ 340.090,60</span>
    </div>
    <div style="overflow-x:auto;"><table style="width:100%;border-collapse:collapse;">
      <thead><tr style="background:#f8fafc;"><th style="padding:10px 20px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#9ca3af;border-bottom:1px solid #e5e7eb;">Mês</th><th style="padding:10px 20px;text-align:center;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#9ca3af;border-bottom:1px solid #e5e7eb;">Projetos</th><th style="padding:10px 20px;text-align:right;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#9ca3af;border-bottom:1px solid #e5e7eb;">Valor Total</th></tr></thead>
      <tbody><tr style="background:#ffffff;border-bottom:1px solid #f3f4f6;"><td style="padding:12px 20px;font-size:14px;font-weight:700;color:#111827;">jan/26</td><td style="padding:12px 20px;text-align:center;"><span style="background:#f0fdf4;color:#166534;font-size:13px;font-weight:700;padding:3px 14px;border-radius:99px;">9</span></td><td style="padding:12px 20px;text-align:right;font-size:13px;font-weight:700;color:#111827;">R$ 281.422,60</td></tr><tr style="background:#f8fafc;border-bottom:1px solid #f3f4f6;"><td style="padding:12px 20px;font-size:14px;font-weight:700;color:#111827;">fev/26</td><td style="padding:12px 20px;text-align:center;"><span style="background:#f0fdf4;color:#166534;font-size:13px;font-weight:700;padding:3px 14px;border-radius:99px;">2</span></td><td style="padding:12px 20px;text-align:right;font-size:13px;font-weight:700;color:#111827;">R$ 49.136,00</td></tr><tr style="background:#ffffff;border-bottom:1px solid #f3f4f6;"><td style="padding:12px 20px;font-size:14px;font-weight:700;color:#111827;">mar/26</td><td style="padding:12px 20px;text-align:center;"><span style="background:#f0fdf4;color:#166534;font-size:13px;font-weight:700;padding:3px 14px;border-radius:99px;">4</span></td><td style="padding:12px 20px;text-align:right;font-size:13px;font-weight:700;color:#111827;">R$ 9.532,00</td></tr><tr style="background:#f0fdf4;border-top:2px solid #bbf7d0;"><td style="padding:12px 20px;font-size:11px;font-weight:700;text-transform:uppercase;color:#059669;">Total</td><td style="padding:12px 20px;text-align:center;font-size:13px;font-weight:800;color:#059669;">15</td><td style="padding:12px 20px;text-align:right;font-size:13px;font-weight:800;color:#059669;">R$ 340.090,60</td></tr></tbody>
    </table></div>
  </div>

</div>
</div> <!-- fim tab-pipeline -->
<div id="tab-gestao" class="tab-panel">
<div class="page">

  <header>
    <div class="header-left">
      <div class="header-eyebrow">Gestão de Contratos · 2026</div>
      <h1 class="header-title">Gestão de<br><span style="color:var(--accent3);">Contratos</span></h1>
    </div>
    <div class="header-right">
      <div class="header-badge"><span class="dot" style="background:#059669;"></span>Base S2 · 23/03/2026</div>
    </div>
  </header>

<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:14px;"><div style="background:#fff;border:1px solid #e5e7eb;border-top:3px solid #2563eb;border-radius:14px;padding:20px 18px;"><div style="font-size:22px;margin-bottom:10px;">📅</div><div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.8px;color:#9ca3af;margin-bottom:8px;">Carteira Jan/2026</div><div style="font-size:32px;font-weight:800;color:#111827;letter-spacing:-1px;line-height:1;margin-bottom:6px;">143</div><div style="font-size:11px;color:#6b7280;">R$ 7.068.386,59</div></div><div style="background:#fff;border:1px solid #e5e7eb;border-top:3px solid #059669;border-radius:14px;padding:20px 18px;"><div style="font-size:22px;margin-bottom:10px;">📋</div><div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.8px;color:#9ca3af;margin-bottom:8px;">Carteira Atual</div><div style="font-size:32px;font-weight:800;color:#111827;letter-spacing:-1px;line-height:1;margin-bottom:6px;">135</div><div style="font-size:11px;color:#6b7280;"><span style="color:#059669;font-weight:600;">Mar/2026</span> · excl. cancelados</div></div><div style="background:#fff;border:1px solid #e5e7eb;border-top:3px solid #dc2626;border-radius:14px;padding:20px 18px;"><div style="font-size:22px;margin-bottom:10px;">✖</div><div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.8px;color:#9ca3af;margin-bottom:8px;">Contratos Cancelados</div><div style="font-size:32px;font-weight:800;color:#111827;letter-spacing:-1px;line-height:1;margin-bottom:6px;">8</div><div style="font-size:11px;color:#6b7280;"><span style="color:#dc2626;font-weight:600;">5.6%</span> do total da carteira</div></div><div style="background:#fff;border:1px solid #e5e7eb;border-top:3px solid #059669;border-radius:14px;padding:20px 18px;"><div style="font-size:22px;margin-bottom:10px;">✅</div><div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.8px;color:#9ca3af;margin-bottom:8px;">Renovados</div><div style="font-size:32px;font-weight:800;color:#111827;letter-spacing:-1px;line-height:1;margin-bottom:6px;">9</div><div style="font-size:11px;color:#6b7280;"><span style="color:#059669;font-weight:600;">6.3%</span> já concluídos</div></div></div><div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:28px;"><div style="background:#fff;border:1px solid #e5e7eb;border-top:3px solid #2563eb;border-radius:14px;padding:20px 18px;"><div style="font-size:22px;margin-bottom:10px;">📅</div><div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.8px;color:#9ca3af;margin-bottom:8px;">Carteira Jan/2026</div><div style="font-size:32px;font-weight:800;color:#111827;letter-spacing:-1px;line-height:1;margin-bottom:6px;">R$ 7,07M</div><div style="font-size:11px;color:#6b7280;">Valor bruto · incl. cancelados · base 2026</div></div><div style="background:#fff;border:1px solid #e5e7eb;border-top:3px solid #2563eb;border-radius:14px;padding:20px 18px;"><div style="font-size:22px;margin-bottom:10px;">💰</div><div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.8px;color:#9ca3af;margin-bottom:8px;">Carteira Atual</div><div style="font-size:32px;font-weight:800;color:#111827;letter-spacing:-1px;line-height:1;margin-bottom:6px;">R$ 6,89M</div><div style="font-size:11px;color:#6b7280;">Valor líquido · 135 contratos ativos</div></div><div style="background:#fff;border:1px solid #e5e7eb;border-top:3px solid #dc2626;border-radius:14px;padding:20px 18px;"><div style="font-size:22px;margin-bottom:10px;">📉</div><div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.8px;color:#9ca3af;margin-bottom:8px;">Redução da Carteira</div><div style="font-size:32px;font-weight:800;color:#111827;letter-spacing:-1px;line-height:1;margin-bottom:6px;"><span style="color:#dc2626;">−R$ 178,9K</span></div><div style="font-size:11px;color:#6b7280;"><span style="color:#dc2626;font-weight:600;">−2.5%</span> vs início do ano</div></div><div style="background:#fff;border:1px solid #e5e7eb;border-top:3px solid #7c3aed;border-radius:14px;padding:20px 18px;"><div style="font-size:22px;margin-bottom:10px;">🎯</div><div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.8px;color:#9ca3af;margin-bottom:8px;">Ticket Médio</div><div style="font-size:32px;font-weight:800;color:#111827;letter-spacing:-1px;line-height:1;margin-bottom:6px;">R$ 51,0K</div><div style="font-size:11px;color:#6b7280;">Valor médio por contrato · R$ 51.033,04</div></div></div><div class="card" style="margin-bottom:20px;"><div class="card-header"><div><div class="card-title">Receita Recorrente Mensal (MRR)</div><div class="card-subtitle">Receita mensal recorrente por mês de vencimento · Jan–Dez/2026</div></div></div><div style="overflow-x:auto;"><table style="width:100%;border-collapse:collapse;"><thead><tr style="background:#f8fafc;"><th style="padding:10px 14px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#9ca3af;border-bottom:1px solid #e5e7eb;">Mês</th><th style="padding:10px 14px;text-align:center;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#9ca3af;border-bottom:1px solid #e5e7eb;">Contratos</th><th style="padding:10px 14px;text-align:right;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#7c3aed;border-bottom:1px solid #e5e7eb;">MRR (c/ cancelados)</th><th style="padding:10px 14px;text-align:right;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#059669;border-bottom:1px solid #e5e7eb;">MRR Líquido</th><th style="padding:10px 14px;text-align:right;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#dc2626;border-bottom:1px solid #e5e7eb;">Variação</th></tr></thead><tbody><tr style="background:#ffffff;border-bottom:1px solid #f3f4f6;"><td style="padding:10px 14px;font-weight:600;color:#111827;">Jan/2026</td><td style="padding:10px 14px;text-align:center;color:#6b7280;">12</td><td style="padding:10px 14px;text-align:right;color:#7c3aed;font-weight:600;">R$ 15.689,65</td><td style="padding:10px 14px;text-align:right;color:#059669;font-weight:600;">R$ 10.731,83</td><td style="padding:10px 14px;text-align:right;"><span style="color:#dc2626;font-weight:600;">▼ R$ 4.957,82</span></td></tr><tr style="background:#fafafa;border-bottom:1px solid #f3f4f6;"><td style="padding:10px 14px;font-weight:600;color:#111827;">Fev/2026</td><td style="padding:10px 14px;text-align:center;color:#6b7280;">8</td><td style="padding:10px 14px;text-align:right;color:#7c3aed;font-weight:600;">R$ 9.058,75</td><td style="padding:10px 14px;text-align:right;color:#059669;font-weight:600;">R$ 9.058,75</td><td style="padding:10px 14px;text-align:right;"><span style="color:#94a3b8;">—</span></td></tr><tr style="background:#ffffff;border-bottom:1px solid #f3f4f6;"><td style="padding:10px 14px;font-weight:600;color:#111827;">Mar/2026</td><td style="padding:10px 14px;text-align:center;color:#6b7280;">9</td><td style="padding:10px 14px;text-align:right;color:#7c3aed;font-weight:600;">R$ 64.003,25</td><td style="padding:10px 14px;text-align:right;color:#059669;font-weight:600;">R$ 64.003,25</td><td style="padding:10px 14px;text-align:right;"><span style="color:#94a3b8;">—</span></td></tr><tr style="background:#fafafa;border-bottom:1px solid #f3f4f6;"><td style="padding:10px 14px;font-weight:600;color:#111827;">Abr/2026</td><td style="padding:10px 14px;text-align:center;color:#6b7280;">5</td><td style="padding:10px 14px;text-align:right;color:#7c3aed;font-weight:600;">R$ 7.899,69</td><td style="padding:10px 14px;text-align:right;color:#059669;font-weight:600;">R$ 7.899,69</td><td style="padding:10px 14px;text-align:right;"><span style="color:#94a3b8;">—</span></td></tr><tr style="background:#ffffff;border-bottom:1px solid #f3f4f6;"><td style="padding:10px 14px;font-weight:600;color:#111827;">Mai/2026</td><td style="padding:10px 14px;text-align:center;color:#6b7280;">11</td><td style="padding:10px 14px;text-align:right;color:#7c3aed;font-weight:600;">R$ 19.303,90</td><td style="padding:10px 14px;text-align:right;color:#059669;font-weight:600;">R$ 19.303,90</td><td style="padding:10px 14px;text-align:right;"><span style="color:#94a3b8;">—</span></td></tr><tr style="background:#fafafa;border-bottom:1px solid #f3f4f6;"><td style="padding:10px 14px;font-weight:600;color:#111827;">Jun/2026</td><td style="padding:10px 14px;text-align:center;color:#6b7280;">5</td><td style="padding:10px 14px;text-align:right;color:#7c3aed;font-weight:600;">R$ 31.894,74</td><td style="padding:10px 14px;text-align:right;color:#059669;font-weight:600;">R$ 31.894,74</td><td style="padding:10px 14px;text-align:right;"><span style="color:#94a3b8;">—</span></td></tr><tr style="background:#ffffff;border-bottom:1px solid #f3f4f6;"><td style="padding:10px 14px;font-weight:600;color:#111827;">Jul/2026</td><td style="padding:10px 14px;text-align:center;color:#6b7280;">10</td><td style="padding:10px 14px;text-align:right;color:#7c3aed;font-weight:600;">R$ 44.356,75</td><td style="padding:10px 14px;text-align:right;color:#059669;font-weight:600;">R$ 43.764,31</td><td style="padding:10px 14px;text-align:right;"><span style="color:#dc2626;font-weight:600;">▼ R$ 592,44</span></td></tr><tr style="background:#fafafa;border-bottom:1px solid #f3f4f6;"><td style="padding:10px 14px;font-weight:600;color:#111827;">Ago/2026</td><td style="padding:10px 14px;text-align:center;color:#6b7280;">24</td><td style="padding:10px 14px;text-align:right;color:#7c3aed;font-weight:600;">R$ 86.188,86</td><td style="padding:10px 14px;text-align:right;color:#059669;font-weight:600;">R$ 84.026,60</td><td style="padding:10px 14px;text-align:right;"><span style="color:#dc2626;font-weight:600;">▼ R$ 2.162,26</span></td></tr><tr style="background:#ffffff;border-bottom:1px solid #f3f4f6;"><td style="padding:10px 14px;font-weight:600;color:#111827;">Set/2026</td><td style="padding:10px 14px;text-align:center;color:#6b7280;">15</td><td style="padding:10px 14px;text-align:right;color:#7c3aed;font-weight:600;">R$ 41.493,30</td><td style="padding:10px 14px;text-align:right;color:#059669;font-weight:600;">R$ 41.493,30</td><td style="padding:10px 14px;text-align:right;"><span style="color:#94a3b8;">—</span></td></tr><tr style="background:#fafafa;border-bottom:1px solid #f3f4f6;"><td style="padding:10px 14px;font-weight:600;color:#111827;">Out/2026</td><td style="padding:10px 14px;text-align:center;color:#6b7280;">18</td><td style="padding:10px 14px;text-align:right;color:#7c3aed;font-weight:600;">R$ 115.997,45</td><td style="padding:10px 14px;text-align:right;color:#059669;font-weight:600;">R$ 112.505,81</td><td style="padding:10px 14px;text-align:right;"><span style="color:#dc2626;font-weight:600;">▼ R$ 3.491,64</span></td></tr><tr style="background:#ffffff;border-bottom:1px solid #f3f4f6;"><td style="padding:10px 14px;font-weight:600;color:#111827;">Nov/2026</td><td style="padding:10px 14px;text-align:center;color:#6b7280;">7</td><td style="padding:10px 14px;text-align:right;color:#7c3aed;font-weight:600;">R$ 25.069,28</td><td style="padding:10px 14px;text-align:right;color:#059669;font-weight:600;">R$ 25.069,28</td><td style="padding:10px 14px;text-align:right;"><span style="color:#94a3b8;">—</span></td></tr><tr style="background:#fafafa;border-bottom:1px solid #f3f4f6;"><td style="padding:10px 14px;font-weight:600;color:#111827;">Dez/2026</td><td style="padding:10px 14px;text-align:center;color:#6b7280;">19</td><td style="padding:10px 14px;text-align:right;color:#7c3aed;font-weight:600;">R$ 56.906,26</td><td style="padding:10px 14px;text-align:right;color:#059669;font-weight:600;">R$ 54.664,16</td><td style="padding:10px 14px;text-align:right;"><span style="color:#dc2626;font-weight:600;">▼ R$ 2.242,10</span></td></tr><tr style="background:#f8fafc;border-top:2px solid #e5e7eb;"><td style="padding:11px 14px;font-weight:800;color:#111827;">TOTAL</td><td></td><td style="padding:11px 14px;text-align:right;font-weight:800;color:#7c3aed;">R$ 517.861,88</td><td style="padding:11px 14px;text-align:right;font-weight:800;color:#059669;">R$ 504.415,62</td><td style="padding:11px 14px;text-align:right;font-weight:800;color:#dc2626;">R$ -13.446,26 (-2.6%)</td></tr></tbody></table></div></div><div class="card" style="margin-bottom:20px;"><div class="card-header"><div><div class="card-title">Receita Anual Recorrente (ARR)</div><div class="card-subtitle">Receita anual recorrente por mês de vencimento · Jan–Dez/2026</div></div></div><div style="overflow-x:auto;"><table style="width:100%;border-collapse:collapse;"><thead><tr style="background:#f8fafc;"><th style="padding:10px 14px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#9ca3af;border-bottom:1px solid #e5e7eb;">Mês</th><th style="padding:10px 14px;text-align:center;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#9ca3af;border-bottom:1px solid #e5e7eb;">Contratos</th><th style="padding:10px 14px;text-align:right;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#0891b2;border-bottom:1px solid #e5e7eb;">ARR (c/ cancelados)</th><th style="padding:10px 14px;text-align:right;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#059669;border-bottom:1px solid #e5e7eb;">ARR Líquido</th><th style="padding:10px 14px;text-align:right;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#dc2626;border-bottom:1px solid #e5e7eb;">Variação</th></tr></thead><tbody><tr style="background:#f8fafc;border-top:2px solid #e5e7eb;"><td style="padding:11px 14px;font-weight:800;color:#111827;">TOTAL</td><td></td><td style="padding:11px 14px;text-align:right;font-weight:800;color:#0891b2;">R$ 1.126.691,44</td><td style="padding:11px 14px;text-align:right;font-weight:800;color:#059669;">R$ 1.109.120,06</td><td style="padding:11px 14px;text-align:right;font-weight:800;color:#dc2626;">R$ -17.571,38 (-1.6%)</td></tr></tbody></table></div></div><div class="card" style="margin-bottom:24px;"><div class="card-header"><div><div class="card-title">Impacto dos Cancelamentos</div><div class="card-subtitle">Comparativo: carteira original vs. carteira atual (sem cancelados)</div></div><span style="background:#fee2e2;color:#991b1b;font-size:11px;font-weight:700;padding:4px 12px;border-radius:99px;">8 cancelados</span></div><div style="overflow-x:auto;"><table style="width:100%;border-collapse:collapse;"><thead><tr style="background:#f8fafc;"><th style="padding:10px 14px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#9ca3af;border-bottom:1px solid #e5e7eb;">Indicador</th><th style="padding:10px 14px;text-align:right;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#9ca3af;border-bottom:1px solid #e5e7eb;">Carteira Original</th><th style="padding:10px 14px;text-align:right;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#059669;border-bottom:1px solid #e5e7eb;">Carteira Atual</th><th style="padding:10px 14px;text-align:right;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#dc2626;border-bottom:1px solid #e5e7eb;">Queda</th><th style="padding:10px 14px;text-align:right;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#dc2626;border-bottom:1px solid #e5e7eb;">%</th></tr></thead><tbody><tr style="border-bottom:1px solid #f3f4f6;"><td style="padding:11px 16px;font-weight:600;color:#111827;">Contratos</td><td style="padding:11px 16px;text-align:right;color:#6b7280;">R$ 143,00</td><td style="padding:11px 16px;text-align:right;color:#059669;font-weight:600;">R$ 135,00</td><td style="padding:11px 16px;text-align:right;color:#dc2626;font-weight:700;">▼ R$ 8,00</td><td style="padding:11px 16px;text-align:right;color:#dc2626;font-weight:700;">5.6%</td></tr><tr style="border-bottom:1px solid #f3f4f6;"><td style="padding:11px 16px;font-weight:600;color:#111827;">Valor Total</td><td style="padding:11px 16px;text-align:right;color:#6b7280;">R$ 7.068.386,59</td><td style="padding:11px 16px;text-align:right;color:#059669;font-weight:600;">R$ 6.889.460,09</td><td style="padding:11px 16px;text-align:right;color:#dc2626;font-weight:700;">▼ R$ 178.926,50</td><td style="padding:11px 16px;text-align:right;color:#dc2626;font-weight:700;">2.5%</td></tr><tr style="border-bottom:1px solid #f3f4f6;"><td style="padding:11px 16px;font-weight:600;color:#111827;">MRR</td><td style="padding:11px 16px;text-align:right;color:#6b7280;">R$ 517.861,88</td><td style="padding:11px 16px;text-align:right;color:#059669;font-weight:600;">R$ 504.415,62</td><td style="padding:11px 16px;text-align:right;color:#dc2626;font-weight:700;">▼ R$ 13.446,26</td><td style="padding:11px 16px;text-align:right;color:#dc2626;font-weight:700;">2.6%</td></tr><tr style="border-bottom:1px solid #f3f4f6;"><td style="padding:11px 16px;font-weight:600;color:#111827;">ARR</td><td style="padding:11px 16px;text-align:right;color:#6b7280;">R$ 1.126.691,44</td><td style="padding:11px 16px;text-align:right;color:#059669;font-weight:600;">R$ 1.109.120,06</td><td style="padding:11px 16px;text-align:right;color:#dc2626;font-weight:700;">▼ R$ 17.571,38</td><td style="padding:11px 16px;text-align:right;color:#dc2626;font-weight:700;">1.6%</td></tr></tbody></table></div></div><div class="card" style="margin-bottom:20px;border-left:4px solid #dc2626;padding-left:24px;"><div class="card-header"><div><div class="card-title" style="color:#dc2626;">⚠ Em Atraso de Renovação</div><div class="card-subtitle">Data Base vencida · pendentes · excl. Processo Financeiro e Renovados</div></div><div style="display:flex;gap:8px;flex-wrap:wrap;"><span style="background:#fee2e2;color:#991b1b;font-size:11px;font-weight:700;padding:4px 12px;border-radius:99px;">10 contratos</span><span style="background:#fff1f2;color:#dc2626;font-size:11px;font-weight:700;padding:4px 12px;border-radius:99px;border:1px solid #fecaca;">R$ 376.535,52 em risco</span></div></div><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:16px;"><div style="background:#fff5f5;border:1px solid #fecaca;border-radius:10px;padding:14px;text-align:center;"><div style="font-size:10px;color:#dc2626;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">Jan/2026</div><div style="font-size:28px;font-weight:800;color:#dc2626;">4</div><div style="font-size:11px;color:#64748b;">R$ 94.492,72</div></div><div style="background:#fff8f3;border:1px solid #fed7aa;border-radius:10px;padding:14px;text-align:center;"><div style="font-size:10px;color:#9a3412;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">Fev/2026</div><div style="font-size:28px;font-weight:800;color:#9a3412;">1</div><div style="font-size:11px;color:#64748b;">R$ 2.052,45</div></div><div style="background:#fefce8;border:1px solid #fde68a;border-radius:10px;padding:14px;text-align:center;"><div style="font-size:10px;color:#854d0e;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">Mar/2026</div><div style="font-size:28px;font-weight:800;color:#854d0e;">5</div><div style="font-size:11px;color:#64748b;">R$ 279.990,35</div></div></div><div style="overflow-x:auto;"><table style="width:100%;border-collapse:collapse;"><thead><tr style="background:#f8fafc;"><th style="padding:10px 14px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#dc2626;border-bottom:1px solid #e5e7eb;">NP</th><th style="padding:10px 14px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#dc2626;border-bottom:1px solid #e5e7eb;">Cliente</th><th style="padding:10px 14px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#dc2626;border-bottom:1px solid #e5e7eb;">Responsável</th><th style="padding:10px 14px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#dc2626;border-bottom:1px solid #e5e7eb;">Etapa</th><th style="padding:10px 14px;text-align:center;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#dc2626;border-bottom:1px solid #e5e7eb;">Vencimento</th><th style="padding:10px 14px;text-align:right;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#dc2626;border-bottom:1px solid #e5e7eb;">Valor Total</th></tr></thead><tbody><tr style="background:#ffffff;border-bottom:1px solid #f3f4f6;"><td style="padding:9px 12px;font-family:monospace;font-size:11px;font-weight:600;color:#dc2626;">NP-115077</td><td style="padding:9px 12px;font-size:12px;font-weight:600;color:#111827;">NETCENTER INFORMATICA</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Pedro</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Em análise pelo cliente</td><td style="padding:9px 12px;text-align:center;"><span style="background:#f1f5f9;color:#334155;font-size:11px;font-weight:700;padding:2px 10px;border-radius:99px;">jan/26</span></td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:700;color:#111827;">R$ 2.254,00</td></tr><tr style="background:#fafafa;border-bottom:1px solid #f3f4f6;"><td style="padding:9px 12px;font-family:monospace;font-size:11px;font-weight:600;color:#dc2626;">NP-115071</td><td style="padding:9px 12px;font-size:12px;font-weight:600;color:#111827;">VERZANI & SANDRINI LTDA</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Pedro</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Em análise pelo cliente</td><td style="padding:9px 12px;text-align:center;"><span style="background:#f1f5f9;color:#334155;font-size:11px;font-weight:700;padding:2px 10px;border-radius:99px;">jan/26</span></td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:700;color:#111827;"><span style="color:#d1d5db;">—</span></td></tr><tr style="background:#ffffff;border-bottom:1px solid #f3f4f6;"><td style="padding:9px 12px;font-family:monospace;font-size:11px;font-weight:600;color:#dc2626;">NP-115063</td><td style="padding:9px 12px;font-size:12px;font-weight:600;color:#111827;">Trt Da 4ª Região</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Pedro</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Em análise pelo cliente</td><td style="padding:9px 12px;text-align:center;"><span style="background:#f1f5f9;color:#334155;font-size:11px;font-weight:700;padding:2px 10px;border-radius:99px;">jan/26</span></td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:700;color:#111827;">R$ 78.738,72</td></tr><tr style="background:#fafafa;border-bottom:1px solid #f3f4f6;"><td style="padding:9px 12px;font-family:monospace;font-size:11px;font-weight:600;color:#dc2626;">NP-115057</td><td style="padding:9px 12px;font-size:12px;font-weight:600;color:#111827;">TECCLOUD SERVICOS DE TECNOLOGIA AHU LTDA</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Anderson</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Em análise pelo cliente</td><td style="padding:9px 12px;text-align:center;"><span style="background:#f1f5f9;color:#334155;font-size:11px;font-weight:700;padding:2px 10px;border-radius:99px;">jan/26</span></td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:700;color:#111827;">R$ 13.500,00</td></tr><tr style="background:#ffffff;border-bottom:1px solid #f3f4f6;"><td style="padding:9px 12px;font-family:monospace;font-size:11px;font-weight:600;color:#dc2626;">NP-115007</td><td style="padding:9px 12px;font-size:12px;font-weight:600;color:#111827;">KICALDO</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Anderson</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Análise de Requisição</td><td style="padding:9px 12px;text-align:center;"><span style="background:#f1f5f9;color:#334155;font-size:11px;font-weight:700;padding:2px 10px;border-radius:99px;">fev/26</span></td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:700;color:#111827;">R$ 2.052,45</td></tr><tr style="background:#fafafa;border-bottom:1px solid #f3f4f6;"><td style="padding:9px 12px;font-family:monospace;font-size:11px;font-weight:600;color:#dc2626;">NP-115044</td><td style="padding:9px 12px;font-size:12px;font-weight:600;color:#111827;">SCGAS - COMPANHIA DE GAS DE SANTA CATARINA</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Pedro</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Análise de Requisição</td><td style="padding:9px 12px;text-align:center;"><span style="background:#f1f5f9;color:#334155;font-size:11px;font-weight:700;padding:2px 10px;border-radius:99px;">mar/26</span></td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:700;color:#111827;">R$ 6.986,00</td></tr><tr style="background:#ffffff;border-bottom:1px solid #f3f4f6;"><td style="padding:9px 12px;font-family:monospace;font-size:11px;font-weight:600;color:#dc2626;">NP-115042</td><td style="padding:9px 12px;font-size:12px;font-weight:600;color:#111827;">Sapore</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Talita</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Análise de Requisição</td><td style="padding:9px 12px;text-align:center;"><span style="background:#f1f5f9;color:#334155;font-size:11px;font-weight:700;padding:2px 10px;border-radius:99px;">mar/26</span></td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:700;color:#111827;">R$ 170.362,80</td></tr><tr style="background:#fafafa;border-bottom:1px solid #f3f4f6;"><td style="padding:9px 12px;font-family:monospace;font-size:11px;font-weight:600;color:#dc2626;">NP-115040</td><td style="padding:9px 12px;font-size:12px;font-weight:600;color:#111827;">SANTA CASA DE MISERICÓRDIA DE PORTO ALEGRE</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Anderson</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Análise de Requisição</td><td style="padding:9px 12px;text-align:center;"><span style="background:#f1f5f9;color:#334155;font-size:11px;font-weight:700;padding:2px 10px;border-radius:99px;">mar/26</span></td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:700;color:#111827;">R$ 3.467,55</td></tr><tr style="background:#ffffff;border-bottom:1px solid #f3f4f6;"><td style="padding:9px 12px;font-family:monospace;font-size:11px;font-weight:600;color:#dc2626;">NP-114982</td><td style="padding:9px 12px;font-size:12px;font-weight:600;color:#111827;">GGT SOLUÇÃO TECNOLOGICAS LTDA (ANGOLAPREV)</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Pedro</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Em análise pelo cliente</td><td style="padding:9px 12px;text-align:center;"><span style="background:#f1f5f9;color:#334155;font-size:11px;font-weight:700;padding:2px 10px;border-radius:99px;">mar/26</span></td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:700;color:#111827;">R$ 54.090,00</td></tr><tr style="background:#fafafa;border-bottom:1px solid #f3f4f6;"><td style="padding:9px 12px;font-family:monospace;font-size:11px;font-weight:600;color:#dc2626;">NP-114944</td><td style="padding:9px 12px;font-size:12px;font-weight:600;color:#111827;">ASSOCIACAO HOSPITALAR MOINHOS DE VENTO</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Pedro</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Em análise pelo cliente</td><td style="padding:9px 12px;text-align:center;"><span style="background:#f1f5f9;color:#334155;font-size:11px;font-weight:700;padding:2px 10px;border-radius:99px;">mar/26</span></td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:700;color:#111827;">R$ 45.084,00</td></tr></tbody></table></div></div><div class="card" style="margin-bottom:20px;border-left:4px solid #7c3aed;padding-left:24px;"><div class="card-header"><div><div class="card-title" style="color:#7c3aed;">🔄 Em Processo Financeiro</div><div class="card-subtitle">Contrato em fase de aprovação financeira</div></div><div><span style="background:#f5f3ff;color:#5b21b6;font-size:11px;font-weight:700;padding:4px 12px;border-radius:99px;">7 contratos</span></div></div><div style="overflow-x:auto;"><table style="width:100%;border-collapse:collapse;"><thead><tr style="background:#f8fafc;"><th style="padding:10px 14px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#7c3aed;border-bottom:1px solid #e5e7eb;">NP</th><th style="padding:10px 14px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#7c3aed;border-bottom:1px solid #e5e7eb;">Cliente</th><th style="padding:10px 14px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#7c3aed;border-bottom:1px solid #e5e7eb;">Responsável</th><th style="padding:10px 14px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#7c3aed;border-bottom:1px solid #e5e7eb;">Etapa</th><th style="padding:10px 14px;text-align:center;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#7c3aed;border-bottom:1px solid #e5e7eb;">Vencimento</th><th style="padding:10px 14px;text-align:right;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#7c3aed;border-bottom:1px solid #e5e7eb;">Valor Total</th></tr></thead><tbody><tr style="background:#ffffff;border-bottom:1px solid #f3f4f6;"><td style="padding:9px 12px;font-family:monospace;font-size:11px;font-weight:600;color:#7c3aed;">NP-115076</td><td style="padding:9px 12px;font-size:12px;font-weight:600;color:#111827;">FORNO DE MINAS</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Denise</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Processo Financeiro</td><td style="padding:9px 12px;text-align:center;"><span style="background:#f1f5f9;color:#334155;font-size:11px;font-weight:700;padding:2px 10px;border-radius:99px;">jan/26</span></td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:700;color:#111827;">R$ 777,00</td></tr><tr style="background:#fafafa;border-bottom:1px solid #f3f4f6;"><td style="padding:9px 12px;font-family:monospace;font-size:11px;font-weight:600;color:#7c3aed;">NP-115066</td><td style="padding:9px 12px;font-size:12px;font-weight:600;color:#111827;">UNIMED VALES DO TAQUARI E RIO PARDO LTDA</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Denise</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Processo Financeiro</td><td style="padding:9px 12px;text-align:center;"><span style="background:#f1f5f9;color:#334155;font-size:11px;font-weight:700;padding:2px 10px;border-radius:99px;">fev/26</span></td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:700;color:#111827;">R$ 38.120,85</td></tr><tr style="background:#ffffff;border-bottom:1px solid #f3f4f6;"><td style="padding:9px 12px;font-family:monospace;font-size:11px;font-weight:600;color:#7c3aed;">NP-115065</td><td style="padding:9px 12px;font-size:12px;font-weight:600;color:#111827;">UNIMED PORTO ALEGRE</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Denise</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Processo Financeiro</td><td style="padding:9px 12px;text-align:center;"><span style="background:#f1f5f9;color:#334155;font-size:11px;font-weight:700;padding:2px 10px;border-radius:99px;">mar/26</span></td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:700;color:#111827;">R$ 127.953,24</td></tr><tr style="background:#fafafa;border-bottom:1px solid #f3f4f6;"><td style="padding:9px 12px;font-family:monospace;font-size:11px;font-weight:600;color:#7c3aed;">NP-115022</td><td style="padding:9px 12px;font-size:12px;font-weight:600;color:#111827;">OCYAN</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Denise</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Processo Financeiro</td><td style="padding:9px 12px;text-align:center;"><span style="background:#f1f5f9;color:#334155;font-size:11px;font-weight:700;padding:2px 10px;border-radius:99px;">jan/26</span></td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:700;color:#111827;">R$ 110.119,68</td></tr><tr style="background:#ffffff;border-bottom:1px solid #f3f4f6;"><td style="padding:9px 12px;font-family:monospace;font-size:11px;font-weight:600;color:#7c3aed;">NP-114998</td><td style="padding:9px 12px;font-size:12px;font-weight:600;color:#111827;">INCORP TECHNOLOGY INFORMATICA LTDA - EPP</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Denise</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Processo Financeiro</td><td style="padding:9px 12px;text-align:center;"><span style="background:#f1f5f9;color:#334155;font-size:11px;font-weight:700;padding:2px 10px;border-radius:99px;">fev/26</span></td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:700;color:#111827;">R$ 6.388,02</td></tr><tr style="background:#fafafa;border-bottom:1px solid #f3f4f6;"><td style="padding:9px 12px;font-family:monospace;font-size:11px;font-weight:600;color:#7c3aed;">NP-114968</td><td style="padding:9px 12px;font-size:12px;font-weight:600;color:#111827;">COTRIBÁ</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Denise</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Processo Financeiro</td><td style="padding:9px 12px;text-align:center;"><span style="background:#f1f5f9;color:#334155;font-size:11px;font-weight:700;padding:2px 10px;border-radius:99px;">mar/26</span></td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:700;color:#111827;">R$ 7.117,32</td></tr><tr style="background:#ffffff;border-bottom:1px solid #f3f4f6;"><td style="padding:9px 12px;font-family:monospace;font-size:11px;font-weight:600;color:#7c3aed;">NP-114949</td><td style="padding:9px 12px;font-size:12px;font-weight:600;color:#111827;">AUXILIADORA PREDIAL</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Denise</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Processo Financeiro</td><td style="padding:9px 12px;text-align:center;"><span style="background:#f1f5f9;color:#334155;font-size:11px;font-weight:700;padding:2px 10px;border-radius:99px;">mar/26</span></td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:700;color:#111827;">R$ 412.288,08</td></tr></tbody></table></div></div><div class="card" style="margin-bottom:20px;border-left:4px solid #9ca3af;padding-left:24px;"><div class="card-header"><div><div class="card-title" style="color:#374151;">❌ Cancelados no Período</div><div class="card-subtitle">Contratos encerrados na base atual</div></div><div style="display:flex;gap:8px;"><span style="background:#f9fafb;color:#374151;font-size:11px;font-weight:700;padding:4px 12px;border-radius:99px;">8 contratos</span><span style="background:#f1f5f9;color:#6b7280;font-size:11px;font-weight:700;padding:4px 12px;border-radius:99px;border:1px solid #e5e7eb;">R$ 178.926,50</span></div></div><div style="overflow-x:auto;"><table style="width:100%;border-collapse:collapse;"><thead><tr style="background:#f8fafc;"><th style="padding:10px 14px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#9ca3af;border-bottom:1px solid #e5e7eb;">NP</th><th style="padding:10px 14px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#9ca3af;border-bottom:1px solid #e5e7eb;">Cliente</th><th style="padding:10px 14px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#9ca3af;border-bottom:1px solid #e5e7eb;">Responsável</th><th style="padding:10px 14px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#9ca3af;border-bottom:1px solid #e5e7eb;">Etapa</th><th style="padding:10px 14px;text-align:center;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#9ca3af;border-bottom:1px solid #e5e7eb;">Vencimento</th><th style="padding:10px 14px;text-align:right;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#9ca3af;border-bottom:1px solid #e5e7eb;">Valor Total</th></tr></thead><tbody><tr style="background:#ffffff;border-bottom:1px solid #f3f4f6;"><td style="padding:9px 12px;font-family:monospace;font-size:11px;font-weight:600;color:#6b7280;">NP-116093</td><td style="padding:9px 12px;font-size:12px;font-weight:600;color:#111827;">SYNERGIE SISTEMAS LTDA</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Anderson</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Contrato Cancelado</td><td style="padding:9px 12px;text-align:center;"><span style="background:#f1f5f9;color:#334155;font-size:11px;font-weight:700;padding:2px 10px;border-radius:99px;">out/26</span></td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:700;color:#111827;">R$ 41.899,68</td></tr><tr style="background:#fafafa;border-bottom:1px solid #f3f4f6;"><td style="padding:9px 12px;font-family:monospace;font-size:11px;font-weight:600;color:#6b7280;">NP-116076</td><td style="padding:9px 12px;font-size:12px;font-weight:600;color:#111827;">NOURYON PULP AND PERFORMANCE INDUSTRIA QUIMICA LTDA</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Pedro</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Contrato Cancelado</td><td style="padding:9px 12px;text-align:center;"><span style="background:#f1f5f9;color:#334155;font-size:11px;font-weight:700;padding:2px 10px;border-radius:99px;">jan/26</span></td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:700;color:#111827;">R$ 30.500,16</td></tr><tr style="background:#ffffff;border-bottom:1px solid #f3f4f6;"><td style="padding:9px 12px;font-family:monospace;font-size:11px;font-weight:600;color:#6b7280;">NP-116075</td><td style="padding:9px 12px;font-size:12px;font-weight:600;color:#111827;">ASSOCIAÇÃO ANTÔNIO VEIRA JESUÍTA DO BRASIL (ASAV)</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Anderson</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Contrato Cancelado</td><td style="padding:9px 12px;text-align:center;"><span style="background:#f1f5f9;color:#334155;font-size:11px;font-weight:700;padding:2px 10px;border-radius:99px;">jan/26</span></td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:700;color:#111827;">R$ 28.993,68</td></tr><tr style="background:#fafafa;border-bottom:1px solid #f3f4f6;"><td style="padding:9px 12px;font-family:monospace;font-size:11px;font-weight:600;color:#6b7280;">NP-115004</td><td style="padding:9px 12px;font-size:12px;font-weight:600;color:#111827;">J&M SOLUÇÕES EM TECNOLOGIA EIRELI (AlliedIT)</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Pedro</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Contrato Cancelado</td><td style="padding:9px 12px;text-align:center;"><span style="background:#f1f5f9;color:#334155;font-size:11px;font-weight:700;padding:2px 10px;border-radius:99px;">ago/26</span></td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:700;color:#111827;">R$ 3.189,60</td></tr><tr style="background:#ffffff;border-bottom:1px solid #f3f4f6;"><td style="padding:9px 12px;font-family:monospace;font-size:11px;font-weight:600;color:#6b7280;">NP-114990</td><td style="padding:9px 12px;font-size:12px;font-weight:600;color:#111827;">GTFOODS GROUP</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Anderson</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Contrato Cancelado</td><td style="padding:9px 12px;text-align:center;"><span style="background:#f1f5f9;color:#334155;font-size:11px;font-weight:700;padding:2px 10px;border-radius:99px;">mar/26</span></td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:700;color:#111827;">R$ 14.240,00</td></tr><tr style="background:#fafafa;border-bottom:1px solid #f3f4f6;"><td style="padding:9px 12px;font-family:monospace;font-size:11px;font-weight:600;color:#6b7280;">NP-114988</td><td style="padding:9px 12px;font-size:12px;font-weight:600;color:#111827;">Grupo Orcali</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Anderson</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Contrato Cancelado</td><td style="padding:9px 12px;text-align:center;"><span style="background:#f1f5f9;color:#334155;font-size:11px;font-weight:700;padding:2px 10px;border-radius:99px;">ago/26</span></td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:700;color:#111827;">R$ 22.757,52</td></tr><tr style="background:#ffffff;border-bottom:1px solid #f3f4f6;"><td style="padding:9px 12px;font-family:monospace;font-size:11px;font-weight:600;color:#6b7280;">NP-114962</td><td style="padding:9px 12px;font-size:12px;font-weight:600;color:#111827;">CLAMPER</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Anderson</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Contrato Cancelado</td><td style="padding:9px 12px;text-align:center;"><span style="background:#f1f5f9;color:#334155;font-size:11px;font-weight:700;padding:2px 10px;border-radius:99px;">jul/26</span></td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:700;color:#111827;">R$ 7.109,28</td></tr><tr style="background:#fafafa;border-bottom:1px solid #f3f4f6;"><td style="padding:9px 12px;font-family:monospace;font-size:11px;font-weight:600;color:#6b7280;">NP-114797</td><td style="padding:9px 12px;font-size:12px;font-weight:600;color:#111827;">RNI - Rodobens Negócios Imobiliários</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Talita</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Contrato Cancelado</td><td style="padding:9px 12px;text-align:center;"><span style="background:#f1f5f9;color:#334155;font-size:11px;font-weight:700;padding:2px 10px;border-radius:99px;">dez/26</span></td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:700;color:#111827;">R$ 30.236,58</td></tr></tbody></table></div></div><div class="card" style="margin-bottom:20px;border-left:4px solid #22c55e;padding-left:24px;"><div class="card-header"><div><div class="card-title" style="color:#059669;">✅ Renovados</div><div class="card-subtitle">Contratos renovados com sucesso no período</div></div><div><span style="background:#dcfce7;color:#166534;font-size:11px;font-weight:700;padding:4px 12px;border-radius:99px;">9 contratos</span></div></div><div style="overflow-x:auto;"><table style="width:100%;border-collapse:collapse;"><thead><tr style="background:#f8fafc;"><th style="padding:10px 14px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#059669;border-bottom:1px solid #e5e7eb;">NP</th><th style="padding:10px 14px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#059669;border-bottom:1px solid #e5e7eb;">Cliente</th><th style="padding:10px 14px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#059669;border-bottom:1px solid #e5e7eb;">Responsável</th><th style="padding:10px 14px;text-align:center;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#059669;border-bottom:1px solid #e5e7eb;">Vencimento</th><th style="padding:10px 14px;text-align:right;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#059669;border-bottom:1px solid #e5e7eb;">Valor Total</th><th style="padding:10px 14px;text-align:right;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#7c3aed;border-bottom:1px solid #e5e7eb;">MRR</th><th style="padding:10px 14px;text-align:right;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#0891b2;border-bottom:1px solid #e5e7eb;">ARR</th></tr></thead><tbody><tr style="background:#ffffff;border-bottom:1px solid #f3f4f6;"><td style="padding:9px 12px;font-family:monospace;font-size:11px;font-weight:600;color:#059669;">NP-115073</td><td style="padding:9px 12px;font-size:12px;font-weight:600;color:#111827;">WAY DATA SOLUTION S/A</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Denise</td><td style="padding:9px 12px;text-align:center;"><span style="background:#f1f5f9;color:#334155;font-size:11px;font-weight:700;padding:2px 10px;border-radius:99px;">jan/26</span></td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:700;color:#111827;">R$ 2.930,46</td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:600;color:#7c3aed;"><span style="color:#d1d5db;">—</span></td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:600;color:#0891b2;">R$ 2.930,46</td></tr><tr style="background:#fafafa;border-bottom:1px solid #f3f4f6;"><td style="padding:9px 12px;font-family:monospace;font-size:11px;font-weight:600;color:#059669;">NP-115068</td><td style="padding:9px 12px;font-size:12px;font-weight:600;color:#111827;">USINA SANTA ISABEL</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Denise</td><td style="padding:9px 12px;text-align:center;"><span style="background:#f1f5f9;color:#334155;font-size:11px;font-weight:700;padding:2px 10px;border-radius:99px;">fev/26</span></td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:700;color:#111827;">R$ 17.220,00</td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:600;color:#7c3aed;">R$ 1.435,00</td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:600;color:#0891b2;"><span style="color:#d1d5db;">—</span></td></tr><tr style="background:#ffffff;border-bottom:1px solid #f3f4f6;"><td style="padding:9px 12px;font-family:monospace;font-size:11px;font-weight:600;color:#059669;">NP-115048</td><td style="padding:9px 12px;font-size:12px;font-weight:600;color:#111827;">SEPROL</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Denise</td><td style="padding:9px 12px;text-align:center;"><span style="background:#f1f5f9;color:#334155;font-size:11px;font-weight:700;padding:2px 10px;border-radius:99px;">jan/26</span></td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:700;color:#111827;">R$ 8.955,24</td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:600;color:#7c3aed;">R$ 746,27</td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:600;color:#0891b2;"><span style="color:#d1d5db;">—</span></td></tr><tr style="background:#fafafa;border-bottom:1px solid #f3f4f6;"><td style="padding:9px 12px;font-family:monospace;font-size:11px;font-weight:600;color:#059669;">NP-115043</td><td style="padding:9px 12px;font-size:12px;font-weight:600;color:#111827;">SAQUE PAGUE</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Pedro</td><td style="padding:9px 12px;text-align:center;"><span style="background:#f1f5f9;color:#334155;font-size:11px;font-weight:700;padding:2px 10px;border-radius:99px;">fev/26</span></td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:700;color:#111827;">R$ 60.982,80</td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:600;color:#7c3aed;">R$ 5.081,90</td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:600;color:#0891b2;"><span style="color:#d1d5db;">—</span></td></tr><tr style="background:#ffffff;border-bottom:1px solid #f3f4f6;"><td style="padding:9px 12px;font-family:monospace;font-size:11px;font-weight:600;color:#059669;">NP-115037</td><td style="padding:9px 12px;font-size:12px;font-weight:600;color:#111827;">SABEMI SEGURADORA</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Denise</td><td style="padding:9px 12px;text-align:center;"><span style="background:#f1f5f9;color:#334155;font-size:11px;font-weight:700;padding:2px 10px;border-radius:99px;">fev/26</span></td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:700;color:#111827;">R$ 23.085,60</td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:600;color:#7c3aed;">R$ 1.923,80</td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:600;color:#0891b2;"><span style="color:#d1d5db;">—</span></td></tr><tr style="background:#fafafa;border-bottom:1px solid #f3f4f6;"><td style="padding:9px 12px;font-family:monospace;font-size:11px;font-weight:600;color:#059669;">NP-115027</td><td style="padding:9px 12px;font-size:12px;font-weight:600;color:#111827;">PLANSERVI ENGENHARIA</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Denise</td><td style="padding:9px 12px;text-align:center;"><span style="background:#f1f5f9;color:#334155;font-size:11px;font-weight:700;padding:2px 10px;border-radius:99px;">fev/26</span></td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:700;color:#111827;">R$ 4.909,09</td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:600;color:#7c3aed;"><span style="color:#d1d5db;">—</span></td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:600;color:#0891b2;">R$ 4.909,09</td></tr><tr style="background:#ffffff;border-bottom:1px solid #f3f4f6;"><td style="padding:9px 12px;font-family:monospace;font-size:11px;font-weight:600;color:#059669;">NP-115002</td><td style="padding:9px 12px;font-size:12px;font-weight:600;color:#111827;">INTERSISTEMAS INFORMATICA LTDA - NETLOGIC</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Denise</td><td style="padding:9px 12px;text-align:center;"><span style="background:#f1f5f9;color:#334155;font-size:11px;font-weight:700;padding:2px 10px;border-radius:99px;">fev/26</span></td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:700;color:#111827;">R$ 7.416,60</td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:600;color:#7c3aed;">R$ 618,05</td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:600;color:#0891b2;"><span style="color:#d1d5db;">—</span></td></tr><tr style="background:#fafafa;border-bottom:1px solid #f3f4f6;"><td style="padding:9px 12px;font-family:monospace;font-size:11px;font-weight:600;color:#059669;">NP-115001</td><td style="padding:9px 12px;font-size:12px;font-weight:600;color:#111827;">INTERCITY</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Denise</td><td style="padding:9px 12px;text-align:center;"><span style="background:#f1f5f9;color:#334155;font-size:11px;font-weight:700;padding:2px 10px;border-radius:99px;">jan/26</span></td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:700;color:#111827;">R$ 41.088,00</td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:600;color:#7c3aed;">R$ 3.424,00</td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:600;color:#0891b2;"><span style="color:#d1d5db;">—</span></td></tr><tr style="background:#ffffff;border-bottom:1px solid #f3f4f6;"><td style="padding:9px 12px;font-family:monospace;font-size:11px;font-weight:600;color:#059669;">NP-114956</td><td style="padding:9px 12px;font-size:12px;font-weight:600;color:#111827;">CALÇADOS BEIRA RIO</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Denise</td><td style="padding:9px 12px;text-align:center;"><span style="background:#f1f5f9;color:#334155;font-size:11px;font-weight:700;padding:2px 10px;border-radius:99px;">jan/26</span></td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:700;color:#111827;">R$ 9.062,78</td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:600;color:#7c3aed;"><span style="color:#d1d5db;">—</span></td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:600;color:#0891b2;">R$ 9.062,78</td></tr></tbody></table></div><div style="background:#f0fdf4;border-top:2px solid #bbf7d0;padding:10px 16px;display:flex;justify-content:flex-end;gap:24px;font-size:12px;font-weight:700;"><span style="color:#6b7280;">Total VT <strong style="color:#111827;margin-left:6px;">R$ 175.650,57</strong></span><span style="color:#7c3aed;">MRR <strong style="margin-left:6px;">R$ 13.229,02</strong></span><span style="color:#0891b2;">ARR <strong style="margin-left:6px;">R$ 16.902,33</strong></span></div></div>
</div>
</div> <!-- fim tab-gestao -->




<div id="tab-wtp" class="tab-panel">
<div class="page">

  <header>
    <div class="header-left">
      <div class="header-eyebrow">Where to Play · Playing to Win</div>
      <h1 class="header-title">Análise de<br><span style="color:var(--accent4);">Segmentos</span></h1>
    </div>
    <div class="header-right">
      <div class="header-badge"><span class="dot" style="background:var(--accent4);"></span>Pipeline + Carteira · 155 proj · 135 contr</div>
    </div>
  </header>

<!-- Intro metodologia -->
  <div style="background:#fff;border:1px solid #e5e7eb;border-radius:16px;padding:28px 32px;margin-bottom:32px;">
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


  <!-- Insights estratégicos -->
  <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:var(--muted);margin:32px 0 14px;">📌 Insights Estratégicos</div>
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:32px;">

    <!-- 1. Maior MRR -->
    <div style="background:var(--surface);border:1px solid var(--border);border-top:3px solid #059669;border-radius:12px;padding:20px 18px;">
      <div style="font-size:22px;margin-bottom:10px;">💰</div>
      <div style="font-size:12px;font-weight:700;color:var(--text);margin-bottom:6px;">Maior MRR na carteira</div>
      <div style="font-size:12px;color:var(--muted);line-height:1.6;">
        <strong style="color:#059669;">Saúde</strong> lidera com <strong>R$ 119K</strong>/mês em receita recorrente
        (14 contratos ativos) — maior base financeira entre todos os segmentos.
      </div>
    </div>

    <!-- 2. Melhor conversão -->
    <div style="background:var(--surface);border:1px solid var(--border);border-top:3px solid #0d9488;border-radius:12px;padding:20px 18px;">
      <div style="font-size:22px;margin-bottom:10px;">🎯</div>
      <div style="font-size:12px;font-weight:700;color:var(--text);margin-bottom:6px;">Melhor conversão no pipeline</div>
      <div style="font-size:12px;color:var(--muted);line-height:1.6;">
        <strong style="color:#0d9488;">Meio Ambiente</strong> converte <strong>20%</strong> dos projetos ativos
        em negócios fechados — maior taxa de sucesso comercial da Qualitor atualmente.
      </div>
    </div>

    <!-- 3. Potencial de expansão -->
    <div style="background:var(--surface);border:1px solid var(--border);border-top:3px solid #7c3aed;border-radius:12px;padding:20px 18px;">
      <div style="font-size:22px;margin-bottom:10px;">🔓</div>
      <div style="font-size:12px;font-weight:700;color:var(--text);margin-bottom:6px;">Clientes exclusivos da carteira</div>
      <div style="font-size:12px;color:var(--muted);line-height:1.6;">
        <strong style="color:#7c3aed;">Tecnologia & TI</strong> tem <strong>14 clientes</strong> só na carteira
        sem projetos ativos — oportunidade imediata de cross-sell e expansão de receita.
      </div>
    </div>

    <!-- 4. Base instalada sem expansão -->
    <div style="background:var(--surface);border:1px solid var(--border);border-top:3px solid #dc2626;border-radius:12px;padding:20px 18px;">
      <div style="font-size:22px;margin-bottom:10px;">⚡</div>
      <div style="font-size:12px;font-weight:700;color:var(--text);margin-bottom:6px;">Base instalada sem expansão</div>
      <div style="font-size:12px;color:var(--muted);line-height:1.6;">
        <strong>Saúde</strong>, <strong>Agronegócio</strong> e <strong>Educação</strong> têm receita recorrente
        ativa mas <strong style="color:#dc2626;">0% de conversão</strong> no pipeline —
        base instalada que não está sendo explorada comercialmente.
      </div>
    </div>

  </div>

<div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:var(--muted);margin:32px 0 14px;">Ranking por segmento · Pipeline × Carteira</div><div class="card">
  <div class="card-header"><div><div class="card-title">Onde estamos jogando hoje?</div><div class="card-subtitle">Clique em qualquer linha para ver os projetos e contratos · Conv. = Fechados ÷ Ativos · Só Carteira = clientes sem projeto ativo</div></div></div>
  <div style="overflow-x:auto;"><table style="width:100%;border-collapse:collapse;">
    <thead><tr style="background:var(--surface2);"><th style="padding:11px 16px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:var(--muted);border-bottom:1px solid var(--border);">Segmento</th><th style="padding:11px 16px;text-align:center;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:var(--muted);border-bottom:1px solid var(--border);">Pipeline</th><th style="padding:11px 16px;text-align:center;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#059669;border-bottom:1px solid var(--border);">Carteira</th><th style="padding:11px 16px;text-align:right;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#059669;border-bottom:1px solid var(--border);">MRR Carteira</th><th style="padding:11px 16px;text-align:center;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#2563eb;border-bottom:1px solid var(--border);">Conv.</th><th style="padding:11px 16px;text-align:center;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#7c3aed;border-bottom:1px solid var(--border);">Só Carteira</th><th style="padding:11px 16px;text-align:center;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:var(--muted);border-bottom:1px solid var(--border);">Recomendação</th></tr></thead>
    <tbody><tr class="clickable-row" onclick="wtpDrilldown('Tecnologia & TI')" style="background:var(--surface);border-bottom:1px solid var(--border);"><td style="padding:11px 16px;"><div style="display:flex;align-items:center;gap:10px;"><span style="font-size:18px;">💻</span><div><div style="font-size:13px;font-weight:600;color:var(--text);">Tecnologia & TI</div><div style="font-size:11px;color:var(--muted);">40 clientes</div></div></div></td><td style="padding:11px 16px;text-align:center;"><span style="background:#2563eb18;color:#2563eb;font-size:12px;font-weight:700;padding:3px 12px;border-radius:99px;">33</span></td><td style="padding:11px 16px;text-align:center;"><span style="background:#f0fdf4;color:#059669;font-size:12px;font-weight:700;padding:3px 12px;border-radius:99px;">30</span></td><td style="padding:11px 16px;text-align:right;font-size:13px;font-weight:600;color:#059669;">R$ 67K</td><td style="padding:11px 16px;text-align:center;font-size:13px;font-weight:700;color:#d97706;">10.8%</td><td style="padding:11px 16px;text-align:center;"><span style="background:#f5f3ff;color:#7c3aed;font-size:12px;font-weight:700;padding:3px 10px;border-radius:99px;">14</span></td><td style="padding:11px 16px;text-align:center;"><span style="background:#dcfce7;color:#166534;font-size:11px;font-weight:700;padding:3px 12px;border-radius:99px;">Jogar</span></td></tr>
<tr class="clickable-row" onclick="wtpDrilldown('Serviços & Infraestrutura')" style="background:var(--surface2);border-bottom:1px solid var(--border);"><td style="padding:11px 16px;"><div style="display:flex;align-items:center;gap:10px;"><span style="font-size:18px;">🏗️</span><div><div style="font-size:13px;font-weight:600;color:var(--text);">Serviços & Infraestrutura</div><div style="font-size:11px;color:var(--muted);">25 clientes</div></div></div></td><td style="padding:11px 16px;text-align:center;"><span style="background:#7c3aed18;color:#7c3aed;font-size:12px;font-weight:700;padding:3px 12px;border-radius:99px;">17</span></td><td style="padding:11px 16px;text-align:center;"><span style="background:#f0fdf4;color:#059669;font-size:12px;font-weight:700;padding:3px 12px;border-radius:99px;">21</span></td><td style="padding:11px 16px;text-align:right;font-size:13px;font-weight:600;color:#059669;">R$ 71K</td><td style="padding:11px 16px;text-align:center;font-size:13px;font-weight:700;color:#059669;">15.0%</td><td style="padding:11px 16px;text-align:center;"><span style="background:#f5f3ff;color:#7c3aed;font-size:12px;font-weight:700;padding:3px 10px;border-radius:99px;">14</span></td><td style="padding:11px 16px;text-align:center;"><span style="background:#dcfce7;color:#166534;font-size:11px;font-weight:700;padding:3px 12px;border-radius:99px;">Jogar</span></td></tr>
<tr class="clickable-row" onclick="wtpDrilldown('Saúde')" style="background:var(--surface);border-bottom:1px solid var(--border);"><td style="padding:11px 16px;"><div style="display:flex;align-items:center;gap:10px;"><span style="font-size:18px;">🏥</span><div><div style="font-size:13px;font-weight:600;color:var(--text);">Saúde</div><div style="font-size:11px;color:var(--muted);">18 clientes</div></div></div></td><td style="padding:11px 16px;text-align:center;"><span style="background:#05966918;color:#059669;font-size:12px;font-weight:700;padding:3px 12px;border-radius:99px;">20</span></td><td style="padding:11px 16px;text-align:center;"><span style="background:#f0fdf4;color:#059669;font-size:12px;font-weight:700;padding:3px 12px;border-radius:99px;">14</span></td><td style="padding:11px 16px;text-align:right;font-size:13px;font-weight:600;color:#059669;">R$ 119K</td><td style="padding:11px 16px;text-align:center;font-size:13px;font-weight:700;color:#dc2626;">0.0%</td><td style="padding:11px 16px;text-align:center;"><span style="background:#f5f3ff;color:#7c3aed;font-size:12px;font-weight:700;padding:3px 10px;border-radius:99px;">8</span></td><td style="padding:11px 16px;text-align:center;"><span style="background:#fef3c7;color:#92400e;font-size:11px;font-weight:700;padding:3px 12px;border-radius:99px;">Explorar</span></td></tr>
<tr class="clickable-row" onclick="wtpDrilldown('Indústria')" style="background:var(--surface2);border-bottom:1px solid var(--border);"><td style="padding:11px 16px;"><div style="display:flex;align-items:center;gap:10px;"><span style="font-size:18px;">🏭</span><div><div style="font-size:13px;font-weight:600;color:var(--text);">Indústria</div><div style="font-size:11px;color:var(--muted);">20 clientes</div></div></div></td><td style="padding:11px 16px;text-align:center;"><span style="background:#d9770618;color:#d97706;font-size:12px;font-weight:700;padding:3px 12px;border-radius:99px;">15</span></td><td style="padding:11px 16px;text-align:center;"><span style="background:#f0fdf4;color:#059669;font-size:12px;font-weight:700;padding:3px 12px;border-radius:99px;">15</span></td><td style="padding:11px 16px;text-align:right;font-size:13px;font-weight:600;color:#059669;">R$ 62K</td><td style="padding:11px 16px;text-align:center;font-size:13px;font-weight:700;color:#d97706;">11.8%</td><td style="padding:11px 16px;text-align:center;"><span style="background:#f5f3ff;color:#7c3aed;font-size:12px;font-weight:700;padding:3px 10px;border-radius:99px;">11</span></td><td style="padding:11px 16px;text-align:center;"><span style="background:#dcfce7;color:#166534;font-size:11px;font-weight:700;padding:3px 12px;border-radius:99px;">Jogar</span></td></tr>
<tr class="clickable-row" onclick="wtpDrilldown('Varejo & Moda')" style="background:var(--surface);border-bottom:1px solid var(--border);"><td style="padding:11px 16px;"><div style="display:flex;align-items:center;gap:10px;"><span style="font-size:18px;">🛍️</span><div><div style="font-size:13px;font-weight:600;color:var(--text);">Varejo & Moda</div><div style="font-size:11px;color:var(--muted);">12 clientes</div></div></div></td><td style="padding:11px 16px;text-align:center;"><span style="background:#db277718;color:#db2777;font-size:12px;font-weight:700;padding:3px 12px;border-radius:99px;">12</span></td><td style="padding:11px 16px;text-align:center;"><span style="background:#f0fdf4;color:#059669;font-size:12px;font-weight:700;padding:3px 12px;border-radius:99px;">11</span></td><td style="padding:11px 16px;text-align:right;font-size:13px;font-weight:600;color:#059669;">R$ 28K</td><td style="padding:11px 16px;text-align:center;font-size:13px;font-weight:700;color:#d97706;">7.7%</td><td style="padding:11px 16px;text-align:center;"><span style="background:#f5f3ff;color:#7c3aed;font-size:12px;font-weight:700;padding:3px 10px;border-radius:99px;">7</span></td><td style="padding:11px 16px;text-align:center;"><span style="background:#fef3c7;color:#92400e;font-size:11px;font-weight:700;padding:3px 12px;border-radius:99px;">Explorar</span></td></tr>
<tr class="clickable-row" onclick="wtpDrilldown('Telecom & Mídia')" style="background:var(--surface2);border-bottom:1px solid var(--border);"><td style="padding:11px 16px;"><div style="display:flex;align-items:center;gap:10px;"><span style="font-size:18px;">📡</span><div><div style="font-size:13px;font-weight:600;color:var(--text);">Telecom & Mídia</div><div style="font-size:11px;color:var(--muted);">10 clientes</div></div></div></td><td style="padding:11px 16px;text-align:center;"><span style="background:#0891b218;color:#0891b2;font-size:12px;font-weight:700;padding:3px 12px;border-radius:99px;">13</span></td><td style="padding:11px 16px;text-align:center;"><span style="background:#f0fdf4;color:#059669;font-size:12px;font-weight:700;padding:3px 12px;border-radius:99px;">9</span></td><td style="padding:11px 16px;text-align:right;font-size:13px;font-weight:600;color:#059669;">R$ 14K</td><td style="padding:11px 16px;text-align:center;font-size:13px;font-weight:700;color:#d97706;">7.1%</td><td style="padding:11px 16px;text-align:center;"><span style="background:#f5f3ff;color:#7c3aed;font-size:12px;font-weight:700;padding:3px 10px;border-radius:99px;">6</span></td><td style="padding:11px 16px;text-align:center;"><span style="background:#dcfce7;color:#166534;font-size:11px;font-weight:700;padding:3px 12px;border-radius:99px;">Jogar</span></td></tr>
<tr class="clickable-row" onclick="wtpDrilldown('Financeiro & Seguros')" style="background:var(--surface);border-bottom:1px solid var(--border);"><td style="padding:11px 16px;"><div style="display:flex;align-items:center;gap:10px;"><span style="font-size:18px;">💳</span><div><div style="font-size:13px;font-weight:600;color:var(--text);">Financeiro & Seguros</div><div style="font-size:11px;color:var(--muted);">9 clientes</div></div></div></td><td style="padding:11px 16px;text-align:center;"><span style="background:#4f46e518;color:#4f46e5;font-size:12px;font-weight:700;padding:3px 12px;border-radius:99px;">10</span></td><td style="padding:11px 16px;text-align:center;"><span style="background:#f0fdf4;color:#059669;font-size:12px;font-weight:700;padding:3px 12px;border-radius:99px;">9</span></td><td style="padding:11px 16px;text-align:right;font-size:13px;font-weight:600;color:#059669;">R$ 46K</td><td style="padding:11px 16px;text-align:center;font-size:13px;font-weight:700;color:#d97706;">9.1%</td><td style="padding:11px 16px;text-align:center;"><span style="background:#f5f3ff;color:#7c3aed;font-size:12px;font-weight:700;padding:3px 10px;border-radius:99px;">3</span></td><td style="padding:11px 16px;text-align:center;"><span style="background:#fef3c7;color:#92400e;font-size:11px;font-weight:700;padding:3px 12px;border-radius:99px;">Explorar</span></td></tr>
<tr class="clickable-row" onclick="wtpDrilldown('Agronegócio')" style="background:var(--surface2);border-bottom:1px solid var(--border);"><td style="padding:11px 16px;"><div style="display:flex;align-items:center;gap:10px;"><span style="font-size:18px;">🌾</span><div><div style="font-size:13px;font-weight:600;color:var(--text);">Agronegócio</div><div style="font-size:11px;color:var(--muted);">7 clientes</div></div></div></td><td style="padding:11px 16px;text-align:center;"><span style="background:#65a30d18;color:#65a30d;font-size:12px;font-weight:700;padding:3px 12px;border-radius:99px;">10</span></td><td style="padding:11px 16px;text-align:center;"><span style="background:#f0fdf4;color:#059669;font-size:12px;font-weight:700;padding:3px 12px;border-radius:99px;">6</span></td><td style="padding:11px 16px;text-align:right;font-size:13px;font-weight:600;color:#059669;">R$ 13K</td><td style="padding:11px 16px;text-align:center;font-size:13px;font-weight:700;color:#dc2626;">0.0%</td><td style="padding:11px 16px;text-align:center;"><span style="background:#f5f3ff;color:#7c3aed;font-size:12px;font-weight:700;padding:3px 10px;border-radius:99px;">2</span></td><td style="padding:11px 16px;text-align:center;"><span style="background:#fee2e2;color:#991b1b;font-size:11px;font-weight:700;padding:3px 12px;border-radius:99px;">Avaliar</span></td></tr>
<tr class="clickable-row" onclick="wtpDrilldown('Alimentos & Bebidas')" style="background:var(--surface);border-bottom:1px solid var(--border);"><td style="padding:11px 16px;"><div style="display:flex;align-items:center;gap:10px;"><span style="font-size:18px;">🍽️</span><div><div style="font-size:13px;font-weight:600;color:var(--text);">Alimentos & Bebidas</div><div style="font-size:11px;color:var(--muted);">11 clientes</div></div></div></td><td style="padding:11px 16px;text-align:center;"><span style="background:#ea580c18;color:#ea580c;font-size:12px;font-weight:700;padding:3px 12px;border-radius:99px;">5</span></td><td style="padding:11px 16px;text-align:center;"><span style="background:#f0fdf4;color:#059669;font-size:12px;font-weight:700;padding:3px 12px;border-radius:99px;">9</span></td><td style="padding:11px 16px;text-align:right;font-size:13px;font-weight:600;color:#059669;">R$ 58K</td><td style="padding:11px 16px;text-align:center;font-size:13px;font-weight:700;color:#059669;">16.7%</td><td style="padding:11px 16px;text-align:center;"><span style="background:#f5f3ff;color:#7c3aed;font-size:12px;font-weight:700;padding:3px 10px;border-radius:99px;">6</span></td><td style="padding:11px 16px;text-align:center;"><span style="background:#dcfce7;color:#166534;font-size:11px;font-weight:700;padding:3px 12px;border-radius:99px;">Jogar</span></td></tr>
<tr class="clickable-row" onclick="wtpDrilldown('Meio Ambiente')" style="background:var(--surface2);border-bottom:1px solid var(--border);"><td style="padding:11px 16px;"><div style="display:flex;align-items:center;gap:10px;"><span style="font-size:18px;">🌱</span><div><div style="font-size:13px;font-weight:600;color:var(--text);">Meio Ambiente</div><div style="font-size:11px;color:var(--muted);">7 clientes</div></div></div></td><td style="padding:11px 16px;text-align:center;"><span style="background:#0d948818;color:#0d9488;font-size:12px;font-weight:700;padding:3px 12px;border-radius:99px;">8</span></td><td style="padding:11px 16px;text-align:center;"><span style="background:#f0fdf4;color:#059669;font-size:12px;font-weight:700;padding:3px 12px;border-radius:99px;">5</span></td><td style="padding:11px 16px;text-align:right;font-size:13px;font-weight:600;color:#059669;">R$ 14K</td><td style="padding:11px 16px;text-align:center;font-size:13px;font-weight:700;color:#059669;">20.0%</td><td style="padding:11px 16px;text-align:center;"><span style="background:#f5f3ff;color:#7c3aed;font-size:12px;font-weight:700;padding:3px 10px;border-radius:99px;">3</span></td><td style="padding:11px 16px;text-align:center;"><span style="background:#dcfce7;color:#166534;font-size:11px;font-weight:700;padding:3px 12px;border-radius:99px;">Jogar</span></td></tr>
<tr class="clickable-row" onclick="wtpDrilldown('Educação')" style="background:var(--surface);border-bottom:1px solid var(--border);"><td style="padding:11px 16px;"><div style="display:flex;align-items:center;gap:10px;"><span style="font-size:18px;">🎓</span><div><div style="font-size:13px;font-weight:600;color:var(--text);">Educação</div><div style="font-size:11px;color:var(--muted);">8 clientes</div></div></div></td><td style="padding:11px 16px;text-align:center;"><span style="background:#9333ea18;color:#9333ea;font-size:12px;font-weight:700;padding:3px 12px;border-radius:99px;">7</span></td><td style="padding:11px 16px;text-align:center;"><span style="background:#f0fdf4;color:#059669;font-size:12px;font-weight:700;padding:3px 12px;border-radius:99px;">3</span></td><td style="padding:11px 16px;text-align:right;font-size:13px;font-weight:600;color:#059669;">R$ 5K</td><td style="padding:11px 16px;text-align:center;font-size:13px;font-weight:700;color:#dc2626;">0.0%</td><td style="padding:11px 16px;text-align:center;"><span style="background:#f5f3ff;color:#7c3aed;font-size:12px;font-weight:700;padding:3px 10px;border-radius:99px;">2</span></td><td style="padding:11px 16px;text-align:center;"><span style="background:#fee2e2;color:#991b1b;font-size:11px;font-weight:700;padding:3px 12px;border-radius:99px;">Avaliar</span></td></tr>
<tr class="clickable-row" onclick="wtpDrilldown('Governo & Público')" style="background:var(--surface2);border-bottom:1px solid var(--border);"><td style="padding:11px 16px;"><div style="display:flex;align-items:center;gap:10px;"><span style="font-size:18px;">🏛️</span><div><div style="font-size:13px;font-weight:600;color:var(--text);">Governo & Público</div><div style="font-size:11px;color:var(--muted);">3 clientes</div></div></div></td><td style="padding:11px 16px;text-align:center;"><span style="background:#47556918;color:#475569;font-size:12px;font-weight:700;padding:3px 12px;border-radius:99px;">5</span></td><td style="padding:11px 16px;text-align:center;"><span style="background:#f0fdf4;color:#059669;font-size:12px;font-weight:700;padding:3px 12px;border-radius:99px;">3</span></td><td style="padding:11px 16px;text-align:right;font-size:13px;font-weight:600;color:#059669;">R$ 7K</td><td style="padding:11px 16px;text-align:center;font-size:13px;font-weight:700;color:#dc2626;">0.0%</td><td style="padding:11px 16px;text-align:center;"><span style="background:#f5f3ff;color:#7c3aed;font-size:12px;font-weight:700;padding:3px 10px;border-radius:99px;">0</span></td><td style="padding:11px 16px;text-align:center;"><span style="background:#fee2e2;color:#991b1b;font-size:11px;font-weight:700;padding:3px 12px;border-radius:99px;">Avaliar</span></td></tr></tbody>
  </table></div>
  <div style="padding:10px 16px;background:var(--surface2);border-top:1px solid var(--border);display:flex;gap:16px;font-size:11px;color:var(--muted);flex-wrap:wrap;align-items:center;"><span><span style="background:#dcfce7;color:#166534;font-size:10px;font-weight:700;padding:2px 8px;border-radius:99px;">Jogar</span> Score ≥ 8</span><span><span style="background:#fef3c7;color:#92400e;font-size:10px;font-weight:700;padding:2px 8px;border-radius:99px;">Explorar</span> Score 4–8</span><span><span style="background:#fee2e2;color:#991b1b;font-size:10px;font-weight:700;padding:2px 8px;border-radius:99px;">Avaliar</span> Score &lt; 4</span></div>
</div>
<div id="wtp-drilldown" style="display:none;margin-bottom:24px;" class="card"><div class="card-header"><div><div id="wtp-dd-title" class="card-title"></div><div id="wtp-dd-sub" class="card-subtitle"></div></div><button onclick="wtpClose()" style="background:none;border:1px solid var(--border);border-radius:8px;padding:6px 14px;font-size:12px;font-weight:600;color:var(--muted);cursor:pointer;">✕ Fechar</button></div><div style="display:flex;border-bottom:1px solid var(--border);margin:-4px 0 0;"><button id="wtp-tab-proj" onclick="wtpTab('proj')" style="padding:10px 20px;font-size:12px;font-weight:700;background:none;border:none;border-bottom:2px solid var(--accent1);color:var(--text);cursor:pointer;">📊 Pipeline</button><button id="wtp-tab-contr" onclick="wtpTab('contr')" style="padding:10px 20px;font-size:12px;font-weight:700;background:none;border:none;border-bottom:2px solid transparent;color:var(--muted);cursor:pointer;">📋 Carteira</button></div><div style="overflow-x:auto;"><table style="width:100%;border-collapse:collapse;"><thead id="wtp-dd-thead"></thead><tbody id="wtp-dd-tbody"></tbody></table></div></div>
<script>
(function(){
var D={"Tecnologia & TI": {"pipe_ativos": 33, "pipe_vt": 508234.88, "pipe_enviados": 19, "pipe_negoc": 0, "pipe_fechados": 4, "pipe_vt_fech": 68821.6, "conv_pct": 10.8, "contr_ativos": 30, "contr_cancel": 2, "contr_mrr": 67064.55, "contr_arr": 144806.17, "contr_vt": 1013861.05, "n_cli_pipe": 26, "n_cli_contr": 32, "n_cli_ambos": 18, "n_cli_so_contr": 14, "n_cli_so_pipe": 8, "projetos": [{"np": "NP-116081", "cliente": "NETCENTER INFORMATICA", "etapa": "Projeto Faturado", "vt": 3800.0, "dias": null, "tipo": "fechado"}, {"np": "NP-115812", "cliente": "BRASTORAGE - THINK", "etapa": "Projeto Faturado", "vt": 1140.0, "dias": null, "tipo": "fechado"}, {"np": "NP-115715", "cliente": "CORPFLEX INFORMATICA LTDA", "etapa": "Projeto Faturado", "vt": 992.0, "dias": null, "tipo": "fechado"}, {"np": "NP-115157", "cliente": "STEFANINI", "etapa": "Projeto Faturado", "vt": 62889.6, "dias": null, "tipo": "fechado"}, {"np": "NP-113065", "cliente": "BRNEO INOVAÇÕES EMPRESARIAL", "etapa": "Desistência", "vt": 0.0, "dias": 195, "tipo": "ativo"}, {"np": "NP-114592", "cliente": "ATP", "etapa": "Elaboração de Projeto", "vt": 0.0, "dias": 97, "tipo": "ativo"}, {"np": "NP-114151", "cliente": "SERVIX", "etapa": "Elaboração de Projeto", "vt": 6144.0, "dias": 130, "tipo": "ativo"}, {"np": "NP-113229", "cliente": "SAFEWEB", "etapa": "Elaboração de Projeto", "vt": 0.0, "dias": 186, "tipo": "ativo"}, {"np": "NP-112695", "cliente": "Celk Sistemas", "etapa": "Elaboração de Projeto", "vt": 0.0, "dias": 210, "tipo": "ativo"}, {"np": "NP-111928", "cliente": "SAFEWEB", "etapa": "Elaboração de Projeto", "vt": 0.0, "dias": 250, "tipo": "ativo"}, {"np": "NP-116143", "cliente": "GOVERNANÇA BRASIL", "etapa": "Estimativa de Esforço", "vt": 0.0, "dias": 11, "tipo": "ativo"}, {"np": "NP-115657", "cliente": "GOVERNANÇA BRASIL", "etapa": "Estimativa de Esforço", "vt": 0.0, "dias": 41, "tipo": "ativo"}, {"np": "NP-115283", "cliente": "STEFANINI", "etapa": "Estimativa de Esforço", "vt": 0.0, "dias": 62, "tipo": "ativo"}, {"np": "NP-114404", "cliente": "BRASTORAGE - THINK", "etapa": "Estimativa de Esforço", "vt": 0.0, "dias": 111, "tipo": "ativo"}, {"np": "NP-113438", "cliente": "LG SISTEMAS", "etapa": "Estimativa de Esforço", "vt": 0.0, "dias": 173, "tipo": "ativo"}, {"np": "NP-115870", "cliente": "WAY DATA SOLUTION S/A", "etapa": "Projeto Enviado", "vt": 17700.0, "dias": 27, "tipo": "ativo"}, {"np": "NP-115404", "cliente": "Solo Network", "etapa": "Projeto Enviado", "vt": 0.0, "dias": 54, "tipo": "ativo"}, {"np": "NP-115314", "cliente": "GGT SOLUÇÃO TECNOLOGICAS LTDA (ANGOLAPREV)", "etapa": "Projeto Enviado", "vt": 17670.0, "dias": 61, "tipo": "ativo"}, {"np": "NP-115265", "cliente": "Solucap Sistemas", "etapa": "Projeto Enviado", "vt": 58200.0, "dias": 63, "tipo": "ativo"}, {"np": "NP-114418", "cliente": "RAPIDONET SISTEMAS", "etapa": "Projeto Enviado", "vt": 36000.0, "dias": 111, "tipo": "ativo"}, {"np": "NP-114405", "cliente": "S3CURITY", "etapa": "Projeto Enviado", "vt": 7600.0, "dias": 111, "tipo": "ativo"}, {"np": "NP-114383", "cliente": "BRASTORAGE - THINK", "etapa": "Projeto Enviado", "vt": 21600.0, "dias": 112, "tipo": "ativo"}, {"np": "NP-114333", "cliente": "PERTO S/A PERIFÉRICOS P/ AUTOMAÇÃO - GRAVATAI ( Digicom )", "etapa": "Projeto Enviado", "vt": 25001.11, "dias": 116, "tipo": "ativo"}, {"np": "NP-114249", "cliente": "CONNECTION SEGURANÇA E GESTÃO DE TI", "etapa": "Projeto Enviado", "vt": 760.0, "dias": 122, "tipo": "ativo"}, {"np": "NP-113970", "cliente": "Data Engenharia", "etapa": "Projeto Enviado", "vt": 172116.0, "dias": 140, "tipo": "ativo"}, {"np": "NP-113740", "cliente": "GOVERNANÇA BRASIL", "etapa": "Projeto Enviado", "vt": 3800.0, "dias": 157, "tipo": "ativo"}, {"np": "NP-113639", "cliente": "INTERSISTEMAS INFORMATICA LTDA - NETLOGIC", "etapa": "Projeto Enviado", "vt": 3007.0, "dias": 161, "tipo": "ativo"}, {"np": "NP-113582", "cliente": "SAFEWEB", "etapa": "Projeto Enviado", "vt": 30636.0, "dias": 166, "tipo": "ativo"}, {"np": "NP-113199", "cliente": "S3CURITY", "etapa": "Projeto Enviado", "vt": 5700.0, "dias": 187, "tipo": "ativo"}, {"np": "NP-113096", "cliente": "BRASTORAGE - THINK", "etapa": "Projeto Enviado", "vt": 10640.0, "dias": 194, "tipo": "ativo"}, {"np": "NP-112991", "cliente": "AEL SISTEMAS S.A", "etapa": "Projeto Enviado", "vt": 30400.0, "dias": 199, "tipo": "ativo"}, {"np": "NP-112404", "cliente": "NETCENTER INFORMATICA", "etapa": "Projeto Enviado", "vt": 32780.0, "dias": 223, "tipo": "ativo"}, {"np": "NP-112211", "cliente": "GOLDEN TECHNOLOGIA", "etapa": "Projeto Enviado", "vt": 12436.77, "dias": 236, "tipo": "ativo"}, {"np": "NP-112132", "cliente": "DATACOM", "etapa": "Projeto Enviado", "vt": 16044.0, "dias": 238, "tipo": "ativo"}, {"np": "NP-116190", "cliente": "WHZ S.A", "etapa": "Qualificação", "vt": 0.0, "dias": 6, "tipo": "ativo"}, {"np": "NP-115823", "cliente": "GGT SOLUÇÃO TECNOLOGICAS LTDA (ANGOLAPREV)", "etapa": "Qualificação", "vt": 0.0, "dias": 31, "tipo": "ativo"}, {"np": "NP-114676", "cliente": "Ditel", "etapa": "Qualificação", "vt": 0.0, "dias": 91, "tipo": "ativo"}], "contratos": [{"np": "NP-116093", "cliente": "SYNERGIE SISTEMAS LTDA", "etapa": "Contrato Cancelado", "vencimento": "01/10/2026", "mrr": 3491.64, "arr": 0.0, "vt": 41899.68, "cancelado": true}, {"np": "NP-115078", "cliente": "CONNECTION SEGURANÇA E GESTÃO DE TI", "etapa": "Análise de Requisição", "vencimento": "01/08/2026", "mrr": 949.43, "arr": 6242.03, "vt": 17635.19, "cancelado": false}, {"np": "NP-115077", "cliente": "NETCENTER INFORMATICA", "etapa": "Em análise pelo cliente", "vencimento": "01/01/2026", "mrr": 0.0, "arr": 2254.0, "vt": 2254.0, "cancelado": false}, {"np": "NP-115073", "cliente": "WAY DATA SOLUTION S/A", "etapa": "Renovado", "vencimento": "01/01/2026", "mrr": 0.0, "arr": 2930.46, "vt": 2930.46, "cancelado": false}, {"np": "NP-115070", "cliente": "VANTIX TECNOLOGIA COMÉRCIO E SERVIÇOS DE INFORMÁTICA LTDA", "etapa": "Análise de Requisição", "vencimento": "01/07/2026", "mrr": 0.0, "arr": 10194.0, "vt": 10194.0, "cancelado": false}, {"np": "NP-115058", "cliente": "TEEVO COM E SERVS DE INFORMÁTICA (MI)", "etapa": "Análise de Requisição", "vencimento": "01/12/2026", "mrr": 82.0, "arr": 0.0, "vt": 984.0, "cancelado": false}, {"np": "NP-115057", "cliente": "TECCLOUD SERVICOS DE TECNOLOGIA AHU LTDA", "etapa": "Em análise pelo cliente", "vencimento": "01/01/2026", "mrr": 0.0, "arr": 13500.0, "vt": 13500.0, "cancelado": false}, {"np": "NP-115055", "cliente": "STEFANINI", "etapa": "Análise de Requisição", "vencimento": "01/08/2026", "mrr": 5918.55, "arr": 0.0, "vt": 71022.6, "cancelado": false}, {"np": "NP-115051", "cliente": "SERVIX", "etapa": "Análise de Requisição", "vencimento": "01/04/2026", "mrr": 856.45, "arr": 0.0, "vt": 10277.4, "cancelado": false}, {"np": "NP-115038", "cliente": "SAFEWEB", "etapa": "Análise de Requisição", "vencimento": "01/05/2026", "mrr": 10688.0, "arr": 0.0, "vt": 128256.0, "cancelado": false}, {"np": "NP-115036", "cliente": "S3CURITY", "etapa": "Análise de Requisição", "vencimento": "01/05/2026", "mrr": 0.0, "arr": 7183.0, "vt": 7183.0, "cancelado": false}, {"np": "NP-115032", "cliente": "RCXIT NETWORK IT EXPERTS", "etapa": "Análise de Requisição", "vencimento": "01/08/2026", "mrr": 0.0, "arr": 11010.0, "vt": 11010.0, "cancelado": false}, {"np": "NP-115030", "cliente": "RAPIDONET SISTEMAS", "etapa": "Análise de Requisição", "vencimento": "01/09/2026", "mrr": 1012.92, "arr": 9464.89, "vt": 21619.93, "cancelado": false}, {"np": "NP-115028", "cliente": "QINTESS", "etapa": "Análise de Requisição", "vencimento": "01/10/2026", "mrr": 1250.0, "arr": 0.0, "vt": 15000.0, "cancelado": false}, {"np": "NP-115025", "cliente": "PERTO S/A PERIFÉRICOS P/ AUTOMAÇÃO - GRAVATAI ( Digicom )", "etapa": "Análise de Requisição", "vencimento": "01/09/2026", "mrr": 0.0, "arr": 0.0, "vt": 0.0, "cancelado": false}, {"np": "NP-115019", "cliente": "MULTISUPORTE TECNOLOGIA", "etapa": "Análise de Requisição", "vencimento": "01/12/2026", "mrr": 0.0, "arr": 1620.93, "vt": 1620.93, "cancelado": false}, {"np": "NP-115010", "cliente": "LG SISTEMAS", "etapa": "Análise de Requisição", "vencimento": "01/10/2026", "mrr": 13507.3, "arr": 0.0, "vt": 226367.88, "cancelado": false}, {"np": "NP-115005", "cliente": "JME INFORMÁTICA", "etapa": "Análise de Requisição", "vencimento": "01/07/2026", "mrr": 2234.19, "arr": 0.0, "vt": 26810.28, "cancelado": false}, {"np": "NP-115004", "cliente": "J&M SOLUÇÕES EM TECNOLOGIA EIRELI (AlliedIT)", "etapa": "Contrato Cancelado", "vencimento": "01/08/2026", "mrr": 265.8, "arr": 0.0, "vt": 3189.6, "cancelado": true}, {"np": "NP-115002", "cliente": "INTERSISTEMAS INFORMATICA LTDA - NETLOGIC", "etapa": "Renovado", "vencimento": "01/02/2026", "mrr": 618.05, "arr": 0.0, "vt": 7416.6, "cancelado": false}, {"np": "NP-114999", "cliente": "INOVATECH SOLUÇÕES EM INFORMÁTICA LTDA - EPP", "etapa": "Análise de Requisição", "vencimento": "01/05/2026", "mrr": 0.0, "arr": 4046.44, "vt": 4046.44, "cancelado": false}, {"np": "NP-114998", "cliente": "INCORP TECHNOLOGY INFORMATICA LTDA - EPP", "etapa": "Processo Financeiro", "vencimento": "01/02/2026", "mrr": 0.0, "arr": 6388.02, "vt": 6388.02, "cancelado": false}, {"np": "NP-114994", "cliente": "HT SOLUTIONS", "etapa": "Análise de Requisição", "vencimento": "01/06/2026", "mrr": 1842.71, "arr": 0.0, "vt": 22112.52, "cancelado": false}, {"np": "NP-114985", "cliente": "GOVERNANÇA BRASIL", "etapa": "Análise de Requisição", "vencimento": "01/10/2026", "mrr": 10087.0, "arr": 0.0, "vt": 121044.0, "cancelado": false}, {"np": "NP-114983", "cliente": "GOLDEN TECHNOLOGIA", "etapa": "Análise de Requisição", "vencimento": "01/05/2026", "mrr": 1810.17, "arr": 0.0, "vt": 21722.04, "cancelado": false}, {"np": "NP-114982", "cliente": "GGT SOLUÇÃO TECNOLOGICAS LTDA (ANGOLAPREV)", "etapa": "Em análise pelo cliente", "vencimento": "01/03/2026", "mrr": 0.0, "arr": 54090.0, "vt": 54090.0, "cancelado": false}, {"np": "NP-114977", "cliente": "FLOWTI", "etapa": "Análise de Requisição", "vencimento": "01/06/2026", "mrr": 4216.81, "arr": 0.0, "vt": 50601.72, "cancelado": false}, {"np": "NP-114972", "cliente": "EQUALITI E SOLUCOES EM TI LTDA", "etapa": "Análise de Requisição", "vencimento": "01/04/2026", "mrr": 0.0, "arr": 2832.72, "vt": 2832.72, "cancelado": false}, {"np": "NP-114970", "cliente": "DATACOM", "etapa": "Análise de Requisição", "vencimento": "01/12/2026", "mrr": 0.0, "arr": 6820.06, "vt": 6820.06, "cancelado": false}, {"np": "NP-114958", "cliente": "Celk Sistemas", "etapa": "Análise de Requisição", "vencimento": "01/10/2026", "mrr": 10135.49, "arr": 0.0, "vt": 121625.88, "cancelado": false}, {"np": "NP-114954", "cliente": "BRASTORAGE - THINK", "etapa": "Análise de Requisição", "vencimento": "01/10/2026", "mrr": 1855.48, "arr": 0.0, "vt": 22265.76, "cancelado": false}, {"np": "NP-114945", "cliente": "ATP", "etapa": "Análise de Requisição", "vencimento": "01/09/2026", "mrr": 0.0, "arr": 6229.62, "vt": 6229.62, "cancelado": false}], "ativos": 33, "vt_pipeline": 508234.88, "vt_fechados": 68821.6, "enviados": 19}, "Serviços & Infraestrutura": {"pipe_ativos": 17, "pipe_vt": 400154.0, "pipe_enviados": 8, "pipe_negoc": 0, "pipe_fechados": 3, "pipe_vt_fech": 130601.0, "conv_pct": 15.0, "contr_ativos": 21, "contr_cancel": 2, "contr_mrr": 71007.89, "contr_arr": 82599.6, "contr_vt": 986061.24, "n_cli_pipe": 11, "n_cli_contr": 23, "n_cli_ambos": 9, "n_cli_so_contr": 14, "n_cli_so_pipe": 2, "projetos": [{"np": "NP-115262", "cliente": "INTERCITY", "etapa": "Projeto Faturado", "vt": 76721.0, "dias": null, "tipo": "fechado"}, {"np": "NP-114660", "cliente": "M.L.GOMES", "etapa": "Projeto Faturado", "vt": 6080.0, "dias": null, "tipo": "fechado"}, {"np": "NP-113067", "cliente": "EBM Incorporações S/A", "etapa": "Projeto Faturado", "vt": 47800.0, "dias": null, "tipo": "fechado"}, {"np": "NP-113781", "cliente": "AUXILIADORA PREDIAL", "etapa": "Elaboração de Projeto", "vt": 0.0, "dias": 153, "tipo": "ativo"}, {"np": "NP-113604", "cliente": "CONSTRUTORA NORBERTO ODEBRECHT S.A.", "etapa": "Elaboração de Projeto", "vt": 0.0, "dias": 165, "tipo": "ativo"}, {"np": "NP-113281", "cliente": "LUXCEL MAXLOG", "etapa": "Elaboração de Projeto", "vt": 0.0, "dias": 182, "tipo": "ativo"}, {"np": "NP-113135", "cliente": "AUXILIADORA PREDIAL", "etapa": "Elaboração de Projeto", "vt": 0.0, "dias": 192, "tipo": "ativo"}, {"np": "NP-112412", "cliente": "CONSTRUTORA NORBERTO ODEBRECHT S.A.", "etapa": "Elaboração de Projeto", "vt": 16500.0, "dias": 222, "tipo": "ativo"}, {"np": "NP-111926", "cliente": "VIAÇÃO OURO E PRATA S.A", "etapa": "Elaboração de Projeto", "vt": 0.0, "dias": 250, "tipo": "ativo"}, {"np": "NP-115261", "cliente": "LUXCEL MAXLOG", "etapa": "Estimativa de Esforço", "vt": 0.0, "dias": 65, "tipo": "ativo"}, {"np": "NP-113530", "cliente": "AUXILIADORA PREDIAL", "etapa": "Estimativa de Esforço", "vt": 0.0, "dias": 168, "tipo": "ativo"}, {"np": "NP-116138", "cliente": "AUXILIADORA PREDIAL", "etapa": "Processo Financeiro", "vt": 1140.0, "dias": 11, "tipo": "ativo"}, {"np": "NP-115351", "cliente": "AUXILIADORA PREDIAL", "etapa": "Projeto Enviado", "vt": 266832.0, "dias": 59, "tipo": "ativo"}, {"np": "NP-115335", "cliente": "CPA", "etapa": "Projeto Enviado", "vt": 0.0, "dias": 60, "tipo": "ativo"}, {"np": "NP-114700", "cliente": "Planem Engenharia", "etapa": "Projeto Enviado", "vt": 16100.0, "dias": 89, "tipo": "ativo"}, {"np": "NP-113863", "cliente": "ROYAL PALM HOTELS & RESORTS (GRUPO ARCEL)", "etapa": "Projeto Enviado", "vt": 12872.0, "dias": 150, "tipo": "ativo"}, {"np": "NP-113660", "cliente": "AUXILIADORA PREDIAL", "etapa": "Projeto Enviado", "vt": 950.0, "dias": 161, "tipo": "ativo"}, {"np": "NP-113545", "cliente": "AUTOGLASS", "etapa": "Projeto Enviado", "vt": 70160.0, "dias": 168, "tipo": "ativo"}, {"np": "NP-111979", "cliente": "CONSTRUTORA NORBERTO ODEBRECHT S.A.", "etapa": "Projeto Enviado", "vt": 6720.0, "dias": 248, "tipo": "ativo"}, {"np": "NP-111866", "cliente": "VIAÇÃO OURO E PRATA S.A", "etapa": "Projeto Enviado", "vt": 8880.0, "dias": 251, "tipo": "ativo"}], "contratos": [{"np": "NP-115072", "cliente": "VIAÇÃO OURO E PRATA S.A", "etapa": "Análise de Requisição", "vencimento": "01/06/2026", "mrr": 932.17, "arr": 0.0, "vt": 11186.04, "cancelado": false}, {"np": "NP-115071", "cliente": "VERZANI & SANDRINI LTDA", "etapa": "Em análise pelo cliente", "vencimento": "01/01/2026", "mrr": 0.0, "arr": 0.0, "vt": 0.0, "cancelado": false}, {"np": "NP-115062", "cliente": "TRISUL", "etapa": "Análise de Requisição", "vencimento": "01/08/2026", "mrr": 450.0, "arr": 7250.0, "vt": 12650.0, "cancelado": false}, {"np": "NP-115054", "cliente": "SOTRAN LOGÍSTICA E TRANSPORTE", "etapa": "Análise de Requisição", "vencimento": "01/08/2026", "mrr": 4370.58, "arr": 36745.0, "vt": 140558.92, "cancelado": false}, {"np": "NP-115035", "cliente": "ROYAL PALM HOTELS & RESORTS (GRUPO ARCEL)", "etapa": "Análise de Requisição", "vencimento": "01/10/2026", "mrr": 2943.8, "arr": 0.0, "vt": 35325.6, "cancelado": false}, {"np": "NP-115027", "cliente": "PLANSERVI ENGENHARIA", "etapa": "Renovado", "vencimento": "01/02/2026", "mrr": 0.0, "arr": 4909.09, "vt": 4909.09, "cancelado": false}, {"np": "NP-115016", "cliente": "M.L.GOMES", "etapa": "Análise de Requisição", "vencimento": "01/08/2026", "mrr": 2056.69, "arr": 0.0, "vt": 24680.28, "cancelado": false}, {"np": "NP-115015", "cliente": "LUXCEL MAXLOG", "etapa": "Análise de Requisição", "vencimento": "01/09/2026", "mrr": 941.26, "arr": 0.0, "vt": 11295.12, "cancelado": false}, {"np": "NP-115001", "cliente": "INTERCITY", "etapa": "Renovado", "vencimento": "01/01/2026", "mrr": 3424.0, "arr": 0.0, "vt": 41088.0, "cancelado": false}, {"np": "NP-114988", "cliente": "Grupo Orcali", "etapa": "Contrato Cancelado", "vencimento": "01/08/2026", "mrr": 1896.46, "arr": 0.0, "vt": 22757.52, "cancelado": true}, {"np": "NP-114978", "cliente": "FORSALES MECANET", "etapa": "Análise de Requisição", "vencimento": "01/07/2026", "mrr": 1399.82, "arr": 0.0, "vt": 16797.84, "cancelado": false}, {"np": "NP-114974", "cliente": "EZEX", "etapa": "Análise de Requisição", "vencimento": "01/12/2026", "mrr": 0.0, "arr": 3333.54, "vt": 3333.54, "cancelado": false}, {"np": "NP-114969", "cliente": "CPA", "etapa": "Análise de Requisição", "vencimento": "01/11/2026", "mrr": 0.0, "arr": 10657.47, "vt": 10657.47, "cancelado": false}, {"np": "NP-114966", "cliente": "CONSTRUTORA NORBERTO ODEBRECHT S.A.", "etapa": "Análise de Requisição", "vencimento": "01/08/2026", "mrr": 4207.0, "arr": 0.0, "vt": 50484.0, "cancelado": false}, {"np": "NP-114965", "cliente": "CONSTRUTORA MARQUISE", "etapa": "Análise de Requisição", "vencimento": "01/05/2026", "mrr": 0.0, "arr": 14510.0, "vt": 14510.0, "cancelado": false}, {"np": "NP-114964", "cliente": "CONSTRUCAP CCPS", "etapa": "Análise de Requisição", "vencimento": "01/09/2026", "mrr": 913.85, "arr": 0.0, "vt": 10966.2, "cancelado": false}, {"np": "NP-114950", "cliente": "BEG", "etapa": "Análise de Requisição", "vencimento": "01/10/2026", "mrr": 0.0, "arr": 3309.0, "vt": 3309.0, "cancelado": false}, {"np": "NP-114949", "cliente": "AUXILIADORA PREDIAL", "etapa": "Processo Financeiro", "vencimento": "01/03/2026", "mrr": 34357.34, "arr": 0.0, "vt": 412288.08, "cancelado": false}, {"np": "NP-114947", "cliente": "AUTOGLASS", "etapa": "Análise de Requisição", "vencimento": "01/11/2026", "mrr": 6348.61, "arr": 0.0, "vt": 76183.32, "cancelado": false}, {"np": "NP-114946", "cliente": "ATRIO HOTÉIS", "etapa": "Análise de Requisição", "vencimento": "01/07/2026", "mrr": 441.58, "arr": 1885.5, "vt": 7184.46, "cancelado": false}, {"np": "NP-114941", "cliente": "ANDRADE GUTIERREZ", "etapa": "Análise de Requisição", "vencimento": "01/08/2026", "mrr": 6072.19, "arr": 0.0, "vt": 72866.28, "cancelado": false}, {"np": "NP-114939", "cliente": "ADESTE PARTICIPACOES E EMPREENDIMENTOS LTDA", "etapa": "Análise de Requisição", "vencimento": "01/08/2026", "mrr": 2149.0, "arr": 0.0, "vt": 25788.0, "cancelado": false}, {"np": "NP-114797", "cliente": "RNI - Rodobens Negócios Imobiliários", "etapa": "Contrato Cancelado", "vencimento": "01/12/2026", "mrr": 2242.1, "arr": 3331.38, "vt": 30236.58, "cancelado": true}], "ativos": 17, "vt_pipeline": 400154.0, "vt_fechados": 130601.0, "enviados": 8}, "Saúde": {"pipe_ativos": 20, "pipe_vt": 212603.0, "pipe_enviados": 9, "pipe_negoc": 0, "pipe_fechados": 0, "pipe_vt_fech": 0.0, "conv_pct": 0.0, "contr_ativos": 14, "contr_cancel": 0, "contr_mrr": 118721.32, "contr_arr": 237484.47, "contr_vt": 1173264.14, "n_cli_pipe": 10, "n_cli_contr": 14, "n_cli_ambos": 6, "n_cli_so_contr": 8, "n_cli_so_pipe": 4, "projetos": [{"np": "NP-112683", "cliente": "HOSPITAL MAE DE DEUS (AESC)", "etapa": "Elaboração de Caderno Técnico", "vt": 10500.0, "dias": 210, "tipo": "ativo"}, {"np": "NP-115818", "cliente": "KleyHertz Farmacêutica", "etapa": "Elaboração de Projeto", "vt": 0.0, "dias": 31, "tipo": "ativo"}, {"np": "NP-112622", "cliente": "KleyHertz Farmacêutica", "etapa": "Elaboração de Projeto", "vt": 0.0, "dias": 214, "tipo": "ativo"}, {"np": "NP-112157", "cliente": "HOSPITAL MAE DE DEUS (AESC)", "etapa": "Elaboração de Projeto", "vt": 0.0, "dias": 238, "tipo": "ativo"}, {"np": "NP-116087", "cliente": "SANTA CASA DE MISERICÓRDIA DE PORTO ALEGRE", "etapa": "Estimativa de Esforço", "vt": 0.0, "dias": 13, "tipo": "ativo"}, {"np": "NP-116025", "cliente": "HOSPITAL MAE DE DEUS (AESC)", "etapa": "Estimativa de Esforço", "vt": 0.0, "dias": 18, "tipo": "ativo"}, {"np": "NP-114475", "cliente": "HOSPITAL MAE DE DEUS (AESC)", "etapa": "Estimativa de Esforço", "vt": 0.0, "dias": 105, "tipo": "ativo"}, {"np": "NP-111919", "cliente": "LIFE EMPRESARIAL SAÚDE LTDA", "etapa": "Estimativa de Esforço", "vt": 0.0, "dias": 250, "tipo": "ativo"}, {"np": "NP-115925", "cliente": "KleyHertz Farmacêutica", "etapa": "Projeto Enviado", "vt": 35520.0, "dias": 25, "tipo": "ativo"}, {"np": "NP-114550", "cliente": "SANTA CASA DE MISERICÓRDIA DE PORTO ALEGRE", "etapa": "Projeto Enviado", "vt": 15200.0, "dias": 101, "tipo": "ativo"}, {"np": "NP-114513", "cliente": "SANTA CASA DE MISERICÓRDIA DE PORTO ALEGRE", "etapa": "Projeto Enviado", "vt": 5700.0, "dias": 103, "tipo": "ativo"}, {"np": "NP-114397", "cliente": "UNIMED PORTO ALEGRE", "etapa": "Projeto Enviado", "vt": 6840.0, "dias": 111, "tipo": "ativo"}, {"np": "NP-114210", "cliente": "KleyHertz Farmacêutica", "etapa": "Projeto Enviado", "vt": 3600.0, "dias": 125, "tipo": "ativo"}, {"np": "NP-114061", "cliente": "SANTA CASA DE MISERICÓRDIA DE PORTO ALEGRE", "etapa": "Projeto Enviado", "vt": 1520.0, "dias": 136, "tipo": "ativo"}, {"np": "NP-113847", "cliente": "FUNDAÇÃO SÃO FRANCISCO XAVIER - FSFX", "etapa": "Projeto Enviado", "vt": 19760.0, "dias": 151, "tipo": "ativo"}, {"np": "NP-112262", "cliente": "Real Hospital Português", "etapa": "Projeto Enviado", "vt": 31360.0, "dias": 232, "tipo": "ativo"}, {"np": "NP-111873", "cliente": "Hospital Ernesto Dornelles", "etapa": "Projeto Enviado", "vt": 82603.0, "dias": 251, "tipo": "ativo"}, {"np": "NP-116205", "cliente": "SOFIA PET", "etapa": "Qualificação", "vt": 0.0, "dias": 6, "tipo": "ativo"}, {"np": "NP-116258", "cliente": "Unimed Central de Serviços - RS", "etapa": "Qualificação Concluída", "vt": 0.0, "dias": 3, "tipo": "ativo"}, {"np": "NP-113665", "cliente": "LIFE EMPRESARIAL SAÚDE LTDA", "etapa": "Qualificação Concluída", "vt": 0.0, "dias": 161, "tipo": "ativo"}], "contratos": [{"np": "NP-115066", "cliente": "UNIMED VALES DO TAQUARI E RIO PARDO LTDA", "etapa": "Processo Financeiro", "vencimento": "01/02/2026", "mrr": 0.0, "arr": 38120.85, "vt": 38120.85, "cancelado": false}, {"np": "NP-115065", "cliente": "UNIMED PORTO ALEGRE", "etapa": "Processo Financeiro", "vencimento": "01/03/2026", "mrr": 11068.22, "arr": 0.0, "vt": 127953.24, "cancelado": false}, {"np": "NP-115040", "cliente": "SANTA CASA DE MISERICÓRDIA DE PORTO ALEGRE", "etapa": "Análise de Requisição", "vencimento": "01/03/2026", "mrr": 0.0, "arr": 3646.9, "vt": 3467.55, "cancelado": false}, {"np": "NP-115039", "cliente": "SANTA CASA DE MISERICORDIA DA BAHIA", "etapa": "Em análise pelo cliente", "vencimento": "01/04/2026", "mrr": 1183.08, "arr": 0.0, "vt": 14196.96, "cancelado": false}, {"np": "NP-115011", "cliente": "LIFE EMPRESARIAL SAÚDE LTDA", "etapa": "Análise de Requisição", "vencimento": "01/11/2026", "mrr": 14838.17, "arr": 0.0, "vt": 178058.04, "cancelado": false}, {"np": "NP-115008", "cliente": "KleyHertz Farmacêutica", "etapa": "Análise de Requisição", "vencimento": "01/08/2026", "mrr": 0.0, "arr": 12823.0, "vt": 12823.0, "cancelado": false}, {"np": "NP-114993", "cliente": "HOSPITAL MAE DE DEUS (AESC)", "etapa": "Análise de Requisição", "vencimento": "01/07/2026", "mrr": 7880.0, "arr": 0.0, "vt": 94560.0, "cancelado": false}, {"np": "NP-114992", "cliente": "HOSPITAL DE CLINICAS (HCPA)", "etapa": "Análise de Requisição", "vencimento": "01/09/2026", "mrr": 2529.0, "arr": 0.0, "vt": 30348.0, "cancelado": false}, {"np": "NP-114991", "cliente": "HOSPITAL CARE", "etapa": "Análise de Requisição", "vencimento": "01/06/2026", "mrr": 24903.05, "arr": 0.0, "vt": 298836.6, "cancelado": false}, {"np": "NP-114981", "cliente": "FUNDAÇÃO SÃO FRANCISCO XAVIER - FSFX", "etapa": "Análise de Requisição", "vencimento": "01/09/2026", "mrr": 9723.8, "arr": 30466.42, "vt": 147152.02, "cancelado": false}, {"np": "NP-114959", "cliente": "CENTRO HOSPITALAR DE SETÚBAL, EPE (TCSI)", "etapa": "Análise de Requisição", "vencimento": "01/11/2026", "mrr": 0.0, "arr": 83001.12, "vt": 83001.12, "cancelado": false}, {"np": "NP-114951", "cliente": "BIONOVIS S.A. - COMPANHIA BRASILEIRA DE BIOTECNOLOGIA FARMACEUTICA", "etapa": "Análise de Requisição", "vencimento": "01/12/2026", "mrr": 0.0, "arr": 69426.18, "vt": 69426.18, "cancelado": false}, {"np": "NP-114944", "cliente": "ASSOCIACAO HOSPITALAR MOINHOS DE VENTO", "etapa": "Em análise pelo cliente", "vencimento": "01/03/2026", "mrr": 3757.0, "arr": 0.0, "vt": 45084.0, "cancelado": false}, {"np": "NP-114797", "cliente": "ACHE LABORATÓRIOS FARMACÊUTICOS SA", "etapa": "Análise de Requisição", "vencimento": "01/10/2026", "mrr": 42839.0, "arr": 0.0, "vt": 30236.58, "cancelado": false}], "ativos": 20, "vt_pipeline": 212603.0, "vt_fechados": 0.0, "enviados": 9}, "Indústria": {"pipe_ativos": 15, "pipe_vt": 352736.0, "pipe_enviados": 7, "pipe_negoc": 0, "pipe_fechados": 2, "pipe_vt_fech": 3600.0, "conv_pct": 11.8, "contr_ativos": 15, "contr_cancel": 2, "contr_mrr": 61933.08, "contr_arr": 28301.03, "contr_vt": 771497.99, "n_cli_pipe": 9, "n_cli_contr": 16, "n_cli_ambos": 5, "n_cli_so_contr": 11, "n_cli_so_pipe": 4, "projetos": [{"np": "NP-115316", "cliente": "FRIGELAR", "etapa": "Projeto Faturado", "vt": 3600.0, "dias": null, "tipo": "fechado"}, {"np": "NP-114662", "cliente": "IRANI PAPEL E EMBALAGEM S.A", "etapa": "Projeto Faturado", "vt": 0.0, "dias": null, "tipo": "fechado"}, {"np": "NP-113967", "cliente": "BOMBRIL S.A", "etapa": "Elaboração de Projeto", "vt": 0.0, "dias": 140, "tipo": "ativo"}, {"np": "NP-112505", "cliente": "Randon SA Implementos e Participações", "etapa": "Elaboração de Projeto", "vt": 0.0, "dias": 220, "tipo": "ativo"}, {"np": "NP-115517", "cliente": "IMPORTADORA BAGE S/A", "etapa": "Estimativa de Esforço", "vt": 0.0, "dias": 48, "tipo": "ativo"}, {"np": "NP-113414", "cliente": "IRANI PAPEL E EMBALAGEM S.A", "etapa": "Estimativa de Esforço", "vt": 0.0, "dias": 175, "tipo": "ativo"}, {"np": "NP-116095", "cliente": "FRIGELAR", "etapa": "Processo Financeiro", "vt": 2400.0, "dias": 13, "tipo": "ativo"}, {"np": "NP-116022", "cliente": "IRANI PAPEL E EMBALAGEM S.A", "etapa": "Projeto Enviado", "vt": 16720.0, "dias": 18, "tipo": "ativo"}, {"np": "NP-114776", "cliente": "IMPORTADORA BAGE S/A", "etapa": "Projeto Enviado", "vt": 1140.0, "dias": 77, "tipo": "ativo"}, {"np": "NP-114308", "cliente": "SPRINGER CARRIER (MIDEA)", "etapa": "Projeto Enviado", "vt": 10776.0, "dias": 117, "tipo": "ativo"}, {"np": "NP-114241", "cliente": "PANATLANTICA", "etapa": "Projeto Enviado", "vt": 11400.0, "dias": 123, "tipo": "ativo"}, {"np": "NP-113859", "cliente": "FRIGELAR", "etapa": "Projeto Enviado", "vt": 24000.0, "dias": 150, "tipo": "ativo"}, {"np": "NP-113270", "cliente": "IMPORTADORA BAGE S/A", "etapa": "Projeto Enviado", "vt": 6300.0, "dias": 182, "tipo": "ativo"}, {"np": "NP-112013", "cliente": "FRIGELAR", "etapa": "Projeto Enviado", "vt": 280000.0, "dias": 244, "tipo": "ativo"}, {"np": "115730", "cliente": "IMPORTADORA BAGE S/A", "etapa": "Qualificação", "vt": 0.0, "dias": 38, "tipo": "ativo"}, {"np": "NP-115242", "cliente": "Brasdiesel SA Comercial e Importadora", "etapa": "Qualificação", "vt": 0.0, "dias": 67, "tipo": "ativo"}, {"np": "NP-115259", "cliente": "Packing Group", "etapa": "Qualificação Concluída", "vt": 0.0, "dias": 66, "tipo": "ativo"}], "contratos": [{"np": "NP-116088", "cliente": "BOMBRIL S.A", "etapa": "Análise de Requisição", "vencimento": "01/10/2026", "mrr": 10397.0, "arr": 0.0, "vt": 124764.0, "cancelado": false}, {"np": "NP-116076", "cliente": "NOURYON PULP AND PERFORMANCE INDUSTRIA QUIMICA LTDA", "etapa": "Contrato Cancelado", "vencimento": "01/01/2026", "mrr": 2541.68, "arr": 0.0, "vt": 30500.16, "cancelado": true}, {"np": "NP-115075", "cliente": "NOURYON PULP AND PERFORMANCE INDUSTRIA QUIMICA LTDA", "etapa": "Análise de Requisição", "vencimento": "01/12/2026", "mrr": 2905.56, "arr": 0.0, "vt": 34866.72, "cancelado": false}, {"np": "NP-115049", "cliente": "SERILON BRASIL", "etapa": "Análise de Requisição", "vencimento": "01/10/2026", "mrr": 0.0, "arr": 3744.37, "vt": 3744.37, "cancelado": false}, {"np": "NP-115033", "cliente": "RESERVA BRASILEIRA INDUSTRIA E COMERCIO LTDA", "etapa": "Análise de Requisição", "vencimento": "01/07/2026", "mrr": 3050.76, "arr": 0.0, "vt": 36609.12, "cancelado": false}, {"np": "NP-115024", "cliente": "PANATLANTICA", "etapa": "Análise de Requisição", "vencimento": "01/05/2026", "mrr": 277.36, "arr": 0.0, "vt": 3328.32, "cancelado": false}, {"np": "NP-115018", "cliente": "MARELLI", "etapa": "Análise de Requisição", "vencimento": "01/08/2026", "mrr": 0.0, "arr": 3763.92, "vt": 3763.92, "cancelado": false}, {"np": "NP-115017", "cliente": "MARCOPOLO", "etapa": "Análise de Requisição", "vencimento": "01/10/2026", "mrr": 0.0, "arr": 2914.25, "vt": 2914.25, "cancelado": false}, {"np": "NP-115006", "cliente": "KEPLER WEBER", "etapa": "Análise de Requisição", "vencimento": "01/09/2026", "mrr": 0.0, "arr": 10679.5, "vt": 10679.5, "cancelado": false}, {"np": "NP-115003", "cliente": "IRANI PAPEL E EMBALAGEM S.A", "etapa": "Análise de Requisição", "vencimento": "01/08/2026", "mrr": 14743.0, "arr": 0.0, "vt": 176916.0, "cancelado": false}, {"np": "NP-114997", "cliente": "INBETTA", "etapa": "Análise de Requisição", "vencimento": "01/08/2026", "mrr": 4407.74, "arr": 0.0, "vt": 52892.88, "cancelado": false}, {"np": "NP-114996", "cliente": "IMPORTADORA BAGE S/A", "etapa": "Análise de Requisição", "vencimento": "01/08/2026", "mrr": 3124.0, "arr": 0.0, "vt": 37488.0, "cancelado": false}, {"np": "NP-114979", "cliente": "FRIGELAR", "etapa": "Análise de Requisição", "vencimento": "01/08/2026", "mrr": 13387.17, "arr": 0.0, "vt": 160646.04, "cancelado": false}, {"np": "NP-114976", "cliente": "FERBASA", "etapa": "Análise de Requisição", "vencimento": "01/10/2026", "mrr": 4011.49, "arr": 7198.99, "vt": 55336.87, "cancelado": false}, {"np": "NP-114975", "cliente": "FCC - FORNECEDORA COMPONENTES QUÍMICOS E COUROS LTDA", "etapa": "Análise de Requisição", "vencimento": "01/08/2026", "mrr": 2929.0, "arr": 0.0, "vt": 35148.0, "cancelado": false}, {"np": "NP-114962", "cliente": "CLAMPER", "etapa": "Contrato Cancelado", "vencimento": "01/07/2026", "mrr": 592.44, "arr": 0.0, "vt": 7109.28, "cancelado": true}, {"np": "NP-114953", "cliente": "BRASKEM", "etapa": "Análise de Requisição", "vencimento": "01/04/2026", "mrr": 2700.0, "arr": 0.0, "vt": 32400.0, "cancelado": false}], "ativos": 15, "vt_pipeline": 352736.0, "vt_fechados": 3600.0, "enviados": 7}, "Varejo & Moda": {"pipe_ativos": 12, "pipe_vt": 42868.0, "pipe_enviados": 4, "pipe_negoc": 0, "pipe_fechados": 1, "pipe_vt_fech": 1140.0, "conv_pct": 7.7, "contr_ativos": 11, "contr_cancel": 0, "contr_mrr": 28112.36, "contr_arr": 89101.97, "contr_vt": 426450.29, "n_cli_pipe": 5, "n_cli_contr": 11, "n_cli_ambos": 4, "n_cli_so_contr": 7, "n_cli_so_pipe": 1, "projetos": [{"np": "NP-114514", "cliente": "TORRA TORRA", "etapa": "Projeto Faturado", "vt": 1140.0, "dias": null, "tipo": "fechado"}, {"np": "NP-113083", "cliente": "AREZZO INDUSTRIA E COMERCIO LTDA", "etapa": "Elaboração de Projeto", "vt": 0.0, "dias": 194, "tipo": "ativo"}, {"np": "NP-113081", "cliente": "AREZZO INDUSTRIA E COMERCIO LTDA", "etapa": "Elaboração de Projeto", "vt": 0.0, "dias": 194, "tipo": "ativo"}, {"np": "NP-113080", "cliente": "AREZZO INDUSTRIA E COMERCIO LTDA", "etapa": "Elaboração de Projeto", "vt": 0.0, "dias": 194, "tipo": "ativo"}, {"np": "NP-112300", "cliente": "AREZZO INDUSTRIA E COMERCIO LTDA", "etapa": "Elaboração de Projeto", "vt": 0.0, "dias": 229, "tipo": "ativo"}, {"np": "NP-116052", "cliente": "AREZZO INDUSTRIA E COMERCIO LTDA", "etapa": "Estimativa de Esforço", "vt": 0.0, "dias": 17, "tipo": "ativo"}, {"np": "NP-115156", "cliente": "TORRA TORRA", "etapa": "Estimativa de Esforço", "vt": 0.0, "dias": 70, "tipo": "ativo"}, {"np": "NP-114138", "cliente": "TORRA TORRA", "etapa": "Processo Financeiro", "vt": 760.0, "dias": 131, "tipo": "ativo"}, {"np": "NP-115495", "cliente": "SEPHORA DO BRASIL PARTICIPAÇÕES S.A.", "etapa": "Projeto Enviado", "vt": 1200.0, "dias": 48, "tipo": "ativo"}, {"np": "NP-115323", "cliente": "SEPHORA DO BRASIL PARTICIPAÇÕES S.A.", "etapa": "Projeto Enviado", "vt": 20900.0, "dias": 61, "tipo": "ativo"}, {"np": "NP-113798", "cliente": "SAO JOAO FARMACIAS", "etapa": "Projeto Enviado", "vt": 15048.0, "dias": 153, "tipo": "ativo"}, {"np": "NP-113762", "cliente": "TORRA TORRA", "etapa": "Projeto Enviado", "vt": 4960.0, "dias": 154, "tipo": "ativo"}, {"np": "NP-115797", "cliente": "ALPARGATAS", "etapa": "Qualificação Concluída", "vt": 0.0, "dias": 32, "tipo": "ativo"}], "contratos": [{"np": "NP-115061", "cliente": "TORRA TORRA", "etapa": "Análise de Requisição", "vencimento": "01/08/2026", "mrr": 4424.57, "arr": 0.0, "vt": 53094.84, "cancelado": false}, {"np": "NP-115047", "cliente": "SEPHORA DO BRASIL PARTICIPAÇÕES S.A.", "etapa": "Análise de Requisição", "vencimento": "01/12/2026", "mrr": 0.0, "arr": 19264.2, "vt": 19264.2, "cancelado": false}, {"np": "NP-115041", "cliente": "SAO JOAO FARMACIAS", "etapa": "Análise de Requisição", "vencimento": "01/08/2026", "mrr": 2905.27, "arr": 0.0, "vt": 34863.24, "cancelado": false}, {"np": "NP-115014", "cliente": "LOJAS LEBES", "etapa": "Análise de Requisição", "vencimento": "01/10/2026", "mrr": 5420.61, "arr": 0.0, "vt": 65047.32, "cancelado": false}, {"np": "NP-115013", "cliente": "LOJAS RENNER", "etapa": "Análise de Requisição", "vencimento": "01/12/2026", "mrr": 521.2, "arr": 0.0, "vt": 6254.4, "cancelado": false}, {"np": "NP-115012", "cliente": "LOJAS COLOMBO S/A", "etapa": "Análise de Requisição", "vencimento": "01/05/2026", "mrr": 863.0, "arr": 0.0, "vt": 10356.0, "cancelado": false}, {"np": "NP-114995", "cliente": "IGUATEMI EMPRESA DE SHOPPING CENTERS S/A", "etapa": "Análise de Requisição", "vencimento": "01/07/2026", "mrr": 7141.4, "arr": 0.0, "vt": 85696.8, "cancelado": false}, {"np": "NP-114989", "cliente": "GRUPO THATHI - PANAMBY", "etapa": "Análise de Requisição", "vencimento": "01/04/2026", "mrr": 3160.16, "arr": 0.0, "vt": 37921.92, "cancelado": false}, {"np": "NP-114987", "cliente": "GRUPO MARINGÁ", "etapa": "Análise de Requisição", "vencimento": "01/12/2026", "mrr": 1466.15, "arr": 7198.99, "vt": 24792.79, "cancelado": false}, {"np": "NP-114956", "cliente": "CALÇADOS BEIRA RIO", "etapa": "Renovado", "vencimento": "01/01/2026", "mrr": 0.0, "arr": 9062.78, "vt": 9062.78, "cancelado": false}, {"np": "NP-114942", "cliente": "AREZZO INDUSTRIA E COMERCIO LTDA", "etapa": "Análise de Requisição", "vencimento": "01/08/2026", "mrr": 2210.0, "arr": 53576.0, "vt": 80096.0, "cancelado": false}], "ativos": 12, "vt_pipeline": 42868.0, "vt_fechados": 1140.0, "enviados": 4}, "Telecom & Mídia": {"pipe_ativos": 13, "pipe_vt": 118032.0, "pipe_enviados": 4, "pipe_negoc": 0, "pipe_fechados": 1, "pipe_vt_fech": 43056.0, "conv_pct": 7.1, "contr_ativos": 9, "contr_cancel": 0, "contr_mrr": 13877.22, "contr_arr": 106212.92, "contr_vt": 373683.24, "n_cli_pipe": 4, "n_cli_contr": 9, "n_cli_ambos": 3, "n_cli_so_contr": 6, "n_cli_so_pipe": 1, "projetos": [{"np": "NP-114632", "cliente": "Novvacore Jr & Js - Telecom LTDA", "etapa": "Projeto Faturado", "vt": 43056.0, "dias": null, "tipo": "fechado"}, {"np": "NP-115697", "cliente": "BULLLA SA", "etapa": "Elaboração de Projeto", "vt": 0.0, "dias": 39, "tipo": "ativo"}, {"np": "NP-113488", "cliente": "BULLLA SA", "etapa": "Elaboração de Projeto", "vt": 0.0, "dias": 172, "tipo": "ativo"}, {"np": "NP-113462", "cliente": "RBS - Televisão Gaúcha SA", "etapa": "Elaboração de Projeto", "vt": 0.0, "dias": 172, "tipo": "ativo"}, {"np": "NP-113285", "cliente": "BULLLA SA", "etapa": "Elaboração de Projeto", "vt": 0.0, "dias": 182, "tipo": "ativo"}, {"np": "NP-112886", "cliente": "BULLLA SA", "etapa": "Elaboração de Projeto", "vt": 0.0, "dias": 201, "tipo": "ativo"}, {"np": "NP-112633", "cliente": "CORTEL", "etapa": "Elaboração de Projeto", "vt": 0.0, "dias": 214, "tipo": "ativo"}, {"np": "NP-115991", "cliente": "BULLLA SA", "etapa": "Estimativa de Esforço", "vt": 0.0, "dias": 20, "tipo": "ativo"}, {"np": "NP-115724", "cliente": "BULLLA SA", "etapa": "Projeto Aprovado", "vt": 16720.0, "dias": 38, "tipo": "ativo"}, {"np": "NP-115606", "cliente": "BULLLA SA", "etapa": "Projeto Aprovado", "vt": 30020.0, "dias": 42, "tipo": "ativo"}, {"np": "NP-115830", "cliente": "BULLLA SA", "etapa": "Projeto Enviado", "vt": 9500.0, "dias": 28, "tipo": "ativo"}, {"np": "NP-115120", "cliente": "RBS - Televisão Gaúcha SA", "etapa": "Projeto Enviado", "vt": 7600.0, "dias": 74, "tipo": "ativo"}, {"np": "NP-115119", "cliente": "RBS - Televisão Gaúcha SA", "etapa": "Projeto Enviado", "vt": 15792.0, "dias": 74, "tipo": "ativo"}, {"np": "NP-113663", "cliente": "BULLLA SA", "etapa": "Projeto Enviado", "vt": 38400.0, "dias": 161, "tipo": "ativo"}], "contratos": [{"np": "NP-116092", "cliente": "CORTEL", "etapa": "Análise de Requisição", "vencimento": "01/11/2026", "mrr": 0.0, "arr": 16532.0, "vt": 16532.64, "cancelado": false}, {"np": "NP-115079", "cliente": "BULLLA SA", "etapa": "Análise de Requisição", "vencimento": "01/11/2026", "mrr": 2970.6, "arr": 0.0, "vt": 35647.2, "cancelado": false}, {"np": "NP-115052", "cliente": "SOLVER", "etapa": "Análise de Requisição", "vencimento": "01/12/2026", "mrr": 3125.72, "arr": 0.0, "vt": 37508.64, "cancelado": false}, {"np": "NP-115031", "cliente": "RBS - Televisão Gaúcha SA", "etapa": "Análise de Requisição", "vencimento": "01/09/2026", "mrr": 0.0, "arr": 59339.73, "vt": 59339.73, "cancelado": false}, {"np": "NP-115022", "cliente": "OCYAN", "etapa": "Processo Financeiro", "vencimento": "01/01/2026", "mrr": 0.0, "arr": 9176.64, "vt": 110119.68, "cancelado": false}, {"np": "NP-115020", "cliente": "Nauterra", "etapa": "Análise de Requisição", "vencimento": "01/12/2026", "mrr": 0.0, "arr": 13048.0, "vt": 13048.0, "cancelado": false}, {"np": "NP-115009", "cliente": "LETTEL", "etapa": "Análise de Requisição", "vencimento": "01/09/2026", "mrr": 0.0, "arr": 8116.55, "vt": 8116.55, "cancelado": false}, {"np": "NP-114986", "cliente": "GRPCOM GRUPO PARANAENSE DE COMUNICAÇÃO", "etapa": "Análise de Requisição", "vencimento": "01/07/2026", "mrr": 6869.0, "arr": 0.0, "vt": 82428.0, "cancelado": false}, {"np": "NP-114971", "cliente": "ENERGY TELECOM", "etapa": "Análise de Requisição", "vencimento": "01/11/2026", "mrr": 911.9, "arr": 0.0, "vt": 10942.8, "cancelado": false}], "ativos": 13, "vt_pipeline": 118032.0, "vt_fechados": 43056.0, "enviados": 4}, "Financeiro & Seguros": {"pipe_ativos": 10, "pipe_vt": 62275.0, "pipe_enviados": 2, "pipe_negoc": 2, "pipe_fechados": 1, "pipe_vt_fech": 9600.0, "conv_pct": 9.1, "contr_ativos": 9, "contr_cancel": 0, "contr_mrr": 46240.5, "contr_arr": 32536.75, "contr_vt": 587428.75, "n_cli_pipe": 6, "n_cli_contr": 8, "n_cli_ambos": 5, "n_cli_so_contr": 3, "n_cli_so_pipe": 1, "projetos": [{"np": "NP-112107", "cliente": "SABEMI SEGURADORA", "etapa": "Projeto Faturado", "vt": 9600.0, "dias": null, "tipo": "fechado"}, {"np": "NP-115271", "cliente": "ABBC - Associação Brasileira de Bancos", "etapa": "Elaboração de Projeto", "vt": 0.0, "dias": 63, "tipo": "ativo"}, {"np": "NP-113311", "cliente": "Argenta Participacoes LTDA", "etapa": "Elaboração de Projeto", "vt": 0.0, "dias": 180, "tipo": "ativo"}, {"np": "NP-116178", "cliente": "Argenta Participacoes LTDA", "etapa": "Estimativa de Esforço", "vt": 0.0, "dias": 7, "tipo": "ativo"}, {"np": "NP-115755", "cliente": "SAQUE PAGUE", "etapa": "Estimativa de Esforço", "vt": 0.0, "dias": 33, "tipo": "ativo"}, {"np": "NP-114516", "cliente": "AUTTAR - GETNET", "etapa": "Negociação", "vt": 37475.0, "dias": 103, "tipo": "ativo"}, {"np": "NP-113114", "cliente": "SABEMI SEGURADORA", "etapa": "Negociação", "vt": 3040.0, "dias": 192, "tipo": "ativo"}, {"np": "NP-114416", "cliente": "Argenta Participacoes LTDA", "etapa": "Projeto Enviado", "vt": 1360.0, "dias": 111, "tipo": "ativo"}, {"np": "NP-111880", "cliente": "Argenta Participacoes LTDA", "etapa": "Projeto Enviado", "vt": 13600.0, "dias": 251, "tipo": "ativo"}, {"np": "NP-116159", "cliente": "REDE BRASIL GESTÃO DE ATIVOS", "etapa": "Qualificação Concluída", "vt": 0.0, "dias": 10, "tipo": "ativo"}, {"np": "NP-113826", "cliente": "Argenta Participacoes LTDA", "etapa": "Qualificação Concluída", "vt": 6800.0, "dias": 152, "tipo": "ativo"}], "contratos": [{"np": "NP-116108", "cliente": "Argenta Participacoes LTDA", "etapa": "Análise de Requisição", "vencimento": "01/12/2026", "mrr": 19752.92, "arr": 0.0, "vt": 237035.04, "cancelado": false}, {"np": "NP-115702", "cliente": "Argenta Participacoes LTDA", "etapa": "Análise de Requisição", "vencimento": "01/05/2026", "mrr": 3988.05, "arr": 0.0, "vt": 47856.6, "cancelado": false}, {"np": "NP-115048", "cliente": "SEPROL", "etapa": "Renovado", "vencimento": "01/01/2026", "mrr": 746.27, "arr": 0.0, "vt": 8955.24, "cancelado": false}, {"np": "NP-115043", "cliente": "SAQUE PAGUE", "etapa": "Renovado", "vencimento": "01/02/2026", "mrr": 5081.9, "arr": 0.0, "vt": 60982.8, "cancelado": false}, {"np": "NP-115037", "cliente": "SABEMI SEGURADORA", "etapa": "Renovado", "vencimento": "01/02/2026", "mrr": 1923.8, "arr": 0.0, "vt": 23085.6, "cancelado": false}, {"np": "NP-115026", "cliente": "Pestana Leilões", "etapa": "Análise de Requisição", "vencimento": "01/05/2026", "mrr": 0.0, "arr": 7387.08, "vt": 7387.08, "cancelado": false}, {"np": "NP-114948", "cliente": "AUTTAR - GETNET", "etapa": "Análise de Requisição", "vencimento": "01/06/2026", "mrr": 0.0, "arr": 20834.0, "vt": 20840.0, "cancelado": false}, {"np": "NP-114940", "cliente": "AGIPLAN SERVIÇOS FINANCEIROS (AGIBANK)", "etapa": "Análise de Requisição", "vencimento": "01/07/2026", "mrr": 14747.56, "arr": 0.0, "vt": 176970.72, "cancelado": false}, {"np": "NP-114796", "cliente": "ABBC - Associação Brasileira de Bancos", "etapa": "Análise de Requisição", "vencimento": "01/10/2026", "mrr": 0.0, "arr": 4315.67, "vt": 4315.67, "cancelado": false}], "ativos": 10, "vt_pipeline": 62275.0, "vt_fechados": 9600.0, "enviados": 2}, "Agronegócio": {"pipe_ativos": 10, "pipe_vt": 392868.0, "pipe_enviados": 4, "pipe_negoc": 0, "pipe_fechados": 0, "pipe_vt_fech": 0.0, "conv_pct": 0.0, "contr_ativos": 6, "contr_cancel": 0, "contr_mrr": 12879.2, "contr_arr": 68581.0, "contr_vt": 222763.24, "n_cli_pipe": 5, "n_cli_contr": 6, "n_cli_ambos": 4, "n_cli_so_contr": 2, "n_cli_so_pipe": 1, "projetos": [{"np": "NP-115600", "cliente": "ZILOR ENERGIA E ALIMENTOS", "etapa": "Elaboração de Projeto", "vt": 0.0, "dias": 45, "tipo": "ativo"}, {"np": "NP-112728", "cliente": "CASTROLANDA", "etapa": "Elaboração de Projeto", "vt": 0.0, "dias": 208, "tipo": "ativo"}, {"np": "NP-116139", "cliente": "ZILOR ENERGIA E ALIMENTOS", "etapa": "Estimativa de Esforço", "vt": 0.0, "dias": 11, "tipo": "ativo"}, {"np": "NP-115788", "cliente": "USINA SAO JOSE DA ESTIVA", "etapa": "Estimativa de Esforço", "vt": 0.0, "dias": 33, "tipo": "ativo"}, {"np": "NP-115397", "cliente": "CASTROLANDA", "etapa": "Estimativa de Esforço", "vt": 0.0, "dias": 54, "tipo": "ativo"}, {"np": "NP-114780", "cliente": "CASTROLANDA", "etapa": "Estimativa de Esforço", "vt": 0.0, "dias": 77, "tipo": "ativo"}, {"np": "NP-115875", "cliente": "CASTROLANDA", "etapa": "Projeto Enviado", "vt": 23472.0, "dias": 27, "tipo": "ativo"}, {"np": "NP-113753", "cliente": "COOPERATIVA AGRO-INDUSTRIAL HOLAMBRA", "etapa": "Projeto Enviado", "vt": 343404.0, "dias": 154, "tipo": "ativo"}, {"np": "NP-113547", "cliente": "TIMAC AGRO", "etapa": "Projeto Enviado", "vt": 24192.0, "dias": 167, "tipo": "ativo"}, {"np": "NP-113058", "cliente": "CASTROLANDA", "etapa": "Projeto Enviado", "vt": 1800.0, "dias": 195, "tipo": "ativo"}], "contratos": [{"np": "NP-115074", "cliente": "ZILOR ENERGIA E ALIMENTOS", "etapa": "Análise de Requisição", "vencimento": "01/08/2026", "mrr": 7755.04, "arr": 0.0, "vt": 93060.48, "cancelado": false}, {"np": "NP-115069", "cliente": "USINA SAO JOSE DA ESTIVA", "etapa": "Análise de Requisição", "vencimento": "01/08/2026", "mrr": 1967.37, "arr": 0.0, "vt": 23608.44, "cancelado": false}, {"np": "NP-115068", "cliente": "USINA SANTA ISABEL", "etapa": "Renovado", "vencimento": "01/02/2026", "mrr": 1435.0, "arr": 0.0, "vt": 17220.0, "cancelado": false}, {"np": "NP-115060", "cliente": "TIMAC AGRO", "etapa": "Análise de Requisição", "vencimento": "01/12/2026", "mrr": 0.0, "arr": 11826.0, "vt": 11826.0, "cancelado": false}, {"np": "NP-114968", "cliente": "COTRIBÁ", "etapa": "Processo Financeiro", "vencimento": "01/03/2026", "mrr": 623.79, "arr": 0.0, "vt": 7117.32, "cancelado": false}, {"np": "NP-114957", "cliente": "CASTROLANDA", "etapa": "Análise de Requisição", "vencimento": "01/09/2026", "mrr": 1098.0, "arr": 56755.0, "vt": 69931.0, "cancelado": false}], "ativos": 10, "vt_pipeline": 392868.0, "vt_fechados": 0.0, "enviados": 4}, "Alimentos & Bebidas": {"pipe_ativos": 5, "pipe_vt": 144491.0, "pipe_enviados": 2, "pipe_negoc": 0, "pipe_fechados": 1, "pipe_vt_fech": 760.0, "conv_pct": 16.7, "contr_ativos": 9, "contr_cancel": 1, "contr_mrr": 58311.62, "contr_arr": 173941.98, "contr_vt": 873681.42, "n_cli_pipe": 5, "n_cli_contr": 10, "n_cli_ambos": 4, "n_cli_so_contr": 6, "n_cli_so_pipe": 1, "projetos": [{"np": "NP-114454", "cliente": "KICALDO", "etapa": "Projeto Faturado", "vt": 760.0, "dias": null, "tipo": "fechado"}, {"np": "NP-113676", "cliente": "Gourmet Sports Hospitality Serviços de Alimentação Ltda", "etapa": "Processo Financeiro", "vt": 11004.0, "dias": 160, "tipo": "ativo"}, {"np": "NP-114520", "cliente": "Nutrire Indústria de Alimentos", "etapa": "Projeto Enviado", "vt": 23087.0, "dias": 102, "tipo": "ativo"}, {"np": "NP-113068", "cliente": "CERVEJARIA PETRÓPOLIS", "etapa": "Projeto Enviado", "vt": 110400.0, "dias": 195, "tipo": "ativo"}, {"np": "NP-115993", "cliente": "Sapore", "etapa": "Qualificação", "vt": 0.0, "dias": 19, "tipo": "ativo"}, {"np": "NP-114746", "cliente": "Sapore", "etapa": "Qualificação", "vt": 0.0, "dias": 83, "tipo": "ativo"}], "contratos": [{"np": "NP-116091", "cliente": "CERVEJARIA PETRÓPOLIS", "etapa": "Análise de Requisição", "vencimento": "01/12/2026", "mrr": 10348.61, "arr": 139440.0, "vt": 263623.32, "cancelado": false}, {"np": "NP-115076", "cliente": "FORNO DE MINAS", "etapa": "Processo Financeiro", "vencimento": "01/01/2026", "mrr": 0.0, "arr": 777.0, "vt": 777.0, "cancelado": false}, {"np": "NP-115064", "cliente": "UNIDASUL DISTRIBUIDORA ALIMENTÍCIA S.A.", "etapa": "Análise de Requisição", "vencimento": "01/09/2026", "mrr": 24390.47, "arr": 0.0, "vt": 292685.64, "cancelado": false}, {"np": "NP-115059", "cliente": "TENDA ATACADO", "etapa": "Análise de Requisição", "vencimento": "01/10/2026", "mrr": 0.0, "arr": 19865.53, "vt": 19865.53, "cancelado": false}, {"np": "NP-115042", "cliente": "Sapore", "etapa": "Análise de Requisição", "vencimento": "01/03/2026", "mrr": 14196.9, "arr": 0.0, "vt": 170362.8, "cancelado": false}, {"np": "NP-115021", "cliente": "NISSIN FOODS DO BRASIL LTDA", "etapa": "Análise de Requisição", "vencimento": "01/12/2026", "mrr": 3670.0, "arr": 0.0, "vt": 44040.0, "cancelado": false}, {"np": "NP-115007", "cliente": "KICALDO", "etapa": "Análise de Requisição", "vencimento": "01/02/2026", "mrr": 0.0, "arr": 2052.45, "vt": 2052.45, "cancelado": false}, {"np": "NP-114990", "cliente": "GTFOODS GROUP", "etapa": "Contrato Cancelado", "vencimento": "01/03/2026", "mrr": 0.0, "arr": 14240.0, "vt": 14240.0, "cancelado": true}, {"np": "NP-114984", "cliente": "Gourmet Sports Hospitality Serviços de Alimentação Ltda", "etapa": "Análise de Requisição", "vencimento": "01/10/2026", "mrr": 5705.64, "arr": 0.0, "vt": 68467.68, "cancelado": false}, {"np": "NP-114980", "cliente": "FRUKI", "etapa": "Análise de Requisição", "vencimento": "01/08/2026", "mrr": 0.0, "arr": 11807.0, "vt": 11807.0, "cancelado": false}], "ativos": 5, "vt_pipeline": 144491.0, "vt_fechados": 760.0, "enviados": 2}, "Meio Ambiente": {"pipe_ativos": 8, "pipe_vt": 72507.0, "pipe_enviados": 1, "pipe_negoc": 0, "pipe_fechados": 2, "pipe_vt_fech": 82512.0, "conv_pct": 20.0, "contr_ativos": 5, "contr_cancel": 0, "contr_mrr": 14469.32, "contr_arr": 58240.37, "contr_vt": 231872.21, "n_cli_pipe": 4, "n_cli_contr": 5, "n_cli_ambos": 2, "n_cli_so_contr": 3, "n_cli_so_pipe": 2, "projetos": [{"np": "NP-116129", "cliente": "Cetrel - Central de Tratamento de Efluentes Líquidos", "etapa": "Projeto Faturado", "vt": 3600.0, "dias": null, "tipo": "fechado"}, {"np": "NP-114581", "cliente": "SOLVI PARTICIPAÇÕES", "etapa": "Projeto Faturado", "vt": 78912.0, "dias": null, "tipo": "fechado"}, {"np": "NP-115992", "cliente": "SOLVI PARTICIPAÇÕES", "etapa": "Estimativa de Esforço", "vt": 0.0, "dias": 19, "tipo": "ativo"}, {"np": "NP-116040", "cliente": "Cetrel - Central de Tratamento de Efluentes Líquidos", "etapa": "Processo Financeiro", "vt": 3600.0, "dias": 17, "tipo": "ativo"}, {"np": "NP-115586", "cliente": "Cetrel - Central de Tratamento de Efluentes Líquidos", "etapa": "Processo Financeiro", "vt": 1520.0, "dias": 45, "tipo": "ativo"}, {"np": "NP-115250", "cliente": "RRP ENERGIA", "etapa": "Projeto Enviado", "vt": 67387.0, "dias": 66, "tipo": "ativo"}, {"np": "NP-115951", "cliente": "SOLVI PARTICIPAÇÕES", "etapa": "Qualificação", "vt": 0.0, "dias": 21, "tipo": "ativo"}, {"np": "NP-114714", "cliente": "SOLVI PARTICIPAÇÕES", "etapa": "Qualificação", "vt": 0.0, "dias": 87, "tipo": "ativo"}, {"np": "NP-116078", "cliente": "Essencis Soluções Ambientais", "etapa": "Qualificação Concluída", "vt": 0.0, "dias": 14, "tipo": "ativo"}, {"np": "NP-116069", "cliente": "Cetrel - Central de Tratamento de Efluentes Líquidos", "etapa": "Qualificação Concluída", "vt": 0.0, "dias": 14, "tipo": "ativo"}], "contratos": [{"np": "NP-115053", "cliente": "SOLVI PARTICIPAÇÕES", "etapa": "Análise de Requisição", "vencimento": "01/12/2026", "mrr": 12792.0, "arr": 0.0, "vt": 153504.0, "cancelado": false}, {"np": "NP-115044", "cliente": "SCGAS - COMPANHIA DE GAS DE SANTA CATARINA", "etapa": "Análise de Requisição", "vencimento": "01/03/2026", "mrr": 0.0, "arr": 6986.0, "vt": 6986.0, "cancelado": false}, {"np": "NP-115023", "cliente": "ORIZON", "etapa": "Análise de Requisição", "vencimento": "01/05/2026", "mrr": 1677.32, "arr": 23122.0, "vt": 43249.84, "cancelado": false}, {"np": "NP-114973", "cliente": "ESTRE AMBIENTAL", "etapa": "Análise de Requisição", "vencimento": "01/12/2026", "mrr": 0.0, "arr": 16810.0, "vt": 16810.0, "cancelado": false}, {"np": "NP-114961", "cliente": "Cetrel - Central de Tratamento de Efluentes Líquidos", "etapa": "Análise de Requisição", "vencimento": "01/12/2026", "mrr": 0.0, "arr": 11322.37, "vt": 11322.37, "cancelado": false}], "ativos": 8, "vt_pipeline": 72507.0, "vt_fechados": 82512.0, "enviados": 1}, "Educação": {"pipe_ativos": 7, "pipe_vt": 360127.28, "pipe_enviados": 4, "pipe_negoc": 1, "pipe_fechados": 0, "pipe_vt_fech": 0.0, "conv_pct": 0.0, "contr_ativos": 3, "contr_cancel": 1, "contr_mrr": 5237.0, "contr_arr": 50079.64, "contr_vt": 112923.64, "n_cli_pipe": 6, "n_cli_contr": 4, "n_cli_ambos": 2, "n_cli_so_contr": 2, "n_cli_so_pipe": 4, "projetos": [{"np": "NP-112130", "cliente": "SEBRAE-PR", "etapa": "Elaboração de Projeto", "vt": 0.0, "dias": 238, "tipo": "ativo"}, {"np": "NP-114406", "cliente": "SENAC RJ", "etapa": "Negociação", "vt": 178043.28, "dias": 111, "tipo": "ativo"}, {"np": "NP-115719", "cliente": "UNIVALI", "etapa": "Projeto Enviado", "vt": 0.0, "dias": 38, "tipo": "ativo"}, {"np": "NP-115363", "cliente": "SENAC RJ", "etapa": "Projeto Enviado", "vt": 13680.0, "dias": 56, "tipo": "ativo"}, {"np": "NP-114712", "cliente": "Associação dos Engenheiros da Sabesp", "etapa": "Projeto Enviado", "vt": 142404.0, "dias": 87, "tipo": "ativo"}, {"np": "NP-113350", "cliente": "Associação Leopoldina Juvenil (ALJ)", "etapa": "Projeto Enviado", "vt": 26000.0, "dias": 179, "tipo": "ativo"}, {"np": "NP-114669", "cliente": "Associação Educadora e Beneficente", "etapa": "Qualificação", "vt": 0.0, "dias": 91, "tipo": "ativo"}], "contratos": [{"np": "NP-116075", "cliente": "ASSOCIAÇÃO ANTÔNIO VEIRA JESUÍTA DO BRASIL (ASAV)", "etapa": "Contrato Cancelado", "vencimento": "01/01/2026", "mrr": 2416.14, "arr": 0.0, "vt": 28993.68, "cancelado": true}, {"np": "NP-115067", "cliente": "UNIVALI", "etapa": "Análise de Requisição", "vencimento": "01/10/2026", "mrr": 4353.0, "arr": 0.0, "vt": 52236.0, "cancelado": false}, {"np": "NP-115046", "cliente": "SENAC RJ", "etapa": "Análise de Requisição", "vencimento": "01/05/2026", "mrr": 0.0, "arr": 44543.0, "vt": 44543.0, "cancelado": false}, {"np": "NP-115000", "cliente": "INSTITUTO FALCAO BAUER DA QUALIDADE", "etapa": "Análise de Requisição", "vencimento": "01/09/2026", "mrr": 884.0, "arr": 5536.64, "vt": 16144.64, "cancelado": false}], "ativos": 7, "vt_pipeline": 360127.28, "vt_fechados": 0.0, "enviados": 4}, "Governo & Público": {"pipe_ativos": 5, "pipe_vt": 125000.0, "pipe_enviados": 1, "pipe_negoc": 1, "pipe_fechados": 0, "pipe_vt_fech": 0.0, "conv_pct": 0.0, "contr_ativos": 3, "contr_cancel": 0, "contr_mrr": 6561.56, "contr_arr": 37234.16, "contr_vt": 115972.88, "n_cli_pipe": 3, "n_cli_contr": 3, "n_cli_ambos": 3, "n_cli_so_contr": 0, "n_cli_so_pipe": 0, "projetos": [{"np": "NP-112214", "cliente": "Trt Da 4ª Região", "etapa": "Elaboração de Projeto", "vt": 0.0, "dias": 235, "tipo": "ativo"}, {"np": "NP-113706", "cliente": "Trt Da 4ª Região", "etapa": "Estimativa de Esforço", "vt": 0.0, "dias": 159, "tipo": "ativo"}, {"np": "NP-113581", "cliente": "Trt Da 4ª Região", "etapa": "Estimativa de Esforço", "vt": 0.0, "dias": 166, "tipo": "ativo"}, {"np": "NP-113976", "cliente": "SERVIÇO SOCIAL DO COMÉRCIO - ADMINISTRAÇÃO REGIONAL NO ESTADO DO RIO DE JANEIRO (SESC/ ARRJ)", "etapa": "Negociação", "vt": 51300.0, "dias": 140, "tipo": "ativo"}, {"np": "NP-113992", "cliente": "SECRETARIA DA FAZENDA DO ESTADO DO ALAGOAS (SEFAZ AL)", "etapa": "Projeto Enviado", "vt": 73700.0, "dias": 139, "tipo": "ativo"}], "contratos": [{"np": "NP-115063", "cliente": "Trt Da 4ª Região", "etapa": "Em análise pelo cliente", "vencimento": "01/01/2026", "mrr": 6561.56, "arr": 0.0, "vt": 78738.72, "cancelado": false}, {"np": "NP-115050", "cliente": "SERVIÇO SOCIAL DO COMÉRCIO - ADMINISTRAÇÃO REGIONAL NO ESTADO DO RIO DE JANEIRO (SESC/ ARRJ)", "etapa": "Análise de Requisição", "vencimento": "01/09/2026", "mrr": 0.0, "arr": 0.0, "vt": 0.0, "cancelado": false}, {"np": "NP-115045", "cliente": "SECRETARIA DA FAZENDA DO ESTADO DO ALAGOAS (SEFAZ AL)", "etapa": "Análise de Requisição", "vencimento": "01/09/2026", "mrr": 0.0, "arr": 37234.16, "vt": 37234.16, "cancelado": false}], "ativos": 5, "vt_pipeline": 125000.0, "vt_fechados": 0.0, "enviados": 1}};
var EC={"Projeto Enviado": ["#dbeafe", "#1e40af"], "Negociação": ["#fef3c7", "#92400e"], "Elaboração de Projeto": ["#f3e8ff", "#6b21a8"], "Estimativa de Esforço": ["#f0fdf4", "#166534"], "Qualificação": ["#f1f5f9", "#334155"], "Qualificação Concluída": ["#ecfdf5", "#065f46"], "Elaboração de Caderno Técnico": ["#fff7ed", "#9a3412"], "Projeto Aprovado": ["#dcfce7", "#14532d"], "Processo Financeiro": ["#fdf4ff", "#701a75"], "Projeto Faturado": ["#dcfce7", "#14532d"], "Desistência": ["#f9fafb", "#6b7280"]};
var SC={"Tecnologia & TI": "#2563eb", "Saúde": "#059669", "Serviços & Infraestrutura": "#7c3aed", "Indústria": "#d97706", "Telecom & Mídia": "#0891b2", "Varejo & Moda": "#db2777", "Financeiro & Seguros": "#4f46e5", "Agronegócio": "#65a30d", "Meio Ambiente": "#0d9488", "Educação": "#9333ea", "Alimentos & Bebidas": "#ea580c", "Governo & Público": "#475569", "Outros": "#9ca3af"};
var SEG=null;
function bdg(e){var c=EC[e]||["#f1f5f9","#334155"];return'<span style="background:'+c[0]+';color:'+c[1]+';font-size:10px;font-weight:600;padding:2px 8px;border-radius:99px;white-space:nowrap;">'+e+'</span>';}
function age(d){if(d==null)return"—";var c,bg;if(d>60){c="#dc2626";bg="#fef2f2";}else if(d>=30){c="#d97706";bg="#fffbeb";}else{c="#16a34a";bg="#f0fdf4";}return'<span style="display:inline-flex;align-items:center;gap:3px;background:'+bg+';color:'+c+';font-size:10px;font-weight:700;padding:2px 8px;border-radius:99px;"><span style="width:6px;height:6px;border-radius:50%;background:'+c+';flex-shrink:0;"></span>'+d+'d</span>';}
function brf(v){if(!v)return'<span style="color:#d1d5db;">—</span>';return"R$ "+v.toLocaleString("pt-BR",{minimumFractionDigits:2});}
function renderP(info){
  document.getElementById("wtp-dd-thead").innerHTML='<tr style="background:var(--surface2)"><th style="padding:9px 16px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:var(--muted);border-bottom:1px solid var(--border);">NP</th><th style="padding:9px 16px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:var(--muted);border-bottom:1px solid var(--border);">Cliente</th><th style="padding:9px 16px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:var(--muted);border-bottom:1px solid var(--border);">Etapa</th><th style="padding:9px 16px;text-align:right;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:var(--muted);border-bottom:1px solid var(--border);">Valor Total</th><th style="padding:9px 16px;text-align:center;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:var(--muted);border-bottom:1px solid var(--border);">Idade</th></tr>';
  document.getElementById("wtp-dd-tbody").innerHTML=(info.projetos||[]).map(function(p,i){
    var bg=i%2===0?"var(--surface)":"var(--surface2)";
    var nc=p.tipo==="fechado"?"#059669":"var(--accent1)";
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
    var nc=p.cancelado?"var(--muted)":"#059669";
    return'<tr style="background:'+bg+';border-bottom:1px solid var(--border);opacity:'+(p.cancelado?"0.6":"1")+';">'+
      '<td style="padding:9px 16px;font-family:monospace;font-size:11px;font-weight:600;color:'+nc+';">'+p.np+'</td>'+
      '<td style="padding:9px 16px;font-size:13px;color:var(--text);">'+p.cliente+'</td>'+
      '<td style="padding:9px 16px;">'+bdg(p.etapa)+'</td>'+
      '<td style="padding:9px 16px;text-align:center;font-size:12px;color:var(--muted);">'+p.vencimento+'</td>'+
      '<td style="padding:9px 16px;text-align:right;font-size:12px;font-weight:600;color:#7c3aed;">'+brf(p.mrr)+'</td>'+
      '<td style="padding:9px 16px;text-align:right;font-size:12px;font-weight:600;color:#0891b2;">'+brf(p.arr)+'</td></tr>';
  }).join("");
}
window.wtpDrilldown=function(seg){
  SEG=seg;var info=D[seg];if(!info)return;
  var color=SC[seg]||"var(--accent1)";
  document.getElementById("wtp-dd-title").textContent=seg;
  document.getElementById("wtp-dd-title").style.color=color;
  document.getElementById("wtp-dd-sub").textContent=(info.projetos||[]).length+" projetos · "+(info.contratos||[]).length+" contratos · conv. "+info.conv_pct+"%";
  var bp=document.getElementById("wtp-tab-proj"),bc=document.getElementById("wtp-tab-contr");
  bp.style.borderBottomColor=color;bp.style.color="var(--text)";
  bc.style.borderBottomColor="transparent";bc.style.color="var(--muted)";
  renderP(info);
  var panel=document.getElementById("wtp-drilldown");
  panel.style.display="block";
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




<div id="tab-changelog" class="tab-panel">
<div class="page">
  <header>
    <div class="header-left">
      <div class="header-eyebrow">Histórico de Alterações</div>
      <h1 class="header-title">Histórico de<br><span style="color:var(--accent4);">Alterações</span></h1>
    </div>
  </header>
  <div class="card"><div class="card-header"><div><div class="card-title">Registro de Atualizações</div></div></div><p style="padding:20px;color:var(--muted);font-size:13px;">Histórico de snapshots e correções aplicadas ao dashboard.</p></div>
</div>
</div> <!-- fim tab-changelog -->

`;
    return new Response(d,{headers:{"Content-Type":"text/html; charset=utf-8","Cache-Control":"no-store","X-Frame-Options":"DENY"}});
  },
};
function login(e){return `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Acesso Restrito</title><link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;800&display=swap" rel="stylesheet"><style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:Nunito,sans-serif;background:#f0f2f5;min-height:100vh;display:flex;align-items:center;justify-content:center}.c{background:#fff;border-radius:18px;padding:52px 44px;width:100%;max-width:400px;box-shadow:0 8px 48px rgba(0,0,0,.10);text-align:center}h1{font-size:22px;font-weight:800;color:#111827;margin:12px 0 6px}p{font-size:13px;color:#6b7280;margin-bottom:28px}input{width:100%;padding:13px 16px;border:1.5px solid #e5e7eb;border-radius:10px;font-size:15px;outline:none;margin-bottom:12px}input:focus{border-color:#2563eb}.er{font-size:12px;color:#dc2626;margin-bottom:12px;min-height:18px}button{width:100%;padding:13px;background:#2563eb;color:#fff;border:none;border-radius:10px;font-size:15px;font-weight:700;cursor:pointer}button:hover{background:#1d4ed8}</style></head><body><div class="c"><div style="font-size:40px;margin-bottom:18px">🔒</div><h1>Acesso Restrito</h1><p>Digite a senha para acessar o dashboard</p><form method="POST" action="/login"><input type="password" name="senha" placeholder="Senha" autofocus><div class="er">${e}</div><button>Entrar</button></form></div></body></html>`;}
