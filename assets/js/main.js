/**
 * ============================================================
 * CECÍLIA MASSAGENS — main.js
 * CP Centro de Terapias e Bem-Estar
 * ============================================================
 *
 * ESTRUTURA DO FICHEIRO
 * ─────────────────────────────────────────────────────────────
 *  01. NAVBAR SCROLL      — sombra ao fazer scroll
 *  02. FADE-IN            — animações por IntersectionObserver
 *  03. COOKIE BANNER RGPD — consentimento via localStorage
 *  04. DATA MÍNIMA        — impede datas passadas no formulário
 *  05. URL PARAMS         — pré-seleciona campos via ?param=
 *  06. FILTROS SERVIÇOS   — filtra cards por categoria
 *  07. SELETOR ESPAÇO     — alterna painel Feira / Esmoriz
 *  08. BLOG: FILTROS      — filtra artigos por tag
 *  09. BLOG: PESQUISA     — filtra artigos por texto
 *  10. BOOTSTRAP CAROUSEL — controlo do carrossel (espaço)
 *  11. INIT               — ponto de entrada (DOMContentLoaded)
 *  12. BARRA TOPO TICKER  — scroll automático da barra de topo
 * ─────────────────────────────────────────────────────────────
 *
 * USO NO HTML (antes do </body>, depois do Bootstrap JS):
 *   <script src="js/main.js"></script>              ← raiz
 *   <script src="../js/main.js"></script>           ← pages/
 *
 * DEPENDÊNCIAS:
 *   Bootstrap 5.3.3 (bootstrap.bundle.min.js)
 *   Bootstrap Icons (CSS — apenas ícones visuais)
 * ============================================================
 */

'use strict';

/* ============================================================
 * 01. NAVBAR SCROLL
 *     Adiciona a classe .scrolled à navbar após 30px de scroll.
 *     A classe .scrolled ativa a sombra e reduz o padding
 *     (ver estilo.css — secção 06. NAVBAR)
 * ============================================================ */
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  const atualizar = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
  };

  window.addEventListener('scroll', atualizar, { passive: true });
  atualizar(); /* estado inicial ao carregar a página */
}


/* ============================================================
 * 01b. BOTÃO VOLTAR AO TOPO
 *      Aparece depois de percorrida uma certa distância,
 *      e sobe suavemente a página ao ser clicado — para o
 *      visitante não ter de arrastar o rato manualmente
 *      desde o fundo da página até ao topo.
 * ============================================================ */
function initBtnTopo() {
  const btn = document.getElementById('btn-topo');
  if (!btn) return;

  const atualizar = () => {
    btn.classList.toggle('visivel', window.scrollY > 500);
  };

  window.addEventListener('scroll', atualizar, { passive: true });
  atualizar();

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}


/* ============================================================
 * 02. FADE-IN — Animações por IntersectionObserver
 *     Elementos com .fade-in ficam invisíveis no CSS.
 *     Quando entram no viewport, recebem .visivel e animam.
 *     Classes .delay-1 a .delay-4 criam efeito de cascata.
 * ============================================================ */
function initFadeIn() {
  const elementos = document.querySelectorAll('.fade-in');
  if (!elementos.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visivel');
          observer.unobserve(entry.target); /* para de observar após animar */
        }
      });
    },
    { threshold: 0.10 }
  );

  elementos.forEach((el) => observer.observe(el));
}


/* ============================================================
 * 03. COOKIE BANNER RGPD
 *     Mostra o banner se o utilizador ainda não decidiu.
 *     Guarda a decisão em localStorage ('cookies-rgpd').
 *     Possíveis valores: 'aceite' | 'recusado'
 * ============================================================ */
function initCookieBanner() {
  const banner    = document.getElementById('cookie-banner');
  const btnAceitar = document.getElementById('btn-aceitar');
  const btnRejeitar = document.getElementById('btn-rejeitar');

  if (!banner || !btnAceitar || !btnRejeitar) return;

  /* Mostra banner apenas se ainda não houve decisão */
  if (!localStorage.getItem('cookies-rgpd')) {
    setTimeout(() => {
      banner.style.display = 'flex';
      document.body.classList.add('cookie-banner-visivel'); /* afasta o botão de WhatsApp do banner */
    }, 900); /* pequeno delay para não bloquear o render */
  } else {
    banner.style.display = 'none';
  }

  function fecharBanner(decisao) {
    localStorage.setItem('cookies-rgpd', decisao);
    banner.classList.add('oculto');
    document.body.classList.remove('cookie-banner-visivel');
    setTimeout(() => {
      banner.style.display = 'none';
    }, 450); /* aguarda a transição CSS de slide-down */
  }

  btnAceitar.addEventListener('click', () => fecharBanner('aceite'));
  btnRejeitar.addEventListener('click', () => fecharBanner('recusado'));
}


/* ============================================================
 * 04. DATA MÍNIMA — Impede datas passadas no formulário
 *     Aplica-se ao input[type="date"]#data.
 *     Define o atributo min para a data de hoje.
 * ============================================================ */
function initDataMinima() {
  const inputData = document.getElementById('data');
  if (!inputData) return;

  inputData.min = new Date().toISOString().split('T')[0];
}


/* ============================================================
 * 05. URL PARAMS — Pré-seleciona campos de formulário via URL
 *     Exemplos de uso:
 *       reservas.html?massagem=shiatsu
 *       reservas.html?local=feira
 *       nosso-espaco.html?local=esmoriz
 * ============================================================ */
function initUrlParams() {
  const params = new URLSearchParams(window.location.search);

  /* Pré-seleciona tipo de massagem no select */
  const massagem = params.get('massagem');
  if (massagem) {
    const sel = document.getElementById('massagem');
    if (sel) {
      /* Procura a opção que contenha o valor (case-insensitive) */
      Array.from(sel.options).forEach((opt) => {
        if (opt.value.toLowerCase().includes(massagem.toLowerCase())) {
          sel.value = opt.value;
        }
      });
    }
  }

  /* Pré-seleciona espaço no select */
  const local = params.get('local');
  if (local) {
    const selEspaco = document.getElementById('espaco');
    if (selEspaco && (local === 'feira' || local === 'esmoriz')) {
      selEspaco.value = local;
    }
    /* Se for a página nosso-espaco.html, ativa o painel correto */
    if (typeof mostrarEspaco === 'function') {
      mostrarEspaco(local);
    }
  }
}


/* ============================================================
 * 06. FILTROS DE SERVIÇOS — servicos.html
 *     Filtra grupos de cards por categoria (relaxamento /
 *     terapêutica / holística) ou mostra todos.
 *     Cada grupo tem data-grupo="..." e .grupo-servico.
 *     O botão ativo recebe a classe .ativo.
 * ============================================================ */
function initFiltrosServicos() {
  const filtros = document.querySelectorAll('.filtro-btn');
  const grupos  = document.querySelectorAll('.grupo-servico');

  if (!filtros.length || !grupos.length) return;

  filtros.forEach((btn) => {
    btn.addEventListener('click', () => {
      /* Atualiza estado visual dos botões */
      filtros.forEach((b) => b.classList.remove('ativo'));
      btn.classList.add('ativo');

      const categoria = btn.dataset.cat;

      /* Mostra/oculta grupos conforme categoria */
      grupos.forEach((grupo) => {
        const corresponde =
          categoria === 'todos' || grupo.dataset.grupo === categoria;
        grupo.classList.toggle('oculto', !corresponde);
      });
    });
  });
}


/* ============================================================
 * 07. SELETOR DE ESPAÇO — nosso-espaco.html
 *     Alterna entre os painéis Feira e Esmoriz.
 *     Os painéis têm .painel-espaco e .ativo (CSS toggle).
 * ============================================================ */
function initSeletorEspaco() {
  const btnFeira   = document.getElementById('btn-feira');
  const btnEsmoriz = document.getElementById('btn-esmoriz');

  if (!btnFeira || !btnEsmoriz) return;

  function mostrarEspaco(qual) {
    const espacos = ['feira', 'esmoriz'];
    espacos.forEach((id) => {
      const painel = document.getElementById(`espaco-${id}`);
      const btn    = document.getElementById(`btn-${id}`);
      if (painel) painel.classList.toggle('ativo', id === qual);
      if (btn)    btn.classList.toggle('ativo', id === qual);
    });
  }

  /* Expõe a função globalmente para initUrlParams poder chamá-la */
  window.mostrarEspaco = mostrarEspaco;

  btnFeira.addEventListener('click',   () => mostrarEspaco('feira'));
  btnEsmoriz.addEventListener('click', () => mostrarEspaco('esmoriz'));

  /* Estado inicial: Feira ativa */
  mostrarEspaco('feira');
}


/* ============================================================
 * 08. BLOG: FILTROS POR TAG — blog.html
 *     Filtra os artigos visíveis consoante a tag clicada.
 *     Cada artigo tem data-tag="..." no elemento pai .col.
 * ============================================================ */
function initFiltrosBlog() {
  const btnTodos = document.querySelector('.filtro-btn-todos');
  if (!btnTodos) return; /* só existe em blog.html */

  /* Estado inicial: mostra todos os artigos e acerta o contador */
  filtrar('todos', btnTodos);
}


/* ============================================================
 * 09. BLOG: FILTRO POR CATEGORIA — blog.html
 *     Chamada via onclick="filtrar('categoria', this)" no HTML
 *     (botões de filtro e ligações "ver mais" da barra lateral).
 *     Filtra os cartões [data-categoria] e atualiza o contador
 *     e a mensagem de "sem resultados".
 * ============================================================ */
function filtrar(categoria, btnEl) {
  const artigos = document.querySelectorAll('.artigo-card[data-categoria]');
  if (!artigos.length) return;

  let visiveis = 0;
  artigos.forEach((artigo) => {
    const visivel = categoria === 'todos' || artigo.dataset.categoria === categoria;
    artigo.style.display = visivel ? '' : 'none';
    if (visivel) visiveis++;
  });

  /* Estado visual dos botões de filtro */
  document.querySelectorAll('.filtro-btn').forEach((b) => {
    b.classList.remove('ativo', 'active');
    b.setAttribute('aria-pressed', 'false');
  });
  const alvo = btnEl || document.querySelector(`.filtro-btn-${categoria}`);
  if (alvo) {
    alvo.classList.add('ativo');
    alvo.setAttribute('aria-pressed', 'true');
  }

  atualizarContadorBlog(visiveis);

  /* Reaplica o termo de pesquisa, se houver algum já escrito */
  const campoPesquisa = document.getElementById('campo-pesquisa');
  if (campoPesquisa && campoPesquisa.value.trim() !== '') {
    aplicarPesquisaBlog(campoPesquisa.value);
  }
}

function atualizarContadorBlog(visiveis) {
  const contador = document.getElementById('contador-artigos');
  const semResultados = document.getElementById('sem-resultados');
  if (contador) contador.textContent = `${visiveis} artigo${visiveis === 1 ? '' : 's'}`;
  if (semResultados) semResultados.classList.toggle('d-none', visiveis > 0);
}


/* ============================================================
 * 09b. BLOG: PESQUISA POR TEXTO — blog.html
 *     Chamada via onclick="pesquisarArtigos()" no botão de
 *     pesquisa. Filtra os cartões pelo título, dentro da
 *     categoria atualmente selecionada.
 * ============================================================ */
function aplicarPesquisaBlog(termo) {
  const termoLower = termo.toLowerCase().trim();
  const btnAtivo = document.querySelector('.filtro-btn.ativo');
  const categoriaAtiva = btnAtivo
    ? [...btnAtivo.classList].find((c) => c.startsWith('filtro-btn-'))?.replace('filtro-btn-', '') || 'todos'
    : 'todos';
  const artigos = document.querySelectorAll('.artigo-card[data-categoria]');

  let visiveis = 0;
  artigos.forEach((artigo) => {
    const naCategoria = categoriaAtiva === 'todos' || artigo.dataset.categoria === categoriaAtiva;
    const titulo = artigo.querySelector('h2, h3')?.textContent.toLowerCase() || '';
    const correspondeTexto = termoLower === '' || titulo.includes(termoLower);
    const visivel = naCategoria && correspondeTexto;
    artigo.style.display = visivel ? '' : 'none';
    if (visivel) visiveis++;
  });

  atualizarContadorBlog(visiveis);
}

function pesquisarArtigos() {
  const campo = document.getElementById('campo-pesquisa');
  if (!campo) return;
  aplicarPesquisaBlog(campo.value);
}

function initPesquisaBlog() {
  const campo = document.getElementById('campo-pesquisa');
  if (!campo) return; /* só existe em blog.html */

  /* Pesquisa em tempo real e ao premir Enter */
  campo.addEventListener('input', () => aplicarPesquisaBlog(campo.value));
  campo.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') pesquisarArtigos();
  });
}


/* ============================================================
 * 10. CARROSSEL BOOTSTRAP — nosso-espaco.html
 *     Inicializa automaticamente via Bootstrap.
 *     Esta função existe para configurações futuras
 *     (intervalo, controlo programático, etc.)
 * ============================================================ */
function initCarrossel() {
  const carrosseis = document.querySelectorAll('.carousel');
  if (!carrosseis.length) return;

  carrosseis.forEach((el) => {
    /* Configuração: pausa no hover está ativa por defeito no Bootstrap */
    /* Para alterar o intervalo: new bootstrap.Carousel(el, { interval: 5000 }) */
  });
}



/* ============================================================
 * 12. BARRA TOPO TICKER — Scroll automático direita → esquerda
 *     Duplica o conteúdo da .barra-topo para criar um loop
 *     contínuo sem quebra. A animação CSS faz o movimento.
 *     Funciona em todas as páginas automaticamente.
 * ============================================================ */
function initBarraTopo() {
  const barra = document.querySelector('.barra-topo');
  if (!barra) return;

  /* Guarda o conteúdo HTML original */
  const conteudoOriginal = barra.innerHTML.trim();

  /* Cria a faixa deslizante com o conteúdo duplicado */
  /* O conteúdo duplicado garante o loop visual sem salto */
  barra.innerHTML = `
    <div class="barra-topo-track" aria-hidden="false">
      ${conteudoOriginal}${conteudoOriginal}
    </div>`;

  /* Ajusta velocidade: mais texto = animação mais lenta */
  const track = barra.querySelector('.barra-topo-track');
  if (track) {
    const largura = track.scrollWidth;
    /* ~80px por segundo — ajuste conforme preferência */
    const duracao = Math.max(20, largura / 80);
    track.style.animationDuration = `${duracao}s`;
  }
}

/* ============================================================
 * 10b. FORMULÁRIOS — Netlify Forms via AJAX (sem redireccionar)
 *      Aplica-se a qualquer <form data-netlify="true">. Intercepta
 *      o submit, envia os dados em segundo plano para o Netlify
 *      (a mesma conta que já publica o site — sem contas extra)
 *      e mostra a confirmação na própria página — o visitante
 *      NUNCA é levado para o e-mail, o WhatsApp, nem para fora
 *      do site.
 * ============================================================ */
function initFormulariosAjax() {
  const forms = document.querySelectorAll('form[data-netlify="true"]');
  if (!forms.length) return;

  const TEXTOS = {
    a_enviar:  { pt: 'A enviar…',        es: 'Enviando…',            en: 'Sending…' },
    sucesso:   { pt: 'Obrigada pelo teu pedido! Vamos responder por e-mail em breve.',
                 es: '¡Gracias por tu solicitud! Te responderemos por correo pronto.',
                 en: 'Thank you for your request! We\u2019ll reply by email shortly.' },
    erro:      { pt: 'Não foi possível enviar. Tenta novamente ou contacta-nos por WhatsApp.',
                 es: 'No se pudo enviar. Inténtalo de nuevo o contáctanos por WhatsApp.',
                 en: 'Something went wrong. Please try again or reach us on WhatsApp.' },
  };
  const idioma = (typeof obterIdiomaGuardado === 'function') ? obterIdiomaGuardado() : 'pt';
  const t = (chave) => (TEXTOS[chave][idioma] || TEXTOS[chave].pt);

  function codificar(formData) {
    return new URLSearchParams(formData).toString();
  }

  forms.forEach((form) => {
    let msgBox = form.querySelector('.form-mensagem-envio');
    if (!msgBox) {
      msgBox = document.createElement('div');
      msgBox.className = 'form-mensagem-envio';
      msgBox.setAttribute('role', 'status');
      msgBox.setAttribute('aria-live', 'polite');
      form.appendChild(msgBox);
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const honeypotNome = form.getAttribute('netlify-honeypot');
      if (honeypotNome) {
        const honeypotCampo = form.querySelector(`[name="${honeypotNome}"]`);
        if (honeypotCampo && honeypotCampo.value) return;
      }

      const btn = form.querySelector('button[type="submit"]');
      const textoOriginalBtn = btn ? btn.innerHTML : '';
      if (btn) {
        btn.disabled = true;
        btn.classList.add('btn-a-enviar');
        btn.setAttribute('aria-busy', 'true');
      }
      msgBox.className = 'form-mensagem-envio';
      msgBox.textContent = '';

      try {
        const resposta = await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: codificar(new FormData(form)),
        });

        if (resposta.ok) {
          form.reset();
          msgBox.classList.add('sucesso');
          msgBox.textContent = t('sucesso');
        } else {
          throw new Error('O Netlify respondeu com erro');
        }
      } catch (erro) {
        msgBox.classList.add('erro');
        msgBox.textContent = t('erro');
      } finally {
        if (btn) {
          btn.disabled = false;
          btn.classList.remove('btn-a-enviar');
          btn.removeAttribute('aria-busy');
          btn.innerHTML = textoOriginalBtn;
        }
      }
    });
  });
}


/* ============================================================
 * 10c. GALERIA — nosso-espaco.html
 *      Ao clicar numa miniatura, carrega a imagem grande e a
 *      legenda no modal antes de este abrir.
 * ============================================================ */
function initGaleria() {
  const itens = document.querySelectorAll('.galeria-item');
  if (!itens.length) return;

  const modalImg = document.getElementById('galeriaModalImg');
  const modalLegenda = document.getElementById('galeriaModalLegenda');

  itens.forEach((item) => {
    item.addEventListener('click', () => {
      const src = item.dataset.img;
      const legenda = item.dataset.legenda || '';
      if (modalImg) {
        modalImg.src = src;
        modalImg.alt = legenda;
      }
      if (modalLegenda) {
        modalLegenda.textContent = legenda;
      }
    });
  });
}


/* ============================================================
 * 10d. GRELHA DE VÍDEOS — homepage
 *      Ao clicar numa miniatura, carrega o vídeo certo no popup
 *      e começa a reproduzir; ao fechar o popup, para o vídeo
 *      (para não ficar áudio a tocar em fundo).
 * ============================================================ */
/* ============================================================
 * 10e. PARTILHA SOCIAL — artigos de blog
 *      Constrói os links de partilha com o URL e título reais
 *      da página atual (evita ter de escrever o link à mão
 *      em cada um dos 8 artigos).
 * ============================================================ */
/* ============================================================
 * 10f. CONTADORES ANIMADOS — estatísticas da homepage
 *      Os números sobem de 0 até ao valor real quando entram
 *      no ecrã, uma única vez.
 * ============================================================ */
function initContadores() {
  const numeros = document.querySelectorAll('.stat-num[data-target]');
  if (!numeros.length) return;

  const DURACAO = 1400; /* ms */

  const animar = (el) => {
    const alvo = parseInt(el.dataset.target, 10);
    const prefixo = el.dataset.prefixo || '';
    const inicio = performance.now();

    const passo = (agora) => {
      const progresso = Math.min((agora - inicio) / DURACAO, 1);
      /* easing suave (ease-out cubic) — acelera e desacelera, não é linear */
      const suavizado = 1 - Math.pow(1 - progresso, 3);
      const valorAtual = Math.round(suavizado * alvo);
      el.textContent = prefixo + valorAtual;
      if (progresso < 1) requestAnimationFrame(passo);
    };
    requestAnimationFrame(passo);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animar(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  numeros.forEach((el) => observer.observe(el));
}


function initPartilhaSocial() {
  const wa = document.querySelector('.btn-partilha-wa');
  const fb = document.querySelector('.btn-partilha-fb');
  if (!wa && !fb) return;

  const url = window.location.href;
  const titulo = document.querySelector('h1')?.textContent.trim() || document.title;
  const textoWa = encodeURIComponent(`${titulo} — ${url}`);
  const urlCodificado = encodeURIComponent(url);

  if (wa) wa.href = `https://wa.me/?text=${textoWa}`;
  if (fb) fb.href = `https://www.facebook.com/sharer/sharer.php?u=${urlCodificado}`;
}


function initVideoGrid() {
  const itens = document.querySelectorAll('.video-item');
  if (!itens.length) return;

  const modalEl = document.getElementById('modalVideo');
  const player = document.getElementById('videoModalPlayer');
  const legenda = document.getElementById('videoModalLegenda');

  itens.forEach((item) => {
    item.addEventListener('click', () => {
      const src = item.dataset.video;
      const titulo = item.dataset.titulo || '';
      if (player) {
        player.src = src;
        player.play().catch(() => {});
      }
      if (legenda) {
        legenda.textContent = titulo;
      }
    });
  });

  if (modalEl && player) {
    modalEl.addEventListener('hidden.bs.modal', () => {
      player.pause();
      player.removeAttribute('src');
      player.load();
    });
  }
}


/* ============================================================
 * 11. INIT — Ponto de entrada
 *     Todas as funções são chamadas aqui.
 *     As que não encontram os seus elementos no DOM
 *     retornam silenciosamente, pelo que é seguro chamar
 *     este ficheiro em todas as páginas.
 * ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initBarraTopo();        /* todas as páginas */
  initNavbarScroll();     /* todas as páginas */
  initBtnTopo();          /* todas as páginas */
  initFadeIn();           /* todas as páginas */
  initCookieBanner();     /* todas as páginas */
  initDataMinima();       /* index.html, reservas.html */
  initUrlParams();        /* reservas.html, nosso-espaco.html */
  initFiltrosServicos();  /* servicos.html */
  initSeletorEspaco();    /* nosso-espaco.html */
  initFiltrosBlog();      /* blog.html */
  initPesquisaBlog();     /* blog.html */
  initCarrossel();        /* nosso-espaco.html */
  initFormulariosAjax();  /* index.html, reservas.html, contactos.html */
  initGaleria();           /* nosso-espaco.html */
  initVideoGrid();         /* index.html */
  initPartilhaSocial();    /* artigos de blog */
  initContadores();        /* homepage */
});
