/**
 *  //|  .------------. //  .------------. //  .------------. //  .------------. //'
 *  //| |  ________   | //  |   ______   | //  |     __     | //  |   ___  __  | //'
 *  //| | |  ____  |  | //  |  |  __  |  | //  |    /  \    | //  |  |   \/  | | //'
 *  //| | | |__/ /  | | //  |  | |__| |  | //  |   / /\ \   | //  |  |       | | //'
 *  //| | |  __  \  | | //  |  |  ____/  | //  |  / ____ \  | //  |  |  |\/|  | | //'
 *  //| | | |  \  \ | | //  |  | |       | //  | / /    \ \ | //  |  |  |  |  | | //'
 *  //| | |_|   \__|| | //  |  |_|       | //  ||_/      \_|| //  |  |__|  |__| | //'
 *  //| |            | //  |             | //  |             | //  |              | //'
 *  //| '------------' //  '-------------' //  '-------------' //  '--------------' //'
 *  //'----------------'  '-----------------'  '-----------------'  '----------------'
 *
 *  ╔══════════════════════════════════════════════════════════════════════╗
 *  ║  Z-PAY · Settlement Infrastructure · ZETTA Ecosystem               ║
 *  ║                                                                    ║
 *  ║  Security:   AES-256 at rest · TLS 1.3 in transit · HMAC-SHA256   ║
 *  ║  Ledger:     Append-only · Immutable · Hash-verified integrity    ║
 *  ║  Compliance: PCI DSS · LGPD · BACEN · VARA/VASP aligned          ║
 *  ║  Audit:      Cyberscope (December 2024) · KYC verified            ║
 *  ║  AI Engine:  ZION (Anthropic Claude) · Server-side execution      ║
 *  ║                                                                    ║
 *  ║  SPDX-License-Identifier: UNLICENSED                              ║
 *  ║  © 2026 ZETTA WORLD · All rights reserved                         ║
 *  ║                                                                    ║
 *  ║  WARNING: This software is proprietary. Unauthorized copying,      ║
 *  ║  modification, distribution, or reverse engineering is strictly    ║
 *  ║  prohibited and may result in civil and criminal penalties.        ║
 *  ╚══════════════════════════════════════════════════════════════════════╝
 */

// Z-PAY — DEMO MODE (mock backend)

// ZION AI — chamadas via API Route server-side (/api/zion)
// API key armazenada como variável de ambiente na Vercel (ANTHROPIC_API_KEY)
// Nenhuma chave sensível no navegador

const zionHistory = []; // Conversation context (cleared on chat close)

const state = {
  apiBase: 'DEMO',
  token: localStorage.getItem('zpay_token') || '',
  merchant: null,
  page_charges: 1, page_payments: 1, page_subscriptions: 1,
  demo: true,
  zionThinking: false
};


// ── SECURITY: HTML Sanitizer ──────────
const sanitize = (str) => {
  if (typeof str !== 'string') return '';
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#x27;');
};


// ── SECURITY: Safe JSON parse ──────────
const safeJSON = (str, fallback=[]) => { try { return JSON.parse(str); } catch { return fallback; } };
// ── MOCK DATA ──────────────────────────
const MOCK = {
  merchant: { id: 'demo-01', name: 'Demo Store', email: 'demo@zpay.com', plan: 'PRO', kyc_status: 'APPROVED' },
  summary: {
    total_volume: 96740359, total_fees: 1950476, balance: 94789883,
    last_payments: [
      { id: 'pay-001', charge_id: 'chg-001', method: 'PIX',    status: 'PAID',   amount: 25000,   fee_amount: 375,  created_at: new Date(Date.now()-3e5).toISOString() },
      { id: 'pay-002', charge_id: 'chg-002', method: 'CARD',   status: 'PAID',   amount: 89700,   fee_amount: 1795, created_at: new Date(Date.now()-9e5).toISOString() },
      { id: 'pay-003', charge_id: 'chg-003', method: 'PIX',    status: 'PAID',   amount: 15000,   fee_amount: 225,  created_at: new Date(Date.now()-18e5).toISOString() },
      { id: 'pay-004', charge_id: 'chg-004', method: 'BOLETO', status: 'PAID',   amount: 320000,  fee_amount: 600,  created_at: new Date(Date.now()-36e5).toISOString() },
      { id: 'pay-005', charge_id: 'chg-005', method: 'CARD',   status: 'FAILED', amount: 45000,   fee_amount: 0,    created_at: new Date(Date.now()-72e5).toISOString() },
      { id: 'pay-006', charge_id: 'chg-006', method: 'PIX',    status: 'PAID',   amount: 1200000, fee_amount: 18000,created_at: new Date(Date.now()-12e6).toISOString() },
      { id: 'pay-007', charge_id: 'chg-007', method: 'CRYPTO', status: 'PAID',   amount: 75000,   fee_amount: 1125, created_at: new Date(Date.now()-18e6).toISOString() },
      { id: 'pay-008', charge_id: 'chg-008', method: 'CARD',   status: 'PAID',   amount: 560000,  fee_amount: 8400, created_at: new Date(Date.now()-24e6).toISOString() },
      { id: 'pay-009', charge_id: 'chg-009', method: 'PIX',    status: 'PAID',   amount: 33000,   fee_amount: 495,  created_at: new Date(Date.now()-48e6).toISOString() },
      { id: 'pay-010', charge_id: 'chg-010', method: 'BOLETO', status: 'PAID',   amount: 890000,  fee_amount: 1335, created_at: new Date(Date.now()-72e6).toISOString() },
    ]
  },
  charges: { items: [
    { id: 'chg-001', status: 'PAID',    amount: 25000,  currency: 'BRL', description: 'Serviço mensal',      metadata: { customer_id: 'cli_joao'  }, payment_link: 'https://zpay.com/p/001', created_at: new Date(Date.now()-3e5).toISOString() },
    { id: 'chg-002', status: 'PAID',    amount: 89700,  currency: 'BRL', description: 'Consultoria',         metadata: { customer_id: 'cli_maria' }, payment_link: 'https://zpay.com/p/002', created_at: new Date(Date.now()-9e5).toISOString() },
    { id: 'chg-003', status: 'PENDING', amount: 15000,  currency: 'BRL', description: 'Produto digital',     metadata: { customer_id: 'cli_pedro' }, payment_link: 'https://zpay.com/p/003', created_at: new Date(Date.now()-18e5).toISOString() },
    { id: 'chg-004', status: 'PAID',    amount: 320000, currency: 'BRL', description: 'Manutenção anual',    metadata: { customer_id: 'cli_ana'   }, payment_link: 'https://zpay.com/p/004', created_at: new Date(Date.now()-36e5).toISOString() },
    { id: 'chg-005', status: 'EXPIRED', amount: 45000,  currency: 'BRL', description: 'Teste',               metadata: { customer_id: 'cli_carlos'}, payment_link: 'https://zpay.com/p/005', created_at: new Date(Date.now()-72e5).toISOString() },
  ]},
  payments: { items: [
    { id: 'pay-001', charge_id: 'chg-001', method: 'PIX',    status: 'PAID',   amount: 25000,   fee_amount: 375,  created_at: new Date(Date.now()-3e5).toISOString() },
    { id: 'pay-002', charge_id: 'chg-002', method: 'CARD',   status: 'PAID',   amount: 89700,   fee_amount: 1795, created_at: new Date(Date.now()-9e5).toISOString() },
    { id: 'pay-003', charge_id: 'chg-003', method: 'PIX',    status: 'PAID',   amount: 15000,   fee_amount: 225,  created_at: new Date(Date.now()-18e5).toISOString() },
    { id: 'pay-004', charge_id: 'chg-004', method: 'BOLETO', status: 'PAID',   amount: 320000,  fee_amount: 600,  created_at: new Date(Date.now()-36e5).toISOString() },
    { id: 'pay-005', charge_id: 'chg-005', method: 'CARD',   status: 'FAILED', amount: 45000,   fee_amount: 0,    created_at: new Date(Date.now()-72e5).toISOString() },
    { id: 'pay-006', charge_id: 'chg-006', method: 'PIX',    status: 'PAID',   amount: 1200000, fee_amount: 18000,created_at: new Date(Date.now()-12e6).toISOString() },
    { id: 'pay-007', charge_id: 'chg-007', method: 'CRYPTO', status: 'PAID',   amount: 75000,   fee_amount: 1125, created_at: new Date(Date.now()-18e6).toISOString() },
    { id: 'pay-008', charge_id: 'chg-008', method: 'CARD',   status: 'PAID',   amount: 560000,  fee_amount: 8400, created_at: new Date(Date.now()-24e6).toISOString() },
    { id: 'pay-009', charge_id: 'chg-009', method: 'PIX',    status: 'PAID',   amount: 33000,   fee_amount: 495,  created_at: new Date(Date.now()-48e6).toISOString() },
    { id: 'pay-010', charge_id: 'chg-010', method: 'BOLETO', status: 'PAID',   amount: 890000,  fee_amount: 1335, created_at: new Date(Date.now()-72e6).toISOString() },
  ]},
  payouts: { items: [
    { id: 'pyo-001', method: 'PIX', status: 'COMPLETED', amount: 5000000, created_at: new Date(Date.now()-86400000).toISOString() },
    { id: 'pyo-002', method: 'TED', status: 'PENDING',   amount: 2000000, created_at: new Date(Date.now()-43200000).toISOString() },
  ]},
  webhooks: { items: [
    { id: 'wh-001', event_type: 'payment.updated', status: 'DELIVERED', attempts: 1, created_at: new Date(Date.now()-3e5).toISOString() },
    { id: 'wh-002', event_type: 'charge.expired',  status: 'FAILED',    attempts: 3, created_at: new Date(Date.now()-72e5).toISOString() },
    { id: 'wh-003', event_type: 'payment.updated', status: 'DELIVERED', attempts: 1, created_at: new Date(Date.now()-12e6).toISOString() },
  ]}
};

// ── API MOCK ───────────────────────────
const api = async (path, options = {}) => {
  await new Promise(r => setTimeout(r, 180 + Math.random() * 120));
  if (path === '/auth/login') {
    const b = options.body || {};
    /* Auth: constant-time credential validation */
    const _ce = btoa(b.email), _cp = btoa(b.password);
    const _ve = 'ZGVtb0B6cGF5LmNvbQ==', _vp = 'ZGVtbzEyMw==';
    let _m = 0; for(let i=0;i<Math.max(_ce.length,_ve.length);i++) _m|=(_ce.charCodeAt(i)||0)^(_ve.charCodeAt(i)||0);
    for(let i=0;i<Math.max(_cp.length,_vp.length);i++) _m|=(_cp.charCodeAt(i)||0)^(_vp.charCodeAt(i)||0);
    if (_m === 0) {
      return { access_token: 'demo-token-' + Date.now() };
    }
    throw new Error('E-mail ou senha incorretos');
  }
  if (path === '/auth/me')           return { merchant: MOCK.merchant };
  if (path === '/dashboard/summary') return MOCK.summary;
  if (path === '/charges'  && (!options.method || options.method === 'GET')) return MOCK.charges;
  if (path === '/payments')          return MOCK.payments;
  if (path === '/payouts'  && (!options.method || options.method === 'GET')) return MOCK.payouts;
  if (path === '/webhooks')          return MOCK.webhooks;
  if (path === '/auth/me')           return { merchant: MOCK.merchant };
  if (path.startsWith('/charges') && options.method === 'POST' && !path.includes('/pay')) {
    const body = options.body || {};
    const id = 'chg-' + Date.now();
    const newCharge = { id, status: 'PENDING', amount: body.amount||0, currency: body.currency||'BRL', description: body.description||'Cobrança', metadata: body.metadata||{}, payment_link: `https://zpay.com/p/${id.slice(-6)}`, created_at: new Date().toISOString() };
    MOCK.charges.items.unshift(newCharge);
    return newCharge;
  }
  if (path.includes('/pay') && options.method === 'POST') {
    return { status: 'PAID' };
  }
  if (path === '/payouts' && options.method === 'POST') return { id: 'pyo-'+Date.now(), status: 'PENDING' };
  if (path.includes('/settings/webhook')) return { ok: true };
  if (path.includes('/keys/rotate'))      return { public_key: btoa('zpk_demo_'+Date.now()).slice(0,24) };
  if (path.includes('/webhooks') && path.includes('/retry')) return { ok: true };
  return {};
};

// ── ELEMENTOS DOM ──────────────────────
const el = {
  loginScreen: document.getElementById('loginScreen'),
  appWrap: document.getElementById('appWrap'),
  loginForm: document.getElementById('loginForm'),
  loginError: document.getElementById('loginError'),
  demoLogin: document.getElementById('demoLogin'),
  volumeTotal: document.getElementById('volumeTotal'),
  merchantRevenue: document.getElementById('merchantRevenue'),
  feesTotal: document.getElementById('feesTotal'),
  balance: document.getElementById('balance'),
  volumeTrend: document.getElementById('volumeTrend'),
  revenueTrend: document.getElementById('revenueTrend'),
  feesTrend: document.getElementById('feesTrend'),
  balanceTrend: document.getElementById('balanceTrend'),
  recentPayments: document.getElementById('recentPayments'),
  chargesTable: document.getElementById('chargesTable'),
  paymentsTable: document.getElementById('paymentsTable'),
  payoutsTable: document.getElementById('payoutsTable'),
  webhooksTable: document.getElementById('webhooksTable'),
  planBadge: document.getElementById('planBadge'),
  kycBadge: document.getElementById('kycBadge'),
  viewTitle: document.getElementById('viewTitle'),
  viewSubtitle: document.getElementById('viewSubtitle'),
  openCharge: document.getElementById('openCharge'),
  openPayout: document.getElementById('openPayout'),
  openCheckout: document.getElementById('openCheckout'),
  chargeModal: document.getElementById('chargeModal'),
  payoutModal: document.getElementById('payoutModal'),
  checkoutModal: document.getElementById('checkoutModal'),
  chargeForm: document.getElementById('chargeForm'),
  payoutForm: document.getElementById('payoutForm'),
  checkoutForm: document.getElementById('checkoutForm'),
  chargeResult: document.getElementById('chargeResult'),
  checkoutResult: document.getElementById('checkoutResult'),
  modalBackdrop: document.getElementById('modalBackdrop'),
  refreshDashboard: document.getElementById('refreshDashboard'),
  refreshCharges: document.getElementById('refreshCharges'),
  refreshPayments: document.getElementById('refreshPayments'),
  refreshWebhooks: document.getElementById('refreshWebhooks'),
  settingsForm: document.getElementById('settingsForm'),
  apiBaseInput: document.getElementById('apiBase'),
  webhookUrl: document.getElementById('webhookUrl'),
  seasonalityChart: document.getElementById('seasonalityChart'),
  webhookConsole: document.getElementById('webhookConsole'),
  webhookStatus: document.getElementById('webhookStatus'),
  triggerWebhook: document.getElementById('triggerWebhook'),
  onboardingStatus: document.getElementById('onboardingStatus'),
  simulateKyc: document.getElementById('simulateKyc'),
  brandHome: document.getElementById('brandHome'),
  riskScore: document.getElementById('riskScore'),
  riskDetail: document.getElementById('riskDetail'),
  approvalRate: document.getElementById('approvalRate'),
  approvalDetail: document.getElementById('approvalDetail'),
  avgTicket: document.getElementById('avgTicket'),
  avgDetail: document.getElementById('avgDetail'),
  settlementCurrency: document.getElementById('settlementCurrency'),
  autoConvert: document.getElementById('autoConvert'),
  hamburger: document.getElementById('hamburger'),
  sidebar: document.getElementById('sidebar'),
  sidebarOverlay: document.getElementById('sidebarOverlay')
};

const conversionRates = { BRL:1, USD:0.19, EUR:0.18, USDT:0.19, BTC:0.0000038, ETH:0.000055 };

// ── UTILS ──────────────────────────────
const show = (modal, visible) => { if (modal) modal.hidden = !visible; };
const showBackdrop = (v) => { if (el.modalBackdrop) el.modalBackdrop.hidden = !v; };
const closeModal = (modal) => { if (modal) modal.hidden = true; };
const closeAllModals = () => {
  [el.chargeModal, el.payoutModal, el.checkoutModal, document.getElementById('linkProductModal'), document.getElementById('subscriptionModal')].forEach(closeModal);
  showBackdrop(false);
};
const openModal = (modal) => { showBackdrop(true); show(modal, true); };

const setView = (view, title, subtitle) => {
  document.querySelectorAll('.panel').forEach(p => { p.hidden = true; });
  if (view === 'dashboard') {
    ['dashboardView','seasonalityPanel','advancedPanel','tutorialPanel'].forEach(id => {
      const el = document.getElementById(id); if (el) el.hidden = false;
    });
  } else {
    const el = document.getElementById(`${view}View`); if (el) el.hidden = false;
  }
  document.querySelectorAll('.menu-item').forEach(item => item.classList.toggle('active', item.dataset.view === view));
  if (el.viewTitle) el.viewTitle.textContent = title || view;
  if (el.viewSubtitle) el.viewSubtitle.textContent = subtitle || '';
};

const formatMoney = (value) => (Number(value||0)/100).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
const convertAmount = (amount, currency) => Number(amount||0) * (conversionRates[currency]||1);
const formatCurrency = (value, currency) => {
  const symbols = {BRL:'R$',USD:'$',EUR:'€',USDT:'USDT ',BTC:'₿',ETH:'Ξ'};
  const dec = ['BTC','ETH'].includes(currency) ? 8 : 2;
  return `${symbols[currency]||''} ${Number(value||0).toLocaleString('pt-BR',{minimumFractionDigits:dec,maximumFractionDigits:dec})}`.trim();
};

const ROWS_PER_PAGE = 10;
const renderTable = (container, rows, columns, headers=null, paginationEl=null, tableKey='') => {
  if (!container) return;
  container.innerHTML = '';
  const total = rows.length;
  const page = tableKey ? Math.max(1,(state[`page_${tableKey}`]||1)) : 1;
  const usePagination = paginationEl && total > ROWS_PER_PAGE;
  const start = usePagination ? (page-1)*ROWS_PER_PAGE : 0;
  const end   = usePagination ? Math.min(start+ROWS_PER_PAGE,total) : total;
  const pageRows = rows.slice(start,end);
  if (headers && headers.length) {
    const h = document.createElement('div'); h.className = 'table-row table-header';
    h.innerHTML = headers.map(h=>`<div>${h}</div>`).join(''); container.appendChild(h);
  }
  pageRows.forEach(row => {
    const d = document.createElement('div'); d.className = 'table-row';
    d.innerHTML = columns.map(col=>`<div>${col(row)}</div>`).join(''); container.appendChild(d);
  });
  if (paginationEl) {
    if (total > ROWS_PER_PAGE) {
      const totalPages = Math.ceil(total/ROWS_PER_PAGE);
      paginationEl.innerHTML = `<span class="pagination-info">${start+1}-${end} ${t('pagination_of')} ${total}</span><button class="ghost pagination-btn" ${page<=1?'disabled':''} data-page="${page-1}" data-table="${tableKey}">${t('pagination_prev')}</button><span class="pagination-pages">${t('pagination_page')} ${page} ${t('pagination_of')} ${totalPages}</span><button class="ghost pagination-btn" ${page>=totalPages?'disabled':''} data-page="${page+1}" data-table="${tableKey}">${t('pagination_next')}</button>`;
      paginationEl.hidden = false;
    } else {
      paginationEl.innerHTML = total ? `<span class="pagination-info">${total} ${t('pagination_records')}</span>` : '';
      paginationEl.hidden = !total;
    }
  }
};

const renderSeasonality = (payments) => {
  if (!el.seasonalityChart) return;
  const buckets = new Array(12).fill(0);
  payments.forEach(p => { const m = new Date(p.created_at).getMonth(); buckets[m] += Number(p.amount||0); });
  const max = Math.max(...buckets, 1);
  const months = t('months_short').split(',');
  el.seasonalityChart.innerHTML = '';
  buckets.forEach((v, i) => {
    const bar = document.createElement('div'); bar.className = 'seasonality-bar';
    bar.style.height = `${Math.max(20,Math.round((v/max)*140))}px`;
    const label = document.createElement('span'); label.textContent = months[i]; bar.appendChild(label);
    el.seasonalityChart.appendChild(bar);
  });
};

// ── DASHBOARD ─────────────────────────
const refreshDashboard = async () => {
  const summary = await api('/dashboard/summary');
  const currency = el.settlementCurrency?.value || 'BRL';
  const auto = el.autoConvert?.checked;
  const cv = auto ? formatCurrency(convertAmount(summary.total_volume, currency), currency) : null;
  const cr = auto ? formatCurrency(convertAmount(summary.total_volume - summary.total_fees, currency), currency) : null;
  el.volumeTotal.textContent = formatMoney(summary.total_volume);
  el.feesTotal.textContent = formatMoney(summary.total_fees);
  el.balance.textContent = formatMoney(summary.balance);
  el.merchantRevenue.textContent = formatMoney(summary.total_volume - summary.total_fees);
  el.volumeTrend.textContent = `+12% vs 30d${cv ? ` • ≈ ${cv}` : ''}`;
  el.revenueTrend.textContent = `+8% vs 30d${cr ? ` • ≈ ${cr}` : ''}`;
  el.feesTrend.textContent = t('fees_stable');
  el.balanceTrend.textContent = t('balance_now');
  const payments = summary.last_payments || [];
  renderTable(el.recentPayments, payments, [
    r => r.id.slice(0,8), r => r.method, r => r.status,
    r => formatMoney(r.amount),
    r => new Date(r.created_at).toLocaleDateString('pt-BR'),
    r => new Date(r.created_at).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})
  ], [t('th_id'),t('th_method'),t('th_status'),t('th_value'),t('th_date'),t('th_time')]);
  renderSeasonality(payments);
  const paid = payments.filter(p=>p.status==='PAID').length;
  const total = payments.length || 1;
  const failed = payments.filter(p=>p.status==='FAILED').length;
  const riskScore = Math.min(100, Math.round(((failed/total)*100) + (payments.length>8?10:0)));
  const avgTicket = payments.reduce((s,p) => s+Number(p.amount||0),0)/total;
  el.approvalRate.textContent = `${Math.round((paid/total)*100)}%`;
  el.approvalDetail.textContent = paid > failed ? t('flow_healthy') : t('flow_attention');
  el.riskScore.textContent = `${riskScore}`;
  el.riskDetail.textContent = riskScore < 30 ? t('risk_low') : riskScore < 60 ? t('risk_medium') : t('risk_high');
  el.avgTicket.textContent = formatMoney(avgTicket);
  el.avgDetail.textContent = `Base: ${total} pagamentos`;
};

const refreshCharges = async () => {
  const data = await api('/charges');
  const pag = document.getElementById('chargesPagination');
  renderTable(el.chargesTable, data.items||[], [
    r=>r.id.slice(0,8), r=>r.status, r=>formatMoney(r.amount),
    r=>r.currency||'BRL',
    r=>new Date(r.created_at).toLocaleDateString('pt-BR'),
    r=>new Date(r.created_at).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'}),
    r=>r.metadata?.customer_id||'-'
  ], [t('th_charge_id'),t('th_status'),t('th_value'),t('th_currency'),t('th_date'),t('th_time'),t('th_customer')], pag, 'charges');
};

const renderMethodChart = (payments) => {
  const byMethod = {};
  (payments||[]).forEach(p => { const m = p.method||'OUTRO'; byMethod[m]=(byMethod[m]||0)+Number(p.amount||0); });
  const total = Object.values(byMethod).reduce((a,b)=>a+b,0)||1;
  const mc = document.getElementById('methodChart'); if (!mc) return; mc.innerHTML='';
  const colors = {PIX:'var(--ember)',CARD:'#38bdf8',BOLETO:'#a78bfa',CRYPTO:'#34d399',OUTRO:'#94a3b8'};
  Object.entries(byMethod).sort((a,b)=>b[1]-a[1]).forEach(([method,amount])=>{
    const pct = (amount/total)*100;
    const row = document.createElement('div'); row.className='method-bar-row';
    row.innerHTML=`<span class="method-label">${method}</span><div class="method-bar-wrap"><div class="method-bar" style="width:${pct}%;background:${colors[method]||'#94a3b8'};box-shadow:0 0 8px ${colors[method]||'#94a3b8'}44" title="${formatMoney(amount)}"></div></div><span class="method-value">${formatMoney(amount)}</span>`;
    mc.appendChild(row);
  });
};

const refreshPayments = async () => {
  const data = await api('/payments');
  renderMethodChart(data.items||[]);
  const pag = document.getElementById('paymentsPagination');
  renderTable(el.paymentsTable, data.items||[], [
    r=>r.id.slice(0,8), r=>r.method, r=>r.status, r=>formatMoney(r.amount), r=>formatMoney(r.fee_amount||0),
    r=>new Date(r.created_at).toLocaleDateString('pt-BR'),
    r=>new Date(r.created_at).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'}),
    r=>r.charge_id?.slice(0,8)||'-'
  ], [t('th_id'),t('th_method'),t('th_status'),t('th_value'),t('th_fee'),t('th_date'),t('th_time'),t('th_charge')], pag, 'payments');
};

const refreshPayouts = async () => {
  const data = await api('/payouts');
  renderTable(el.payoutsTable, data.items||[], [
    r=>r.id.slice(0,8), r=>r.method, r=>r.status, r=>formatMoney(r.amount),
    r=>new Date(r.created_at).toLocaleDateString('pt-BR'),
    r=>new Date(r.created_at).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})
  ], [t('th_payout_id'),t('th_method'),t('th_status'),t('th_value'),t('th_date'),t('th_time')]);
};

const refreshWebhooks = async () => {
  const data = await api('/webhooks');
  renderTable(el.webhooksTable, data.items||[], [
    r=>r.event_type, r=>r.status, r=>r.attempts,
    r=>new Date(r.created_at).toLocaleDateString('pt-BR'),
    r=>new Date(r.created_at).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'}),
    r=>r.id.slice(0,8)
  ], [t('th_event_type'),t('th_status'),t('th_attempts'),t('th_date'),t('th_time'),t('th_id')]);
};

const refreshAnalytics = async () => {
  const summary = await api('/dashboard/summary');
  const vol = Number(summary.total_volume||0);
  const el2 = document.getElementById('revenueForecast');
  if (el2) el2.textContent = formatMoney(Math.round(vol*1.08)) + ' (proj. 30d)';
};

// ── CONTADOR ──────────────────────────
const MOCK_CLIENTES = [
  {nome:'Supermercado Silva',cnpj:'12.345.678/0001-90',volume:28450000,plano:'PRO',kyc:'APROVADO',var:'+8%'},
  {nome:'Farmácia Central',cnpj:'98.765.432/0001-11',volume:15620000,plano:'PRO',kyc:'APROVADO',var:'+12%'},
  {nome:'Auto Peças Norte',cnpj:'11.222.333/0001-44',volume:8930000,plano:'STARTER',kyc:'APROVADO',var:'-3%'},
  {nome:'Clínica Dr. Santos',cnpj:'55.666.777/0001-88',volume:21000000,plano:'PRO',kyc:'APROVADO',var:'+21%'},
  {nome:'Construtora MRB',cnpj:'33.444.555/0001-22',volume:51200000,plano:'PRO',kyc:'APROVADO',var:'+5%'},
];

const refreshContador = () => {
  const c = document.getElementById('contadorContent'); if (!c) return;
  const total = MOCK_CLIENTES.reduce((a,x)=>a+x.volume,0);
  const totalFees = Math.round(total * 0.032);
  const n = MOCK_CLIENTES.length;
  const mA_a = n * 400000, mA_m = Math.round(totalFees * 0.10);
  const mB_a = n * 250000, mB_m = Math.round(totalFees * 0.20);
  const mC_a = n * 150000, mC_m = Math.round(totalFees * 0.30);
  c.innerHTML = `
    <div class="contador-header">
      <div class="contador-metric"><div class="contador-metric-label">Volume da Carteira</div><div class="contador-metric-value">${formatMoney(total)}</div><div class="contador-metric-sub">${n} merchants indicados</div></div>
      <div class="contador-metric"><div class="contador-metric-label">Fees Geradas (mês)</div><div class="contador-metric-value">${formatMoney(totalFees)}</div><div class="contador-metric-sub">Taxa média ~3,2% (Pro)</div></div>
      <div class="contador-metric"><div class="contador-metric-label">${t('contador_approval_rate')}</div><div class="contador-metric-value">98,4%</div><div class="contador-metric-sub">${t('contador_portfolio_avg')}</div></div>
    </div>
    <div style="margin:24px 0 12px"><div style="font-family:'Bricolage Grotesque',sans-serif;font-weight:900;font-size:17px;color:var(--text);margin-bottom:4px">Modelos de Comissionamento</div>
    <p style="font-size:13px;color:var(--text3);line-height:1.6;margin-bottom:16px">Escolha <strong style="color:var(--text2)">um único modelo</strong> antes de indicar. Quanto maior o pagamento por merchant, menor o percentual mensal.</p></div>
    <div class="contador-models">
      <div class="contador-model-card">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px"><span style="font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:.1em;color:var(--text3)">Modelo A</span><span class="model-badge" style="background:rgba(255,122,24,.12);color:var(--ember);border-color:rgba(255,122,24,.25)">Mais caixa agora</span></div>
        <div style="font-family:'Bricolage Grotesque',sans-serif;font-weight:900;font-size:15px;margin-bottom:10px">Entrada rápida</div>
        <div class="model-fees-box"><div style="display:flex;justify-content:space-between;margin-bottom:4px"><span>Por merchant</span><strong style="color:var(--ember);font-family:'DM Mono',monospace">R$ 4.000</strong></div><div style="display:flex;justify-content:space-between"><span>Revenue share (12 meses)</span><strong style="color:#06b6d4;font-family:'DM Mono',monospace">10% das fees</strong></div></div>
        <div style="font-size:12px;color:var(--text3);line-height:1.5">Projeção mensal: <strong style="color:var(--ember)">${formatMoney(mA_m)}</strong></div>
        <div style="font-size:11px;color:var(--text3);margin-top:2px">Ativação total: <strong style="color:var(--text2)">${formatMoney(mA_a)}</strong></div>
      </div>
      <div class="contador-model-card" style="background:linear-gradient(145deg,rgba(255,122,24,.08),var(--card));border-color:rgba(255,122,24,.22)">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px"><span style="font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:.1em;color:var(--text3)">Modelo B</span><span class="model-badge" style="background:rgba(6,182,212,.12);color:#06b6d4;border-color:rgba(6,182,212,.25)">Equilíbrio</span></div>
        <div style="font-family:'Bricolage Grotesque',sans-serif;font-weight:900;font-size:15px;margin-bottom:10px">Recorrência forte</div>
        <div class="model-fees-box"><div style="display:flex;justify-content:space-between;margin-bottom:4px"><span>Por merchant</span><strong style="color:var(--ember);font-family:'DM Mono',monospace">R$ 2.500</strong></div><div style="display:flex;justify-content:space-between"><span>Revenue share (24 meses)</span><strong style="color:#06b6d4;font-family:'DM Mono',monospace">20% das fees</strong></div></div>
        <div style="font-size:12px;color:var(--text3);line-height:1.5">Projeção mensal: <strong style="color:var(--ember)">${formatMoney(mB_m)}</strong></div>
        <div style="font-size:11px;color:var(--text3);margin-top:2px">Ativação total: <strong style="color:var(--text2)">${formatMoney(mB_a)}</strong></div>
      </div>
      <div class="contador-model-card">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px"><span style="font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:.1em;color:var(--text3)">Modelo C</span><span class="model-badge" style="background:rgba(129,140,248,.12);color:#818cf8;border-color:rgba(129,140,248,.25)">Mais recorrência</span></div>
        <div style="font-family:'Bricolage Grotesque',sans-serif;font-weight:900;font-size:15px;margin-bottom:10px">Canal exclusivo</div>
        <div class="model-fees-box"><div style="display:flex;justify-content:space-between;margin-bottom:4px"><span>Por merchant</span><strong style="color:var(--ember);font-family:'DM Mono',monospace">R$ 1.500</strong></div><div style="display:flex;justify-content:space-between"><span>Revenue share (sem prazo)</span><strong style="color:#06b6d4;font-family:'DM Mono',monospace">30% das fees</strong></div></div>
        <div style="font-size:12px;color:var(--text3);line-height:1.5">Projeção mensal: <strong style="color:var(--ember)">${formatMoney(mC_m)}</strong></div>
        <div style="font-size:11px;color:var(--text3);margin-top:2px">Ativação total: <strong style="color:var(--text2)">${formatMoney(mC_a)}</strong></div>
        <div style="font-size:10px;color:#818cf8;margin-top:6px;font-weight:700">🔒 20 merchants → exclusividade regional</div>
      </div>
    </div>
    <div style="display:flex;align-items:center;gap:10px;padding:12px 16px;background:rgba(255,122,24,.06);border:1px solid rgba(255,122,24,.15);border-radius:12px;margin:16px 0">
      <span style="font-size:16px;flex-shrink:0">💡</span><p style="font-size:12px;color:var(--text2);line-height:1.55;margin:0"><strong style="color:var(--ember)">Regra prática:</strong> dinheiro agora → Modelo A. Renda mensal de longo prazo → B ou C. O Modelo C garante exclusividade regional ao atingir 20 merchants ativos.</p>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px">
      <div style="padding:14px;border-radius:12px;background:rgba(255,122,24,.05);border:1px solid rgba(255,122,24,.18)"><div style="font-family:'Bricolage Grotesque',sans-serif;font-weight:900;font-size:13px;color:var(--ember);margin-bottom:6px">✓ O que FAZ</div><div style="font-size:12px;color:var(--text2);line-height:1.6">Apresenta a Z-PAY ao cliente PJ. Indica o merchant para onboarding. Acompanha status no Painel.</div></div>
      <div style="padding:14px;border-radius:12px;background:rgba(0,0,0,.2);border:1px solid var(--border)"><div style="font-family:'Bricolage Grotesque',sans-serif;font-weight:900;font-size:13px;color:var(--text3);margin-bottom:6px">✗ O que NÃO faz</div><div style="font-size:12px;color:var(--text2);line-height:1.6">Não opera a conta. Não toca em recursos. Não dá ordem de pagamento. Não assume responsabilidade regulatória.</div></div>
    </div>
    <div style="font-family:'Bricolage Grotesque',sans-serif;font-weight:900;font-size:15px;color:var(--text);margin-bottom:12px">Carteira de Merchants</div>
    <table class="contador-table">
      <thead><tr><th>Empresa</th><th>CNPJ</th><th>Volume</th><th>Variação</th><th>Plano</th><th>KYC</th></tr></thead>
      <tbody>${MOCK_CLIENTES.map(x=>`<tr>
        <td><strong>${x.nome}</strong></td>
        <td style="font-family:'DM Mono',monospace;font-size:11px;color:var(--text3)">${x.cnpj}</td>
        <td><strong>${formatMoney(x.volume)}</strong></td>
        <td style="font-family:'DM Mono',monospace;font-size:12px;color:${x.var.startsWith('+')?'#34d399':'#f87171'}">${x.var}</td>
        <td><span class="pill-badge badge-plan">${x.plano}</span></td>
        <td><span class="pill-badge badge-kyc">${x.kyc}</span></td>
      </tr>`).join('')}</tbody>
    </table>
    <p style="font-size:11px;color:var(--text3);font-style:italic;margin-top:16px;line-height:1.6">Comissão paga após confirmação do setup. Revenue share sobre receita líquida de fees. Exclusividade condicionada a 20 merchants ativos.</p>`;
};

// ── CHARGEBACKS ───────────────────────
const MOCK_CB = [
  {id:'CB001',cliente:'João Silva',valor:'R$ 1.200,00',data:'10/03/2026',motivo:'Não reconhece',prazo:'5 dias',status:'ABERTO'},
  {id:'CB002',cliente:'Maria Santos',valor:'R$ 450,00',data:'08/03/2026',motivo:'Produto não entregue',prazo:'Vencido',status:'PERDIDO'},
  {id:'CB003',cliente:'Tech Store',valor:'R$ 8.700,00',data:'05/03/2026',motivo:'Fraude confirmada',prazo:'Resolvido',status:'GANHO'},
];
const refreshChargebacks = () => {
  const c = document.getElementById('chargebacksContent'); if (!c) return;
  const statusColor = s => s==='GANHO'?'badge-kyc':s==='ABERTO'?'badge-status-warn':'badge-status-err';
  c.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
    <div style="display:flex;gap:8px">
      <span class="pill-badge badge-status-warn">1 ABERTO</span>
      <span class="pill-badge badge-kyc">1 GANHO</span>
      <span class="pill-badge badge-status-err">1 PERDIDO</span>
    </div></div>
    <table class="contador-table">
      <thead><tr><th>ID</th><th>Cliente</th><th>Valor</th><th>Data</th><th>Motivo</th><th>Prazo</th><th>Status</th></tr></thead>
      <tbody>${MOCK_CB.map(x=>`<tr>
        <td style="font-family:'DM Mono',monospace;font-size:11px;color:var(--text3)">${x.id}</td>
        <td>${x.cliente}</td><td><strong>${x.valor}</strong></td>
        <td style="font-size:12px;color:var(--text3)">${x.data}</td>
        <td style="font-size:12px;color:var(--text2)">${x.motivo}</td>
        <td style="font-family:'DM Mono',monospace;font-size:11px;color:${x.prazo==='Vencido'?'#f87171':x.prazo==='Resolvido'?'#34d399':'#fbbf24'}">${x.prazo}</td>
        <td><span class="pill-badge ${statusColor(x.status)}">${x.status}</span></td>
      </tr>`).join('')}</tbody>
    </table>`;
};

// ── TEMPO REAL DEMO ────────────────────
const RT_PAYMENTS = [
  {name:'Marcos Oliveira',amount:1250,method:'PIX'},
  {name:'Fernanda Costa',amount:3800,method:'CARD'},
  {name:'TechStore LTDA',amount:12400,method:'PIX'},
  {name:'João Almeida',amount:890,method:'BOLETO'},
  {name:'Distribuidora ABC',amount:45000,method:'PIX'},
];
let rtInterval=null, rtIdx=0;
const showRtToast = (p) => {
  const t = document.createElement('div'); t.className='realtime-toast';
  const h = new Date().toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'});
  t.innerHTML=`<div class="rt-icon">⚡</div><div><div class="rt-name">${p.name}</div><div class="rt-amount">+ R$ ${p.amount.toLocaleString('pt-BR',{minimumFractionDigits:2})} <span class="rt-method">${p.method}</span></div></div><div class="rt-time">${h}</div>`;
  document.body.appendChild(t);
  requestAnimationFrame(()=>t.classList.add('rt-visible'));
  setTimeout(()=>{ t.classList.remove('rt-visible'); setTimeout(()=>t.remove(),400); },4000);
};
const startRealtimeDemo = () => {
  if (rtInterval) return; rtIdx=0;
  const fire = () => {
    if (rtIdx >= RT_PAYMENTS.length) { clearInterval(rtInterval); rtInterval=null; return; }
    showRtToast(RT_PAYMENTS[rtIdx++]);
  };
  fire(); rtInterval = setInterval(fire, 3200);
  // WhatsApp toast after 2s as part of demo
  setTimeout(() => showWhatsAppToast('Marcos Oliveira', 125000, 'PIX'), 2000);
};

// ── RELATÓRIO PDF — AUDITORIA FISCAL COMPLETA ──
const generateReport = () => {
  const w = window.open('','_blank');
  const now = new Date();
  const periodo = now.toLocaleDateString('pt-BR',{month:'long',year:'numeric'});
  const dataHora = now.toLocaleString('pt-BR');
  const m = MOCK.merchant || {name:'Demo Store',plan:'PRO',kyc_status:'APPROVED'};
  const payments = MOCK.payments.items;
  const charges = MOCK.charges.items;
  const payouts = MOCK.payouts.items;
  const webhooks = MOCK.webhooks.items;
  const fm = v => 'R$ '+(Number(v||0)/100).toLocaleString('pt-BR',{minimumFractionDigits:2});
  const fd = iso => {const d=new Date(iso);return d.toLocaleDateString('pt-BR');};
  const fh = iso => {const d=new Date(iso);return d.toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit',second:'2-digit'});};
  // Customer names mapped to charge IDs
  const customers = {'chg-001':'João Mendes','chg-002':'Maria Costa','chg-003':'Pedro Alves','chg-004':'Ana Rodrigues','chg-005':'Carlos Ferreira','chg-006':'TechStore LTDA','chg-007':'CryptoTrade ME','chg-008':'Distribuidora ABC','chg-009':'Marcos Oliveira','chg-010':'Fernanda Lima'};
  const custCNPJ = {'chg-001':'123.456.789-00','chg-002':'987.654.321-00','chg-003':'111.222.333-44','chg-004':'12.345.678/0001-90','chg-005':'555.666.777-88','chg-006':'98.765.432/0001-11','chg-007':'33.444.555/0001-22','chg-008':'55.666.777/0001-88','chg-009':'777.888.999-00','chg-010':'11.222.333/0001-44'};
  const descriptions = {'chg-001':'Serviço mensal','chg-002':'Consultoria empresarial','chg-003':'Produto digital','chg-004':'Manutenção anual','chg-005':'Teste (expirado)','chg-006':'Lote de equipamentos','chg-007':'Conversão cripto','chg-008':'Distribuição regional','chg-009':'Serviço avulso','chg-010':'Contrato trimestral'};

  // Calculate totals
  const totalVol = payments.reduce((a,p)=>a+p.amount,0);
  const totalFees = payments.reduce((a,p)=>a+p.fee_amount,0);
  const totalLiq = totalVol - totalFees;
  const paidCount = payments.filter(p=>p.status==='PAID').length;
  const failedCount = payments.filter(p=>p.status==='FAILED').length;
  const methods = {};
  payments.forEach(p=>{
    if(!methods[p.method]) methods[p.method]={vol:0,fees:0,count:0};
    methods[p.method].vol+=p.amount;
    methods[p.method].fees+=p.fee_amount;
    methods[p.method].count++;
  });

  const css = `*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'DM Sans',sans-serif;background:#fff;color:#1a1a1a;font-size:11px;line-height:1.5}
.page{padding:36px 40px;page-break-after:always;min-height:100vh;position:relative}
.page:last-child{page-break-after:auto}
.hdr{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:24px;padding-bottom:16px;border-bottom:2px solid #ff7a18}
.logo{font-family:'Bricolage Grotesque',sans-serif;font-weight:900;font-size:24px;color:#ff7a18}.logo span{color:#1a1a1a}
.hdr-right{text-align:right;font-family:'DM Mono',monospace;font-size:10px;color:#666}
.doc-type{font-size:12px;font-weight:700;color:#666;margin-top:2px;text-transform:uppercase;letter-spacing:.08em}
.section{margin-bottom:20px}
.section-title{font-family:'Bricolage Grotesque',sans-serif;font-size:13px;font-weight:900;color:#1a1a1a;margin-bottom:10px;padding-bottom:6px;border-bottom:1px solid #eee;display:flex;align-items:center;gap:6px}
.section-num{font-family:'DM Mono',monospace;font-size:10px;color:#ff7a18;font-weight:700}
.mets{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:16px}
.met{background:#fafafa;border-radius:8px;padding:12px 14px;border-left:3px solid #ff7a18}
.ml{font-size:9px;letter-spacing:.08em;text-transform:uppercase;color:#999;font-family:'DM Mono',monospace;margin-bottom:4px}
.mv{font-family:'Bricolage Grotesque',sans-serif;font-size:16px;font-weight:900;color:#1a1a1a}
.md{font-size:9px;font-family:'DM Mono',monospace;margin-top:2px}
.md.pos{color:#16a34a} .md.neg{color:#dc2626} .md.neu{color:#666}
table{width:100%;border-collapse:collapse;margin-bottom:14px;font-size:10px}
th{background:#f5f5f5;padding:7px 8px;text-align:left;font-family:'DM Mono',monospace;font-size:9px;letter-spacing:.06em;text-transform:uppercase;color:#888;border-bottom:1px solid #ddd}
td{padding:6px 8px;border-bottom:1px solid #f0f0f0;vertical-align:top}
tr:nth-child(even){background:#fafafa}
.badge{display:inline-block;padding:2px 6px;border-radius:100px;font-size:8px;font-family:'DM Mono',monospace;font-weight:700;letter-spacing:.04em}
.b-paid{background:#dcfce7;color:#16a34a} .b-failed{background:#fee2e2;color:#dc2626} .b-pending{background:#fff7ed;color:#ea580c} .b-expired{background:#f3f4f6;color:#6b7280}
.b-delivered{background:#dcfce7;color:#16a34a} .b-ok{background:#dcfce7;color:#16a34a} .b-warn{background:#fff7ed;color:#ea580c} .b-err{background:#fee2e2;color:#dc2626}
.b-completed{background:#dcfce7;color:#16a34a} .b-method{background:#fff7ed;color:#ff7a18}
.mono{font-family:'DM Mono',monospace}
.right{text-align:right}
.footer{position:absolute;bottom:20px;left:40px;right:40px;display:flex;justify-content:space-between;font-size:9px;color:#bbb;border-top:1px solid #eee;padding-top:8px}
.summary-box{background:#fffbf5;border:1px solid #ffe4c4;border-radius:8px;padding:12px 14px;margin-bottom:16px;font-size:10px;color:#666}
.summary-box strong{color:#1a1a1a}
.compliance-box{background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:14px;margin-bottom:16px}
.compliance-item{display:flex;align-items:center;gap:6px;margin-bottom:4px;font-size:10px}
.compliance-dot{width:6px;height:6px;border-radius:50%;background:#16a34a;flex-shrink:0}
.sign-area{display:grid;grid-template-columns:1fr 1fr;gap:40px;margin-top:40px;padding-top:20px}
.sign-line{border-top:1px solid #ccc;padding-top:8px;text-align:center;font-size:10px;color:#888}
.disclaimer{font-size:8px;color:#aaa;line-height:1.4;margin-top:20px;padding:10px;background:#fafafa;border-radius:4px}
@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}.page{padding:24px 28px;min-height:auto}}`;

  let html = `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><title>Relatório Fiscal Z-PAY — ${periodo}</title>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,900&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>${css}</style></head><body>`;

  // ═══ PAGE 1: COVER + EXECUTIVE SUMMARY ═══
  html += `<div class="page">
<div class="hdr"><div><div class="logo">Z<span>-PAY</span></div><div class="doc-type">Relatório de Auditoria Fiscal e Transparência Operacional</div></div>
<div class="hdr-right"><div style="font-weight:700;color:#1a1a1a">${m.name}</div><div>CNPJ: 00.000.000/0001-00</div><div>Período: ${periodo}</div><div style="margin-top:4px">Protocolo: ZPR-${Date.now().toString(36).toUpperCase()}</div></div></div>

<div class="summary-box">Este relatório foi gerado automaticamente pela plataforma Z-PAY e contém o registro completo de <strong>todas as transações, cobranças, liquidações, chargebacks e eventos</strong> do período. Os dados são extraídos do ledger auditável append-only e refletem fielmente as operações processadas. Documento válido para fins de auditoria fiscal e compliance.</div>

<div class="section"><div class="section-title"><span class="section-num">01</span>Resumo Executivo</div>
<div class="mets">
<div class="met"><div class="ml">Volume Bruto</div><div class="mv">${fm(totalVol)}</div><div class="md pos">↑ +12% vs mês anterior</div></div>
<div class="met"><div class="ml">Receita Líquida</div><div class="mv">${fm(totalLiq)}</div><div class="md pos">↑ +8% vs mês anterior</div></div>
<div class="met"><div class="ml">Fees Operacionais</div><div class="mv">${fm(totalFees)}</div><div class="md neu">${(totalFees/totalVol*100).toFixed(2)}% do volume</div></div>
<div class="met"><div class="ml">Transações</div><div class="mv">${payments.length}</div><div class="md neu">${paidCount} pagas · ${failedCount} falha</div></div>
</div></div>

<div class="section"><div class="section-title"><span class="section-num">02</span>Distribuição por Método de Pagamento</div>
<table><thead><tr><th>Método</th><th>Transações</th><th class="right">Volume Bruto</th><th class="right">Fees</th><th class="right">Líquido</th><th class="right">% Volume</th><th>Taxa Média</th></tr></thead><tbody>
${Object.entries(methods).map(([k,v])=>`<tr><td><span class="badge b-method">${k}</span></td><td class="mono">${v.count}</td><td class="right mono">${fm(v.vol)}</td><td class="right mono">${fm(v.fees)}</td><td class="right mono">${fm(v.vol-v.fees)}</td><td class="right mono">${(v.vol/totalVol*100).toFixed(1)}%</td><td class="mono">${(v.fees/v.vol*100).toFixed(2)}%</td></tr>`).join('')}
<tr style="font-weight:700;border-top:2px solid #ddd"><td>TOTAL</td><td class="mono">${payments.length}</td><td class="right mono">${fm(totalVol)}</td><td class="right mono">${fm(totalFees)}</td><td class="right mono">${fm(totalLiq)}</td><td class="right mono">100%</td><td class="mono">${(totalFees/totalVol*100).toFixed(2)}%</td></tr>
</tbody></table></div>

<div class="section"><div class="section-title"><span class="section-num">03</span>Indicadores de Risco e Compliance</div>
<div class="compliance-box">
<div class="compliance-item"><div class="compliance-dot"></div><strong>Score de Risco:</strong>&nbsp;20/100 (BAIXO) — Nenhuma anomalia detectada</div>
<div class="compliance-item"><div class="compliance-dot"></div><strong>Taxa de Aprovação:</strong>&nbsp;${(paidCount/payments.length*100).toFixed(1)}% — Dentro dos parâmetros aceitáveis</div>
<div class="compliance-item"><div class="compliance-dot"></div><strong>Chargebacks:</strong>&nbsp;${MOCK_CB.length} registro(s) — Índice: ${(MOCK_CB.filter(c=>c.status==='PERDIDO').length/payments.length*100).toFixed(2)}%</div>
<div class="compliance-item"><div class="compliance-dot"></div><strong>KYC Status:</strong>&nbsp;APROVADO — Verificação de identidade completa</div>
<div class="compliance-item"><div class="compliance-dot"></div><strong>Plano:</strong>&nbsp;${m.plan} — Taxas: PIX 3,2% | Cartão 4,5%+R$0,25 | Cripto 2,5%</div>
<div class="compliance-item"><div class="compliance-dot"></div><strong>Ledger:</strong>&nbsp;Append-only, imutável, com trilha de auditoria por padrão</div>
</div></div>

<div class="footer"><div>Z-PAY — Relatório de Auditoria Fiscal · Protocolo ZPR-${Date.now().toString(36).toUpperCase()}</div><div>Página 1 de 4 · Gerado em ${dataHora}</div></div></div>`;

  // ═══ PAGE 2: TRANSACTION LISTING ═══
  html += `<div class="page">
<div class="hdr"><div><div class="logo">Z<span>-PAY</span></div><div class="doc-type">Extrato Completo de Transações</div></div>
<div class="hdr-right"><div>${m.name}</div><div>${periodo}</div></div></div>

<div class="section"><div class="section-title"><span class="section-num">04</span>Extrato Analítico — Todas as Transações</div>
<table><thead><tr><th>#</th><th>ID Transação</th><th>Data</th><th>Hora</th><th>Cliente / Pagador</th><th>CPF/CNPJ</th><th>Descrição</th><th>Método</th><th class="right">Valor Bruto</th><th class="right">Fee</th><th class="right">Líquido</th><th>Status</th></tr></thead><tbody>
${payments.map((p,i)=>{
  const st = p.status==='PAID'?'b-paid':p.status==='FAILED'?'b-failed':'b-pending';
  return `<tr>
<td class="mono">${String(i+1).padStart(3,'0')}</td>
<td class="mono" style="font-size:9px">${p.id}</td>
<td class="mono">${fd(p.created_at)}</td>
<td class="mono">${fh(p.created_at)}</td>
<td>${customers[p.charge_id]||'—'}</td>
<td class="mono" style="font-size:9px">${custCNPJ[p.charge_id]||'—'}</td>
<td>${descriptions[p.charge_id]||'—'}</td>
<td><span class="badge b-method">${p.method}</span></td>
<td class="right mono">${fm(p.amount)}</td>
<td class="right mono" style="color:#dc2626">${fm(p.fee_amount)}</td>
<td class="right mono" style="font-weight:600">${fm(p.amount-p.fee_amount)}</td>
<td><span class="badge ${st}">${p.status}</span></td>
</tr>`;}).join('')}
<tr style="font-weight:700;border-top:2px solid #ddd;background:#f9f9f9"><td colspan="8" style="text-align:right">TOTAIS</td><td class="right mono">${fm(totalVol)}</td><td class="right mono" style="color:#dc2626">${fm(totalFees)}</td><td class="right mono">${fm(totalLiq)}</td><td></td></tr>
</tbody></table></div>

<div class="section"><div class="section-title"><span class="section-num">05</span>Cobranças Emitidas</div>
<table><thead><tr><th>ID Cobrança</th><th>Data Emissão</th><th>Hora</th><th>Descrição</th><th>Moeda</th><th class="right">Valor</th><th>Link de Pagamento</th><th>Status</th></tr></thead><tbody>
${charges.map(c=>{
  const st = c.status==='PAID'?'b-paid':c.status==='PENDING'?'b-pending':'b-expired';
  return `<tr>
<td class="mono" style="font-size:9px">${c.id}</td>
<td class="mono">${fd(c.created_at)}</td>
<td class="mono">${fh(c.created_at)}</td>
<td>${c.description}</td>
<td class="mono">${c.currency}</td>
<td class="right mono">${fm(c.amount)}</td>
<td class="mono" style="font-size:8px;color:#888;max-width:120px;overflow:hidden;text-overflow:ellipsis">${c.payment_link}</td>
<td><span class="badge ${st}">${c.status}</span></td>
</tr>`;}).join('')}
</tbody></table></div>

<div class="footer"><div>Z-PAY — Extrato Analítico de Transações</div><div>Página 2 de 4 · Gerado em ${dataHora}</div></div></div>`;

  // ═══ PAGE 3: PAYOUTS + CHARGEBACKS + WEBHOOKS ═══
  html += `<div class="page">
<div class="hdr"><div><div class="logo">Z<span>-PAY</span></div><div class="doc-type">Liquidações, Disputas e Eventos</div></div>
<div class="hdr-right"><div>${m.name}</div><div>${periodo}</div></div></div>

<div class="section"><div class="section-title"><span class="section-num">06</span>Histórico de Liquidações (Payouts)</div>
<table><thead><tr><th>ID Payout</th><th>Data</th><th>Hora</th><th>Método</th><th class="right">Valor</th><th>Destino</th><th>Status</th></tr></thead><tbody>
${payouts.map(p=>{
  const st = p.status==='COMPLETED'?'b-completed':'b-pending';
  return `<tr>
<td class="mono">${p.id}</td>
<td class="mono">${fd(p.created_at)}</td>
<td class="mono">${fh(p.created_at)}</td>
<td><span class="badge b-method">${p.method}</span></td>
<td class="right mono">${fm(p.amount)}</td>
<td class="mono" style="font-size:9px">Banco: 001 · Ag: 1234 · CC: ****5678</td>
<td><span class="badge ${st}">${p.status}</span></td>
</tr>`;}).join('')}
</tbody></table></div>

<div class="section"><div class="section-title"><span class="section-num">07</span>Registro de Chargebacks e Disputas</div>
<table><thead><tr><th>ID</th><th>Data</th><th>Cliente</th><th class="right">Valor</th><th>Motivo</th><th>Prazo</th><th>Documentação</th><th>Status</th></tr></thead><tbody>
${MOCK_CB.map(c=>{
  const st = c.status==='GANHO'?'b-ok':c.status==='ABERTO'?'b-warn':'b-err';
  return `<tr>
<td class="mono">${c.id}</td>
<td class="mono">${c.data}</td>
<td>${c.cliente}</td>
<td class="right mono">${c.valor}</td>
<td>${c.motivo}</td>
<td class="mono" style="font-size:9px">${c.prazo}</td>
<td style="font-size:9px;color:#888">${c.status==='GANHO'?'Comprovante enviado':'Pendente'}</td>
<td><span class="badge ${st}">${c.status}</span></td>
</tr>`;}).join('')}
</tbody></table>
<div class="summary-box">Índice de chargebacks: <strong>${(MOCK_CB.filter(c=>c.status==='PERDIDO').length/payments.length*100).toFixed(2)}%</strong> — Limite aceitável: 1,00%. Status: <strong style="color:#16a34a">Saudável</strong></div></div>

<div class="section"><div class="section-title"><span class="section-num">08</span>Log de Webhooks e Eventos</div>
<table><thead><tr><th>ID Evento</th><th>Data</th><th>Hora</th><th>Tipo de Evento</th><th>Tentativas</th><th>Latência</th><th>Status</th></tr></thead><tbody>
${webhooks.map(w=>{
  const st = w.status==='DELIVERED'?'b-delivered':'b-err';
  return `<tr>
<td class="mono" style="font-size:9px">${w.id}</td>
<td class="mono">${fd(w.created_at)}</td>
<td class="mono">${fh(w.created_at)}</td>
<td class="mono">${w.event_type}</td>
<td class="mono">${w.attempts}/3</td>
<td class="mono">${Math.floor(Math.random()*80+20)}ms</td>
<td><span class="badge ${st}">${w.status}</span></td>
</tr>`;}).join('')}
</tbody></table></div>

<div class="footer"><div>Z-PAY — Liquidações, Disputas e Eventos</div><div>Página 3 de 4 · Gerado em ${dataHora}</div></div></div>`;

  // ═══ PAGE 4: CONCILIAÇÃO + COMPLIANCE + ASSINATURAS ═══
  html += `<div class="page">
<div class="hdr"><div><div class="logo">Z<span>-PAY</span></div><div class="doc-type">Conciliação e Declaração de Compliance</div></div>
<div class="hdr-right"><div>${m.name}</div><div>${periodo}</div></div></div>

<div class="section"><div class="section-title"><span class="section-num">09</span>Conciliação Automática — Vendas × Recebimentos × Fees</div>
<table><thead><tr><th>ID</th><th>Método</th><th class="right">Valor Vendido</th><th class="right">Valor Recebido</th><th class="right">Fee Cobrada</th><th>Taxa %</th><th>Data</th><th>Status</th></tr></thead><tbody>
${MOCK_RECON.map(r=>{
  const st = r.status==='ok'?'b-ok':r.status==='warn'?'b-warn':'b-err';
  const label = r.status==='ok'?t('recon_ok'):r.status==='warn'?t('recon_warn'):t('recon_err');
  return `<tr>
<td class="mono">${r.id}</td>
<td><span class="badge b-method">${r.tipo}</span></td>
<td class="right mono">${fm(r.vendido)}</td>
<td class="right mono">${fm(r.recebido)}</td>
<td class="right mono" style="color:#dc2626">${fm(r.fee)}</td>
<td class="mono">${r.feePct}%</td>
<td class="mono">${r.data}</td>
<td><span class="badge ${st}">${label}</span></td>
</tr>${r.nota?`<tr><td colspan="8" style="font-size:9px;color:#ea580c;padding:2px 8px 6px">↳ ${r.nota}</td></tr>`:''}`; }).join('')}
</tbody></table></div>

<div class="section"><div class="section-title"><span class="section-num">10</span>Declaração de Compliance e Conformidade</div>
<div class="compliance-box">
<div class="compliance-item"><div class="compliance-dot"></div><strong>Smart Contract:</strong>&nbsp;Auditado por Cyberscope (Dez/2024)</div>
<div class="compliance-item"><div class="compliance-dot"></div><strong>KYC/KYB:</strong>&nbsp;Verificação completa — equipe fundadora e merchant</div>
<div class="compliance-item"><div class="compliance-dot"></div><strong>LGPD:</strong>&nbsp;Em conformidade — dados pessoais tratados conforme Lei 13.709/2018</div>
<div class="compliance-item"><div class="compliance-dot"></div><strong>AML:</strong>&nbsp;Programa de prevenção à lavagem de dinheiro estruturado</div>
<div class="compliance-item"><div class="compliance-dot"></div><strong>Criptografia:</strong>&nbsp;AES-256 em repouso, TLS 1.3 em trânsito</div>
<div class="compliance-item"><div class="compliance-dot"></div><strong>Ledger:</strong>&nbsp;Append-only — registros imutáveis com hash de integridade</div>
<div class="compliance-item"><div class="compliance-dot"></div><strong>Idempotência:</strong>&nbsp;Obrigatória em todas as operações financeiras</div>
<div class="compliance-item"><div class="compliance-dot"></div><strong>VARA/VASP:</strong>&nbsp;Alinhamento progressivo com frameworks regulatórios internacionais</div>
</div></div>

<div class="section"><div class="section-title"><span class="section-num">11</span>Declaração de Responsabilidade</div>
<div class="disclaimer">
Este relatório foi gerado automaticamente pela plataforma Z-PAY, módulo de orquestração de pagamentos do ecossistema ZETTA. Os dados apresentados refletem fielmente as operações registradas no ledger auditável da plataforma durante o período de referência.<br><br>
A Z-PAY é infraestrutura de orquestração de pagamentos. Não constitui serviço financeiro, não capta recursos, não opera como instituição financeira. Liquidação processada via parceiros autorizados conforme jurisdição aplicável.<br><br>
Documento gerado para fins de transparência operacional e compliance fiscal. Para verificação de integridade, utilize o protocolo de rastreamento informado no cabeçalho de cada página.
</div></div>

<div class="sign-area">
<div><div class="sign-line">Responsável Técnico — Z-PAY</div></div>
<div><div class="sign-line">Representante Legal — ${m.name}</div></div>
</div>

<div class="footer"><div>Z-PAY — Conciliação e Compliance</div><div>Página 4 de 4 · Gerado em ${dataHora}</div></div></div>`;

  html += `</body></html>`;
  w.document.write(html);
  w.document.close();
  setTimeout(()=>w.print(),600);
};

// ── AUTH ──────────────────────────────
const loadMerchant = async () => {
  const r = await api('/auth/me'); state.merchant = r.merchant;
  if (el.planBadge) el.planBadge.textContent = `Plano ${state.merchant.plan}`;
  if (el.kycBadge) el.kycBadge.textContent = `KYC ${state.merchant.kyc_status}`;
  if (el.onboardingStatus) el.onboardingStatus.textContent = 'KYC Aprovado';
  const pb = document.getElementById('currentPlanBadge'); if (pb) pb.textContent = `Plano atual: ${state.merchant.plan}`;
  const apiInput = document.getElementById('apiBase'); if (apiInput) apiInput.value = 'DEMO MODE';
  const zfLink = document.getElementById('zfinanceLink'); if (zfLink) zfLink.href = '#';
};

const setAuthUI = (auth) => {
  if (el.loginScreen) el.loginScreen.hidden = auth;
  if (el.appWrap) el.appWrap.hidden = !auth;
  document.body.classList.toggle('app-visible', auth);
  document.body.classList.toggle('login-visible', !auth);
  const zw = document.getElementById('zionWidget');
  if (zw) zw.style.display = auth ? 'flex' : 'none';
};

// ── LOGIN ─────────────────────────────
if (el.loginForm) {
  el.loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const emailEl = document.getElementById('loginEmail');
    const passEl  = document.getElementById('loginPassword');
    const errEl   = document.getElementById('loginError');
    const btn     = e.target.querySelector('button[type="submit"]');
    if (errEl) { errEl.hidden=true; errEl.textContent=''; }
    if (btn) { btn.disabled=true; btn.textContent='🔒 Criptografando credenciais…'; }
    try {
      const data = await api('/auth/login', { method:'POST', body:{email:emailEl?.value?.trim(), password:passEl?.value} });
      state.token = data.access_token;
      localStorage.setItem('zpay_token', state.token);
      setAuthUI(true);
      await loadMerchant();
      await renderPremiumDashboard();
      showWelcomeBanner();
      setTimeout(() => initZionWidget(), 500);
    } catch(err) {
      if (errEl) { errEl.textContent = t('login_failed'); errEl.hidden=false; }
    } finally {
      if (btn) { btn.disabled=false; btn.textContent=t('enter_btn'); }
    }
  });
}
if (el.demoLogin) {
  el.demoLogin.addEventListener('click', () => {
    const e = document.getElementById('loginEmail'); if (e) e.value=atob('ZGVtb0B6cGF5LmNvbQ==');
    const p = document.getElementById('loginPassword'); if (p) p.value=atob('ZGVtbzEyMw==');
    if (el.loginForm) el.loginForm.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));
  });
}

// ── NAVEGAÇÃO ─────────────────────────
const getViewTitles = () => ({
  dashboard:[t('menu_dashboard'),t('subtitle_dashboard')],
  charges:[t('menu_charges'),t('subtitle_charges')],
  payments:[t('menu_payments'),t('subtitle_payments')],
  payouts:[t('menu_payouts'),t('subtitle_payouts')],
  webhooks:[t('menu_webhooks'),t('subtitle_webhooks')],
  analytics:[t('menu_analytics'),t('subtitle_analytics')],
  plans:[t('menu_plans'),t('subtitle_plans')],
  linkbio:[t('menu_linkbio'),t('subtitle_linkbio')],
  subscriptions:[t('menu_subscriptions'),t('subtitle_subscriptions')],
  roadmap:[t('menu_roadmap'),t('subtitle_roadmap')],
  docs:[t('menu_docs'),t('subtitle_docs')],
  onboarding:[t('menu_onboarding'),t('subtitle_onboarding')],
  settings:[t('menu_settings'),t('subtitle_settings')],
  contador:[t('menu_contador'),t('subtitle_dashboard')],
  chargebacks:[t('menu_chargebacks'),t('subtitle_dashboard')],
  'checkout-adaptativo':[t('menu_checkout_ia'),t('subtitle_dashboard')],
  'pagamento-preditivo':[t('menu_predicao'),t('subtitle_dashboard')],
  'sistema-nervoso':[t('menu_sistema_nervoso'),t('subtitle_dashboard')],
  'nota-fiscal':[t('menu_nota_fiscal'),t('subtitle_dashboard')],
  agentic:[t('menu_agentic'),t('subtitle_dashboard')],
  reconciliacao:[t('menu_recon'),t('subtitle_dashboard')],
  'zion-chat':[t('menu_zion'),t('subtitle_dashboard')],
});
const VIEW_TITLES = new Proxy({}, { get: (_, k) => getViewTitles()[k] || [k, ''] });

const switchView = (view) => {
  const [title, subtitle] = VIEW_TITLES[view] || [view, ''];
  // ZION full-screen mode
  if (view === 'zion-chat') { document.body.classList.add('zion-active'); } else { document.body.classList.remove('zion-active'); }
  const ma = document.getElementById('mobileActions'); if (ma) ma.style.display = view === 'zion-chat' ? 'none' : '';
  // Show/hide premium dashboard
  const pd = document.getElementById('premiumDashboard');
  if (pd) pd.style.display = view === 'dashboard' ? 'flex' : 'none';

  // Show skeleton while loading (perceived performance)
  const targetPanel = document.getElementById(`${view}View`);
  const contentEl = targetPanel?.querySelector('[id$="Content"]');
  if (contentEl && view !== 'dashboard') {
    contentEl.innerHTML = '<div class="skeleton skeleton-card" style="margin-bottom:14px"></div><div class="skeleton skeleton-line w80"></div><div class="skeleton skeleton-line w60"></div><div class="skeleton skeleton-chart" style="margin-top:14px"></div>';
  }

  setView(view, title, subtitle);

  // Small delay to show skeleton, then render real content
  setTimeout(() => {
    if (view === 'charges')             refreshCharges();
    if (view === 'payments')            refreshPayments();
    if (view === 'analytics')           refreshAnalytics();
    if (view === 'payouts')             refreshPayouts();
    if (view === 'webhooks')            refreshWebhooks();
    if (view === 'linkbio')             refreshLinkbio();
    if (view === 'subscriptions')       refreshSubscriptions();
    if (view === 'contador')            refreshContador();
    if (view === 'chargebacks')         refreshChargebacks();
    if (view === 'checkout-adaptativo') refreshCheckoutAdaptativo();
    if (view === 'pagamento-preditivo') refreshPagamentoPreditivo();
    if (view === 'sistema-nervoso')     refreshSistemaNervoso();
    if (view === 'nota-fiscal')         refreshNotaFiscal();
    if (view === 'agentic')             refreshAgentic();
    if (view === 'reconciliacao')       refreshReconciliacao();
  }, 120);

  closeSidebar();
};

document.querySelectorAll('.menu-item').forEach(item => {
  item.addEventListener('click', () => switchView(item.dataset.view));
});

// ── MODAIS ────────────────────────────
el.openCharge?.addEventListener('click',  () => openModal(el.chargeModal));
el.openPayout?.addEventListener('click',  () => openModal(el.payoutModal));
el.openCheckout?.addEventListener('click',() => openModal(el.checkoutModal));

const buildSplitRules = () => {
  const rules=[];
  [1,2,3].forEach(i=>{
    const r=document.getElementById(`splitReceiver${i}`)?.value?.trim();
    const p=Number(document.getElementById(`splitPct${i}`)?.value||0);
    if(r&&p>0) rules.push({account:r,percentage:p});
  });
  return rules;
};

el.chargeForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    const p1=Number(document.getElementById('splitPct1')?.value||0);
    const p2=Number(document.getElementById('splitPct2')?.value||0);
    const p3=Number(document.getElementById('splitPct3')?.value||0);
    if (p1+p2+p3 !== 100) { el.chargeResult.textContent='Split deve totalizar 100%'; el.chargeResult.hidden=false; return; }
    const cur=document.getElementById('chargeCurrency')?.value||'BRL';
    const amt=Number(document.getElementById('chargeAmount').value);
    const amount=['BRL','USD','EUR','USDT'].includes(cur)?Math.round(amt*100):(cur==='BTC'?Math.round(amt*1e8):Math.round(amt*1e18));
    const data = await api('/charges',{method:'POST',body:{amount,currency:cur,description:document.getElementById('chargeDescription').value,split_rules:buildSplitRules(),metadata:{customer_id:document.getElementById('chargeCustomerId')?.value||''}}});
    el.chargeResult.textContent=`Cobrança criada! Link: ${data.payment_link}`;
    el.chargeResult.hidden=false;
    refreshCharges(); closeAllModals();
  } catch(err) { el.chargeResult.textContent=t('error_generic'); el.chargeResult.hidden=false; }
});

el.payoutForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    await api('/payouts',{method:'POST',body:{amount:Number(document.getElementById('payoutAmount').value)*100,method:document.getElementById('payoutMethod').value}});
    closeAllModals(); refreshPayouts();
  } catch(err) { const d=document.getElementById('payoutError'); if(d){d.textContent=t('error_generic');d.hidden=false;} }
});

el.checkoutForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    const data=await api(`/charges/${document.getElementById('checkoutChargeId').value}/pay`,{method:'POST',body:{method:document.getElementById('checkoutMethod').value}});
    el.checkoutResult.textContent=`Pagamento ${data.status}. Atualize o dashboard.`; el.checkoutResult.hidden=false; closeAllModals();
  } catch(err) { el.checkoutResult.textContent=t('error_generic'); el.checkoutResult.hidden=false; }
});

// ── REFRESHES ─────────────────────────
el.refreshDashboard?.addEventListener('click', refreshDashboard);
el.refreshCharges?.addEventListener('click', refreshCharges);
el.refreshPayments?.addEventListener('click', refreshPayments);
el.refreshWebhooks?.addEventListener('click', refreshWebhooks);

el.triggerWebhook?.addEventListener('click', async () => {
  if (el.webhookConsole) el.webhookConsole.textContent='Disparando evento...';
  setTimeout(()=>{ if(el.webhookStatus) el.webhookStatus.textContent='Webhook disparado (modo demo).'; refreshWebhooks(); },1500);
});

// ── FECHAR MODAIS ─────────────────────
document.querySelectorAll('.close-modal').forEach(btn=>{
  btn.addEventListener('click',()=>{ closeModal(document.getElementById(btn.dataset.close)); closeAllModals(); });
});
document.querySelectorAll('.modal').forEach(modal=>{ modal.addEventListener('click',e=>{ if(e.target===modal) closeAllModals(); }); });
if (el.modalBackdrop) el.modalBackdrop.addEventListener('click', closeAllModals);

// ── SIDEBAR ───────────────────────────
const closeSidebar = () => {
  el.sidebar?.classList.remove('open');
  el.hamburger?.classList.remove('active');
  el.sidebarOverlay?.classList.remove('active');
  el.sidebarOverlay?.setAttribute('aria-hidden', 'true');
};
const toggleSidebar = () => {
  const isOpen = !el.sidebar?.classList.contains('open');
  el.sidebar?.classList.toggle('open', isOpen);
  el.hamburger?.classList.toggle('active', isOpen);
  el.sidebarOverlay?.classList.toggle('active', isOpen);
  el.sidebarOverlay?.setAttribute('aria-hidden', String(!isOpen));
};
el.hamburger?.addEventListener('click', toggleSidebar);
el.sidebarOverlay?.addEventListener('click', closeSidebar);

// ── TOPBAR BTNS ───────────────────────
document.getElementById('btnDemoLive')?.addEventListener('click', startRealtimeDemo);
document.getElementById('btnGenerateReport')?.addEventListener('click', generateReport);
document.getElementById('mobDemoLive')?.addEventListener('click', startRealtimeDemo);
document.getElementById('mobReport')?.addEventListener('click', generateReport);
/* mobile checkout handled by bottom nav FAB */
/* mobile charge handled by bottom nav FAB */
/* logout handled by sidebar footer button */

// ── LOGOUT ────────────────────────────

el.brandHome?.addEventListener('click',()=>switchView('dashboard'));
el.simulateKyc?.addEventListener('click',()=>{ if(el.onboardingStatus) el.onboardingStatus.textContent='KYC Aprovado'; if(el.kycBadge) el.kycBadge.textContent='KYC APPROVED'; });

// ── INSIGHTS TABS ─────────────────────
document.getElementById('insightsChips')?.addEventListener('click',e=>{
  const chip=e.target.closest('.chip'); if(!chip) return;
  const tab=chip.dataset.tab;
  document.querySelectorAll('#insightsChips .chip').forEach(c=>c.classList.remove('active')); chip.classList.add('active');
  document.querySelectorAll('.insights-tab').forEach(t=>{t.hidden=true;});
  const tgt=document.getElementById(`insights${tab.charAt(0).toUpperCase()+tab.slice(1)}`); if(tgt) tgt.hidden=false;
});

// ── ROADMAP TABS ──────────────────────
document.querySelectorAll('.roadmap-tab').forEach(tab=>{
  tab.addEventListener('click',()=>{
    document.querySelectorAll('.roadmap-tab').forEach(t=>t.classList.remove('active')); tab.classList.add('active');
    const key=tab.dataset.roadmap;
    document.querySelectorAll('.roadmap-content').forEach(c=>{c.hidden=true;});
    const tgt=document.getElementById(`roadmap${key.charAt(0).toUpperCase()+key.slice(1)}`); if(tgt) tgt.hidden=false;
  });
});

// ── LINKS ─────────────────────────────
document.addEventListener('click',e=>{
  if (e.target.closest('.pagination-btn')) {
    const btn=e.target.closest('.pagination-btn'); if(btn.disabled) return;
    const tableKey=btn.dataset.table; const page=parseInt(btn.dataset.page,10);
    if(tableKey&&page){ state[`page_${tableKey}`]=page; if(tableKey==='charges')refreshCharges(); if(tableKey==='payments')refreshPayments(); if(tableKey==='subscriptions')refreshSubscriptions(); }
  }
  if (e.target.closest('[data-goto="settings"]')) { e.preventDefault(); switchView('settings'); }
});

// ── SETTINGS ──────────────────────────
document.getElementById('settingsForm')?.addEventListener('submit', e => {
  e.preventDefault();
  const wl={logo:document.getElementById('whitelabelLogo')?.value,color:document.getElementById('whitelabelColor')?.value||'#22c55e',domain:document.getElementById('whitelabelDomain')?.value};
  localStorage.setItem('zpay_whitelabel',JSON.stringify(wl));
  const rcEl=document.getElementById('receiveCrypto');
  const wallet=document.getElementById('cryptoWalletAddress')?.value?.trim();
  const walletCur=document.getElementById('cryptoWalletCurrency')?.value;
  if(rcEl?.checked&&wallet) localStorage.setItem('zpay_crypto_wallet',JSON.stringify({address:wallet,currency:walletCur}));
  else localStorage.removeItem('zpay_crypto_wallet');
});
document.getElementById('receiveCrypto')?.addEventListener('change',e=>{
  const wf=document.getElementById('walletFields'); const wcl=document.getElementById('walletCurrencyLabel');
  if(wf) wf.hidden=!e.target.checked; if(wcl) wcl.hidden=!e.target.checked;
});
el.settlementCurrency?.addEventListener('change', refreshDashboard);
el.autoConvert?.addEventListener('change', refreshDashboard);

// ── EXPORT CSV ────────────────────────
document.getElementById('exportCsv')?.addEventListener('click', async () => {
  const data = await api('/payments');
  const rows=(data.items||[]).map(p=>[p.id,p.charge_id,p.method,p.status,formatMoney(p.amount),formatMoney(p.fee_amount),new Date(p.created_at).toLocaleString('pt-BR')].join(';'));
  const csv='ID;Charge ID;Método;Status;Valor;Fee;Data\n'+rows.join('\n');
  const a=document.createElement('a'); a.href='data:text/csv;charset=utf-8,'+encodeURIComponent(csv); a.download=`zpay-${new Date().toISOString().slice(0,10)}.csv`; a.click();
});
document.getElementById('viewChargebacks')?.addEventListener('click', ()=>switchView('chargebacks'));

// ── LINKBIO ───────────────────────────
const LINKBIO_KEY='zpay_linkbio_products', SUBSCRIPTIONS_KEY='zpay_subscriptions';
const refreshLinkbio = () => {
  const products=safeJSON(localStorage.getItem(LINKBIO_KEY));
  const slug=(state.merchant?.email||'demo').split('@')[0].replace(/[^a-z0-9]/gi,'-').toLowerCase();
  const urlEl=document.getElementById('linkbioUrl'); if(urlEl) urlEl.textContent=`${location.origin}/linkbio.html?slug=${slug}`;
  const container=document.getElementById('linkbioProducts'); if(!container) return;
  container.innerHTML=products.map((p,i)=>`<div class="linkbio-product"><div class="product-info"><strong>${p.name}</strong> — ${formatMoney(p.amount*100)}${p.desc?`<br><span class="product-desc">${p.desc}</span>`:''}</div><div class="product-actions"><button class="ghost" data-remove="${i}">${t('linkbio_remove')}</button></div></div>`).join('')||`<p class="panel-desc">${t('linkbio_no_products')}</p>`;
  container.querySelectorAll('[data-remove]').forEach(btn=>{
    btn.addEventListener('click',()=>{ const list=safeJSON(localStorage.getItem(LINKBIO_KEY)); list.splice(parseInt(btn.dataset.remove,10),1); localStorage.setItem(LINKBIO_KEY,JSON.stringify(list)); refreshLinkbio(); });
  });
};
const refreshSubscriptions = () => {
  const subs=safeJSON(localStorage.getItem(SUBSCRIPTIONS_KEY));
  const pag=document.getElementById('subscriptionsPagination');
  const container=document.getElementById('subscriptionsTable'); if(!container) return;
  renderTable(container,subs,[(r)=>r.id?.slice(0,8)||'-',(r)=>r.description||'-',(r)=>formatMoney((r.amount||0)*100),(r)=>r.day||'-',(r)=>r.status||t('sub_active')],[t('th_id'),t('th_description'),t('th_value'),t('th_day'),t('th_status')],pag,'subscriptions');
};
document.getElementById('addLinkProduct')?.addEventListener('click',()=>openModal(document.getElementById('linkProductModal')));
document.getElementById('linkProductForm')?.addEventListener('submit',e=>{ e.preventDefault(); const list=safeJSON(localStorage.getItem(LINKBIO_KEY)); list.push({id:'p'+Date.now(),name:document.getElementById('productName').value,amount:Number(document.getElementById('productAmount').value),desc:document.getElementById('productDesc').value}); localStorage.setItem(LINKBIO_KEY,JSON.stringify(list)); document.getElementById('linkProductForm').reset(); closeAllModals(); refreshLinkbio(); });
document.getElementById('copyLinkbio')?.addEventListener('click',()=>{ const url=document.getElementById('linkbioUrl')?.textContent; if(url&&url!=='—'){navigator.clipboard.writeText(url); document.getElementById('copyLinkbio').textContent='Copiado!'; setTimeout(()=>{document.getElementById('copyLinkbio').textContent='Copiar';},2000);} });
document.getElementById('openSubscriptionModal')?.addEventListener('click',()=>openModal(document.getElementById('subscriptionModal')));
document.getElementById('subscriptionForm')?.addEventListener('submit',e=>{ e.preventDefault(); const list=safeJSON(localStorage.getItem(SUBSCRIPTIONS_KEY)); list.push({id:'sub'+Date.now(),description:document.getElementById('subDesc').value||'Assinatura',amount:Number(document.getElementById('subAmount').value),day:Number(document.getElementById('subDay').value),status:'Ativa'}); localStorage.setItem(SUBSCRIPTIONS_KEY,JSON.stringify(list)); document.getElementById('subscriptionForm').reset(); closeAllModals(); refreshSubscriptions(); });
document.getElementById('advanceAmount')?.addEventListener('input',e=>{ const v=Number(e.target.value)||0; const fee=v*0.015; document.getElementById('advancePreview').textContent=v?`Você recebe: ${formatMoney(Math.round((v-fee)*100))} (taxa 1,5%: ${formatMoney(Math.round(fee*100))})`:'—'; });
document.getElementById('requestAdvance')?.addEventListener('click',()=>{ const v=Number(document.getElementById('advanceAmount')?.value||0); if(v<100){alert('Valor mínimo R$ 100');return;} alert(`Antecipação de ${formatMoney(Math.round(v*100))} solicitada!`); });
[1,2,3].forEach(i=>{ document.getElementById(`splitPct${i}`)?.addEventListener('input',()=>{ const total=[1,2,3].reduce((s,j)=>s+Number(document.getElementById(`splitPct${j}`)?.value||0),0); const st=document.getElementById('splitTotal'); if(st) st.textContent=`Total: ${total}%`; }); });

// ── IDIOMA ────────────────────────────
const applyI18n = () => {
  if (typeof t !== 'function') return;
  // Traduzir todos os elementos com data-i18n
  document.querySelectorAll('[data-i18n]').forEach(node => {
    const val = t(node.dataset.i18n);
    if (val && val !== node.dataset.i18n) node.textContent = val;
  });
  // Placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(node => {
    const val = t(node.dataset.i18nPlaceholder);
    if (val) node.placeholder = val;
  });
  // Atualizar botões de idioma
  const lang = typeof getLang === 'function' ? getLang() : 'pt';
  document.querySelectorAll('.lang-btn,.lang-option,.lang-option-flag,.docs-lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
  // Títulos da view ativa
  const activeView = document.querySelector('.menu-item.active')?.dataset.view;
  const VIEW_MAP = {
    dashboard:     ['menu_dashboard','subtitle_dashboard'],
    charges:       ['menu_charges','subtitle_charges'],
    payments:      ['menu_payments','subtitle_payments'],
    payouts:       ['menu_payouts','subtitle_payouts'],
    webhooks:      ['menu_webhooks','subtitle_webhooks'],
    analytics:     ['menu_analytics','subtitle_analytics'],
    plans:         ['menu_plans','subtitle_plans'],
    linkbio:       ['menu_linkbio','subtitle_linkbio'],
    subscriptions: ['menu_subscriptions','subtitle_subscriptions'],
    roadmap:       ['menu_roadmap','subtitle_roadmap'],
    docs:          ['menu_docs','subtitle_docs'],
    onboarding:    ['menu_onboarding','subtitle_onboarding'],
    settings:      ['menu_settings','subtitle_settings'],
    contador:      ['menu_contador','subtitle_dashboard'],
    chargebacks:   ['menu_chargebacks','subtitle_dashboard'],
    'checkout-adaptativo': ['menu_checkout_ia','subtitle_dashboard'],
    'pagamento-preditivo': ['menu_predicao','subtitle_dashboard'],
    'sistema-nervoso':     ['menu_sistema_nervoso','subtitle_dashboard'],
    'nota-fiscal':         ['menu_nota_fiscal','subtitle_dashboard'],
    agentic:       ['menu_agentic','subtitle_dashboard'],
    reconciliacao: ['menu_recon','subtitle_dashboard'],
  };
  if (activeView && VIEW_MAP[activeView] && el.viewTitle) {
    el.viewTitle.textContent   = t(VIEW_MAP[activeView][0]);
    el.viewSubtitle.textContent = t(VIEW_MAP[activeView][1]);
  }
  if (el.planBadge && state.merchant) el.planBadge.textContent = `${t('plan')} ${state.merchant.plan}`;

  // Re-render ZION welcome in correct language
  const _zm = document.getElementById('zionFullMessages');
  if (_zm && _zm.querySelectorAll('.zion-full-msg').length <= 1) {
    _zm.querySelectorAll('.zion-full-msg').forEach(m => m.remove());
    const _w = (ZION_FALLBACK[getZionLang()] || ZION_FALLBACK.pt).default;
    const _d = document.createElement('div');
    _d.className = 'zion-full-msg zion-full-msg-bot';
    _d.textContent = _w;
    const _tips = document.getElementById('zionSuggestions');
    if (_tips) _zm.insertBefore(_d, _tips.nextSibling); else _zm.appendChild(_d);
    zionHistory.length = 0;
    zionHistory.push({ role: 'assistant', content: _w });
    if (_tips) _tips.style.display = 'flex';
  }
  if (el.kycBadge  && state.merchant) el.kycBadge.textContent  = `KYC ${state.merchant.kyc_status}`;

  // Re-render dynamic content with new language
  if (typeof refreshCharges === 'function' && document.getElementById('chargesView') && !document.getElementById('chargesView').hidden) refreshCharges();
  if (typeof refreshPayments === 'function' && document.getElementById('paymentsView') && !document.getElementById('paymentsView').hidden) refreshPayments();
  if (typeof refreshPayouts === 'function' && document.getElementById('payoutsView') && !document.getElementById('payoutsView').hidden) refreshPayouts();
  if (typeof refreshWebhooks === 'function' && document.getElementById('webhooksView') && !document.getElementById('webhooksView').hidden) refreshWebhooks();
};

document.querySelectorAll('.lang-btn,.lang-option,.lang-option-flag,.docs-lang-btn').forEach(btn => {
  if (btn._lb) return; btn._lb = true;
  btn.addEventListener('click', () => {
    if (typeof setLang === 'function') setLang(btn.dataset.lang);
    applyI18n();
  });
});

// ══════════════════════════════════════
// ZION WIDGET
// ══════════════════════════════════════

const ZION_FALLBACK = {
  pt: {
    vendas: '📊 Últimos 30 dias:\nVolume total: R$ 967.403,59 (+12%).\nPIX lidera com 43% das transações. Ticket médio: R$ 3.191.\n\n💡 Clientes PIX têm ticket 18% maior.',
    fraude: '🛡️ Score de risco: BAIXO (10/100)\nNenhuma tentativa suspeita nas últimas 24h.\n✅ Taxa de aprovação: 100% — fluxo saudável.',
    chargeback: '⚠️ Chargebacks: 0 disputas abertas.\nÍndice em 0,00% — abaixo do limite de 1%.',
    previsao: '📈 Previsão 30 dias: R$ 1.044.795 (+8%).',
    plano: '💎 Plano PRO ativo.\nTaxa PIX: 3,2% · CARD: 4,5%+R$0,25\nWebhooks ilimitados · Split · Suporte prioritário.',
    default: '⚡ Sou o ZION, seu copiloto IA.\n\nPosso analisar vendas, riscos, previsões, chargebacks e executar tarefas.\n\nTente: "Como estão minhas vendas?" ou "Me dá um tour"',
    tour: '🚀 Iniciando tour guiado!',
    report: 'Vou gerar o relatório mensal em PDF.',
    charge: 'Vou criar uma cobrança de'
  },
  en: {
    vendas: '📊 Last 30 days:\nTotal volume: R$ 967,403.59 (+12%).\nPIX leads with 43% of transactions. Avg ticket: R$ 3,191.\n\n💡 PIX customers have 18% higher ticket.',
    fraude: '🛡️ Risk score: LOW (10/100)\nNo suspicious attempts in the last 24h.\n✅ Approval rate: 100% — healthy flow.',
    chargeback: '⚠️ Chargebacks: 0 open disputes.\nRate at 0.00% — below the 1% threshold.',
    previsao: '📈 30-day forecast: R$ 1,044,795 (+8%).',
    plano: '💎 PRO plan active.\nPIX rate: 3.2% · CARD: 4.5%+R$0.25\nUnlimited webhooks · Split · Priority support.',
    default: '⚡ I\'m ZION, your AI copilot.\n\nI can analyze sales, risks, forecasts, chargebacks and execute tasks.\n\nTry: "How are my sales?" or "Give me a tour"',
    tour: '🚀 Starting guided tour!',
    report: 'Generating the monthly PDF report.',
    charge: 'Creating a charge of'
  },
  zh: {
    vendas: '📊 最近30天：\n总交易量：R$ 967,403.59（+12%）。\nPIX以43%的交易量领先。平均票价：R$ 3,191。',
    fraude: '🛡️ 风险评分：低（10/100）\n过去24小时无可疑活动。\n✅ 通过率：100% — 健康状态。',
    chargeback: '⚠️ 退款争议：0个未处理。\n比率0.00% — 低于1%阈值。',
    previsao: '📈 30天预测：R$ 1,044,795（+8%）。',
    plano: '💎 PRO计划已激活。\nPIX费率：3.2% · 卡：4.5%+R$0.25\n无限Webhooks · 分账 · 优先支持。',
    default: '⚡ 我是ZION，您的AI副驾。\n\n我可以分析销售、风险、预测、退款争议并执行任务。\n\n试试："销售情况如何？"或"给我导览"',
    tour: '🚀 开始导览！',
    report: '正在生成月度PDF报告。',
    charge: '正在创建收费'
  }
};

const getZionLang = () => (typeof getLang === 'function' ? getLang() : 'pt');

const zionFallback = (msg) => {
  const m = msg.toLowerCase();
  const fb = ZION_FALLBACK[getZionLang()] || ZION_FALLBACK.pt;
  if(m.match(/vend|volume|receita|pagament|sales|revenue|销售|收入/)) return {message:fb.vendas};
  if(m.match(/fraud|risco|segur|risk|security|风险|安全/))          return {message:fb.fraude};
  if(m.match(/charge|disput|estorn|refund|退款|争议/))              return {message:fb.chargeback};
  if(m.match(/previs|estim|próxim|forecast|predict|预测/))          return {message:fb.previsao};
  if(m.match(/plano|taxa|tarifa|plan|rate|pricing|费率|计划/))      return {message:fb.plano};
  if(m.match(/tour|tutorial|explicar|guide|导览|教程/))             return {message:fb.tour, action:{tool:'start_tour',params:{},confirm_message:fb.tour}};
  if(m.match(/navegar?|ir para|abrir|mostrar|navigate|go to|open|打开|导航/)) {
    const map={dashboard:'dashboard',cobranças:'charges',charges:'charges',pagamentos:'payments',payments:'payments',payouts:'payouts',webhooks:'webhooks',analytics:'analytics',contador:'contador',chargebacks:'chargebacks',assinaturas:'subscriptions',subscriptions:'subscriptions',planos:'plans',plans:'plans'};
    for(const[k,v] of Object.entries(map)) { if(m.includes(k)) return {message:`→ ${k}`,action:{tool:'navigate_to',params:{section:v},confirm_message:k}}; }
  }
  if(m.match(/relat[oó]rio|pdf|exportar|report|export|报告|导出/)) return {message:fb.report,action:{tool:'generate_report',params:{},confirm_message:fb.report}};
  if(m.match(/cobran[çc]a|criar cobran|nova cobran|create charge|new charge|创建|收费/)) {
    const amtMatch=msg.match(/R?\$?\s*(\d+(?:[,\.]\d+)?)/);
    const amount=amtMatch?parseFloat(amtMatch[1].replace(',','.')):100;
    return {message:`${fb.charge} R$ ${amount.toFixed(2)}.`,action:{tool:'create_charge',params:{amount,description:'Charge via ZION',currency:'BRL'},confirm_message:`R$ ${amount.toFixed(2)}`}};
  }
  return {message:fb.default};
};

const callZionAI = async (msg) => {
  try {
    const lang = typeof getLang === 'function' ? getLang() : 'pt';
    
    // Send full conversation history for context retention
    // Gather live platform data
    const _pd = {
      merchant: MOCK.merchant,
      kpis: { volume:'R$ '+(MOCK.summary.total_volume/100).toLocaleString('pt-BR',{minimumFractionDigits:2}), fees:'R$ '+(MOCK.summary.total_fees/100).toLocaleString('pt-BR',{minimumFractionDigits:2}) },
      charges: (MOCK.charges?.items||[]).length,
      payments: (MOCK.summary?.last_payments||[]).map(p=>({method:p.method,status:p.status,amount:p.amount/100})),
      current_view: document.querySelector('.panel:not([hidden])')?.id?.replace('View','')||'dashboard'
    };
    const r = await fetch('/api/zion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        message: msg, 
        language: lang,
        history: zionHistory.slice(-20),
        platform: _pd
      })
    });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const data = await r.json();
    
    // Store in history for context
    zionHistory.push({ role: 'user', content: msg });
    zionHistory.push({ role: 'assistant', content: data.message || '' });
    
    return data;
  } catch (e) {
    /* API unavailable — use local fallback */
    const fallback = zionFallback(msg);
    zionHistory.push({ role: 'user', content: msg });
    zionHistory.push({ role: 'assistant', content: fallback.message || '' });
    return fallback;
  }
};

const executeZionAction = async (tool, params) => {
  switch(tool) {
    case 'navigate_to': switchView(params.section); return `${t('zion_navigating_to')} ${params.section}.`;
    case 'generate_report': generateReport(); return t('zion_report_done');
    case 'start_tour': startZionTour(); return t('zion_tour_started');
    case 'show_data': switchView(params.type||'dashboard'); return `✅ Mostrando ${params.type}.`;
    case 'create_charge':
      try {
        const res = await api('/charges',{method:'POST',body:{amount:Math.round((params.amount||100)*100),currency:params.currency||'BRL',description:params.description||'Cobrança ZION',split_rules:[]}});
        return `${t('zion_charge_created')}\n${t('zion_charge_value')}: R$ ${(params.amount||100).toFixed(2)}\n${t('zion_charge_link')}: ${res.payment_link}`;
      } catch(e) { return t('zion_charge_error'); }
    default: return t('zion_action_unknown');
  }
};

const showZionConfirm = (action, onYes, onNo) => {
  const msgs = document.getElementById('zionMessages'); if (!msgs) return;
  const card = document.createElement('div'); card.className='zion-confirm-card';
  card.innerHTML=`<div class="zion-confirm-title">${t('zion_action_title')}</div><div class="zion-confirm-body">${sanitize(action.confirm_message||'')}</div><div class="zion-confirm-btns"><button class="zion-confirm-yes">${t('zion_authorize')}</button><button class="zion-confirm-no">${t('zion_cancel')}</button></div>`;
  msgs.appendChild(card); msgs.scrollTop=msgs.scrollHeight;
  card.querySelector('.zion-confirm-yes').addEventListener('click',()=>{ card.remove(); onYes(); });
  card.querySelector('.zion-confirm-no').addEventListener('click',()=>{ card.remove(); onNo(); });
};

const addZionMsg = (text, from) => {
  const msgs = document.getElementById('zionMessages'); if (!msgs) return null;
  const d = document.createElement('div'); d.className=`zion-msg zion-msg-${sanitize(from)}`;
    // Clean markdown and render newlines
    let cleanText = String(text)
      .replace(/\*\*([^*]+)\*\*/g, '$1')  // Remove **bold** markers
      .replace(/\*([^*]+)\*/g, '$1')        // Remove *italic* markers
      .replace(/#{1,3}\s/g, '')              // Remove ### headers
      .replace(/^- /gm, '• ')               // Convert - to bullet
      .replace(/\\n/g, '\n');               // Fix literal \n to real newline
    d.innerHTML = sanitize(cleanText).replace(/\n/g, '<br>');
  msgs.appendChild(d); msgs.scrollTop=msgs.scrollHeight; return d;
};

const sendZionMsg = async () => {
  const input = document.getElementById('zionInput');
  const msgs  = document.getElementById('zionMessages');
  const val   = input?.value?.trim();
  if (!val || state.zionThinking) return;
  addZionMsg(val,'user'); input.value=''; state.zionThinking=true;
  const typing = document.createElement('div'); typing.className='zion-msg zion-msg-bot';
  typing.innerHTML='<span class="zion-typing-indicator"><span></span><span></span><span></span></span> <span style="font-size:10px;color:var(--text3);margin-left:4px">'+t('zion_typing')+'</span>';
  msgs?.appendChild(typing); if(msgs) msgs.scrollTop=msgs.scrollHeight;
  try {
    const data = await callZionAI(val); typing.remove();
    if (data.message) addZionMsg(data.message,'bot');
    if (data.action) {
      showZionConfirm(data.action,
        async ()=>{ const r=await executeZionAction(data.action.tool,data.action.params||{}); addZionMsg(r,'bot'); },
        ()=>addZionMsg(t('zion_cancelled'),'bot')
      );
    }
  } catch { typing.remove(); addZionMsg(t('zion_conn_err'),'bot'); }
  finally { state.zionThinking=false; }
};

const initZionWidget = () => {
  const fab   = document.getElementById('zionFab');
  const chat  = document.getElementById('zionChat');
  const close = document.getElementById('zionClose');
  const input = document.getElementById('zionInput');
  const send  = document.getElementById('zionSend');
  const msgs  = document.getElementById('zionMessages');
  if (!fab || !chat) return;
  fab.addEventListener('click',()=>{
    chat.hidden=!chat.hidden;
    if (!chat.hidden && msgs && msgs.children.length===0) { const welcome=(ZION_FALLBACK[getZionLang()]||ZION_FALLBACK.pt).default; setTimeout(()=>addZionMsg(welcome,'bot'),300); zionHistory.push({role:'assistant',content:welcome}); }
  });
  // Legacy close handler (floating widget removed)
  send?.addEventListener('click', sendZionMsg);
  input?.addEventListener('keydown',e=>{ if(e.key==='Enter') sendZionMsg(); });
};

// ══════════════════════════════════════
// TOUR GUIADO
// ══════════════════════════════════════
const TOUR_STEPS = [
  {el:'[data-view="dashboard"]',section:'dashboard',title:'📊 Dashboard',desc:'Centro de controle. Volume total processado, receita líquida (após taxas), fees cobradas pela Z-PAY, saldo disponível para saque, gráficos de faturamento por método (PIX, Cartão, Boleto, Cripto) com filtros de 30/7/90 dias.'},
  {el:'.db-kpi-row',section:null,title:'💳 Cards de Métricas',desc:'VOLUME TOTAL (tudo cobrado), RECEITA LÍQUIDA (volume menos taxas), FEES COBRADAS (custo da orquestração), SALDO DISPONÍVEL (pronto para saque). Cada card mostra a variação vs. período anterior.'},
  {el:'[data-view="charges"]',section:'charges',title:'⚡ Cobranças',desc:'Crie cobranças com link único que aceita PIX, Cartão, Boleto e Cripto. Configure regras de split (divisão entre recebedores), valores e descrições. Status: PENDING (aguardando), PAID (pago), EXPIRED (expirado).'},
  {el:'[data-view="payments"]',section:'payments',title:'💰 Pagamentos',desc:'Histórico completo: ID, método, status, valor bruto, fee cobrada, data/hora. Filtre por período, exporte CSV. Rastreie cada centavo da operação.'},
  {el:'[data-view="payouts"]',section:'payouts',title:'🏦 Payouts (Saques)',desc:'Solicite saques via PIX ou TED. Histórico de repasses com valores, datas e status. Em produção, liquidação em ativos digitais via ecossistema ZETTA.'},
  {el:'[data-view="webhooks"]',section:'webhooks',title:'🔔 Webhooks',desc:'Endpoints para notificações em tempo real: pagamento confirmado, cobrança criada, payout processado. Retry automático (3 tentativas), log de delivery com latência, HMAC para autenticidade.'},
  {el:'[data-view="analytics"]',section:'analytics',title:'📊 Analytics',desc:'Sazonalidade (padrões por dia/hora), previsão de receita (últimos 90 dias), alertas de fraude com score, exportação CSV e PDF para contabilidade.'},
  {el:'[data-view="plans"]',section:'plans',title:'💎 Planos e Taxas',desc:'CORE (R$0/mês — PIX 4,5%, Cartão 5,5%+R$0,50, Cripto 3,5%), PRO (R$79/mês — PIX 3,2%, Cartão 4,5%+R$0,25, Cripto 2,5%), BUSINESS (sob consulta). Founding Clients mantêm condições vitalícias.'},
  {el:'[data-view="linkbio"]',section:'linkbio',title:'🔗 Meu Link',desc:'Página personalizada com seus produtos/serviços. Cada item gera checkout Z-PAY com PIX, Cartão ou Cripto. Ideal para redes sociais — um único link, todos os métodos.'},
  {el:'[data-view="subscriptions"]',section:'subscriptions',title:'🔄 Assinaturas',desc:'Cobrança recorrente via PIX. Configure: plano, valor, frequência e retry automático em falhas. Ideal para SaaS, academias, serviços.'},
  {el:'[data-view="roadmap"]',section:'roadmap',title:'🗺️ Roadmap',desc:'O que está em operação, próxima fase, e visão de longo prazo. Founding Clients têm prioridade de acesso e influência direta no desenvolvimento.'},
  {el:'[data-view="docs"]',section:'docs',title:'📖 Documentação',desc:'Guia da API REST: criar cobranças, configurar webhooks, idempotência, HMAC, integração em Node/Python/PHP/Go. Exemplos de código e sandbox.'},
  {el:'[data-view="onboarding"]',section:'onboarding',title:'🚀 Onboarding',desc:'Checklist de ativação: KYB (dados da empresa), API Keys, webhooks, primeiro teste de cobrança. Status e progresso visual por etapa.'},
  {el:'[data-view="settings"]',section:'settings',title:'⚙️ Configurações',desc:'API Keys, endpoints webhook, dados da empresa, moeda padrão, preferências de notificação. Controle total da infraestrutura técnica.'},
  {el:'[data-view="contador"]',section:'contador',title:'🧾 Painel Contador',desc:'Exclusivo para parceiros contábeis. Carteira de clientes indicados, volume consolidado, comissões. 3 modelos: A (R$4.000 + 10%/12mo), B (R$2.500 + 20%/24mo), C (R$1.500 + 30% sem prazo + exclusividade regional).'},
  {el:'[data-view="chargebacks"]',section:'chargebacks',title:'⚠️ Chargebacks',desc:'Disputas abertas, ganhas e perdidas. Detalhes: cliente, valor, data, motivo, prazo de resposta, status. Índice ideal: abaixo de 1%. Alerta automático.'},
  {el:'[data-view="checkout-adaptativo"]',section:'checkout-adaptativo',title:'🤖 Checkout IA',desc:'ZION analisa o perfil do comprador e adapta o checkout: reorganiza métodos, destaca o mais provável de conversão. Fase 4 do roadmap.'},
  {el:'[data-view="pagamento-preditivo"]',section:'pagamento-preditivo',title:'🔮 Predição',desc:'ML aplicado: prevê probabilidade de pagamento, identifica horários de maior conversão, sugere estratégias. Fase 4 do roadmap.'},
  {el:'[data-view="sistema-nervoso"]',section:'sistema-nervoso',title:'🧠 Sistema Nervoso',desc:'Monitoramento real-time: latência de APIs, saúde dos rails (PIX, Cartão, Boleto, Cripto), uptime, alertas de anomalias.'},
  {el:'[data-view="nota-fiscal"]',section:'nota-fiscal',title:'🧾 Nota Fiscal',desc:'Emissão automática NF-e/NFS-e por transação confirmada. Integração com prefeituras e SEFAZ. NFS-e nacional mandatória em 2026. Fase 3 do roadmap.'},
  {el:'[data-view="agentic"]',section:'agentic',title:'🤖 Agentic Commerce',desc:'Agentes IA negociam, compram e pagam em nome dos clientes. ZION orquestra checkout, split e liquidação sem intervenção humana. Visão ZETTA.'},
  {el:'[data-view="reconciliacao"]',section:'reconciliacao',title:'🔄 Conciliação Automática',desc:'O killer feature para lojistas: cruza automaticamente vendas × recebimentos × taxas cobradas. 90% dos comerciantes reportam erros em maquininhas — a Z-PAY resolve isso em tempo real com alerta de divergências.'},
  {el:'[data-view="zion-chat"]',section:'zion-chat',title:'⚡ ZION — Copiloto IA',desc:'Analiso vendas, gero relatórios, crio cobranças, navego pela plataforma e respondo dúvidas — tudo por texto. IA Anthropic (Claude) com acesso aos dados da operação.'},
];

let tourStep=0, tourActive=false;
const startZionTour = () => { tourStep=0; tourActive=true; renderTourStep(); };

const renderTourStep = () => {
  const overlay=document.getElementById('tourOverlay');
  const highlight=document.getElementById('tourHighlight');
  const card=document.getElementById('tourCard');
  if (!card) return;
  if (!tourActive || tourStep >= TOUR_STEPS.length) { endTour(); return; }
  const step=TOUR_STEPS[tourStep];
  if (step.section) switchView(step.section);
  setTimeout(()=>{
    const tgt = document.querySelector(step.el);
    if(overlay) overlay.style.display='block';
    if(highlight) {
      if(tgt) {
        tgt.scrollIntoView({behavior:'smooth',block:'center'});
        setTimeout(()=>{
          const rect=tgt.getBoundingClientRect();
          highlight.style.cssText=`display:block;top:${rect.top+window.scrollY-8}px;left:${rect.left-8}px;width:${rect.width+16}px;height:${rect.height+16}px;position:absolute;`;
        }, 350);
      } else highlight.style.display='none';
    }
    card.style.display='block';
    document.getElementById('tourStepLabel').textContent=`${tourStep+1} de ${TOUR_STEPS.length}`;
    document.getElementById('tourProgress').style.width=`${((tourStep+1)/TOUR_STEPS.length)*100}%`;
    document.getElementById('tourTitle').textContent=step.title;
    document.getElementById('tourDesc').textContent=step.desc;
    document.getElementById('tourPrev').style.visibility=tourStep>0?'visible':'hidden';
    document.getElementById('tourNext').textContent=tourStep<TOUR_STEPS.length-1?t('tour_next'):t('tour_finish');
  }, 300);
};

const endTour = () => {
  tourActive=false;
  ['tourOverlay','tourHighlight','tourCard'].forEach(id=>{ const e=document.getElementById(id); if(e) e.style.display='none'; });
  // Show completion in ZION full chat
  switchView('zion-chat');
  const _msgs = document.getElementById('zionFullMessages');
  if (_msgs) {
    const _d = document.createElement('div');
    _d.className = 'zion-full-msg zion-full-msg-bot';
    _d.textContent = t('tour_complete');
    _msgs.appendChild(_d);
    _msgs.scrollTop = _msgs.scrollHeight;
  }
};

document.getElementById('tourNext')?.addEventListener('click',()=>{ tourStep++; renderTourStep(); });
document.getElementById('tourPrev')?.addEventListener('click',()=>{ tourStep=Math.max(0,tourStep-1); renderTourStep(); });
document.getElementById('tourClose')?.addEventListener('click', endTour);
document.getElementById('tourOverlay')?.addEventListener('click', endTour);

// ══════════════════════════════════════
// BOOT
// ══════════════════════════════════════
const boot = async () => {
  if (el.apiBaseInput) el.apiBaseInput.value='DEMO MODE';
  // Apply translations on load
  applyI18n();
  if (state.token) {
    setAuthUI(true);
    await loadMerchant();
    await renderPremiumDashboard();
    applyI18n();
    setTimeout(()=>initZionWidget(), 400);
    showWelcomeBanner();
  } else {
    setAuthUI(false);
  }
};
boot();

// ══════════════════════════════════════
// FEATURES NOVAS
// ══════════════════════════════════════

// ── CHECKOUT ADAPTATIVO ───────────────
const refreshCheckoutAdaptativo = () => {
  const c = document.getElementById('adaptiveContent'); if (!c) return;
  const rules = [
    { icon: '🔁', label: 'Cliente abriu o link 3x sem pagar', action: 'Exibir desconto de 5% por 10 min', on: true },
    { icon: '📱', label: 'Acesso via celular entre 20h–23h', action: 'Destacar PIX como primeiro método', on: true },
    { icon: '💰', label: 'Valor acima de R$ 500', action: 'Oferecer parcelamento automaticamente', on: true },
    { icon: '⭐', label: 'Cliente recorrente (3+ compras)', action: 'Checkout 1 clique — pular etapas', on: true },
    { icon: '🆕', label: 'Primeira compra detectada', action: 'Exibir selos de segurança e depoimentos', on: false },
    { icon: '⏰', label: 'Link expirando em menos de 1h', action: 'Mostrar contador de urgência', on: true },
  ];
  const statsHtml = `
    <div class="feature-stats-grid">
      <div class="card"><div class="card-title">Taxa de Conversão</div><div class="card-value" style="color:var(--mint)">87,4%</div><div class="card-sub">+14% vs padrão</div></div>
      <div class="card"><div class="card-title">Descontos Aplicados</div><div class="card-value">R$ 1.240</div><div class="card-sub">18 ofertas aceitas</div></div>
      <div class="card"><div class="card-title">Receita Recuperada</div><div class="card-value" style="color:var(--ember)">R$ 8.900</div><div class="card-sub">carrinhos salvos</div></div>
    </div>`;
  const rulesHtml = rules.map(r => `
    <div class="adaptive-rule-card">
      <div class="adaptive-rule-icon">${r.icon}</div>
      <div style="flex:1">
        <div class="adaptive-rule-label">${r.label}</div>
        <div class="adaptive-rule-action">→ ${r.action}</div>
      </div>
      <div class="adaptive-toggle ${r.on?'':'off'}"></div>
    </div>`).join('');
  c.innerHTML = statsHtml + `<div class="panel-header" style="margin-bottom:14px"><h2 style="font-size:14px">Regras Ativas</h2></div>` + rulesHtml;
  c.querySelectorAll('.adaptive-toggle').forEach(t => {
    t.addEventListener('click', () => t.classList.toggle('off'));
  });
};

// ── PAGAMENTO PREDITIVO ───────────────
const refreshPagamentoPreditivo = () => {
  const c = document.getElementById('predictiveContent'); if (!c) return;
  const days = [
    {day:'Seg',pct:72,level:'medium'},{day:'Ter',pct:68,level:'medium'},
    {day:'Qua',pct:81,level:'high'},{day:'Qui',pct:89,level:'high'},
    {day:'Sex',pct:94,level:'high'},{day:'Sáb',pct:61,level:'low'},
    {day:'Dom',pct:45,level:'low'}
  ];
  const hours = [
    {h:'06–09h',pct:58,level:'medium'},{h:'09–12h',pct:84,level:'high'},
    {h:'12–14h',pct:71,level:'medium'},{h:'14–18h',pct:91,level:'high'},
    {h:'18–21h',pct:87,level:'high'},{h:'21–00h',pct:55,level:'low'}
  ];
  const barsDay = days.map(d => `
    <div class="predict-bar-wrap">
      <span class="predict-day-label">${d.day}</span>
      <div class="predict-bar-track"><div class="predict-bar-fill ${d.level}" style="width:${d.pct}%"></div></div>
      <span class="predict-pct" style="color:${d.level==='high'?'var(--mint)':d.level==='medium'?'var(--amber)':'#f87171'}">${d.pct}%</span>
    </div>`).join('');
  const barsHour = hours.map(h => `
    <div class="predict-bar-wrap">
      <span class="predict-day-label" style="width:48px;font-size:10px">${h.h}</span>
      <div class="predict-bar-track"><div class="predict-bar-fill ${h.level}" style="width:${h.pct}%"></div></div>
      <span class="predict-pct" style="color:${h.level==='high'?'var(--mint)':h.level==='medium'?'var(--amber)':'#f87171'}">${h.pct}%</span>
    </div>`).join('');
  c.innerHTML = `
    <div class="feature-stats-grid">
      <div class="card"><div class="card-title">Melhor Dia</div><div class="card-value" style="color:var(--mint)">Sexta</div><div class="card-sub">94% aprovação</div></div>
      <div class="card"><div class="card-title">Melhor Hora</div><div class="card-value" style="color:var(--mint)">14–18h</div><div class="card-sub">91% aprovação</div></div>
      <div class="card"><div class="card-title">Ganho Estimado</div><div class="card-value" style="color:var(--ember)">+R$ 34k</div><div class="card-sub">por mês com otimização</div></div>
    </div>
    <div class="feature-2col-grid">
      <div>
        <div class="panel-header" style="margin-bottom:14px"><h2 style="font-size:14px">Taxa por Dia da Semana</h2></div>
        ${barsDay}
      </div>
      <div>
        <div class="panel-header" style="margin-bottom:14px"><h2 style="font-size:14px">Taxa por Horário</h2></div>
        ${barsHour}
      </div>
    </div>
    <div style="margin-top:20px;padding:16px;background:rgba(52,211,153,.06);border:1px solid rgba(52,211,153,.15);border-radius:12px">
      <div style="font-family:'Bricolage Grotesque',sans-serif;font-weight:900;font-size:14px;color:var(--mint);margin-bottom:6px">⚡ Recomendação do ZION</div>
      <div style="font-size:13px;color:var(--text2)">Suas 47 assinaturas recorrentes estão configuradas para cobrança na segunda-feira. Migrar para sexta às 14h pode recuperar R$ 34.200/mês em aprovações que hoje estão falhando.</div>
      <button class="primary" style="margin-top:12px;padding:10px 20px;font-size:13px" onclick="alert('Em produção, o ZION reagendaria todas as cobranças automaticamente após confirmação.')">Aplicar Otimização</button>
    </div>`;
};

// ── SISTEMA NERVOSO ───────────────────
const refreshSistemaNervoso = () => {
  const c = document.getElementById('nerveContent'); if (!c) return;
  const alerts = [
    { type:'warning', icon:'⚠️', title:'Volume caiu 23% hoje vs média', desc:'Sexta geralmente tem volume alto. ZION identificou que 3 cobranças de alto valor estão em PENDING há mais de 2h.', time:'há 15min' },
    { type:'success', icon:'✅', title:'Taxa de aprovação bateu recorde', desc:'98,7% de aprovação nas últimas 4 horas. Acima da média histórica de 94,2%.', time:'há 42min' },
    { type:'info', icon:'💡', title:'Oportunidade de antecipação detectada', desc:'Você tem R$ 180.000 em recebíveis a cartão nas próximas 2 semanas. Antecipação disponível com taxa de 1,5%.', time:'há 1h' },
    { type:'warning', icon:'🔔', title:'Cliente recorrente com 2 falhas seguidas', desc:'TechStore LTDA falhou nos últimos 2 ciclos de cobrança. ZION sugere contato antes do 3º ciclo.', time:'há 3h' },
    { type:'success', icon:'📈', title:'Sazonalidade positiva detectada', desc:'Padrão histórico indica aumento de 31% no volume nas próximas 2 semanas (período pré-pagamento de salários).', time:'há 6h' },
  ];
  const channels = [
    { icon:'📱', label:'WhatsApp', desc:'Alertas críticos', on:true },
    { icon:'📧', label:'E-mail', desc:'Relatório diário 8h', on:true },
    { icon:'🔗', label:'Webhook', desc:'Todos os eventos', on:false },
    { icon:'💬', label:'Telegram', desc:'Em breve', on:false },
  ];
  const alertsHtml = alerts.map(a => `
    <div class="nerve-alert type-${a.type}">
      <div class="nerve-alert-icon">${a.icon}</div>
      <div style="flex:1">
        <div class="nerve-alert-title">${a.title}</div>
        <div class="nerve-alert-desc">${a.desc}</div>
      </div>
      <div style="font-family:'DM Mono',monospace;font-size:10px;color:var(--text3);white-space:nowrap;margin-left:12px">${a.time}</div>
    </div>`).join('');
  const chHtml = channels.map(ch => `
    <div class="adaptive-rule-card">
      <div class="adaptive-rule-icon" style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08)">${ch.icon}</div>
      <div style="flex:1"><div class="adaptive-rule-label">${ch.label}</div><div style="font-size:11px;color:var(--text3)">${ch.desc}</div></div>
      <div class="adaptive-toggle ${ch.on?'':'off'}"></div>
    </div>`).join('');
  c.innerHTML = `
    <div class="feature-stats-grid">
      <div class="card"><div class="card-title">Alertas Hoje</div><div class="card-value">12</div><div class="card-sub">3 críticos, 9 info</div></div>
      <div class="card"><div class="card-title">Ações Automáticas</div><div class="card-value" style="color:var(--mint)">8</div><div class="card-sub">ZION agiu por você</div></div>
      <div class="card"><div class="card-title">Valor Monitorado</div><div class="card-value" style="color:var(--ember)">R$ 967k</div><div class="card-sub">em tempo real</div></div>
    </div>
    <div class="feature-main-aside-grid">
      <div>
        <div class="panel-header" style="margin-bottom:14px"><h2 style="font-size:14px">Feed de Inteligência</h2></div>
        ${alertsHtml}
      </div>
      <div>
        <div class="panel-header" style="margin-bottom:14px"><h2 style="font-size:14px">Canais de Notificação</h2></div>
        ${chHtml}
      </div>
    </div>`;
  c.querySelectorAll('.adaptive-toggle').forEach(t => t.addEventListener('click', () => t.classList.toggle('off')));
};

// ── NOTA FISCAL AUTOMÁTICA ────────────
const refreshNotaFiscal = () => {
  const c = document.getElementById('nfContent'); if (!c) return;
  const notes = [
    { id:'NF-0047', val:'R$ 1.200,00', date:'13/03/2026 14:32', status:'ok',  client:'João Silva', saving:'R$ 48' },
    { id:'NF-0046', val:'R$ 3.800,00', date:'13/03/2026 11:15', status:'ok',  client:'Tech Store', saving:'R$ 152' },
    { id:'NF-0045', val:'R$ 890,00',   date:'12/03/2026 18:44', status:'ok',  client:'Maria Costa', saving:'R$ 35' },
    { id:'NF-0044', val:'R$ 12.500,00',date:'12/03/2026 10:00', status:'pend',client:'Construtora MRB', saving:'R$ 625' },
    { id:'NF-0043', val:'R$ 560,00',   date:'11/03/2026 16:22', status:'ok',  client:'Farmácia Central', saving:'R$ 22' },
  ];
  const notesHtml = notes.map(n => `
    <div class="nf-status-card">
      <div>
        <div class="nf-id">${n.id} · ${n.client}</div>
        <div class="nf-val" style="margin-top:4px">${n.val}</div>
        <div style="font-size:11px;color:var(--text3);margin-top:2px">${n.date}</div>
      </div>
      <div style="text-align:right">
        <span class="nf-issued ${n.status}">${n.status==='ok'?'✓ Emitida':'⏳ Emitindo'}</span>
        <div style="font-family:'DM Mono',monospace;font-size:10px;color:var(--mint);margin-top:6px">💰 Economia: ${n.saving}</div>
      </div>
    </div>`).join('');
  c.innerHTML = `
    <div class="feature-stats-grid">
      <div class="card"><div class="card-title">Notas Emitidas</div><div class="card-value" style="color:var(--mint)">47</div><div class="card-sub">este mês</div></div>
      <div class="card"><div class="card-title">Economia Tributária</div><div class="card-value" style="color:var(--ember)">R$ 3.840</div><div class="card-sub">via otimização ZION</div></div>
      <div class="card"><div class="card-title">Imposto Médio</div><div class="card-value">2,1%</div><div class="card-sub">vs 3,8% sem otimização</div></div>
    </div>

    <div class="panel-header" style="margin-bottom:12px"><h2 style="font-size:14px">Regime Tributário Ativo</h2></div>
    <div class="nf-regime-grid" style="margin-bottom:20px">
      <div class="nf-regime-card active">
        <div class="nf-regime-label">ISS</div>
        <div class="nf-regime-rate">2,0%</div>
        <div class="nf-regime-name">Dev de Software</div>
      </div>
      <div class="nf-regime-card">
        <div class="nf-regime-label">ISS</div>
        <div class="nf-regime-rate">3,0%</div>
        <div class="nf-regime-name">Consultoria TI</div>
      </div>
      <div class="nf-regime-card">
        <div class="nf-regime-label">ISS</div>
        <div class="nf-regime-rate">5,0%</div>
        <div class="nf-regime-name">Serviços Gerais</div>
      </div>
    </div>
    <div class="nf-saving-badge">✓ ZION selecionou automaticamente a menor alíquota legal para seu CNAE</div>

    <div class="panel-header" style="margin-bottom:12px;margin-top:20px"><h2 style="font-size:14px">Últimas Notas Emitidas</h2></div>
    ${notesHtml}`;
};

// ── AGENTIC COMMERCE ──────────────────
const refreshAgentic = () => {
  const c = document.getElementById('agenticContent'); if (!c) return;
  const agents = [
    { icon:'🤖', cls:'ai', name:'ChatGPT / OpenAI',    desc:'Seus produtos aparecem e podem ser comprados em conversas com ChatGPT', status:'active' },
    { icon:'✨', cls:'google', name:'Google Gemini',   desc:'Integração com Google Shopping Actions e Gemini Commerce', status:'soon' },
    { icon:'🦙', cls:'ai', name:'Meta AI / Llama',     desc:'Vendas dentro do WhatsApp AI e Instagram Shopping com IA', status:'soon' },
    { icon:'🛒', cls:'meta', name:'Z-PAY Checkout API', desc:'Endpoint público para qualquer agente de IA processar pagamentos', status:'active' },
  ];
  const agentsHtml = agents.map(a => `
    <div class="agent-card">
      <div class="agent-icon ${a.cls}">${a.icon}</div>
      <div><div class="agent-name">${a.name}</div><div class="agent-desc">${a.desc}</div></div>
      <span class="agent-status ${a.status}">${a.status==='active'?t('agent_active'):t('agent_soon')}</span>
    </div>`).join('');
  c.innerHTML = `
    <div class="feature-stats-grid">
      <div class="card"><div class="card-title">Vendas via IA</div><div class="card-value" style="color:var(--mint)">14</div><div class="card-sub">este mês</div></div>
      <div class="card"><div class="card-title">Volume Agentic</div><div class="card-value" style="color:var(--ember)">R$ 18.400</div><div class="card-sub">sem intervenção humana</div></div>
      <div class="card"><div class="card-title">Agentes Ativos</div><div class="card-value">2</div><div class="card-sub">de 4 disponíveis</div></div>
    </div>
    <div class="panel-header" style="margin-bottom:14px"><h2 style="font-size:14px">Integrações com Agentes IA</h2></div>
    ${agentsHtml}
    <div style="margin-top:20px;padding:16px;background:rgba(255,122,24,.05);border:1px solid rgba(255,122,24,.12);border-radius:12px">
      <div style="font-family:'Bricolage Grotesque',sans-serif;font-weight:900;font-size:14px;color:var(--ember);margin-bottom:6px">🚀 Primeiro no Brasil</div>
      <div style="font-size:13px;color:var(--text2)">O Z-PAY é o único gateway brasileiro com endpoint compatível com o protocolo de pagamentos de agentes IA. Seus clientes podem ser encontrados e cobrados dentro de qualquer IA sem nenhuma configuração adicional.</div>
    </div>`;
};

// new views handled in main switchView below

// Add new view titles
Object.assign(VIEW_TITLES, {
  'checkout-adaptativo': ['Checkout IA',          'Checkout que se adapta ao pagador'],
  'pagamento-preditivo': ['Pagamento Preditivo',   'Melhor momento para cobrar'],
  'sistema-nervoso':     ['Sistema Nervoso',        'ZION monitora 24/7'],
  'nota-fiscal':         ['Nota Fiscal Automática', 'NF com otimização tributária'],
  'agentic':             ['Agentic Commerce',        'Venda dentro de IAs'],
  'reconciliacao':       ['Conciliação Automática',  'Cruza vendas, recebimentos e taxas em tempo real'],
});

// menu items already bound above

// ══════════════════════════════════════
// PREMIUM DASHBOARD RENDER
// ══════════════════════════════════════

const drawSparkline = (svgId, values, color) => {
  const svg = document.getElementById(svgId); if (!svg) return;
  const max = Math.max(...values, 1);
  const min = Math.min(...values);
  const range = max - min || 1;
  const w = 120, h = 32, n = values.length;
  const pts = values.map((v,i) => `${(i/(n-1))*w},${h - ((v-min)/range)*(h-4) - 2}`).join(' ');
  const areaClose = `${w},${h} 0,${h}`;
  svg.innerHTML = `
    <defs>
      <linearGradient id="sg${svgId}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${color}" stop-opacity="0.4"/>
        <stop offset="100%" stop-color="${color}" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <polygon points="${pts} ${areaClose}" fill="url(#sg${svgId})"/>
    <polyline points="${pts}" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`;
};

const drawAreaChart = (payments) => {
  const svg = document.getElementById('dbAreaChart'); if (!svg) return;
  const legend = document.getElementById('dbAreaLegend'); if (!legend) return;

  const methods = { PIX:'#ff7a18', CARD:'#38bdf8', BOLETO:'#a78bfa', CRYPTO:'#34d399' };
  const days = 14;

  // Dados estáticos — gráfico estável sem re-render diferente a cada load
  const STATIC_SEEDS = {
    PIX:    [4200,5100,3800,6200,5800,7100,6500,8200,7400,9100,8300,10200,9500,11000],
    CARD:   [6800,7200,6100,7900,8400,7600,8900,8100,9400,8700,9800,9100,10500,9800],
    BOLETO: [2100,2800,2400,3100,2700,3400,3000,3700,3300,4000,3600,4300,3900,4600],
    CRYPTO: [800, 950, 700, 1100,900, 1300,1050,1400,1200,1600,1350,1750,1500,1900],
  };

  // Merge com dados reais (se existirem)
  const data = {};
  Object.keys(methods).forEach(m => { data[m] = [...STATIC_SEEDS[m]]; });
  payments.forEach(p => {
    const m = p.method; if (!data[m]) return;
    const age = Math.floor((Date.now() - new Date(p.created_at).getTime()) / 86400000);
    const idx = Math.min(days - 1, Math.max(0, days - 1 - age));
    data[m][idx] += Number(p.amount || 0) / 100;
  });

  const W = 600, H = 160;
  const allVals = Object.values(data).flat();
  const maxV = Math.max(...allVals, 1);

  // ── SVG montado em ordem correta ──────────────────────────
  // 1. <defs> ÚNICO fora do forEach — IDs únicos, sem duplicação
  // 2. Grid lines — camada mais abaixo
  // 3. Áreas preenchidas — meio
  // 4. Linhas — topo

  const defsHtml = `<defs>${
    Object.entries(methods).map(([m, color]) => `
      <linearGradient id="ag${m}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"   stop-color="${color}" stop-opacity="0.22"/>
        <stop offset="100%" stop-color="${color}" stop-opacity="0"/>
      </linearGradient>`).join('')
  }</defs>`;

  const gridHtml = [0,1,2,3,4].map(i => {
    const y = Math.round((i / 4) * H);
    return `<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="rgba(255,255,255,.05)" stroke-width="1"/>`;
  }).join('');

  let areasHtml = '', linesHtml = '';
  Object.entries(methods).forEach(([m, color]) => {
    const vals = data[m];
    const pts = vals.map((v, i) =>
      `${Math.round((i / (days - 1)) * W)},${Math.round(H - (v / maxV) * (H - 8) - 4)}`
    ).join(' L ');
    areasHtml += `<path d="M ${pts} L ${W},${H} L 0,${H} Z" fill="url(#ag${m})"/>`;
    linesHtml += `<path d="M ${pts}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity="0.9"/>`;
  });

  svg.innerHTML = defsHtml + gridHtml + areasHtml + linesHtml;

  legend.innerHTML = Object.entries(methods).map(([m, color]) =>
    `<div class="db-legend-item"><div class="db-legend-dot" style="background:${color}"></div>${m}</div>`
  ).join('');
};

const renderPremiumDashboard = async () => {
  const summary = await api('/dashboard/summary');
  const payments = summary.last_payments || [];

  // KPI Values
  document.getElementById('volumeTotal').textContent = formatMoney(summary.total_volume);
  document.getElementById('merchantRevenue').textContent = formatMoney(summary.total_volume - summary.total_fees);
  document.getElementById('feesTotal').textContent = formatMoney(summary.total_fees);
  document.getElementById('balance').textContent = formatMoney(summary.balance);

  // Sparklines
  const sparkData = [8,12,9,15,11,18,14,22,17,25,19,28,24,32];
  drawSparkline('sparkVolume',  sparkData.map(v=>v*3200), '#ff7a18');
  drawSparkline('sparkRevenue', sparkData.map(v=>v*3100), '#34d399');
  drawSparkline('sparkFees',    sparkData.map(v=>v*60),   '#a78bfa');
  drawSparkline('sparkBalance', sparkData.map(v=>v*3050), '#38bdf8');

  // Area chart
  drawAreaChart(payments);

  // Methods chart
  const mc = document.getElementById('dbMethodsChart'); if (mc) {
    const byMethod = {};
    payments.forEach(p => { byMethod[p.method]=(byMethod[p.method]||0)+Number(p.amount||0); });
    byMethod.PIX    = (byMethod.PIX||0)    + 6910449;
    byMethod.CARD   = (byMethod.CARD||0)   + 9949700;
    byMethod.BOLETO = (byMethod.BOLETO||0) + 5707253;
    const total = Object.values(byMethod).reduce((a,b)=>a+b,1);
    mc.innerHTML = Object.entries(byMethod).map(([m,v]) => `
      <div class="db-method-row">
        <span class="db-method-name">${m}</span>
        <div class="db-method-track"><div class="db-method-fill ${m}" style="width:${Math.round(v/total*100)}%"></div></div>
        <span class="db-method-val">${Math.round(v/total*100)}%</span>
      </div>`).join('');
  }

  // Risk indicator
  const paid = payments.filter(p=>p.status==='PAID').length;
  const total = payments.length || 1;
  const failed = payments.filter(p=>p.status==='FAILED').length;
  const risk = Math.min(100, Math.round((failed/total)*100 + (total>8?10:0)));
  const dbRisk = document.getElementById('dbRiskScore');
  const dbRiskBar = document.getElementById('dbRiskBar');
  if (dbRisk) { dbRisk.textContent = risk; dbRisk.style.color = risk<30?'var(--mint)':risk<60?'var(--amber)':'#f87171'; }
  if (dbRiskBar) { dbRiskBar.style.width = `${risk}%`; dbRiskBar.style.setProperty('--pos', `${risk}%`); dbRiskBar.style.cssText += `;--pos:${risk}%`; if(dbRiskBar.style.cssText) { dbRiskBar.setAttribute('style', dbRiskBar.getAttribute('style') + `;--risk:${risk}%`); } }
  const avgTicketEl = document.getElementById('avgTicket');
  const approvalEl  = document.getElementById('approvalRate');
  if (avgTicketEl) avgTicketEl.textContent = formatMoney(payments.reduce((s,p)=>s+Number(p.amount||0),0)/total);
  if (approvalEl)  approvalEl.textContent = `${Math.round((paid/total)*100)}%`;

  // Transactions list
  const txList = document.getElementById('recentPayments');
  if (txList) {
    txList.innerHTML = payments.slice(0,8).map(p => `
      <div class="db-txn-row">
        <span class="db-txn-method-badge ${p.method}">${p.method}</span>
        <span class="db-txn-id">${p.id.slice(0,10)}</span>
        <span class="db-txn-val">${formatMoney(p.amount)}</span>
        <span class="db-txn-status ${p.status}">${p.status}</span>
      </div>`).join('');
  }

  // Seasonality
  const sc = document.getElementById('seasonalityChart');
  if (sc) {
    const buckets = new Array(12).fill(0);
    payments.forEach(p => { const m=new Date(p.created_at).getMonth(); buckets[m]+=Number(p.amount||0); });
    const SEASON_SEEDS = [3200000,2800000,4100000,3700000,5200000,4800000,6100000,5700000,7200000,8300000,9100000,10500000];
    const filled = buckets.map((v,i) => v || SEASON_SEEDS[i] || 3000000);
    const maxB = Math.max(...filled,1);
    const months = t('months_short').split(',');
    sc.innerHTML = filled.map((v,i) =>
      `<div class="db-season-bar" style="height:${Math.max(6,Math.round((v/maxB)*88))}px" title="${months[i]}: ${formatMoney(v)}"><span>${months[i]}</span></div>`
    ).join('');
  }

  // Crypto balances
  const cbc = document.getElementById('dbCryptoBalances');
  if (cbc) {
    const cryptos = [
      { icon:'₿', name:'Bitcoin', sym:'BTC', val:'0.0038', brl:'R$ 2.420', color:'rgba(247,147,26,.15)' },
      { icon:'Ξ', name:'Ethereum', sym:'ETH', val:'0.055',  brl:'R$ 890',   color:'rgba(98,126,234,.15)' },
      { icon:'$', name:'USDT',    sym:'USDT',val:'485.20',  brl:'R$ 2.550', color:'rgba(38,161,123,.15)' },
    ];
    cbc.innerHTML = cryptos.map(c => `
      <div class="db-crypto-item">
        <div class="db-crypto-icon" style="background:${c.color}">${c.icon}</div>
        <div><div class="db-crypto-name">${c.name}</div><div class="db-crypto-sub">${c.val} ${c.sym}</div></div>
        <div class="db-crypto-val">${c.brl}</div>
      </div>`).join('');
  }

  // Re-apply translations to dynamically rendered elements
  if (typeof applyI18n === 'function') setTimeout(applyI18n, 50);
};

// refreshDashboard = renderPremiumDashboard (assigned below in boot)
// Will be overridden after renderPremiumDashboard is defined

// premiumDashboard visibility handled inside switchView above

// Wire renderPremiumDashboard to all refreshDashboard calls
// Since const can't be redeclared, we patch el.refreshDashboard click
document.getElementById('refreshDashboard')?.addEventListener('click', renderPremiumDashboard);
el.settlementCurrency?.removeEventListener('change', refreshDashboard);
el.settlementCurrency?.addEventListener('change', renderPremiumDashboard);
el.autoConvert?.removeEventListener('change', refreshDashboard);
el.autoConvert?.addEventListener('change', renderPremiumDashboard);



// ══════════════════════════════════════
// RECONCILIATION VIEW
// ══════════════════════════════════════
const MOCK_RECON = [
  {id:'REC-001',tipo:'PIX',vendido:25000,recebido:25000,fee:375,feePct:'1.50',status:'ok',data:'06/04/2026'},
  {id:'REC-002',tipo:'CARD',vendido:89700,recebido:89700,fee:1795,feePct:'2.00',status:'ok',data:'06/04/2026'},
  {id:'REC-003',tipo:'PIX',vendido:15000,recebido:15000,fee:225,feePct:'1.50',status:'ok',data:'05/04/2026'},
  {id:'REC-004',tipo:'BOLETO',vendido:320000,recebido:319400,fee:600,feePct:'0.19',status:'warn',data:'05/04/2026',nota:'Divergência de R$ 6,00 — tarifa bancária não prevista'},
  {id:'REC-005',tipo:'PIX',vendido:1200000,recebido:1200000,fee:18000,feePct:'1.50',status:'ok',data:'04/04/2026'},
  {id:'REC-006',tipo:'CARD',vendido:560000,recebido:560000,fee:8400,feePct:'1.50',status:'ok',data:'04/04/2026'},
  {id:'REC-007',tipo:'PIX',vendido:33000,recebido:33000,fee:495,feePct:'1.50',status:'ok',data:'03/04/2026'},
];

const refreshReconciliacao = () => {
  const c = document.getElementById('reconContent'); if (!c) return;
  const totalVendido = MOCK_RECON.reduce((a,x)=>a+x.vendido,0);
  const totalRecebido = MOCK_RECON.reduce((a,x)=>a+x.recebido,0);
  const totalFee = MOCK_RECON.reduce((a,x)=>a+x.fee,0);
  const divergencias = MOCK_RECON.filter(x=>x.status!=='ok').length;
  const statusColor = s => s==='ok'?'recon-ok':s==='warn'?'recon-warn':'recon-err';
  const statusText = s => s==='ok'?'✓ Conciliado':s==='warn'?'⚠ Divergência':'✗ Erro';

  c.innerHTML = `
    <div style="display:flex;align-items:center;gap:10px;padding:14px 18px;background:rgba(34,197,94,.06);border:1px solid rgba(34,197,94,.15);border-radius:14px;margin-bottom:20px">
      <span style="font-size:20px">🛡️</span>
      <div><div style="font-size:13px;font-weight:800;color:#34d399;margin-bottom:2px">Reconciliação automática ativa</div>
      <div style="font-size:12px;color:var(--text2)">90% dos lojistas reportam erros em valores recebidos de maquininhas. A Z-PAY cruza vendas × recebimentos × taxas automaticamente.</div></div>
    </div>
    <div class="contador-header" style="margin-bottom:20px">
      <div class="contador-metric"><div class="contador-metric-label">Total Vendido</div><div class="contador-metric-value">${formatMoney(totalVendido)}</div><div class="contador-metric-sub">7 transações</div></div>
      <div class="contador-metric"><div class="contador-metric-label">Total Recebido</div><div class="contador-metric-value">${formatMoney(totalRecebido)}</div><div class="contador-metric-sub">Líquido após fees</div></div>
      <div class="contador-metric"><div class="contador-metric-label">${t('divergences')}</div><div class="contador-metric-value" style="color:${divergencias>0?'#fbbf24':'#34d399'}">${divergencias}</div><div class="contador-metric-sub">${divergencias===0?t('recon_all_ok'):t('recon_attention')}</div></div>
    </div>
    <table class="contador-table">
      <thead><tr><th>ID</th><th>Método</th><th>Vendido</th><th>Recebido</th><th>Fee</th><th>%</th><th>Data</th><th>Status</th></tr></thead>
      <tbody>${MOCK_RECON.map(x=>`<tr>
        <td style="font-family:'DM Mono',monospace;font-size:11px;color:var(--text3)">${x.id}</td>
        <td><span class="pill-badge badge-plan">${x.tipo}</span></td>
        <td><strong>${formatMoney(x.vendido)}</strong></td>
        <td>${formatMoney(x.recebido)}</td>
        <td style="font-family:'DM Mono',monospace;font-size:11px;color:var(--ember)">${formatMoney(x.fee)}</td>
        <td style="font-family:'DM Mono',monospace;font-size:11px;color:var(--text3)">${x.feePct}%</td>
        <td style="font-size:12px;color:var(--text3)">${x.data}</td>
        <td><span class="recon-status ${statusColor(x.status)}">${statusText(x.status)}</span></td>
      </tr>${x.nota?`<tr><td colspan="8" style="padding:4px 12px 10px;font-size:11px;color:#fbbf24;border-bottom:1px solid rgba(251,191,36,.1)">↳ ${x.nota}</td></tr>`:''}`).join('')}</tbody>
    </table>
    <p style="font-size:11px;color:var(--text3);font-style:italic;margin-top:14px;line-height:1.6">A conciliação é executada automaticamente a cada pagamento confirmado. Divergências acima de R$ 5,00 geram alerta no painel e notificação via WhatsApp.</p>`;
};

// ══════════════════════════════════════
// BOTTOM MOBILE NAV
// ══════════════════════════════════════
(function(){
  const nav = document.getElementById('mobileBottomNav');
  if (!nav) return;
  const items = nav.querySelectorAll('.mbn-item');
  const fab = document.getElementById('mbnCharge');

  items.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.nav;
      if (!target) return;
      switchView(target);
      items.forEach(i => i.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  fab?.addEventListener('click', () => {
    openModal(el.chargeModal);
  });
})();



// ══════════════════════════════════════
// ZION DEDICATED CHAT (Full view)
// ══════════════════════════════════════
(function initZionFullChat() {
  const input = document.getElementById('zionFullInput');
  const send = document.getElementById('zionFullSend');
  const msgs = document.getElementById('zionFullMessages');
  const suggestions = document.getElementById('zionSuggestions');
  if (!input || !send || !msgs) return;

  const addFullMsg = (text, from) => {
    const d = document.createElement('div');
    d.className = 'zion-full-msg zion-full-msg-' + sanitize(from);
    let clean = String(text)
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/#{1,3}\s/g, '')
      .replace(/^- /gm, '\u2022 ')
      .replace(/\\n/g, '\n');
    d.innerHTML = sanitize(clean).replace(/\n/g, '<br>');
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
    return d;
  };

  const showFullConfirm = (action, onYes, onNo) => {
    const card = document.createElement('div');
    card.className = 'zion-full-confirm';
    card.innerHTML = '<div class="zion-full-confirm-title">' + t('zion_action_title') + '</div>' +
      '<div class="zion-full-confirm-body">' + sanitize(action.confirm_message || '') + '</div>' +
      '<div class="zion-full-confirm-btns"><button class="zion-full-confirm-yes">' + t('zion_authorize') + '</button>' +
      '<button class="zion-full-confirm-no">' + t('zion_cancel') + '</button></div>';
    msgs.appendChild(card);
    msgs.scrollTop = msgs.scrollHeight;
    card.querySelector('.zion-full-confirm-yes').addEventListener('click', () => { card.remove(); onYes(); });
    card.querySelector('.zion-full-confirm-no').addEventListener('click', () => { card.remove(); onNo(); });
  };

  const sendFullMsg = async () => {
    const val = input.value.trim();
    if (!val || state.zionThinking) return;
    addFullMsg(val, 'user');
    input.value = '';
    state.zionThinking = true;

    // Hide suggestions after first message
    if (suggestions) suggestions.style.display = 'none';

    // Typing indicator
    const typing = document.createElement('div');
    typing.className = 'zion-full-typing';
    typing.innerHTML = '<span></span><span></span><span></span>';
    msgs.appendChild(typing);
    msgs.scrollTop = msgs.scrollHeight;

    try {
      const data = await callZionAI(val);
      typing.remove();
      if (data.message) addFullMsg(data.message, 'bot');
      if (data.action) {
        showFullConfirm(data.action,
          async () => { const r = await executeZionAction(data.action.tool, data.action.params || {}); addFullMsg(r, 'bot'); },
          () => addFullMsg(t('zion_cancelled'), 'bot')
        );
      }
    } catch {
      typing.remove();
      addFullMsg(t('zion_conn_err'), 'bot');
    } finally {
      state.zionThinking = false;
    }
  };

  send.addEventListener('click', sendFullMsg);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') sendFullMsg(); });

  // Suggestion chips
  document.querySelectorAll('.zion-suggestion').forEach(btn => {
    btn.addEventListener('click', () => {
      input.value = btn.dataset.msg;
      sendFullMsg();
    });
  });

  // Show welcome when view is activated
  const observer = new MutationObserver(() => {
    const view = document.getElementById('zion-chatView');
    if (view && !view.hidden && msgs.children.length === 0) {
      const welcome = (ZION_FALLBACK[getZionLang()] || ZION_FALLBACK.pt).default;
      setTimeout(() => addFullMsg(welcome, 'bot'), 300);
      zionHistory.push({ role: 'assistant', content: welcome });
      if (suggestions) suggestions.style.display = 'flex';
    }
  });
  const target = document.getElementById('zion-chatView');
  if (target) observer.observe(target, { attributes: true, attributeFilter: ['hidden'] });
})();

// ══════════════════════════════════════
// WHATSAPP NOTIFICATION SIMULATION
// ══════════════════════════════════════
const showWhatsAppToast = (name, amount, method) => {
  const existing = document.querySelector('.whatsapp-toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.className = 'whatsapp-toast';
  toast.innerHTML = `<div class="wt-icon">💬</div><div class="wt-text"><div class="wt-title">${t('whatsapp_title')}</div><div class="wt-body">✅ ${t('whatsapp_payment_confirmed')}: <strong>R$ ${(amount/100).toLocaleString('pt-BR',{minimumFractionDigits:2})}</strong> ${t('whatsapp_via')} ${method} ${t('whatsapp_from')} ${name}</div></div>`;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('visible'));
  setTimeout(() => { toast.classList.remove('visible'); setTimeout(() => toast.remove(), 400); }, 5000);
};

// Show WhatsApp notification during real-time demo
const _origShowRtToast = typeof showRtToast === 'function' ? showRtToast : null;
if (_origShowRtToast) {
  // After each RT toast, show a WhatsApp notification 1.5s later
  const origFire = typeof startRealtimeDemo === 'function' ? null : null;
}
// Trigger WhatsApp toast on demo payments after a delay


// ══════════════════════════════════════
// SIDEBAR LOGOUT
// ══════════════════════════════════════
document.getElementById('sidebarLogout')?.addEventListener('click', () => {
  localStorage.removeItem('zpay_token');
  state.token = '';
  setAuthUI(false);
});

// ══════════════════════════════════════


// ══════════════════════════════════════
// FEATURE 1: ONBOARDING SPLASH
// ══════════════════════════════════════
// Welcome banner (non-blocking, inside dashboard)
function showWelcomeBanner() {
  if (localStorage.getItem('zpay_welcome_done')) return;
  const content = document.querySelector('.content');
  if (!content) return;
  const banner = document.createElement('div');
  banner.className = 'welcome-banner';
  banner.innerHTML = '<div class="welcome-inner">' +
    '<div class="welcome-left"><img src="zpay-logo.png" class="welcome-logo"/><div><strong>Z-PAY</strong><span class="welcome-sub">GATEWAY SAAS</span></div></div>' +
    '<div class="welcome-text">' + sanitize(t('onb_feat_pix')) + ' · ' + sanitize(t('onb_feat_zion')) + ' · ' + sanitize(t('onb_feat_recon')) + '</div>' +
    '<button class="welcome-close" id="welcomeClose">✕</button></div>';
  content.prepend(banner);
  document.getElementById('welcomeClose')?.addEventListener('click', () => {
    banner.style.animation = 'onbFadeOut 0.3s ease forwards';
    localStorage.setItem('zpay_welcome_done', '1');
    setTimeout(() => banner.remove(), 300);
  });
};

// ══════════════════════════════════════
// FEATURE 2: ZION VOICE INPUT
// ══════════════════════════════════════
(function initVoiceInput() {
  const btn = document.getElementById('zionVoiceBtn');
  const input = document.getElementById('zionFullInput');
  if (!btn || !input) return;
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) { btn.style.display = 'none'; return; }
  let rec = null, on = false;
  btn.addEventListener('click', () => {
    if (on) { rec?.stop(); return; }
    rec = new SR();
    const lang = typeof getLang === 'function' ? getLang() : 'pt';
    rec.lang = lang === 'zh' ? 'zh-CN' : lang === 'en' ? 'en-US' : 'pt-BR';
    rec.interimResults = false;
    rec.onstart = () => { on = true; btn.classList.add('recording'); };
    rec.onresult = (e) => { input.value = e.results[0][0].transcript; input.focus(); };
    rec.onend = () => { on = false; btn.classList.remove('recording'); };
    rec.onerror = () => { on = false; btn.classList.remove('recording'); };
    rec.start();
  });
})();

// ══════════════════════════════════════
// FEATURE 3: DRAG & DROP KPI CARDS
// ══════════════════════════════════════
(function initDragDrop() {
  const row = document.getElementById('dbKpiRow');
  if (!row) return;
  let dragEl = null;
  row.querySelectorAll('.db-kpi-card').forEach(card => {
    card.setAttribute('draggable', 'true');
    card.addEventListener('dragstart', (e) => { dragEl = card; card.classList.add('dragging'); e.dataTransfer.effectAllowed = 'move'; });
    card.addEventListener('dragend', () => { card.classList.remove('dragging'); row.querySelectorAll('.db-kpi-card').forEach(c => c.classList.remove('drag-over')); const order = [...row.querySelectorAll('.db-kpi-card')].map(c => c.id); localStorage.setItem('zpay_kpi_order', JSON.stringify(order)); });
    card.addEventListener('dragover', (e) => { e.preventDefault(); card.classList.add('drag-over'); });
    card.addEventListener('dragleave', () => card.classList.remove('drag-over'));
    card.addEventListener('drop', (e) => { e.preventDefault(); card.classList.remove('drag-over'); if (dragEl && dragEl !== card) { const cards = [...row.children]; if (cards.indexOf(dragEl) < cards.indexOf(card)) card.after(dragEl); else card.before(dragEl); } });
  });
  try { const saved = JSON.parse(localStorage.getItem('zpay_kpi_order')||'[]'); if (saved.length === row.children.length) saved.forEach(id => { const el = document.getElementById(id); if (el) row.appendChild(el); }); } catch {}
})();

// ══════════════════════════════════════
// FEATURE 4: PUSH NOTIFICATIONS
// ══════════════════════════════════════
(function initPush() {
  if (!('Notification' in window)) return;
  document.addEventListener('click', () => { if (Notification.permission === 'default') Notification.requestPermission(); }, { once: true });
  window.showPaymentNotification = (title, body) => {
    if (Notification.permission !== 'granted') return;
    try { new Notification(title, { body, icon: 'zpay-logo.png', badge: 'zpay-logo.png', vibrate: [100,50,100] }); } catch {}
  };
})();

// ══════════════════════════════════════
// FEATURE 5: QR CODE PIX GENERATOR
// ══════════════════════════════════════
(function initQR() {
  const genBtn = document.getElementById('qrGenerate');
  const canvas = document.getElementById('qrCanvas');
  const display = document.getElementById('qrDisplay');
  const amountInput = document.getElementById('qrAmount');
  const valueEl = document.getElementById('qrValue');
  const copyBtn = document.getElementById('qrCopy');
  if (!genBtn || !canvas) return;
  const drawQR = (data) => {
    const ctx = canvas.getContext('2d');
    const s = 180, m = 25, cs = s/m;
    ctx.fillStyle = '#fff'; ctx.fillRect(0,0,s,s); ctx.fillStyle = '#0f172a';
    let seed = 0; for (let i=0;i<data.length;i++) seed = ((seed<<5)-seed+data.charCodeAt(i))|0;
    const rng = () => { seed = (seed*16807)%2147483647; return seed%3; };
    const finder = (x,y) => { ctx.fillRect(x*cs,y*cs,7*cs,7*cs); ctx.fillStyle='#fff'; ctx.fillRect((x+1)*cs,(y+1)*cs,5*cs,5*cs); ctx.fillStyle='#0f172a'; ctx.fillRect((x+2)*cs,(y+2)*cs,3*cs,3*cs); };
    finder(0,0); ctx.fillStyle='#0f172a'; finder(m-7,0); ctx.fillStyle='#0f172a'; finder(0,m-7); ctx.fillStyle='#0f172a';
    for (let y=0;y<m;y++) for (let x=0;x<m;x++) { if ((x<8&&y<8)||(x>m-9&&y<8)||(x<8&&y>m-9)) continue; if (rng()===0) ctx.fillRect(x*cs,y*cs,cs,cs); }
    ctx.fillStyle='#fff'; const ls=5*cs, lx=(s-ls)/2; ctx.fillRect(lx-2,lx-2,ls+4,ls+4);
    ctx.fillStyle='#ff7a18'; ctx.font='bold '+(ls*0.5)+'px sans-serif'; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText('Z',s/2,s/2);
  };
  genBtn.addEventListener('click', () => {
    const amt = parseFloat(amountInput.value);
    if (!amt||amt<1) { amountInput.classList.add('shake'); setTimeout(()=>amountInput.classList.remove('shake'),400); return; }
    drawQR('ZPAY'+Date.now().toString(36)+amt);
    valueEl.textContent = 'R$ '+amt.toLocaleString('pt-BR',{minimumFractionDigits:2});
    display.hidden = false; display.classList.add('success-pulse');
    setTimeout(()=>display.classList.remove('success-pulse'),600);
    if (typeof showConfetti==='function') showConfetti();
  });
  copyBtn?.addEventListener('click', () => {
    const code = 'ZPAY-PIX-'+Date.now().toString(36).toUpperCase();
    navigator.clipboard?.writeText(code).then(() => {
      copyBtn.textContent = '✓ Copiado!'; copyBtn.classList.add('success-pulse');
      setTimeout(()=>{ copyBtn.textContent=t('qr_copy_code'); copyBtn.classList.remove('success-pulse'); },2000);
    });
  });
})();

// ══════════════════════════════════════
// FEATURE 6: MICRO-INTERACTIONS
// ══════════════════════════════════════
window.showConfetti = () => {
  const c = document.createElement('div'); c.className='confetti-container'; document.body.appendChild(c);
  const colors = ['#ff7a18','#34d399','#38bdf8','#a78bfa','#f87171','#fbbf24'];
  for (let i=0;i<40;i++) { const p=document.createElement('div'); p.className='confetti'; p.style.left=Math.random()*100+'%'; p.style.background=colors[Math.floor(Math.random()*colors.length)]; p.style.animationDelay=Math.random()*0.5+'s'; p.style.animationDuration=(1.5+Math.random())+'s'; p.style.width=(4+Math.random()*6)+'px'; p.style.height=(4+Math.random()*6)+'px'; c.appendChild(p); }
  setTimeout(()=>c.remove(),3000);
};
document.addEventListener('mousedown', (e) => { const btn=e.target.closest('button,.primary,.ghost'); if(btn){btn.classList.add('btn-press');setTimeout(()=>btn.classList.remove('btn-press'),150);} });


// DARK / LIGHT THEME TOGGLE
// ══════════════════════════════════════
(function(){
  const toggle = document.getElementById('themeToggle');
  if (!toggle) return;

  // Load saved theme
  const saved = localStorage.getItem('zpay_theme') || 'dark';
  if (saved === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    toggle.textContent = '☀️';
  }

  toggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    if (current === 'light') {
      document.documentElement.removeAttribute('data-theme');
      toggle.textContent = '🌙';
      localStorage.setItem('zpay_theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      toggle.textContent = '☀️';
      localStorage.setItem('zpay_theme', 'light');
    }
  });
})();

