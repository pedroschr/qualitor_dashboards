export default {
  async fetch(request, env) {

    const SENHA   = "Qualitor!@#25";
    const COOKIE  = "qlt_auth";
    const TOKEN   = "qualitor2026ok";  // valor do cookie de sessão

    const url     = new URL(request.url);
    const cookies = request.headers.get("Cookie") || "";
    const autenticado = cookies.includes(COOKIE + "=" + TOKEN);

    // ── POST /login — verifica a senha ────────────────────────────────────────
    if (request.method === "POST" && url.pathname === "/login") {
      const body  = await request.formData();
      const senha = body.get("senha") || "";

      if (senha === SENHA) {
        // Senha correta — seta cookie de sessão HttpOnly e redireciona
        return new Response("", {
          status: 302,
          headers: {
            "Location": "/",
            "Set-Cookie": `${COOKIE}=${TOKEN}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=28800`,
          },
        });
      }

      // Senha errada — volta ao login com erro
      return new Response(loginHTML("Senha incorreta. Tente novamente."), {
        status: 401,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    // ── GET /logout ───────────────────────────────────────────────────────────
    if (url.pathname === "/logout") {
      return new Response("", {
        status: 302,
        headers: {
          "Location": "/",
          "Set-Cookie": `${COOKIE}=; Path=/; Max-Age=0`,
        },
      });
    }

    // ── Não autenticado — exibe tela de login ─────────────────────────────────
    if (!autenticado) {
      return new Response(loginHTML(""), {
        status: 200,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    // ── Autenticado — serve o dashboard ───────────────────────────────────────
    const dashboard = `<!DOCTYPE html>
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
  <button class="tab-btn active" onclick="switchTab('pipeline', this)">📊 Pipeline Comercial</button>
  <button class="tab-btn" onclick="switchTab('gestao', this)">📁 Gestão de Contratos</button>
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
      <div class="p26-eyebrow">Pipeline Comercial · 2026</div>
      <h1 class="p26-title">Pipeline<br><span>Comercial</span></h1>
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

    <!-- Cabeçalho do card -->
    <div style="display:flex;justify-content:space-between;align-items:center;
      padding:18px 20px 14px;border-bottom:1px solid var(--border);">
      <div>
        <div style="font-size:13px;font-weight:700;color:#111827;">Projetos Aprovados ≥ Jan / 2026</div>
        <div style="font-size:12px;color:#6b7280;margin-top:2px;">
          Ordenado por data de aprovação · 15 projetos
        </div>
      </div>
      <div style="display:flex;gap:20px;font-size:11px;font-weight:700;color:#6b7280;">
        <span>Total VT <strong style="color:#111827;font-size:13px;margin-left:4px;">R$ 340.090,60</strong></span>
        <span>MRR <strong style="color:#7c3aed;font-size:13px;margin-left:4px;">R$ 18.254,00</strong></span>
        <span>ARR <strong style="color:#0891b2;font-size:13px;margin-left:4px;">R$ 121.033,00</strong></span>
      </div>
    </div>

    <!-- Tabela -->
    <div style="overflow-x:auto;">
      <table style="width:100%;border-collapse:collapse;">
        <thead>
          <tr style="background:#f8fafc;">
            <th style="padding:10px 16px;text-align:left;font-size:10px;font-weight:700;
              text-transform:uppercase;letter-spacing:1.5px;color:#9ca3af;
              border-bottom:1px solid #e5e7eb;">NP</th>
            <th style="padding:10px 16px;text-align:left;font-size:10px;font-weight:700;
              text-transform:uppercase;letter-spacing:1.5px;color:#9ca3af;
              border-bottom:1px solid #e5e7eb;">Cliente</th>
            <th style="padding:10px 16px;text-align:center;font-size:10px;font-weight:700;
              text-transform:uppercase;letter-spacing:1.5px;color:#9ca3af;
              border-bottom:1px solid #e5e7eb;">Aprovação</th>
            <th style="padding:10px 16px;text-align:right;font-size:10px;font-weight:700;
              text-transform:uppercase;letter-spacing:1.5px;color:#9ca3af;
              border-bottom:1px solid #e5e7eb;">Valor Total</th>
            <th style="padding:10px 16px;text-align:right;font-size:10px;font-weight:700;
              text-transform:uppercase;letter-spacing:1.5px;color:#7c3aed;
              border-bottom:1px solid #e5e7eb;">MRR</th>
            <th style="padding:10px 16px;text-align:right;font-size:10px;font-weight:700;
              text-transform:uppercase;letter-spacing:1.5px;color:#0891b2;
              border-bottom:1px solid #e5e7eb;">ARR</th>
          </tr>
        </thead>
        <tbody><tr>
          <td colspan="5" style="padding:10px 16px 8px;font-size:10px;font-weight:700;
            text-transform:uppercase;letter-spacing:2px;color:#059669;
            background:#f0fdf4;border-bottom:1px solid #d1fae5;">Janeiro / 2026</td>
        </tr><tr style="background:#ffffff;border-bottom:1px solid #f3f4f6;">
      <td style="padding:11px 16px;font-family:monospace;font-size:11px;font-weight:600;color:#2563eb;white-space:nowrap;">NP-115316</td>
      <td style="padding:11px 16px;font-size:13px;font-weight:600;color:#111827;">FRIGELAR</td>
      <td style="padding:11px 16px;text-align:center;font-size:12px;color:#6b7280;white-space:nowrap;">01/01/2026</td>
      <td style="padding:11px 16px;text-align:right;font-size:12px;font-weight:700;color:#111827;">R$ 3.600,00</td>
      <td style="padding:11px 16px;text-align:right;font-size:12px;font-weight:600;color:#7c3aed;">R$ 300,00</td>
      <td style="padding:11px 16px;text-align:right;font-size:12px;font-weight:600;color:#0891b2;"><span style="color:#d1d5db;">—</span></td>
    </tr><tr style="background:#fafafa;border-bottom:1px solid #f3f4f6;">
      <td style="padding:11px 16px;font-family:monospace;font-size:11px;font-weight:600;color:#2563eb;white-space:nowrap;">NP-115262</td>
      <td style="padding:11px 16px;font-size:13px;font-weight:600;color:#111827;">INTERCITY</td>
      <td style="padding:11px 16px;text-align:center;font-size:12px;color:#6b7280;white-space:nowrap;">01/01/2026</td>
      <td style="padding:11px 16px;text-align:right;font-size:12px;font-weight:700;color:#111827;">R$ 76.721,00</td>
      <td style="padding:11px 16px;text-align:right;font-size:12px;font-weight:600;color:#7c3aed;"><span style="color:#d1d5db;">—</span></td>
      <td style="padding:11px 16px;text-align:right;font-size:12px;font-weight:600;color:#0891b2;">R$ 76.721,00</td>
    </tr><tr style="background:#ffffff;border-bottom:1px solid #f3f4f6;">
      <td style="padding:11px 16px;font-family:monospace;font-size:11px;font-weight:600;color:#2563eb;white-space:nowrap;">NP-115157</td>
      <td style="padding:11px 16px;font-size:13px;font-weight:600;color:#111827;">STEFANINI</td>
      <td style="padding:11px 16px;text-align:center;font-size:12px;color:#6b7280;white-space:nowrap;">01/01/2026</td>
      <td style="padding:11px 16px;text-align:right;font-size:12px;font-weight:700;color:#111827;">R$ 62.889,60</td>
      <td style="padding:11px 16px;text-align:right;font-size:12px;font-weight:600;color:#7c3aed;">R$ 5.240,00</td>
      <td style="padding:11px 16px;text-align:right;font-size:12px;font-weight:600;color:#0891b2;"><span style="color:#d1d5db;">—</span></td>
    </tr><tr style="background:#fafafa;border-bottom:1px solid #f3f4f6;">
      <td style="padding:11px 16px;font-family:monospace;font-size:11px;font-weight:600;color:#2563eb;white-space:nowrap;">NP-114662</td>
      <td style="padding:11px 16px;font-size:13px;font-weight:600;color:#111827;">IRANI PAPEL E EMBALAGEM S.A</td>
      <td style="padding:11px 16px;text-align:center;font-size:12px;color:#6b7280;white-space:nowrap;">01/01/2026</td>
      <td style="padding:11px 16px;text-align:right;font-size:12px;font-weight:700;color:#111827;"><span style="color:#d1d5db;">—</span></td>
      <td style="padding:11px 16px;text-align:right;font-size:12px;font-weight:600;color:#7c3aed;"><span style="color:#d1d5db;">—</span></td>
      <td style="padding:11px 16px;text-align:right;font-size:12px;font-weight:600;color:#0891b2;"><span style="color:#d1d5db;">—</span></td>
    </tr><tr style="background:#ffffff;border-bottom:1px solid #f3f4f6;">
      <td style="padding:11px 16px;font-family:monospace;font-size:11px;font-weight:600;color:#2563eb;white-space:nowrap;">NP-114581</td>
      <td style="padding:11px 16px;font-size:13px;font-weight:600;color:#111827;">SOLVI PARTICIPAÇÕES</td>
      <td style="padding:11px 16px;text-align:center;font-size:12px;color:#6b7280;white-space:nowrap;">01/01/2026</td>
      <td style="padding:11px 16px;text-align:right;font-size:12px;font-weight:700;color:#111827;">R$ 78.912,00</td>
      <td style="padding:11px 16px;text-align:right;font-size:12px;font-weight:600;color:#7c3aed;">R$ 6.576,00</td>
      <td style="padding:11px 16px;text-align:right;font-size:12px;font-weight:600;color:#0891b2;"><span style="color:#d1d5db;">—</span></td>
    </tr><tr style="background:#fafafa;border-bottom:1px solid #f3f4f6;">
      <td style="padding:11px 16px;font-family:monospace;font-size:11px;font-weight:600;color:#2563eb;white-space:nowrap;">NP-114514</td>
      <td style="padding:11px 16px;font-size:13px;font-weight:600;color:#111827;">TORRA TORRA</td>
      <td style="padding:11px 16px;text-align:center;font-size:12px;color:#6b7280;white-space:nowrap;">01/01/2026</td>
      <td style="padding:11px 16px;text-align:right;font-size:12px;font-weight:700;color:#111827;">R$ 1.140,00</td>
      <td style="padding:11px 16px;text-align:right;font-size:12px;font-weight:600;color:#7c3aed;"><span style="color:#d1d5db;">—</span></td>
      <td style="padding:11px 16px;text-align:right;font-size:12px;font-weight:600;color:#0891b2;">R$ 1.140,00</td>
    </tr><tr style="background:#ffffff;border-bottom:1px solid #f3f4f6;">
      <td style="padding:11px 16px;font-family:monospace;font-size:11px;font-weight:600;color:#2563eb;white-space:nowrap;">NP-114454</td>
      <td style="padding:11px 16px;font-size:13px;font-weight:600;color:#111827;">KICALDO</td>
      <td style="padding:11px 16px;text-align:center;font-size:12px;color:#6b7280;white-space:nowrap;">01/01/2026</td>
      <td style="padding:11px 16px;text-align:right;font-size:12px;font-weight:700;color:#111827;">R$ 760,00</td>
      <td style="padding:11px 16px;text-align:right;font-size:12px;font-weight:600;color:#7c3aed;"><span style="color:#d1d5db;">—</span></td>
      <td style="padding:11px 16px;text-align:right;font-size:12px;font-weight:600;color:#0891b2;">R$ 760,00</td>
    </tr><tr style="background:#fafafa;border-bottom:1px solid #f3f4f6;">
      <td style="padding:11px 16px;font-family:monospace;font-size:11px;font-weight:600;color:#2563eb;white-space:nowrap;">NP-113067</td>
      <td style="padding:11px 16px;font-size:13px;font-weight:600;color:#111827;">EBM Incorporações S/A</td>
      <td style="padding:11px 16px;text-align:center;font-size:12px;color:#6b7280;white-space:nowrap;">01/01/2026</td>
      <td style="padding:11px 16px;text-align:right;font-size:12px;font-weight:700;color:#111827;">R$ 47.800,00</td>
      <td style="padding:11px 16px;text-align:right;font-size:12px;font-weight:600;color:#7c3aed;">R$ 1.450,00</td>
      <td style="padding:11px 16px;text-align:right;font-size:12px;font-weight:600;color:#0891b2;">R$ 30.400,00</td>
    </tr><tr style="background:#ffffff;border-bottom:1px solid #f3f4f6;">
      <td style="padding:11px 16px;font-family:monospace;font-size:11px;font-weight:600;color:#2563eb;white-space:nowrap;">NP-112107</td>
      <td style="padding:11px 16px;font-size:13px;font-weight:600;color:#111827;">SABEMI SEGURADORA</td>
      <td style="padding:11px 16px;text-align:center;font-size:12px;color:#6b7280;white-space:nowrap;">01/01/2026</td>
      <td style="padding:11px 16px;text-align:right;font-size:12px;font-weight:700;color:#111827;">R$ 9.600,00</td>
      <td style="padding:11px 16px;text-align:right;font-size:12px;font-weight:600;color:#7c3aed;">R$ 800,00</td>
      <td style="padding:11px 16px;text-align:right;font-size:12px;font-weight:600;color:#0891b2;"><span style="color:#d1d5db;">—</span></td>
    </tr><tr style="background:#fafafa;border-bottom:1px solid #f3f4f6;">
      <td style="padding:11px 16px;font-family:monospace;font-size:11px;font-weight:600;color:#2563eb;white-space:nowrap;">NP-114660</td>
      <td style="padding:11px 16px;font-size:13px;font-weight:600;color:#111827;">M.L.GOMES</td>
      <td style="padding:11px 16px;text-align:center;font-size:12px;color:#6b7280;white-space:nowrap;">02/01/2026</td>
      <td style="padding:11px 16px;text-align:right;font-size:12px;font-weight:700;color:#111827;">R$ 6.080,00</td>
      <td style="padding:11px 16px;text-align:right;font-size:12px;font-weight:600;color:#7c3aed;"><span style="color:#d1d5db;">—</span></td>
      <td style="padding:11px 16px;text-align:right;font-size:12px;font-weight:600;color:#0891b2;">R$ 6.080,00</td>
    </tr><tr style="background:#ffffff;border-bottom:1px solid #f3f4f6;">
      <td style="padding:11px 16px;font-family:monospace;font-size:11px;font-weight:600;color:#2563eb;white-space:nowrap;">NP-114632</td>
      <td style="padding:11px 16px;font-size:13px;font-weight:600;color:#111827;">Novvacore Jr & Js - Telecom LTDA</td>
      <td style="padding:11px 16px;text-align:center;font-size:12px;color:#6b7280;white-space:nowrap;">02/01/2026</td>
      <td style="padding:11px 16px;text-align:right;font-size:12px;font-weight:700;color:#111827;">R$ 43.056,00</td>
      <td style="padding:11px 16px;text-align:right;font-size:12px;font-weight:600;color:#7c3aed;">R$ 3.588,00</td>
      <td style="padding:11px 16px;text-align:right;font-size:12px;font-weight:600;color:#0891b2;"><span style="color:#d1d5db;">—</span></td>
    </tr><tr style="background:#fafafa;border-bottom:1px solid #f3f4f6;">
      <td style="padding:11px 16px;font-family:monospace;font-size:11px;font-weight:600;color:#2563eb;white-space:nowrap;">NP-116129</td>
      <td style="padding:11px 16px;font-size:13px;font-weight:600;color:#111827;">Cetrel - Central de Tratamento de Efluentes Líquidos</td>
      <td style="padding:11px 16px;text-align:center;font-size:12px;color:#6b7280;white-space:nowrap;">03/01/2026</td>
      <td style="padding:11px 16px;text-align:right;font-size:12px;font-weight:700;color:#111827;">R$ 3.600,00</td>
      <td style="padding:11px 16px;text-align:right;font-size:12px;font-weight:600;color:#7c3aed;">R$ 300,00</td>
      <td style="padding:11px 16px;text-align:right;font-size:12px;font-weight:600;color:#0891b2;"><span style="color:#d1d5db;">—</span></td>
    </tr><tr style="background:#ffffff;border-bottom:1px solid #f3f4f6;">
      <td style="padding:11px 16px;font-family:monospace;font-size:11px;font-weight:600;color:#2563eb;white-space:nowrap;">NP-116081</td>
      <td style="padding:11px 16px;font-size:13px;font-weight:600;color:#111827;">NETCENTER INFORMATICA</td>
      <td style="padding:11px 16px;text-align:center;font-size:12px;color:#6b7280;white-space:nowrap;">03/01/2026</td>
      <td style="padding:11px 16px;text-align:right;font-size:12px;font-weight:700;color:#111827;">R$ 3.800,00</td>
      <td style="padding:11px 16px;text-align:right;font-size:12px;font-weight:600;color:#7c3aed;"><span style="color:#d1d5db;">—</span></td>
      <td style="padding:11px 16px;text-align:right;font-size:12px;font-weight:600;color:#0891b2;">R$ 3.800,00</td>
    </tr><tr style="background:#fafafa;border-bottom:1px solid #f3f4f6;">
      <td style="padding:11px 16px;font-family:monospace;font-size:11px;font-weight:600;color:#2563eb;white-space:nowrap;">NP-115812</td>
      <td style="padding:11px 16px;font-size:13px;font-weight:600;color:#111827;">BRASTORAGE - THINK</td>
      <td style="padding:11px 16px;text-align:center;font-size:12px;color:#6b7280;white-space:nowrap;">03/01/2026</td>
      <td style="padding:11px 16px;text-align:right;font-size:12px;font-weight:700;color:#111827;">R$ 1.140,00</td>
      <td style="padding:11px 16px;text-align:right;font-size:12px;font-weight:600;color:#7c3aed;"><span style="color:#d1d5db;">—</span></td>
      <td style="padding:11px 16px;text-align:right;font-size:12px;font-weight:600;color:#0891b2;">R$ 1.140,00</td>
    </tr><tr style="background:#ffffff;border-bottom:1px solid #f3f4f6;">
      <td style="padding:11px 16px;font-family:monospace;font-size:11px;font-weight:600;color:#2563eb;white-space:nowrap;">NP-115715</td>
      <td style="padding:11px 16px;font-size:13px;font-weight:600;color:#111827;">CORPFLEX INFORMATICA LTDA</td>
      <td style="padding:11px 16px;text-align:center;font-size:12px;color:#6b7280;white-space:nowrap;">03/01/2026</td>
      <td style="padding:11px 16px;text-align:right;font-size:12px;font-weight:700;color:#111827;">R$ 992,00</td>
      <td style="padding:11px 16px;text-align:right;font-size:12px;font-weight:600;color:#7c3aed;"><span style="color:#d1d5db;">—</span></td>
      <td style="padding:11px 16px;text-align:right;font-size:12px;font-weight:600;color:#0891b2;">R$ 992,00</td>
    </tr></tbody>
        <tfoot>
          <tr style="background:#f0fdf4;border-top:2px solid #bbf7d0;">
            <td colspan="3" style="padding:12px 16px;font-size:11px;font-weight:700;
              text-transform:uppercase;letter-spacing:1px;color:#059669;">
              Total · 15 projetos
            </td>
            <td style="padding:12px 16px;text-align:right;font-size:13px;font-weight:800;color:#111827;">R$ 340.090,60</td>
            <td style="padding:12px 16px;text-align:right;font-size:13px;font-weight:800;color:#7c3aed;">R$ 18.254,00</td>
            <td style="padding:12px 16px;text-align:right;font-size:13px;font-weight:800;color:#0891b2;">R$ 121.033,00</td>
          </tr>
        </tfoot>
      </table>
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

  <!-- Seção 5 — Fechados por Mês -->
  <div class="p26-section-label" style="margin-top:40px;">Fechados por Mês — 2026</div>

  <div style="background:#fff;border:1px solid var(--border);border-radius:16px;overflow:hidden;">

    <!-- Cabeçalho -->
    <div style="display:flex;justify-content:space-between;align-items:center;
      padding:18px 20px 14px;border-bottom:1px solid var(--border);">
      <div>
        <div style="font-size:13px;font-weight:700;color:#111827;">Volume de Projetos Aprovados por Mês</div>
        <div style="font-size:12px;color:#6b7280;margin-top:2px;">
          Filtro: Data de Aprovação ≥ Jan/2026 · acumulado mensal
        </div>
      </div>
      <div style="display:flex;gap:20px;font-size:11px;font-weight:700;color:#6b7280;">
        <span>Total VT <strong style="color:#111827;font-size:13px;margin-left:4px;">R$ 340.090,60</strong></span>
        <span>MRR <strong style="color:#7c3aed;font-size:13px;margin-left:4px;">R$ 18.254,00</strong></span>
        <span>ARR <strong style="color:#0891b2;font-size:13px;margin-left:4px;">R$ 121.033,00</strong></span>
      </div>
    </div>

    <!-- Gráfico -->
    <div style="padding:20px 20px 8px;">
      <canvas id="chartFechMes" height="90"></canvas>
    </div>

    <!-- Tabela -->
    <div style="overflow-x:auto;">
      <table style="width:100%;border-collapse:collapse;">
        <thead>
          <tr style="background:#f8fafc;">
            <th style="padding:10px 20px;text-align:left;font-size:10px;font-weight:700;
              text-transform:uppercase;letter-spacing:1.5px;color:#9ca3af;
              border-bottom:1px solid #e5e7eb;">Mês</th>
            <th style="padding:10px 20px;text-align:center;font-size:10px;font-weight:700;
              text-transform:uppercase;letter-spacing:1.5px;color:#9ca3af;
              border-bottom:1px solid #e5e7eb;">Projetos</th>
            <th style="padding:10px 20px;text-align:right;font-size:10px;font-weight:700;
              text-transform:uppercase;letter-spacing:1.5px;color:#9ca3af;
              border-bottom:1px solid #e5e7eb;">Valor Total</th>
            <th style="padding:10px 20px;text-align:right;font-size:10px;font-weight:700;
              text-transform:uppercase;letter-spacing:1.5px;color:#7c3aed;
              border-bottom:1px solid #e5e7eb;">MRR</th>
            <th style="padding:10px 20px;text-align:right;font-size:10px;font-weight:700;
              text-transform:uppercase;letter-spacing:1.5px;color:#0891b2;
              border-bottom:1px solid #e5e7eb;">ARR</th>
          </tr>
        </thead>
        <tbody><tr style="background:#ffffff;border-bottom:1px solid #f3f4f6;">
      <td style="padding:12px 20px;font-size:13px;font-weight:700;color:#111827;">Jan/2026</td>
      <td style="padding:12px 20px;text-align:center;">
        <span style="background:#f0fdf4;color:#166534;font-size:12px;font-weight:700;
          padding:3px 12px;border-radius:99px;">15</span>
      </td>
      <td style="padding:12px 20px;text-align:right;font-size:13px;font-weight:700;color:#111827;">R$ 340.090,60</td>
      <td style="padding:12px 20px;text-align:right;font-size:13px;font-weight:600;color:#7c3aed;">R$ 18.254,00</td>
      <td style="padding:12px 20px;text-align:right;font-size:13px;font-weight:600;color:#0891b2;">R$ 121.033,00</td>
    </tr></tbody>
        <tfoot>
          <tr style="background:#f0fdf4;border-top:2px solid #bbf7d0;">
            <td style="padding:12px 20px;font-size:11px;font-weight:700;
              text-transform:uppercase;letter-spacing:1px;color:#059669;">Total</td>
            <td style="padding:12px 20px;text-align:center;font-size:13px;font-weight:800;color:#059669;">15</td>
            <td style="padding:12px 20px;text-align:right;font-size:13px;font-weight:800;color:#111827;">R$ 340.090,60</td>
            <td style="padding:12px 20px;text-align:right;font-size:13px;font-weight:800;color:#7c3aed;">R$ 18.254,00</td>
            <td style="padding:12px 20px;text-align:right;font-size:13px;font-weight:800;color:#0891b2;">R$ 121.033,00</td>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>

  <script>
  (function() {
    var ctx = document.getElementById('chartFechMes');
    if (!ctx) return;
    var labels = ['Jan/2026'];
    var vtData  = [340090.6];
    var mrrData = [18254.0];
    var arrData = [121033.0];
    var qtdData = [15];
    new Chart(ctx, {
      data: {
        labels: labels,
        datasets: [
          {
            type: 'bar',
            label: 'Valor Total',
            data: vtData,
            backgroundColor: 'rgba(17,24,39,0.08)',
            borderColor: '#111827',
            borderWidth: 1.5,
            borderRadius: 6,
            yAxisID: 'yVal',
            order: 2
          },
          {
            type: 'bar',
            label: 'MRR',
            data: mrrData,
            backgroundColor: 'rgba(124,58,237,0.65)',
            borderColor: '#7c3aed',
            borderWidth: 0,
            borderRadius: 6,
            yAxisID: 'yVal',
            order: 3
          },
          {
            type: 'bar',
            label: 'ARR',
            data: arrData,
            backgroundColor: 'rgba(8,145,178,0.65)',
            borderColor: '#0891b2',
            borderWidth: 0,
            borderRadius: 6,
            yAxisID: 'yVal',
            order: 4
          },
          {
            type: 'line',
            label: 'Qtd Projetos',
            data: qtdData,
            borderColor: '#059669',
            backgroundColor: 'rgba(5,150,105,0.08)',
            borderWidth: 2.5,
            tension: 0.3,
            pointRadius: 5,
            pointBackgroundColor: '#059669',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            fill: true,
            yAxisID: 'yQtd',
            order: 1
          }
        ]
      },
      options: {
        responsive: true,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: {
            labels: {
              color: '#6b7280',
              font: { family: 'Nunito', size: 11 },
              boxWidth: 10,
              padding: 16
            }
          },
          tooltip: {
            backgroundColor: '#fff',
            borderColor: 'rgba(0,0,0,.08)',
            borderWidth: 1,
            titleColor: '#111827',
            bodyColor: '#374151',
            padding: 12,
            callbacks: {
              label: function(c) {
                if (c.dataset.label === 'Qtd Projetos')
                  return ' ' + c.parsed.y + ' projetos';
                return ' ' + c.dataset.label + ': R$ ' +
                  c.parsed.y.toLocaleString('pt-BR', {minimumFractionDigits: 0});
              }
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: '#6b7280', font: { family: 'Nunito', size: 11 } }
          },
          yVal: {
            type: 'linear',
            position: 'left',
            grid: { color: 'rgba(0,0,0,.04)' },
            ticks: {
              color: '#6b7280',
              font: { family: 'Nunito', size: 11 },
              callback: function(v) {
                return v >= 1000 ? 'R$' + (v/1000).toFixed(0) + 'K' : 'R$' + v;
              }
            },
            title: { display: true, text: 'Valor (R$)', color: '#9ca3af', font: { family: 'Nunito', size: 10 } }
          },
          yQtd: {
            type: 'linear',
            position: 'right',
            grid: { drawOnChartArea: false },
            ticks: {
              color: '#059669',
              font: { family: 'Nunito', size: 11 },
              stepSize: 1
            },
            title: { display: true, text: 'Qtd', color: '#059669', font: { family: 'Nunito', size: 10 } }
          }
        }
      }
    });
  })();
  </script>

</div>
</div> <!-- fim tab-pipeline -->

<!-- ══ ABA 2: RENOVAÇÃO DE CONTRATOS ══ -->
<div id="tab-gestao" class="tab-panel">
<div class="page">

  <header>
    <div class="header-left">
      <div class="header-eyebrow">Gestão de Contratos · 2026</div>
      <h1 class="header-title">Dashboard de<br><span style="color:var(--accent2);">Renovações</span></h1>
    </div>
    <div class="header-right">
      <div class="header-date" id="dateDisplay2"></div>
      <div class="header-badge"><span class="dot"></span>Dados Atualizados</div>
    </div>
  </header>

  <!-- KPIs -->
  <div class="kpi-row" style="margin-bottom:28px;">
    <div class="kpi-card" style="--card-accent:var(--accent1)">
      <div class="kpi-icon">📅</div>
      <div class="kpi-label">Carteira Jan/2026</div>
      <div class="kpi-value">143</div>
      <div class="kpi-sub">R$ 2.414.929,88</div>
    </div>
    <div class="kpi-card" style="--card-accent:var(--accent3)">
      <div class="kpi-icon">📋</div>
      <div class="kpi-label">Carteira Atual</div>
      <div class="kpi-value">135</div>
      <div class="kpi-sub"><span style="color:var(--accent3);font-weight:600;">Mar/2026</span> · excl. cancelados</div>
    </div>
    <div class="kpi-card" style="--card-accent:#dc2626">
      <div class="kpi-icon">❌</div>
      <div class="kpi-label">Contratos Cancelados</div>
      <div class="kpi-value">8</div>
      <div class="kpi-sub"><span style="color:#dc2626;font-weight:600;">5.6%</span> do total da carteira</div>
    </div>
    <div class="kpi-card" style="--card-accent:var(--accent3)">
      <div class="kpi-icon">✅</div>
      <div class="kpi-label">Renovados</div>
      <div class="kpi-value">9</div>
      <div class="kpi-sub"><span style="color:var(--accent3);font-weight:600;">6.7%</span> já concluídos</div>
    </div>
  </div>

  <!-- KPIs Financeiros -->
  <div class="kpi-row" style="margin-bottom:28px;">
    <div class="kpi-card" style="--card-accent:#64748b">
      <div class="kpi-icon">📅</div>
      <div class="kpi-label">Carteira Jan/2026</div>
      <div class="kpi-value" style="font-size:20px;">R$ 7,34M</div>
      <div class="kpi-sub">Valor bruto · incl. cancelados · base 2026</div>
    </div>
    <div class="kpi-card" style="--card-accent:var(--accent1)">
      <div class="kpi-icon">💰</div>
      <div class="kpi-label">Carteira Atual</div>
      <div class="kpi-value" style="font-size:20px;">R$ 7,16M</div>
      <div class="kpi-sub">Valor líquido · 135 contratos ativos</div>
    </div>
    <div class="kpi-card" style="--card-accent:#dc2626">
      <div class="kpi-icon">📉</div>
      <div class="kpi-label">Redução da Carteira</div>
      <div class="kpi-value" style="font-size:20px;color:#dc2626;">−R$ 178,9K</div>
      <div class="kpi-sub"><span style="color:#dc2626;font-weight:600;">−2.4%</span> vs início do ano</div>
    </div>
    <div class="kpi-card" style="--card-accent:var(--accent4)">
      <div class="kpi-icon">🎯</div>
      <div class="kpi-label">Ticket Médio</div>
      <div class="kpi-value" style="font-size:20px;">R$ 53,1K</div>
      <div class="kpi-sub">Valor médio por contrato · R$ 53.052,65</div>
    </div>
  </div>

  
  <!-- ⚠ ATRASO -->
  <div class="card" style="margin-bottom:24px;border-left:4px solid #dc2626;padding-left:24px;">
    <div class="card-header"><div><div class="card-title" style="color:#dc2626;">⚠ Em Atraso de Renovação</div><div class="card-subtitle">Data Base vencida · pendentes · excl. Processo Financeiro e Renovados</div></div><div style="display:flex;gap:8px;flex-wrap:wrap;"><span style="background:#fee2e2;color:#991b1b;font-size:11px;font-weight:700;padding:4px 12px;border-radius:99px;">10 contratos</span><span style="background:#fff1f2;color:#dc2626;font-size:11px;font-weight:700;padding:4px 12px;border-radius:99px;border:1px solid #fecaca;">R$ 376.535,52 em risco</span></div></div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:16px;"><div style="background:#fff5f5;border:1px solid #fecaca;border-radius:10px;padding:14px;text-align:center;"><div style="font-size:10px;color:#dc2626;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">Jan/2026</div><div style="font-size:28px;font-weight:800;color:#dc2626;">4</div><div style="font-size:11px;color:#64748b;">R$ 94.492,72</div></div><div style="background:#fff8f3;border:1px solid #fed7aa;border-radius:10px;padding:14px;text-align:center;"><div style="font-size:10px;color:#9a3412;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">Fev/2026</div><div style="font-size:28px;font-weight:800;color:#9a3412;">1</div><div style="font-size:11px;color:#64748b;">R$ 2.052,45</div></div><div style="background:#fefce8;border:1px solid #fde68a;border-radius:10px;padding:14px;text-align:center;"><div style="font-size:10px;color:#854d0e;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">Mar/2026</div><div style="font-size:28px;font-weight:800;color:#854d0e;">5</div><div style="font-size:11px;color:#64748b;">R$ 279.990,35</div></div></div>
    <div style="overflow-x:auto;"><table style="width:100%;border-collapse:collapse;"><thead><tr style="background:#f8fafc;"><th style="padding:9px 12px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#dc2626;border-bottom:1px solid #e5e7eb;">NP</th><th style="padding:9px 12px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#dc2626;border-bottom:1px solid #e5e7eb;">Cliente</th><th style="padding:9px 12px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#dc2626;border-bottom:1px solid #e5e7eb;">Responsável</th><th style="padding:9px 12px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#dc2626;border-bottom:1px solid #e5e7eb;">Etapa</th><th style="padding:9px 12px;text-align:center;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#dc2626;border-bottom:1px solid #e5e7eb;">Vencimento</th><th style="padding:9px 12px;text-align:right;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#dc2626;border-bottom:1px solid #e5e7eb;">Valor Total</th></tr></thead><tbody><tr style="background:#ffffff;border-bottom:1px solid #f3f4f6;"><td style="padding:9px 12px;font-family:monospace;font-size:11px;font-weight:600;color:#dc2626;">NP-115077</td><td style="padding:9px 12px;font-size:12px;font-weight:600;color:#111827;">NETCENTER INFORMATICA</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Pedro</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Em análise pelo cliente</td><td style="padding:9px 12px;text-align:center;font-size:11px;font-weight:600;color:#dc2626;">01/01/2026</td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:700;color:#111827;">R$ 2.254,00</td></tr><tr style="background:#fafafa;border-bottom:1px solid #f3f4f6;"><td style="padding:9px 12px;font-family:monospace;font-size:11px;font-weight:600;color:#dc2626;">NP-115071</td><td style="padding:9px 12px;font-size:12px;font-weight:600;color:#111827;">VERZANI & SANDRINI LTDA</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Pedro</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Em análise pelo cliente</td><td style="padding:9px 12px;text-align:center;font-size:11px;font-weight:600;color:#dc2626;">01/01/2026</td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:700;color:#111827;"><span style="color:#d1d5db;">—</span></td></tr><tr style="background:#ffffff;border-bottom:1px solid #f3f4f6;"><td style="padding:9px 12px;font-family:monospace;font-size:11px;font-weight:600;color:#dc2626;">NP-115063</td><td style="padding:9px 12px;font-size:12px;font-weight:600;color:#111827;">Trt Da 4ª Região</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Pedro</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Em análise pelo cliente</td><td style="padding:9px 12px;text-align:center;font-size:11px;font-weight:600;color:#dc2626;">01/01/2026</td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:700;color:#111827;">R$ 78.738,72</td></tr><tr style="background:#fafafa;border-bottom:1px solid #f3f4f6;"><td style="padding:9px 12px;font-family:monospace;font-size:11px;font-weight:600;color:#dc2626;">NP-115057</td><td style="padding:9px 12px;font-size:12px;font-weight:600;color:#111827;">TECCLOUD SERVICOS DE TECNOLOGIA AHU LTDA</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Anderson</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Em análise pelo cliente</td><td style="padding:9px 12px;text-align:center;font-size:11px;font-weight:600;color:#dc2626;">01/01/2026</td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:700;color:#111827;">R$ 13.500,00</td></tr><tr style="background:#ffffff;border-bottom:1px solid #f3f4f6;"><td style="padding:9px 12px;font-family:monospace;font-size:11px;font-weight:600;color:#dc2626;">NP-115007</td><td style="padding:9px 12px;font-size:12px;font-weight:600;color:#111827;">KICALDO</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Anderson</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Análise de Requisição</td><td style="padding:9px 12px;text-align:center;font-size:11px;font-weight:600;color:#dc2626;">01/02/2026</td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:700;color:#111827;">R$ 2.052,45</td></tr><tr style="background:#fafafa;border-bottom:1px solid #f3f4f6;"><td style="padding:9px 12px;font-family:monospace;font-size:11px;font-weight:600;color:#dc2626;">NP-115044</td><td style="padding:9px 12px;font-size:12px;font-weight:600;color:#111827;">SCGAS - COMPANHIA DE GAS DE SANTA CATARINA</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Pedro</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Análise de Requisição</td><td style="padding:9px 12px;text-align:center;font-size:11px;font-weight:600;color:#dc2626;">01/03/2026</td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:700;color:#111827;">R$ 6.986,00</td></tr><tr style="background:#ffffff;border-bottom:1px solid #f3f4f6;"><td style="padding:9px 12px;font-family:monospace;font-size:11px;font-weight:600;color:#dc2626;">NP-115042</td><td style="padding:9px 12px;font-size:12px;font-weight:600;color:#111827;">Sapore</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Talita</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Análise de Requisição</td><td style="padding:9px 12px;text-align:center;font-size:11px;font-weight:600;color:#dc2626;">01/03/2026</td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:700;color:#111827;">R$ 170.362,80</td></tr><tr style="background:#fafafa;border-bottom:1px solid #f3f4f6;"><td style="padding:9px 12px;font-family:monospace;font-size:11px;font-weight:600;color:#dc2626;">NP-115040</td><td style="padding:9px 12px;font-size:12px;font-weight:600;color:#111827;">SANTA CASA DE MISERICÓRDIA DE PORTO ALEGRE</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Anderson</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Análise de Requisição</td><td style="padding:9px 12px;text-align:center;font-size:11px;font-weight:600;color:#dc2626;">01/03/2026</td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:700;color:#111827;">R$ 3.467,55</td></tr><tr style="background:#ffffff;border-bottom:1px solid #f3f4f6;"><td style="padding:9px 12px;font-family:monospace;font-size:11px;font-weight:600;color:#dc2626;">NP-114982</td><td style="padding:9px 12px;font-size:12px;font-weight:600;color:#111827;">GGT SOLUÇÃO TECNOLOGICAS LTDA (ANGOLAPREV)</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Pedro</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Em análise pelo cliente</td><td style="padding:9px 12px;text-align:center;font-size:11px;font-weight:600;color:#dc2626;">01/03/2026</td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:700;color:#111827;">R$ 54.090,00</td></tr><tr style="background:#fafafa;border-bottom:1px solid #f3f4f6;"><td style="padding:9px 12px;font-family:monospace;font-size:11px;font-weight:600;color:#dc2626;">NP-114944</td><td style="padding:9px 12px;font-size:12px;font-weight:600;color:#111827;">ASSOCIACAO HOSPITALAR MOINHOS DE VENTO</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Pedro</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Em análise pelo cliente</td><td style="padding:9px 12px;text-align:center;font-size:11px;font-weight:600;color:#dc2626;">01/03/2026</td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:700;color:#111827;">R$ 45.084,00</td></tr></tbody></table></div>
  </div>
  <!-- 🔄 PROCESSO FINANCEIRO -->
  <div class="card" style="margin-bottom:24px;border-left:4px solid #7c3aed;padding-left:24px;">
    <div class="card-header"><div><div class="card-title" style="color:#7c3aed;">🔄 Em Processo Financeiro</div><div class="card-subtitle">Contrato em fase de aprovação financeira</div></div><div><span style="background:#f5f3ff;color:#5b21b6;font-size:11px;font-weight:700;padding:4px 12px;border-radius:99px;">7 contratos</span></div></div>
    <div style="overflow-x:auto;"><table style="width:100%;border-collapse:collapse;"><thead><tr style="background:#f8fafc;"><th style="padding:9px 12px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#7c3aed;border-bottom:1px solid #e5e7eb;">NP</th><th style="padding:9px 12px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#7c3aed;border-bottom:1px solid #e5e7eb;">Cliente</th><th style="padding:9px 12px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#7c3aed;border-bottom:1px solid #e5e7eb;">Responsável</th><th style="padding:9px 12px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#7c3aed;border-bottom:1px solid #e5e7eb;">Etapa</th><th style="padding:9px 12px;text-align:center;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#7c3aed;border-bottom:1px solid #e5e7eb;">Vencimento</th><th style="padding:9px 12px;text-align:right;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#7c3aed;border-bottom:1px solid #e5e7eb;">Valor Total</th></tr></thead><tbody><tr style="background:#ffffff;border-bottom:1px solid #f3f4f6;"><td style="padding:9px 12px;font-family:monospace;font-size:11px;font-weight:600;color:#7c3aed;">NP-115076</td><td style="padding:9px 12px;font-size:12px;font-weight:600;color:#111827;">FORNO DE MINAS</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Denise</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Processo Financeiro</td><td style="padding:9px 12px;text-align:center;font-size:11px;font-weight:600;color:#7c3aed;">01/01/2026</td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:700;color:#111827;">R$ 777,00</td></tr><tr style="background:#fafafa;border-bottom:1px solid #f3f4f6;"><td style="padding:9px 12px;font-family:monospace;font-size:11px;font-weight:600;color:#7c3aed;">NP-115066</td><td style="padding:9px 12px;font-size:12px;font-weight:600;color:#111827;">UNIMED VALES DO TAQUARI E RIO PARDO LTDA</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Denise</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Processo Financeiro</td><td style="padding:9px 12px;text-align:center;font-size:11px;font-weight:600;color:#7c3aed;">01/02/2026</td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:700;color:#111827;">R$ 38.120,85</td></tr><tr style="background:#ffffff;border-bottom:1px solid #f3f4f6;"><td style="padding:9px 12px;font-family:monospace;font-size:11px;font-weight:600;color:#7c3aed;">NP-115065</td><td style="padding:9px 12px;font-size:12px;font-weight:600;color:#111827;">UNIMED PORTO ALEGRE</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Denise</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Processo Financeiro</td><td style="padding:9px 12px;text-align:center;font-size:11px;font-weight:600;color:#7c3aed;">01/03/2026</td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:700;color:#111827;">R$ 127.953,24</td></tr><tr style="background:#fafafa;border-bottom:1px solid #f3f4f6;"><td style="padding:9px 12px;font-family:monospace;font-size:11px;font-weight:600;color:#7c3aed;">NP-115022</td><td style="padding:9px 12px;font-size:12px;font-weight:600;color:#111827;">OCYAN</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Denise</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Processo Financeiro</td><td style="padding:9px 12px;text-align:center;font-size:11px;font-weight:600;color:#7c3aed;">01/01/2026</td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:700;color:#111827;">R$ 110.119,68</td></tr><tr style="background:#ffffff;border-bottom:1px solid #f3f4f6;"><td style="padding:9px 12px;font-family:monospace;font-size:11px;font-weight:600;color:#7c3aed;">NP-114998</td><td style="padding:9px 12px;font-size:12px;font-weight:600;color:#111827;">INCORP TECHNOLOGY INFORMATICA LTDA - EPP</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Denise</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Processo Financeiro</td><td style="padding:9px 12px;text-align:center;font-size:11px;font-weight:600;color:#7c3aed;">01/02/2026</td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:700;color:#111827;">R$ 6.388,02</td></tr><tr style="background:#fafafa;border-bottom:1px solid #f3f4f6;"><td style="padding:9px 12px;font-family:monospace;font-size:11px;font-weight:600;color:#7c3aed;">NP-114968</td><td style="padding:9px 12px;font-size:12px;font-weight:600;color:#111827;">COTRIBÁ</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Denise</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Processo Financeiro</td><td style="padding:9px 12px;text-align:center;font-size:11px;font-weight:600;color:#7c3aed;">01/03/2026</td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:700;color:#111827;">R$ 7.117,32</td></tr><tr style="background:#ffffff;border-bottom:1px solid #f3f4f6;"><td style="padding:9px 12px;font-family:monospace;font-size:11px;font-weight:600;color:#7c3aed;">NP-114949</td><td style="padding:9px 12px;font-size:12px;font-weight:600;color:#111827;">AUXILIADORA PREDIAL</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Denise</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Processo Financeiro</td><td style="padding:9px 12px;text-align:center;font-size:11px;font-weight:600;color:#7c3aed;">01/03/2026</td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:700;color:#111827;">R$ 412.288,08</td></tr></tbody></table></div>
  </div>
  <!-- ❌ CANCELADOS -->
  <div class="card" style="margin-bottom:24px;border-left:4px solid #9ca3af;padding-left:24px;">
    <div class="card-header"><div><div class="card-title" style="color:#374151;">❌ Cancelados no Período</div><div class="card-subtitle">Contratos encerrados na base atual</div></div><div style="display:flex;gap:8px;"><span style="background:#f9fafb;color:#374151;font-size:11px;font-weight:700;padding:4px 12px;border-radius:99px;">8 contratos</span><span style="background:#f1f5f9;color:#6b7280;font-size:11px;font-weight:700;padding:4px 12px;border-radius:99px;border:1px solid #e5e7eb;">R$ 178.926,50</span></div></div>
    <div style="overflow-x:auto;"><table style="width:100%;border-collapse:collapse;"><thead><tr style="background:#f8fafc;"><th style="padding:9px 12px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#9ca3af;border-bottom:1px solid #e5e7eb;">NP</th><th style="padding:9px 12px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#9ca3af;border-bottom:1px solid #e5e7eb;">Cliente</th><th style="padding:9px 12px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#9ca3af;border-bottom:1px solid #e5e7eb;">Responsável</th><th style="padding:9px 12px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#9ca3af;border-bottom:1px solid #e5e7eb;">Etapa</th><th style="padding:9px 12px;text-align:center;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#9ca3af;border-bottom:1px solid #e5e7eb;">Vencimento</th><th style="padding:9px 12px;text-align:right;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#9ca3af;border-bottom:1px solid #e5e7eb;">Valor Total</th></tr></thead><tbody><tr style="background:#ffffff;border-bottom:1px solid #f3f4f6;"><td style="padding:9px 12px;font-family:monospace;font-size:11px;font-weight:600;color:#6b7280;">NP-116093</td><td style="padding:9px 12px;font-size:12px;font-weight:600;color:#111827;">SYNERGIE SISTEMAS LTDA</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Anderson</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Contrato Cancelado</td><td style="padding:9px 12px;text-align:center;font-size:11px;font-weight:600;color:#6b7280;">01/10/2026</td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:700;color:#111827;">R$ 41.899,68</td></tr><tr style="background:#fafafa;border-bottom:1px solid #f3f4f6;"><td style="padding:9px 12px;font-family:monospace;font-size:11px;font-weight:600;color:#6b7280;">NP-116076</td><td style="padding:9px 12px;font-size:12px;font-weight:600;color:#111827;">NOURYON PULP AND PERFORMANCE INDUSTRIA QUIMICA LTDA</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Pedro</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Contrato Cancelado</td><td style="padding:9px 12px;text-align:center;font-size:11px;font-weight:600;color:#6b7280;">01/01/2026</td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:700;color:#111827;">R$ 30.500,16</td></tr><tr style="background:#ffffff;border-bottom:1px solid #f3f4f6;"><td style="padding:9px 12px;font-family:monospace;font-size:11px;font-weight:600;color:#6b7280;">NP-116075</td><td style="padding:9px 12px;font-size:12px;font-weight:600;color:#111827;">ASSOCIAÇÃO ANTÔNIO VEIRA JESUÍTA DO BRASIL (ASAV)</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Anderson</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Contrato Cancelado</td><td style="padding:9px 12px;text-align:center;font-size:11px;font-weight:600;color:#6b7280;">01/01/2026</td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:700;color:#111827;">R$ 28.993,68</td></tr><tr style="background:#fafafa;border-bottom:1px solid #f3f4f6;"><td style="padding:9px 12px;font-family:monospace;font-size:11px;font-weight:600;color:#6b7280;">NP-115004</td><td style="padding:9px 12px;font-size:12px;font-weight:600;color:#111827;">J&M SOLUÇÕES EM TECNOLOGIA EIRELI (AlliedIT)</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Pedro</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Contrato Cancelado</td><td style="padding:9px 12px;text-align:center;font-size:11px;font-weight:600;color:#6b7280;">01/08/2026</td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:700;color:#111827;">R$ 3.189,60</td></tr><tr style="background:#ffffff;border-bottom:1px solid #f3f4f6;"><td style="padding:9px 12px;font-family:monospace;font-size:11px;font-weight:600;color:#6b7280;">NP-114990</td><td style="padding:9px 12px;font-size:12px;font-weight:600;color:#111827;">GTFOODS GROUP</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Anderson</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Contrato Cancelado</td><td style="padding:9px 12px;text-align:center;font-size:11px;font-weight:600;color:#6b7280;">01/03/2026</td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:700;color:#111827;">R$ 14.240,00</td></tr><tr style="background:#fafafa;border-bottom:1px solid #f3f4f6;"><td style="padding:9px 12px;font-family:monospace;font-size:11px;font-weight:600;color:#6b7280;">NP-114988</td><td style="padding:9px 12px;font-size:12px;font-weight:600;color:#111827;">Grupo Orcali</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Anderson</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Contrato Cancelado</td><td style="padding:9px 12px;text-align:center;font-size:11px;font-weight:600;color:#6b7280;">01/08/2026</td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:700;color:#111827;">R$ 22.757,52</td></tr><tr style="background:#ffffff;border-bottom:1px solid #f3f4f6;"><td style="padding:9px 12px;font-family:monospace;font-size:11px;font-weight:600;color:#6b7280;">NP-114962</td><td style="padding:9px 12px;font-size:12px;font-weight:600;color:#111827;">CLAMPER</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Anderson</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Contrato Cancelado</td><td style="padding:9px 12px;text-align:center;font-size:11px;font-weight:600;color:#6b7280;">01/07/2026</td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:700;color:#111827;">R$ 7.109,28</td></tr><tr style="background:#fafafa;border-bottom:1px solid #f3f4f6;"><td style="padding:9px 12px;font-family:monospace;font-size:11px;font-weight:600;color:#6b7280;">NP-114797</td><td style="padding:9px 12px;font-size:12px;font-weight:600;color:#111827;">RNI - Rodobens Negócios Imobiliários</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Talita</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Contrato Cancelado</td><td style="padding:9px 12px;text-align:center;font-size:11px;font-weight:600;color:#6b7280;">01/12/2026</td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:700;color:#111827;">R$ 30.236,58</td></tr></tbody></table></div>
  </div>
  <!-- ✅ RENOVADOS -->
  <div class="card" style="margin-bottom:24px;border-left:4px solid #22c55e;padding-left:24px;">
    <div class="card-header"><div><div class="card-title" style="color:#059669;">✅ Renovados</div><div class="card-subtitle">Contratos renovados com sucesso no período</div></div><div><span style="background:#dcfce7;color:#166534;font-size:11px;font-weight:700;padding:4px 12px;border-radius:99px;">11 contratos</span></div></div>
    <div style="overflow-x:auto;"><table style="width:100%;border-collapse:collapse;"><thead><tr style="background:#f8fafc;"><th style="padding:9px 12px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#059669;border-bottom:1px solid #e5e7eb;">NP</th><th style="padding:9px 12px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#059669;border-bottom:1px solid #e5e7eb;">Cliente</th><th style="padding:9px 12px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#059669;border-bottom:1px solid #e5e7eb;">Responsável</th><th style="padding:9px 12px;text-align:right;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#059669;border-bottom:1px solid #e5e7eb;">Valor Total</th><th style="padding:9px 12px;text-align:right;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#7c3aed;border-bottom:1px solid #e5e7eb;">MRR</th><th style="padding:9px 12px;text-align:right;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#0891b2;border-bottom:1px solid #e5e7eb;">ARR</th></tr></thead><tbody><tr style="background:#ffffff;border-bottom:1px solid #f3f4f6;"><td style="padding:9px 12px;font-family:monospace;font-size:11px;font-weight:600;color:#059669;">NP-115073</td><td style="padding:9px 12px;font-size:12px;font-weight:600;color:#111827;">WAY DATA SOLUTION S/A</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Denise</td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:700;color:#111827;">R$ 2.930,46</td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:600;color:#7c3aed;"><span style="color:#d1d5db;">—</span></td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:600;color:#0891b2;">R$ 2.930,46</td></tr><tr style="background:#fafafa;border-bottom:1px solid #f3f4f6;"><td style="padding:9px 12px;font-family:monospace;font-size:11px;font-weight:600;color:#059669;">NP-115068</td><td style="padding:9px 12px;font-size:12px;font-weight:600;color:#111827;">USINA SANTA ISABEL</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Denise</td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:700;color:#111827;">R$ 17.220,00</td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:600;color:#7c3aed;">R$ 1.435,00</td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:600;color:#0891b2;"><span style="color:#d1d5db;">—</span></td></tr><tr style="background:#ffffff;border-bottom:1px solid #f3f4f6;"><td style="padding:9px 12px;font-family:monospace;font-size:11px;font-weight:600;color:#059669;">NP-115048</td><td style="padding:9px 12px;font-size:12px;font-weight:600;color:#111827;">SEPROL</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Denise</td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:700;color:#111827;">R$ 8.955,24</td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:600;color:#7c3aed;">R$ 746,27</td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:600;color:#0891b2;"><span style="color:#d1d5db;">—</span></td></tr><tr style="background:#fafafa;border-bottom:1px solid #f3f4f6;"><td style="padding:9px 12px;font-family:monospace;font-size:11px;font-weight:600;color:#059669;">NP-115043</td><td style="padding:9px 12px;font-size:12px;font-weight:600;color:#111827;">SAQUE PAGUE</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Pedro</td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:700;color:#111827;">R$ 60.982,80</td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:600;color:#7c3aed;">R$ 5.081,90</td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:600;color:#0891b2;"><span style="color:#d1d5db;">—</span></td></tr><tr style="background:#ffffff;border-bottom:1px solid #f3f4f6;"><td style="padding:9px 12px;font-family:monospace;font-size:11px;font-weight:600;color:#059669;">NP-115037</td><td style="padding:9px 12px;font-size:12px;font-weight:600;color:#111827;">SABEMI SEGURADORA</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Denise</td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:700;color:#111827;">R$ 23.085,60</td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:600;color:#7c3aed;">R$ 1.923,80</td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:600;color:#0891b2;"><span style="color:#d1d5db;">—</span></td></tr><tr style="background:#fafafa;border-bottom:1px solid #f3f4f6;"><td style="padding:9px 12px;font-family:monospace;font-size:11px;font-weight:600;color:#059669;">NP-115027</td><td style="padding:9px 12px;font-size:12px;font-weight:600;color:#111827;">PLANSERVI ENGENHARIA</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Denise</td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:700;color:#111827;">R$ 4.909,09</td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:600;color:#7c3aed;"><span style="color:#d1d5db;">—</span></td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:600;color:#0891b2;">R$ 4.909,09</td></tr><tr style="background:#ffffff;border-bottom:1px solid #f3f4f6;"><td style="padding:9px 12px;font-family:monospace;font-size:11px;font-weight:600;color:#059669;">NP-115002</td><td style="padding:9px 12px;font-size:12px;font-weight:600;color:#111827;">INTERSISTEMAS INFORMATICA LTDA - NETLOGIC</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Denise</td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:700;color:#111827;">R$ 7.416,60</td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:600;color:#7c3aed;">R$ 618,05</td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:600;color:#0891b2;"><span style="color:#d1d5db;">—</span></td></tr><tr style="background:#fafafa;border-bottom:1px solid #f3f4f6;"><td style="padding:9px 12px;font-family:monospace;font-size:11px;font-weight:600;color:#059669;">NP-115001</td><td style="padding:9px 12px;font-size:12px;font-weight:600;color:#111827;">INTERCITY</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Denise</td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:700;color:#111827;">R$ 41.088,00</td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:600;color:#7c3aed;">R$ 3.424,00</td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:600;color:#0891b2;"><span style="color:#d1d5db;">—</span></td></tr><tr style="background:#ffffff;border-bottom:1px solid #f3f4f6;"><td style="padding:9px 12px;font-family:monospace;font-size:11px;font-weight:600;color:#059669;">NP-114967</td><td style="padding:9px 12px;font-size:12px;font-weight:600;color:#111827;">CORTEL</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Denise</td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:700;color:#111827;"><span style="color:#d1d5db;">—</span></td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:600;color:#7c3aed;"><span style="color:#d1d5db;">—</span></td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:600;color:#0891b2;"><span style="color:#d1d5db;">—</span></td></tr><tr style="background:#fafafa;border-bottom:1px solid #f3f4f6;"><td style="padding:9px 12px;font-family:monospace;font-size:11px;font-weight:600;color:#059669;">NP-114956</td><td style="padding:9px 12px;font-size:12px;font-weight:600;color:#111827;">CALÇADOS BEIRA RIO</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Denise</td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:700;color:#111827;">R$ 9.062,78</td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:600;color:#7c3aed;"><span style="color:#d1d5db;">—</span></td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:600;color:#0891b2;">R$ 9.062,78</td></tr><tr style="background:#ffffff;border-bottom:1px solid #f3f4f6;"><td style="padding:9px 12px;font-family:monospace;font-size:11px;font-weight:600;color:#059669;">NP-114943</td><td style="padding:9px 12px;font-size:12px;font-weight:600;color:#111827;">Argenta Participacoes LTDA</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Denise</td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:700;color:#111827;"><span style="color:#d1d5db;">—</span></td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:600;color:#7c3aed;"><span style="color:#d1d5db;">—</span></td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:600;color:#0891b2;"><span style="color:#d1d5db;">—</span></td></tr></tbody></table></div><div style="background:#f0fdf4;border-top:2px solid #bbf7d0;padding:10px 16px;display:flex;justify-content:flex-end;gap:24px;font-size:12px;font-weight:700;"><span style="color:#6b7280;">Total VT <strong style="color:#111827;margin-left:6px;">R$ 175.650,57</strong></span><span style="color:#7c3aed;">MRR <strong style="margin-left:6px;">R$ 13.229,02</strong></span><span style="color:#0891b2;">ARR <strong style="margin-left:6px;">R$ 16.902,33</strong></span></div>
  </div>
    <div style="overflow-x:auto;"><table style="width:100%;border-collapse:collapse;"><thead><tr style="background:#f8fafc;"><th style="padding:9px 12px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#059669;border-bottom:1px solid #e5e7eb;">NP</th><th style="padding:9px 12px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#059669;border-bottom:1px solid #e5e7eb;">Cliente</th><th style="padding:9px 12px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#059669;border-bottom:1px solid #e5e7eb;">Responsável</th><th style="padding:9px 12px;text-align:right;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#059669;border-bottom:1px solid #e5e7eb;">Valor Total</th><th style="padding:9px 12px;text-align:right;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#7c3aed;border-bottom:1px solid #e5e7eb;">MRR</th><th style="padding:9px 12px;text-align:right;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#0891b2;border-bottom:1px solid #e5e7eb;">ARR</th></tr></thead><tbody><tr style="background:#ffffff;border-bottom:1px solid #f3f4f6;"><td style="padding:9px 12px;font-family:monospace;font-size:11px;font-weight:600;color:#059669;">NP-115073</td><td style="padding:9px 12px;font-size:12px;font-weight:600;color:#111827;">WAY DATA SOLUTION S/A</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Denise</td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:700;color:#111827;">R$ 2.930,46</td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:600;color:#7c3aed;"><span style="color:#d1d5db;">—</span></td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:600;color:#0891b2;">R$ 2.930,46</td></tr><tr style="background:#fafafa;border-bottom:1px solid #f3f4f6;"><td style="padding:9px 12px;font-family:monospace;font-size:11px;font-weight:600;color:#059669;">NP-115068</td><td style="padding:9px 12px;font-size:12px;font-weight:600;color:#111827;">USINA SANTA ISABEL</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Denise</td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:700;color:#111827;">R$ 17.220,00</td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:600;color:#7c3aed;">R$ 1.435,00</td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:600;color:#0891b2;"><span style="color:#d1d5db;">—</span></td></tr><tr style="background:#ffffff;border-bottom:1px solid #f3f4f6;"><td style="padding:9px 12px;font-family:monospace;font-size:11px;font-weight:600;color:#059669;">NP-115048</td><td style="padding:9px 12px;font-size:12px;font-weight:600;color:#111827;">SEPROL</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Denise</td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:700;color:#111827;">R$ 8.955,24</td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:600;color:#7c3aed;">R$ 746,27</td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:600;color:#0891b2;"><span style="color:#d1d5db;">—</span></td></tr><tr style="background:#fafafa;border-bottom:1px solid #f3f4f6;"><td style="padding:9px 12px;font-family:monospace;font-size:11px;font-weight:600;color:#059669;">NP-115043</td><td style="padding:9px 12px;font-size:12px;font-weight:600;color:#111827;">SAQUE PAGUE</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Pedro</td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:700;color:#111827;">R$ 60.982,80</td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:600;color:#7c3aed;">R$ 5.081,90</td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:600;color:#0891b2;"><span style="color:#d1d5db;">—</span></td></tr><tr style="background:#ffffff;border-bottom:1px solid #f3f4f6;"><td style="padding:9px 12px;font-family:monospace;font-size:11px;font-weight:600;color:#059669;">NP-115037</td><td style="padding:9px 12px;font-size:12px;font-weight:600;color:#111827;">SABEMI SEGURADORA</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Denise</td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:700;color:#111827;">R$ 23.085,60</td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:600;color:#7c3aed;">R$ 1.923,80</td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:600;color:#0891b2;"><span style="color:#d1d5db;">—</span></td></tr><tr style="background:#fafafa;border-bottom:1px solid #f3f4f6;"><td style="padding:9px 12px;font-family:monospace;font-size:11px;font-weight:600;color:#059669;">NP-115027</td><td style="padding:9px 12px;font-size:12px;font-weight:600;color:#111827;">PLANSERVI ENGENHARIA</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Denise</td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:700;color:#111827;">R$ 4.909,09</td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:600;color:#7c3aed;"><span style="color:#d1d5db;">—</span></td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:600;color:#0891b2;">R$ 4.909,09</td></tr><tr style="background:#ffffff;border-bottom:1px solid #f3f4f6;"><td style="padding:9px 12px;font-family:monospace;font-size:11px;font-weight:600;color:#059669;">NP-115002</td><td style="padding:9px 12px;font-size:12px;font-weight:600;color:#111827;">INTERSISTEMAS INFORMATICA LTDA - NETLOGIC</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Denise</td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:700;color:#111827;">R$ 7.416,60</td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:600;color:#7c3aed;">R$ 618,05</td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:600;color:#0891b2;"><span style="color:#d1d5db;">—</span></td></tr><tr style="background:#fafafa;border-bottom:1px solid #f3f4f6;"><td style="padding:9px 12px;font-family:monospace;font-size:11px;font-weight:600;color:#059669;">NP-115001</td><td style="padding:9px 12px;font-size:12px;font-weight:600;color:#111827;">INTERCITY</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Denise</td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:700;color:#111827;">R$ 41.088,00</td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:600;color:#7c3aed;">R$ 3.424,00</td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:600;color:#0891b2;"><span style="color:#d1d5db;">—</span></td></tr><tr style="background:#ffffff;border-bottom:1px solid #f3f4f6;"><td style="padding:9px 12px;font-family:monospace;font-size:11px;font-weight:600;color:#059669;">NP-114956</td><td style="padding:9px 12px;font-size:12px;font-weight:600;color:#111827;">CALÇADOS BEIRA RIO</td><td style="padding:9px 12px;font-size:11px;color:#6b7280;">Denise</td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:700;color:#111827;">R$ 9.062,78</td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:600;color:#7c3aed;"><span style="color:#d1d5db;">—</span></td><td style="padding:9px 12px;text-align:right;font-size:12px;font-weight:600;color:#0891b2;">R$ 9.062,78</td></tr></tbody></table></div><div style="background:#f0fdf4;border-top:2px solid #bbf7d0;padding:10px 16px;display:flex;justify-content:flex-end;gap:24px;font-size:12px;font-weight:700;"><span style="color:#6b7280;">Total VT <strong style="color:#111827;margin-left:6px;">R$ 175.650,57</strong></span><span style="color:#7c3aed;">MRR <strong style="margin-left:6px;">R$ 13.229,02</strong></span><span style="color:#0891b2;">ARR <strong style="margin-left:6px;">R$ 16.902,33</strong></span></div>
  </div><!-- end mainContent -->
</body>
</html>
`;
    return new Response(dashboard, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Frame-Options": "DENY",
        "X-Content-Type-Options": "nosniff",
      },
    });
  },
};

function loginHTML(erro) {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Acesso Restrito</title>
  <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Nunito', sans-serif;
      background: #f0f2f5;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .card {
      background: #fff;
      border-radius: 18px;
      padding: 52px 44px;
      width: 100%;
      max-width: 400px;
      box-shadow: 0 8px 48px rgba(0,0,0,0.10);
      text-align: center;
    }
    .icon { font-size: 40px; margin-bottom: 18px; }
    .eyebrow {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 2.5px;
      text-transform: uppercase;
      color: #2563eb;
      margin-bottom: 8px;
    }
    h1 { font-size: 22px; font-weight: 800; color: #111827; margin-bottom: 6px; }
    p  { font-size: 13px; color: #6b7280; margin-bottom: 28px; }
    input[type=password] {
      width: 100%;
      padding: 13px 16px;
      border: 1.5px solid #e5e7eb;
      border-radius: 10px;
      font-size: 15px;
      font-family: 'Nunito', sans-serif;
      outline: none;
      margin-bottom: 12px;
      transition: border-color .2s;
    }
    input[type=password]:focus { border-color: #2563eb; }
    .erro {
      font-size: 12px;
      color: #dc2626;
      margin-bottom: 12px;
      min-height: 18px;
    }
    button {
      width: 100%;
      padding: 13px;
      background: #2563eb;
      color: #fff;
      border: none;
      border-radius: 10px;
      font-size: 15px;
      font-weight: 700;
      font-family: 'Nunito', sans-serif;
      cursor: pointer;
      transition: background .2s;
    }
    button:hover { background: #1d4ed8; }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">🔒</div>
    <div class="eyebrow">Pipeline de Projetos · 2026</div>
    <h1>Acesso Restrito</h1>
    <p>Digite a senha para acessar o dashboard</p>
    <form method="POST" action="/login">
      <input type="password" name="senha" placeholder="Senha" autofocus autocomplete="current-password">
      <div class="erro">${erro}</div>
      <button type="submit">Entrar</button>
    </form>
  </div>
</body>
</html>`;
}
