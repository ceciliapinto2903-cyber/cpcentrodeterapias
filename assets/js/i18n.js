/**
 * ============================================================
 * CECÍLIA MASSAGENS — i18n.js
 * Motor de tradução PT / ES / EN
 * ============================================================
 *
 * COMO FUNCIONA
 * ─────────────────────────────────────────────────────────────
 * 1. O dicionário de traduções vive em js/i18n-dict.js (variável
 *    global I18N_DICT), carregado ANTES deste ficheiro.
 * 2. Qualquer elemento com data-i18n="chave.aninhada" tem o seu
 *    texto substituído pelo valor correspondente no dicionário.
 * 3. data-i18n-html="chave" funciona igual mas substitui innerHTML
 *    (usar só quando o texto original tem tags simples, ex: <strong>).
 * 4. data-i18n-placeholder="chave" traduz o atributo placeholder.
 * 5. data-i18n-aria="chave" traduz o atributo aria-label.
 * 6. data-i18n-title="chave" traduz o atributo title.
 * 7. A preferência de idioma fica guardada em localStorage
 *    ('idioma-preferido') e aplica-se automaticamente em cada
 *    página nova que o visitante abra.
 * 8. Se uma chave não existir no idioma escolhido, mantém-se o
 *    texto original em português (nunca fica em branco).
 * ============================================================
 */
'use strict';

const IDIOMAS_DISPONIVEIS = ['pt', 'es', 'en'];
const IDIOMA_POR_OMISSAO = 'pt';

const HTML_LANG_POR_IDIOMA = {
  pt: 'pt-PT',
  es: 'es-ES',
  en: 'en-US',
};

const NOME_IDIOMA = {
  pt: { pt: 'Português', es: 'Português', en: 'Português' },
  es: { pt: 'Español', es: 'Español', en: 'Español' },
  en: { pt: 'English', es: 'English', en: 'English' },
};

/* Resolve "form.nome_label" dentro de um objeto aninhado */
function resolverChave(dicionario, caminho) {
  return caminho.split('.').reduce((acc, parte) => {
    return (acc && Object.prototype.hasOwnProperty.call(acc, parte)) ? acc[parte] : undefined;
  }, dicionario);
}

function obterIdiomaGuardado() {
  const guardado = localStorage.getItem('idioma-preferido');
  return IDIOMAS_DISPONIVEIS.includes(guardado) ? guardado : IDIOMA_POR_OMISSAO;
}

function aplicarTraducao(idioma) {
  if (!IDIOMAS_DISPONIVEIS.includes(idioma)) idioma = IDIOMA_POR_OMISSAO;
  if (typeof I18N_DICT === 'undefined') return; /* dicionário não carregado nesta página */

  const dicionario = I18N_DICT[idioma] || {};

  document.documentElement.setAttribute('lang', HTML_LANG_POR_IDIOMA[idioma]);

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const valor = resolverChave(dicionario, el.dataset.i18n);
    if (valor !== undefined) el.textContent = valor;
  });

  document.querySelectorAll('[data-i18n-html]').forEach((el) => {
    const valor = resolverChave(dicionario, el.dataset.i18nHtml);
    if (valor !== undefined) el.innerHTML = valor;
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    const valor = resolverChave(dicionario, el.dataset.i18nPlaceholder);
    if (valor !== undefined) el.setAttribute('placeholder', valor);
  });

  document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
    const valor = resolverChave(dicionario, el.dataset.i18nAria);
    if (valor !== undefined) el.setAttribute('aria-label', valor);
  });

  document.querySelectorAll('[data-i18n-title]').forEach((el) => {
    const valor = resolverChave(dicionario, el.dataset.i18nTitle);
    if (valor !== undefined) el.setAttribute('title', valor);
  });

  localStorage.setItem('idioma-preferido', idioma);
  atualizarUISeletorIdioma(idioma);
}

function atualizarUISeletorIdioma(idioma) {
  document.querySelectorAll('.seletor-idioma-btn').forEach((btn) => {
    const ativo = btn.dataset.idioma === idioma;
    btn.classList.toggle('ativo', ativo);
    btn.setAttribute('aria-current', ativo ? 'true' : 'false');
  });
  document.querySelectorAll('.seletor-idioma-atual').forEach((span) => {
    span.textContent = idioma.toUpperCase();
  });
}

function initSeletorIdioma() {
  const botoes = document.querySelectorAll('.seletor-idioma-btn');
  if (!botoes.length) return;

  botoes.forEach((btn) => {
    btn.addEventListener('click', () => {
      aplicarTraducao(btn.dataset.idioma);
      /* fecha o dropdown no mobile depois de escolher */
      const dropdown = btn.closest('.dropdown-menu');
      if (dropdown && dropdown.classList.contains('show')) {
        dropdown.classList.remove('show');
      }
    });
  });

  aplicarTraducao(obterIdiomaGuardado());
}

document.addEventListener('DOMContentLoaded', initSeletorIdioma);
