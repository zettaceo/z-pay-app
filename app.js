// ══════════════════════════════════════
// Z-PAY — DEMO MODE (sem backend)
// ══════════════════════════════════════

const GROQ_API_KEY = 'gsk_demo'; // substitua pela sua chave em console.groq.com (gratuito)

const state = {
  apiBase: 'DEMO',
  token: localStorage.getItem('zpay_token') || '',
  merchant: null,
  page_charges: 1, page_payments: 1, page_subscriptions: 1,
  demo: true,
  zionThinking: false
};

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
    if (b.email === 'demo@zpay.com' && b.password === 'demo123') {
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
  if (path.includes('/keys/rotate'))      return { public_key: 'zpk_demo_'+Date.now() };
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
  logoutBtn: document.getElementById('logoutBtn'),
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
      paginationEl.innerHTML = `<span class="pagination-info">${start+1}-${end} de ${total}</span><button class="ghost pagination-btn" ${page<=1?'disabled':''} data-page="${page-1}" data-table="${tableKey}">‹ Ant</button><span class="pagination-pages">Pág ${page} de ${totalPages}</span><button class="ghost pagination-btn" ${page>=totalPages?'disabled':''} data-page="${page+1}" data-table="${tableKey}">Próx ›</button>`;
      paginationEl.hidden = false;
    } else {
      paginationEl.innerHTML = total ? `<span class="pagination-info">${total} registro${total!==1?'s':''}</span>` : '';
      paginationEl.hidden = !total;
    }
  }
};

const renderSeasonality = (payments) => {
  if (!el.seasonalityChart) return;
  const buckets = new Array(12).fill(0);
  payments.forEach(p => { const m = new Date(p.created_at).getMonth(); buckets[m] += Number(p.amount||0); });
  const max = Math.max(...buckets, 1);
  const months = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
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
  el.feesTrend.textContent = 'Estável';
  el.balanceTrend.textContent = 'Atualizado agora';
  const payments = summary.last_payments || [];
  renderTable(el.recentPayments, payments, [
    r => r.id.slice(0,8), r => r.method, r => r.status,
    r => formatMoney(r.amount),
    r => new Date(r.created_at).toLocaleDateString('pt-BR'),
    r => new Date(r.created_at).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})
  ], ['ID','Método','Status','Valor','Data','Hora']);
  renderSeasonality(payments);
  const paid = payments.filter(p=>p.status==='PAID').length;
  const total = payments.length || 1;
  const failed = payments.filter(p=>p.status==='FAILED').length;
  const riskScore = Math.min(100, Math.round(((failed/total)*100) + (payments.length>8?10:0)));
  const avgTicket = payments.reduce((s,p) => s+Number(p.amount||0),0)/total;
  el.approvalRate.textContent = `${Math.round((paid/total)*100)}%`;
  el.approvalDetail.textContent = paid > failed ? 'Fluxo saudável' : 'Atenção a recusas';
  el.riskScore.textContent = `${riskScore}`;
  el.riskDetail.textContent = riskScore < 30 ? 'Baixo' : riskScore < 60 ? 'Médio' : 'Alto';
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
  ], ['Charge ID','Status','Valor','Moeda','Data','Hora','Cliente'], pag, 'charges');
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
  ], ['ID','Método','Status','Valor','Fee','Data','Hora','Charge'], pag, 'payments');
};

const refreshPayouts = async () => {
  const data = await api('/payouts');
  renderTable(el.payoutsTable, data.items||[], [
    r=>r.id.slice(0,8), r=>r.method, r=>r.status, r=>formatMoney(r.amount),
    r=>new Date(r.created_at).toLocaleDateString('pt-BR'),
    r=>new Date(r.created_at).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})
  ], ['Payout ID','Método','Status','Valor','Data','Hora']);
};

const refreshWebhooks = async () => {
  const data = await api('/webhooks');
  renderTable(el.webhooksTable, data.items||[], [
    r=>r.event_type, r=>r.status, r=>r.attempts,
    r=>new Date(r.created_at).toLocaleDateString('pt-BR'),
    r=>new Date(r.created_at).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'}),
    r=>r.id.slice(0,8)
  ], ['Evento','Status','Tentativas','Data','Hora','ID']);
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
  const comissao = total * 0.0025;
  c.innerHTML = `
    <div class="contador-header">
      <div class="contador-metric">
        <div class="contador-metric-label">Volume da Carteira</div>
        <div class="contador-metric-value">${formatMoney(total)}</div>
        <div class="contador-metric-sub">20 clientes simulados</div>
      </div>
      <div class="contador-metric highlight">
        <div class="contador-metric-label">Suas Comissões (mês)</div>
        <div class="contador-metric-value">${formatMoney(comissao)}</div>
        <div class="contador-metric-sub">0,25% sobre volume</div>
      </div>
      <div class="contador-metric">
        <div class="contador-metric-label">Taxa de Aprovação</div>
        <div class="contador-metric-value">98,4%</div>
        <div class="contador-metric-sub">Média da carteira</div>
      </div>
    </div>
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
    </table>`;
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
};

// ── RELATÓRIO PDF ──────────────────────
const generateReport = () => {
  const w = window.open('','_blank');
  const now = new Date();
  w.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Relatório Z-PAY</title>
  <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,900&family=DM+Sans:opsz,wght@9..40,400;9..40,500&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'DM Sans',sans-serif;background:#fff;color:#111;padding:48px}
  .hdr{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:40px;padding-bottom:24px;border-bottom:2px solid #f1f1f1}
  .logo{font-family:'Bricolage Grotesque',sans-serif;font-weight:900;font-size:28px;color:#ff7a18}.logo span{color:#111}
  .dt{font-family:'DM Mono',monospace;font-size:12px;color:#888;text-align:right}
  .mets{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:28px}
  .met{background:#f9f9f9;border-radius:10px;padding:16px 18px;border-left:3px solid #ff7a18}
  .ml{font-size:10px;letter-spacing:.06em;text-transform:uppercase;color:#888;font-family:'DM Mono',monospace;margin-bottom:6px}
  .mv{font-family:'Bricolage Grotesque',sans-serif;font-size:20px;font-weight:900;color:#111}
  .md{font-size:11px;color:#22c55e;font-family:'DM Mono',monospace;margin-top:3px}
  h2{font-family:'Bricolage Grotesque',sans-serif;font-size:15px;font-weight:900;margin-bottom:13px;color:#111}
  table{width:100%;border-collapse:collapse;margin-bottom:28px;font-size:13px}
  th{background:#f5f5f5;padding:9px 12px;text-align:left;font-family:'DM Mono',monospace;font-size:10px;letter-spacing:.06em;text-transform:uppercase;color:#888}
  td{padding:9px 12px;border-bottom:1px solid #f1f1f1}
  .badge{display:inline-block;padding:2px 7px;border-radius:100px;font-size:10px;font-family:'DM Mono',monospace;background:#fff3e0;color:#ff7a18}
  .ft{margin-top:36px;padding-top:14px;border-top:1px solid #eee;font-size:11px;color:#aaa;display:flex;justify-content:space-between}
  @media print{body{padding:24px}}</style></head><body>
  <div class="hdr"><div><div class="logo">Z<span>-PAY</span></div><div style="font-size:13px;color:#888;margin-top:3px">Relatório Executivo Mensal</div></div>
  <div class="dt"><div>Demo Store</div><div>CNPJ: 00.000.000/0001-00</div><div style="margin-top:4px">${now.toLocaleDateString('pt-BR',{month:'long',year:'numeric'})}</div></div></div>
  <div class="mets">
    <div class="met"><div class="ml">Volume Total</div><div class="mv">R$ 967.403</div><div class="md">↑ +12%</div></div>
    <div class="met"><div class="ml">Receita Líquida</div><div class="mv">R$ 947.898</div><div class="md">↑ +8%</div></div>
    <div class="met"><div class="ml">Transações</div><div class="mv">303</div><div class="md">Ticket: R$ 3.191</div></div>
    <div class="met"><div class="ml">Aprovação</div><div class="mv">100%</div><div class="md">Risco: Baixo</div></div>
  </div>
  <h2>Distribuição por Método</h2>
  <table><thead><tr><th>Método</th><th>Volume</th><th>Txns</th><th>%</th><th>Status</th></tr></thead><tbody>
    <tr><td>PIX</td><td>R$ 69.104,49</td><td>98</td><td>43%</td><td><span class="badge">Ativo</span></td></tr>
    <tr><td>CARTÃO</td><td>R$ 99.497,00</td><td>142</td><td>32%</td><td><span class="badge">Ativo</span></td></tr>
    <tr><td>BOLETO</td><td>R$ 57.072,53</td><td>63</td><td>25%</td><td><span class="badge">Ativo</span></td></tr>
  </tbody></table>
  <h2>Score de Risco</h2>
  <table><thead><tr><th>Indicador</th><th>Valor</th><th>Status</th></tr></thead><tbody>
    <tr><td>Score de Risco</td><td>10/100</td><td><span class="badge" style="background:#e8f5e9;color:#22c55e">Baixo</span></td></tr>
    <tr><td>Chargebacks</td><td>0,00%</td><td><span class="badge" style="background:#e8f5e9;color:#22c55e">Saudável</span></td></tr>
    <tr><td>KYC Status</td><td>Aprovado</td><td><span class="badge" style="background:#e8f5e9;color:#22c55e">OK</span></td></tr>
  </tbody></table>
  <div class="ft"><div>Gerado por Z-PAY</div><div>${now.toLocaleString('pt-BR')}</div></div>
  </body></html>`);
  w.document.close(); setTimeout(()=>w.print(),500);
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
    if (btn) { btn.disabled=true; btn.textContent='Entrando…'; }
    try {
      const data = await api('/auth/login', { method:'POST', body:{email:emailEl?.value?.trim(), password:passEl?.value} });
      state.token = data.access_token;
      localStorage.setItem('zpay_token', state.token);
      setAuthUI(true);
      await loadMerchant();
      await renderPremiumDashboard();
      setTimeout(() => initZionWidget(), 500);
    } catch(err) {
      if (errEl) { errEl.textContent = err.message||'Falha no login'; errEl.hidden=false; }
    } finally {
      if (btn) { btn.disabled=false; btn.textContent='Entrar'; }
    }
  });
}
if (el.demoLogin) {
  el.demoLogin.addEventListener('click', () => {
    const e = document.getElementById('loginEmail'); if (e) e.value='demo@zpay.com';
    const p = document.getElementById('loginPassword'); if (p) p.value='demo123';
    if (el.loginForm) el.loginForm.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));
  });
}

// ── NAVEGAÇÃO ─────────────────────────
const VIEW_TITLES = {
  dashboard:['Dashboard','Visão consolidada da operação'],
  charges:['Cobranças','Gerencie suas cobranças'],
  payments:['Pagamentos','Histórico de pagamentos'],
  payouts:['Payouts','Saques e repasses'],
  webhooks:['Webhooks','Logs e simulador'],
  analytics:['Analytics','Relatórios avançados'],
  plans:['Planos','Planos Z-PAY'],
  linkbio:['Meu Link','Link-in-bio'],
  subscriptions:['Assinaturas','Recorrência PIX'],
  roadmap:['Roadmap','Próximas features'],
  docs:['Documentação','API Reference'],
  onboarding:['Onboarding','KYC e ativação'],
  settings:['Configurações','Chaves e integrações'],
  'contador':   ['Painel Contador','Gestão da carteira'],
  'chargebacks':['Chargebacks','Disputas e contestações'],
};

const switchView = (view) => {
  const [title, subtitle] = VIEW_TITLES[view] || [view, ''];
  // Show/hide premium dashboard
  const pd = document.getElementById('premiumDashboard');
  if (pd) pd.style.display = view === 'dashboard' ? 'flex' : 'none';
  setView(view, title, subtitle);
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
  } catch(err) { el.chargeResult.textContent=err.message||'Erro'; el.chargeResult.hidden=false; }
});

el.payoutForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    await api('/payouts',{method:'POST',body:{amount:Number(document.getElementById('payoutAmount').value)*100,method:document.getElementById('payoutMethod').value}});
    closeAllModals(); refreshPayouts();
  } catch(err) { const d=document.getElementById('payoutError'); if(d){d.textContent=err.message;d.hidden=false;} }
});

el.checkoutForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    const data=await api(`/charges/${document.getElementById('checkoutChargeId').value}/pay`,{method:'POST',body:{method:document.getElementById('checkoutMethod').value}});
    el.checkoutResult.textContent=`Pagamento ${data.status}. Atualize o dashboard.`; el.checkoutResult.hidden=false; closeAllModals();
  } catch(err) { el.checkoutResult.textContent=err.message||'Erro'; el.checkoutResult.hidden=false; }
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
document.getElementById('mobCheckout')?.addEventListener('click', ()=>openModal(el.checkoutModal));
document.getElementById('mobNewCharge')?.addEventListener('click', ()=>openModal(el.chargeModal));
document.getElementById('mobLogout')?.addEventListener('click', ()=>{ localStorage.removeItem('zpay_token'); state.token=''; setAuthUI(false); });

// ── LOGOUT ────────────────────────────
el.logoutBtn?.addEventListener('click',()=>{ localStorage.removeItem('zpay_token'); state.token=''; setAuthUI(false); });
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
  const products=JSON.parse(localStorage.getItem(LINKBIO_KEY)||'[]');
  const slug=(state.merchant?.email||'demo').split('@')[0].replace(/[^a-z0-9]/gi,'-').toLowerCase();
  const urlEl=document.getElementById('linkbioUrl'); if(urlEl) urlEl.textContent=`${location.origin}/linkbio.html?slug=${slug}`;
  const container=document.getElementById('linkbioProducts'); if(!container) return;
  container.innerHTML=products.map((p,i)=>`<div class="linkbio-product"><div class="product-info"><strong>${p.name}</strong> — ${formatMoney(p.amount*100)}${p.desc?`<br><span class="product-desc">${p.desc}</span>`:''}</div><div class="product-actions"><button class="ghost" data-remove="${i}">Remover</button></div></div>`).join('')||'<p class="panel-desc">Nenhum produto adicionado.</p>';
  container.querySelectorAll('[data-remove]').forEach(btn=>{
    btn.addEventListener('click',()=>{ const list=JSON.parse(localStorage.getItem(LINKBIO_KEY)||'[]'); list.splice(parseInt(btn.dataset.remove,10),1); localStorage.setItem(LINKBIO_KEY,JSON.stringify(list)); refreshLinkbio(); });
  });
};
const refreshSubscriptions = () => {
  const subs=JSON.parse(localStorage.getItem(SUBSCRIPTIONS_KEY)||'[]');
  const pag=document.getElementById('subscriptionsPagination');
  const container=document.getElementById('subscriptionsTable'); if(!container) return;
  renderTable(container,subs,[(r)=>r.id?.slice(0,8)||'-',(r)=>r.description||'-',(r)=>formatMoney((r.amount||0)*100),(r)=>r.day||'-',(r)=>r.status||'Ativa'],['ID','Descrição','Valor','Dia','Status'],pag,'subscriptions');
};
document.getElementById('addLinkProduct')?.addEventListener('click',()=>openModal(document.getElementById('linkProductModal')));
document.getElementById('linkProductForm')?.addEventListener('submit',e=>{ e.preventDefault(); const list=JSON.parse(localStorage.getItem(LINKBIO_KEY)||'[]'); list.push({id:'p'+Date.now(),name:document.getElementById('productName').value,amount:Number(document.getElementById('productAmount').value),desc:document.getElementById('productDesc').value}); localStorage.setItem(LINKBIO_KEY,JSON.stringify(list)); document.getElementById('linkProductForm').reset(); closeAllModals(); refreshLinkbio(); });
document.getElementById('copyLinkbio')?.addEventListener('click',()=>{ const url=document.getElementById('linkbioUrl')?.textContent; if(url&&url!=='—'){navigator.clipboard.writeText(url); document.getElementById('copyLinkbio').textContent='Copiado!'; setTimeout(()=>{document.getElementById('copyLinkbio').textContent='Copiar';},2000);} });
document.getElementById('openSubscriptionModal')?.addEventListener('click',()=>openModal(document.getElementById('subscriptionModal')));
document.getElementById('subscriptionForm')?.addEventListener('submit',e=>{ e.preventDefault(); const list=JSON.parse(localStorage.getItem(SUBSCRIPTIONS_KEY)||'[]'); list.push({id:'sub'+Date.now(),description:document.getElementById('subDesc').value||'Assinatura',amount:Number(document.getElementById('subAmount').value),day:Number(document.getElementById('subDay').value),status:'Ativa'}); localStorage.setItem(SUBSCRIPTIONS_KEY,JSON.stringify(list)); document.getElementById('subscriptionForm').reset(); closeAllModals(); refreshSubscriptions(); });
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
  };
  if (activeView && VIEW_MAP[activeView] && el.viewTitle) {
    el.viewTitle.textContent   = t(VIEW_MAP[activeView][0]);
    el.viewSubtitle.textContent = t(VIEW_MAP[activeView][1]);
  }
  if (el.planBadge && state.merchant) el.planBadge.textContent = `${t('plan')} ${state.merchant.plan}`;
  if (el.kycBadge  && state.merchant) el.kycBadge.textContent  = `KYC ${state.merchant.kyc_status}`;
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
  vendas:`📊 Últimos 30 dias:\nVolume total: R$ 967.403,59 (+12%).\nPIX lidera com 43% das transações. Ticket médio: R$ 3.191.\n\n💡 Clientes PIX têm ticket 18% maior. Desconto de 2% no PIX pode gerar +R$ 45k/mês.`,
  fraude:`🛡️ Score de risco: BAIXO (10/100)\nNenhuma tentativa suspeita nas últimas 24h.\n✅ Taxa de aprovação: 100% — fluxo saudável.`,
  chargeback:`⚠️ Chargebacks: 0 disputas abertas.\nÍndice em 0,00% — abaixo do limite de 1%. Continue monitorando transações acima de R$ 5.000.`,
  previsao:`📈 Previsão 30 dias: R$ 1.044.795 (+8%).\nFevereiro é seu mês mais forte historicamente.`,
  plano:`💎 Plano PRO ativo.\nTaxa PIX: 0,6% · CARD: 2,2%\nWebhooks ilimitados · Split · Suporte prioritário.`,
  default:`⚡ Sou o ZION, seu copiloto IA.\n\nPosso analisar vendas, riscos, previsões, chargebacks e executar tarefas.\n\nTente: "Como estão minhas vendas?" ou "Me dá um tour" ou "Crie uma cobrança de R$ 100"`
};

const zionFallback = (msg) => {
  const m=msg.toLowerCase();
  if(m.match(/vend|volume|receita|pagament/)) return {message:ZION_FALLBACK.vendas};
  if(m.match(/fraud|risco|segur/))            return {message:ZION_FALLBACK.fraude};
  if(m.match(/charge|disput|estorn/))         return {message:ZION_FALLBACK.chargeback};
  if(m.match(/previs|estim|próxim/))          return {message:ZION_FALLBACK.previsao};
  if(m.match(/plano|taxa|tarifa/))            return {message:ZION_FALLBACK.plano};
  if(m.match(/tour|tutorial|explicar|mostrar plataforma|como usar/)) return {message:'🚀 Iniciando tour guiado!', action:{tool:'start_tour',params:{},confirm_message:'Iniciar o tour completo da plataforma Z-PAY? São 10 passos explicando cada seção.'}};
  if(m.match(/navegar?|ir para|abrir|mostrar/)) {
    const map={dashboard:'dashboard',cobranças:'charges',pagamentos:'payments',payouts:'payouts',webhooks:'webhooks',analytics:'analytics',contador:'contador',chargebacks:'chargebacks',assinaturas:'subscriptions',planos:'plans'};
    for(const[k,v] of Object.entries(map)) { if(m.includes(k)) return {message:`Navegando para ${k}.`,action:{tool:'navigate_to',params:{section:v},confirm_message:`Navegar para a seção "${k}"?`}}; }
  }
  if(m.match(/relat[oó]rio|pdf|exportar/)) return {message:'Vou gerar o relatório mensal em PDF.',action:{tool:'generate_report',params:{},confirm_message:'Gerar relatório financeiro mensal em PDF?'}};
  if(m.match(/cobran[çc]a|criar cobran|nova cobran/)) {
    const amtMatch=msg.match(/R?\$?\s*(\d+(?:[,\.]\d+)?)/);
    const amount=amtMatch?parseFloat(amtMatch[1].replace(',','.')):100;
    return {message:`Vou criar uma cobrança de R$ ${amount.toFixed(2)}.`,action:{tool:'create_charge',params:{amount,description:'Cobrança via ZION',currency:'BRL'},confirm_message:`Criar cobrança de R$ ${amount.toFixed(2)} via PIX?`}};
  }
  return {message:ZION_FALLBACK.default};
};

const callZionAI = async (msg) => {
  if (!GROQ_API_KEY || GROQ_API_KEY === 'gsk_demo') return zionFallback(msg);
  try {
    const systemPrompt = `Você é o ZION, copiloto IA da plataforma Z-PAY.

DADOS DO MERCHANT:
- Plano: PRO | KYC: APROVADO
- Volume (30d): R$ 967.403,59 | Transações: 303 | Aprovação: 100%
- Pagamentos: PIX 43%, CARD 32%, BOLETO 25%

FERRAMENTAS DISPONÍVEIS (responda em JSON):
Se detectar intenção de ação, retorne:
{"message":"texto","action":{"tool":"nome","params":{},"confirm_message":"texto do card"}}
Caso contrário: {"message":"sua resposta"}

FERRAMENTAS: navigate_to (params: section), generate_report, start_tour, create_charge (params: amount, description, currency)

Responda em português, máximo 3 parágrafos, JSON puro sem markdown.`;

    const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method:'POST',
      headers:{'Content-Type':'application/json','Authorization':`Bearer ${GROQ_API_KEY}`},
      body:JSON.stringify({model:'llama-3.3-70b-versatile',max_tokens:500,temperature:0.3,messages:[{role:'system',content:systemPrompt},{role:'user',content:msg}]})
    });
    const data = await r.json();
    const raw = data.choices?.[0]?.message?.content || '{}';
    try { return JSON.parse(raw.replace(/```json|```/g,'').trim()); }
    catch { return {message:raw}; }
  } catch { return zionFallback(msg); }
};

const executeZionAction = async (tool, params) => {
  switch(tool) {
    case 'navigate_to': switchView(params.section); return `✅ Navegando para ${params.section}.`;
    case 'generate_report': generateReport(); return '✅ Relatório gerado!';
    case 'start_tour': startZionTour(); return '🚀 Tour iniciado!';
    case 'show_data': switchView(params.type||'dashboard'); return `✅ Mostrando ${params.type}.`;
    case 'create_charge':
      try {
        const res = await api('/charges',{method:'POST',body:{amount:Math.round((params.amount||100)*100),currency:params.currency||'BRL',description:params.description||'Cobrança ZION',split_rules:[]}});
        return `✅ Cobrança criada!\nValor: R$ ${(params.amount||100).toFixed(2)}\nLink: ${res.payment_link}`;
      } catch(e) { return '❌ Erro: '+e.message; }
    default: return '⚠️ Ação não reconhecida.';
  }
};

const showZionConfirm = (action, onYes, onNo) => {
  const msgs = document.getElementById('zionMessages'); if (!msgs) return;
  const card = document.createElement('div'); card.className='zion-confirm-card';
  card.innerHTML=`<div class="zion-confirm-title">⚡ ZION quer executar uma ação</div><div class="zion-confirm-body">${action.confirm_message||'Confirmar ação?'}</div><div class="zion-confirm-btns"><button class="zion-confirm-yes">✓ Autorizar</button><button class="zion-confirm-no">✗ Cancelar</button></div>`;
  msgs.appendChild(card); msgs.scrollTop=msgs.scrollHeight;
  card.querySelector('.zion-confirm-yes').addEventListener('click',()=>{ card.remove(); onYes(); });
  card.querySelector('.zion-confirm-no').addEventListener('click',()=>{ card.remove(); onNo(); });
};

const addZionMsg = (text, from) => {
  const msgs = document.getElementById('zionMessages'); if (!msgs) return null;
  const d = document.createElement('div'); d.className=`zion-msg zion-msg-${from}`; d.textContent=text;
  msgs.appendChild(d); msgs.scrollTop=msgs.scrollHeight; return d;
};

const sendZionMsg = async () => {
  const input = document.getElementById('zionInput');
  const msgs  = document.getElementById('zionMessages');
  const val   = input?.value?.trim();
  if (!val || state.zionThinking) return;
  addZionMsg(val,'user'); input.value=''; state.zionThinking=true;
  const typing = document.createElement('div'); typing.className='zion-msg zion-msg-bot';
  typing.innerHTML='<span class="zion-typing-indicator"><span></span><span></span><span></span></span>';
  msgs?.appendChild(typing); if(msgs) msgs.scrollTop=msgs.scrollHeight;
  try {
    const data = await callZionAI(val); typing.remove();
    if (data.message) addZionMsg(data.message,'bot');
    if (data.action) {
      showZionConfirm(data.action,
        async ()=>{ const r=await executeZionAction(data.action.tool,data.action.params||{}); addZionMsg(r,'bot'); },
        ()=>addZionMsg('↩️ Ação cancelada.','bot')
      );
    }
  } catch { typing.remove(); addZionMsg('⚠️ Erro de conexão.','bot'); }
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
    if (!chat.hidden && msgs && msgs.children.length===0) setTimeout(()=>addZionMsg(ZION_FALLBACK.default,'bot'),300);
  });
  close?.addEventListener('click',()=>{ chat.hidden=true; });
  send?.addEventListener('click', sendZionMsg);
  input?.addEventListener('keydown',e=>{ if(e.key==='Enter') sendZionMsg(); });
};

// ══════════════════════════════════════
// TOUR GUIADO
// ══════════════════════════════════════
const TOUR_STEPS = [
  {el:'[data-view="dashboard"]',section:'dashboard',title:'Dashboard',desc:'Centro de controle. Volume total, receita, score de risco e taxa de aprovação em tempo real.'},
  {el:'.cards',section:null,title:'Cards de Métricas',desc:'Aqui você acompanha volume total processado, receita líquida após taxas, fees cobradas e saldo disponível.'},
  {el:'[data-view="charges"]',section:'charges',title:'Cobranças',desc:'Crie e gerencie cobranças. Cada uma gera um link de pagamento único. Suporta PIX, Cartão, Boleto, Cripto e split automático.'},
  {el:'[data-view="payments"]',section:'payments',title:'Pagamentos',desc:'Histórico completo de todos os pagamentos. Veja distribuição por método, ticket médio e filtre por período.'},
  {el:'[data-view="payouts"]',section:'payouts',title:'Payouts',desc:'Solicite saques e acompanhe repasses via PIX ou TED. Em produção, suporta liquidação em cripto.'},
  {el:'[data-view="webhooks"]',section:'webhooks',title:'Webhooks',desc:'Integre o Z-PAY com seus sistemas via webhooks. Notificações em tempo real com retry automático.'},
  {el:'[data-view="analytics"]',section:'analytics',title:'Analytics',desc:'Relatórios avançados: sazonalidade, previsão de receita, alertas de fraude e exportação CSV/PDF.'},
  {el:'[data-view="contador"]',section:'contador',title:'Painel Contador',desc:'Exclusivo para parceiros contábeis. Gerencie toda a carteira de clientes com volume consolidado e comissões.'},
  {el:'[data-view="subscriptions"]',section:'subscriptions',title:'Assinaturas',desc:'Cobranças recorrentes via PIX. Configure planos com retry automático em falhas.'},
  {el:'#zionWidget',section:null,title:'ZION — Copiloto IA',desc:'Sou o ZION! Analiso dados, crio cobranças, navego pela plataforma e respondo dúvidas. Tudo por texto!'},
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
        const rect=tgt.getBoundingClientRect();
        highlight.style.cssText=`display:block;top:${rect.top+window.scrollY-6}px;left:${rect.left-6}px;width:${rect.width+12}px;height:${rect.height+12}px;`;
      } else highlight.style.display='none';
    }
    card.style.display='block';
    document.getElementById('tourStepLabel').textContent=`${tourStep+1} de ${TOUR_STEPS.length}`;
    document.getElementById('tourProgress').style.width=`${((tourStep+1)/TOUR_STEPS.length)*100}%`;
    document.getElementById('tourTitle').textContent=step.title;
    document.getElementById('tourDesc').textContent=step.desc;
    document.getElementById('tourPrev').style.visibility=tourStep>0?'visible':'hidden';
    document.getElementById('tourNext').textContent=tourStep<TOUR_STEPS.length-1?'Próximo →':'🎉 Concluir';
    card.scrollIntoView({behavior:'smooth',block:'nearest'});
  }, 250);
};

const endTour = () => {
  tourActive=false;
  ['tourOverlay','tourHighlight','tourCard'].forEach(id=>{ const e=document.getElementById(id); if(e) e.style.display='none'; });
  addZionMsg('🎉 Tour concluído! Você conhece toda a plataforma. Como posso ajudar?','bot');
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
      <span class="agent-status ${a.status}">${a.status==='active'?'● Ativo':'Em breve'}</span>
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
    const months = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
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


