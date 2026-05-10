/* =============================================
   EU APOIO DILSON BATISTA — main.js
   Counter · Form · Google Sheets · Pixel
   ============================================= */

// ─── CONFIG ───────────────────────────────────
// Substitua pela URL do seu Google Apps Script após publicar
const SHEETS_URL = 'COLE_AQUI_A_URL_DO_GOOGLE_APPS_SCRIPT';

const META_ASSINATURAS = 30000;
let contagemAtual = 247; // valor de fallback enquanto o Sheets não está conectado

// ─── CONTADOR ANIMADO ─────────────────────────
function animateCounter(target, duration = 1200) {
  const elHero = document.getElementById('counter-num');
  const elProgress = document.getElementById('progress-count');
  const start = performance.now();
  const from = 0;

  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(from + (target - from) * ease);
    const formatted = value.toLocaleString('pt-BR');
    if (elHero) elHero.textContent = formatted;
    if (elProgress) elProgress.textContent = formatted;
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

function updateProgressBar(count) {
  const fill = document.getElementById('progress-fill');
  if (!fill) return;
  const pct = Math.min((count / META_ASSINATURAS) * 100, 100);
  fill.style.width = pct.toFixed(1) + '%';
}

// ─── BUSCAR TOTAL DE ASSINATURAS DA PLANILHA ─
async function fetchCount() {
  if (SHEETS_URL.includes('COLE_AQUI')) {
    // URL ainda não configurada — usa fallback e anima
    animateCounter(contagemAtual);
    updateProgressBar(contagemAtual);
    return;
  }

  try {
    const r = await fetch(SHEETS_URL + '?action=count');
    const data = await r.json();
    if (data.total && data.total > 0) {
      contagemAtual = data.total;
    }
  } catch (_) { /* usa fallback */ }

  animateCounter(contagemAtual);
  updateProgressBar(contagemAtual);
}

fetchCount();

// ─── MÁSCARA DE TELEFONE ──────────────────────
function maskPhone(input) {
  let v = input.value.replace(/\D/g, '').slice(0, 11);
  if (v.length > 10) {
    v = v.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else if (v.length > 6) {
    v = v.replace(/(\d{2})(\d{4})(\d+)/, '($1) $2-$3');
  } else if (v.length > 2) {
    v = v.replace(/(\d{2})(\d+)/, '($1) $2');
  }
  input.value = v;
}

document.getElementById('whatsapp')?.addEventListener('input', e => maskPhone(e.target));

// ─── FORMULÁRIO ───────────────────────────────
const form = document.getElementById('petition-form');

function showError(field, msg) {
  const el = document.getElementById(`erro-${field}`);
  if (el) { el.textContent = msg; el.style.display = 'block'; }
  const input = document.getElementById(field);
  if (input) input.classList.add('form-input--error');
}

function clearErrors() {
  document.querySelectorAll('.form-error').forEach(el => {
    el.textContent = '';
    el.style.display = 'none';
  });
  document.querySelectorAll('.form-input--error').forEach(el => {
    el.classList.remove('form-input--error');
  });
}

form?.addEventListener('submit', async e => {
  e.preventDefault();
  clearErrors();

  const nome     = form.nome.value.trim();
  const email    = form.email.value.trim();
  const whatsapp = form.whatsapp.value.trim();

  let valid = true;

  if (nome.length < 2) {
    showError('nome', 'Por favor, informe seu nome completo.');
    valid = false;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showError('email', 'Por favor, informe um e-mail válido.');
    valid = false;
  }
  if (whatsapp.replace(/\D/g, '').length < 10) {
    showError('whatsapp', 'Informe um WhatsApp válido com DDD.');
    valid = false;
  }

  if (!valid) return;

  const btn = document.getElementById('btn-submit');
  btn.textContent = '⏳ Registrando sua assinatura...';
  btn.disabled = true;

  const payload = {
    nome,
    email,
    whatsapp,
    timestamp: new Date().toISOString(),
  };

  // Envia para o Google Sheets (se URL configurada)
  if (!SHEETS_URL.includes('COLE_AQUI')) {
    try {
      const url = SHEETS_URL + '?' + new URLSearchParams(payload).toString();
      const r   = await fetch(url);
      const res = await r.json().catch(() => ({}));
      if (res.total) contagemAtual = res.total;
    } catch (_) { /* continua para obrigado mesmo sem resposta */ }
  }

  // Preserva UTMs na URL de destino
  const urlParams = new URLSearchParams(window.location.search);
  const utms = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
  const utmString = utms
    .filter(k => urlParams.has(k))
    .map(k => `${k}=${urlParams.get(k)}`)
    .join('&');

  const destino =
    `obrigado.html?nome=${encodeURIComponent(nome)}${utmString ? '&' + utmString : ''}`;

  window.location.href = destino;
});

// ─── STICKY CTA ───────────────────────────────
const stickyCta = document.getElementById('sticky-cta');
const heroSection = document.querySelector('.hero');

if (stickyCta && heroSection) {
  const observer = new IntersectionObserver(
    ([entry]) => stickyCta.classList.toggle('sticky-cta--visible', !entry.isIntersecting),
    { threshold: 0.1 }
  );
  observer.observe(heroSection);
}

// ─── SMOOTH SCROLL ────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
