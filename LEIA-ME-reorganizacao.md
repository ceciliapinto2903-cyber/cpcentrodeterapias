# CP Centro de Terapias — Reorganização da estrutura (v2)

Reorganização incremental do projecto, conforme a abordagem de "Tech Lead" definida: manter a simplicidade da base existente, sem fragmentação desnecessária de CSS/JS, mas com fundações mais profissionais e escaláveis.

## O que mudou

### 1. Pasta `assets/`
Todos os recursos estáticos passaram a viver dentro de `assets/`, em vez de soltos na raiz:

```
assets/
├── css/estilo.css
├── js/ (i18n.js, i18n-dict.js, main.js)
├── images/
│   ├── hero/       → imagens de fundo das secções hero
│   ├── gallery/     → imagens gerais de tratamentos e espaço
│   ├── team/        → foto da Cecília
│   ├── logos/       → monograma SVG + logomarca PNG
│   └── blog/        → imagens usadas nos artigos
├── videos/ + videos/posters/
├── icons/           → favicons gerados
└── fonts/           → pasta preparada (actualmente usa Google Fonts via CDN)
```

CSS e JS **não foram fragmentados** em múltiplos ficheiros — o projecto ainda é pequeno o suficiente para que um `estilo.css` e um `main.js` sejam mais fáceis de manter do que 10 ficheiros pequenos. Isto pode ser revisto quando o volume de código justificar.

### 2. Nomes de ficheiros normalizados
- Todos em minúsculas, com hífen como separador (sem `_`).
- Corrigidos: `Ayurvedra.jpg` → `massagem-ayurvedica.jpg`, `medica_stres_trabalho` → `medica-stress-trabalho`, `mao_de_terapeuta_aplicar_precao_Images.jpg` → `mao-de-terapeuta-aplicar-pressao.jpg`.
- Nomes já descritivos foram mantidos (evitar renomeações desnecessárias que não trazem ganho de SEO).

### 3. Favicon completo + manifest
Gerados automaticamente a partir do logótipo (`logomarca-cp-centro-terapias.png`):
- `favicon.ico`, `favicon-16.png`, `favicon-32.png`, `apple-touch-icon.png`, `android-chrome-192.png`, `android-chrome-512.png`
- `site.webmanifest` na raiz, com a cor de marca `#5C4033` (castanho chocolate, já usada no CSS).

### 4. `robots.txt` e `sitemap.xml`
Já existiam e foram mantidos sem alterações (estavam correctos).

### 5. Estrutura preparada para crescimento
Criada a pasta `downloads/` (vazia, pronta a receber PDFs/ebooks quando surgirem), sem criar pastas mortas para funcionalidades que ainda não existem (blog, reservas, newsletter) — essas serão criadas apenas quando forem efectivamente desenvolvidas, para não haver código morto.

## O que NÃO foi feito (propositadamente)
- **Conversão para WebP**: recomendável, mas implica decidir qualidade/compressão e testar visualmente cada imagem — proponho fazer isto numa segunda fase dedicada, com a Cecília a validar o resultado visual antes de substituir os `.jpg` originais.
- **`security.txt` / `humans.txt`**: opcionais, de baixo impacto para um site institucional deste porte — posso adicionar se for pedido.
- **Auto-hospedagem das fontes Google**: actualmente via CDN (`fonts.googleapis.com`), consistente com o CSP definido em `_headers`. Mudar para self-hosted é uma optimização de performance à parte.

## Validações efectuadas
- ✅ Todas as referências de imagem, vídeo, CSS e JS foram actualizadas em `index.html`, `pages/*.html`, `pages/blog/*.html` e `assets/css/estilo.css`.
- ✅ Verificação automática: zero ligações quebradas a ficheiros estáticos.
- ✅ Verificação automática: zero links de navegação quebrados entre páginas.
- ✅ Nenhuma referência residual às pastas antigas (`imagens/`, `css/`, `js/` na raiz).

## Regra a aplicar em todos os projectos futuros
A partir de agora, esta estrutura (`assets/{css,js,images/subpastas,icons,fonts,videos}`, nomes de ficheiro em kebab-case, favicon completo + manifest, `robots.txt`/`sitemap.xml` na raiz) passa a ser o ponto de partida padrão para qualquer novo projecto ou reorganização dentro da Equipa 360º.

---

## Atualização — Limpeza final da raiz (v3)

A pedido, a raiz do projeto ficou reduzida ao estritamente necessário:

```
/
├── index.html            ← página principal, sempre na raiz
├── robots.txt             ← exigido na raiz (motores de busca)
├── sitemap.xml             ← exigido na raiz (motores de busca)
├── site.webmanifest        ← manifest PWA/ícones
├── favicon.ico              ← lido automaticamente pelo browser em /favicon.ico
├── _headers                  ← configuração do Cloudflare Pages
├── assets/                    ← todos os recursos estáticos (css, js, images, videos, icons, fonts, downloads)
└── pages/                      ← todas as páginas secundárias, incluindo blog/
```

### O que mudou nesta fase
- `politica-privacidade.html` e `termos-utilizacao.html` mudaram de `/` para `/pages/`. Todas as ligações internas (index, páginas de 1º e 2º nível, footer, aviso de cookies) e as `canonical`/`sitemap.xml` foram atualizadas em conformidade.
- `downloads/` (vazia, reservada a PDFs/ebooks futuros) passou de `/` para `/assets/downloads/`, por ser um recurso estático como os restantes.
- Verificação automática: zero ligações locais quebradas em todo o site após a mudança.

Com isto, a raiz só contém ficheiros que **têm de estar** na raiz por convenção técnica (SEO, PWA, browser, hosting); tudo o resto vive dentro de `assets/` ou `pages/`.
