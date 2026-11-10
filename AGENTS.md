# AGENTS.md — Orto Centro

Instruções permanentes para qualquer agente de IA que trabalhe neste repositório.
Leia este arquivo antes de alterar código e siga todas as regras abaixo em todas as tarefas.

---

## 1. Contexto do projeto

- **O que é:** catálogo online da Orto Centro, loja de produtos de saúde, apoio e acessibilidade.
- **O que não é:** não é e-commerce. Não existe carrinho, checkout, pagamento, promoção, cupom, desconto, parcelamento, frete grátis, urgência ou “compre agora”.
- **Objetivo:** apresentar os produtos de forma intuitiva e interativa para que o cliente encontre sozinho o que precisa, sem ter que ligar para a loja toda vez.
- **Público:** idosos, pessoas com mobilidade reduzida, cuidadores e familiares. Priorize clareza, legibilidade e previsibilidade.
- **Stack:** React 19 + TypeScript + Vite 8 + Tailwind CSS v4 no front-end; PHP + SQLite no back-end.
- **Idioma:** todo texto de interface, conteúdo, comentários de produto e mensagens devem estar em português do Brasil.
- **Rotas atuais:** `/` (home), `/categoria/:categoryName`, `/produto/:id`, `/admin`.

### Comandos

```bash
npm install
npm run dev        # Vite em http://localhost:5173
npm run typecheck  # tsc -b --noEmit
npm run lint       # eslint .
npm run build      # tsc -b && vite build
```

O Vite faz proxy de `/api` para `http://localhost:8000` (back-end PHP).
Nunca edite `dist/`, `node_modules/` ou `backend/data/catalog.sqlite` manualmente sem que a tarefa peça isso explicitamente.

---

## 2. Referências visuais e princípios

Referências: **DJI, Patagonia, Nothing, Tesla**. Extraia os princípios, não copie layouts.

- Muito espaço em branco e respiro entre seções.
- Poucos elementos por seção; cada seção tem uma ideia principal.
- Tipografia grande é a protagonista; o texto deve ser legível antes de ser “estiloso”.
- Animação sutil, curta e funcional. Nada de efeito chamativo competindo com o produto.
- Cores usadas com disciplina: neutros dominam; azul e verde aparecem só como acento.
- Produto e informação primeiro; contato e marca depois.
- Interface previsível: mesmos cards, mesmos rótulos, mesmos padrões em todas as páginas.

---

## 3. Regras obrigatórias de design

### 3.1 Cores da marca

Manter a paleta atual:

- **Azul da marca:** família `sky`/`blue` (referência atual: `sky-500`/`sky-600`).
- **Verde da marca:** família `green` (referência atual: `green-500`/`green-600`).
- **Neutros:** branco, preto e escala `neutral` (cinzas) para superfícies, texto e bordas.
- **Vermelho:** apenas para erros de sistema. Nunca como cor de marca ou destaque comercial.

Regras de uso:

- Azul e verde somente em **destaques pequenos**: botões, rótulos pequenos, links, hover, foco, ícones e detalhes.
- **Nunca** usar azul ou verde em blocos grandes de texto, títulos enormes ou parágrafos inteiros.
- Títulos grandes e corpo de texto usam `neutral-900`/`white` (claro/escuro) ou `neutral-100`/`neutral-300`.
- Não criar novas cores de marca, gradientes coloridos, glows ou neon.
- Não usar cor como único indicador de estado; sempre acompanhar de texto, ícone ou rótulo.
- Contraste mínimo **WCAG AA**:
  - texto normal: **4.5:1**;
  - texto grande (≥ 24px, ou ≥ 18.66px em negrito): **3:1**;
  - componentes de interface, bordas de foco e ícones informativos: **3:1**.
- Em fundo branco, para texto pequeno em azul/verde, use tons mais escuros (`sky-700`/`green-700` ou mais escuros) e confira o contraste. `sky-500`/`green-500` são acentos, não texto pequeno.
- Em botão com fundo azul/verde e texto branco, confira 4.5:1; prefira `sky-700`/`green-700` ou mais escuros.
- No tema escuro, use tons claros (`sky-300`/`green-300`) e confira o contraste novamente.
- O nome “Orto Centro” no hero pode ser grande, mas deve ser neutro/branco. Se quiser um acento de marca, use um detalhe pequeno (ponto, linha, rótulo), não o texto inteiro em azul/verde.

### 3.2 Design tokens

Todos os valores de design devem ser tokens reutilizáveis, definidos em `src/index.css` (via `@theme` do Tailwind v4 para o que gera utilitários, e/ou `:root` para CSS puro). Componentes não devem conter valores mágicos.

**Proibido em componentes/páginas:**

- Hex, `rgb()` ou `hsl()` soltos: use `var(--color-*)` ou a paleta Tailwind.
- Tamanhos de fonte arbitrários: `text-[2.5rem]`, `text-[11px]`.
- Espaçamentos arbitrários: `py-[70px]`, `mt-[38px]`.
- Durações arbitrárias: `duration-[450ms]`.
- `clamp()` repetido em cada arquivo: use o token correspondente.
- `border-radius` solto: use `rounded-card`, `rounded-button` ou `var(--radius-*)`.

**Permitido:** utilitários da escala padrão do Tailwind (`p-4`, `gap-6`, `rounded-2xl`), pois já são tokens do sistema. Valores calculados em runtime (posição de carrossel, progresso de scroll, coordenadas de mouse) podem ser inline; eles não são decisões de design.

Contrato mínimo de tokens (implementar/expandir em `src/index.css`):

```css
:root {
  /* Cor */
  --color-brand-blue: #0ea5e9;       /* acento */
  --color-brand-blue-ink: #0369a1;   /* texto/link com AA no claro */
  --color-brand-green: #22c55e;      /* acento */
  --color-brand-green-ink: #15803d;  /* texto/link com AA no claro */
  --color-ink: #171717;
  --color-ink-muted: #525252;
  --color-surface: #ffffff;
  --color-surface-muted: #f5f5f5;
  --color-border: #e5e5e5;
  --color-focus: #0369a1;

  /* Layout */
  --content-max: 80rem;
  --page-gutter: clamp(1rem, 4vw, 2rem);
  --section-y: clamp(80px, 12vw, 160px);

  /* Raios */
  --radius-card: 1rem;
  --radius-card-lg: 1.5rem;
  --radius-button: 0.75rem;
  --radius-pill: 9999px;

  /* Tipografia */
  --text-body: 1.0625rem; /* 17px */
  --text-body-lg: clamp(1.125rem, 1.5vw, 1.25rem);
  --text-label: 0.875rem;
  --text-h3: clamp(1.25rem, 2vw, 1.5rem);
  --text-h2: clamp(2rem, 4vw, 3rem);
  --text-h1: clamp(2.5rem, 6vw, 4.5rem);
  --text-display: clamp(3rem, 9vw, 7rem);
  --leading-tight: 1.1;
  --leading-body: 1.6;
  --leading-relaxed: 1.7;

  /* Movimento */
  --duration-fast: 150ms;
  --duration-base: 250ms;
  --duration-slow: 400ms;
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);

  /* Acessibilidade */
  --tap-min: 44px;
  --focus-ring-width: 2px;
  --focus-ring-offset: 3px;
}
```

Utilitários de projeto recomendados:

```css
.section-y {
  padding-block: var(--section-y);
}

.page-gutter {
  padding-inline: var(--page-gutter);
}

.focus-ring:focus-visible {
  outline: var(--focus-ring-width) solid var(--color-focus);
  outline-offset: var(--focus-ring-offset);
}

.tap-target {
  min-width: var(--tap-min);
  min-height: var(--tap-min);
}
```

Regras adicionais:

- `--text-body` é 17px e é o padrão para corpo de texto. Defina `--text-base` como 17px no `@theme` se for usar `text-base`.
- `text-sm` (14px) só para metadados não essenciais, com contraste AA.
- `text-xs` só para rótulos pequenos com tracking; nunca para informação principal.
- Line-height do corpo: entre 1.5 e 1.7. Largura de linha: ~60–70ch.
- Não desative zoom do usuário; use `rem`, não `px` fixo em texto.
- Raios: cards usam `--radius-card`; cards grandes/editoriais podem usar `--radius-card-lg`; botões usam `--radius-button`; pills usam `--radius-pill`.
- Sombras: use tokens (`--shadow-card`, `--shadow-card-hover`) ou sombras padrão do Tailwind; nada de sombra pesada/colorida.
- Durações de animação: `--duration-fast` para hover/foco, `--duration-base` para transições de estado, `--duration-slow` para entradas. Nada acima de ~500ms.

### 3.3 Espaçamento de seções

- Toda seção de conteúdo usa **exatamente** `padding-block: clamp(80px, 12vw, 160px)`, via `--section-y` / `.section-y`.
- Não use `py-8`, `py-16`, `mt-24` etc. para o respiro vertical de uma seção. Use o token.
- Header, hero e footer podem ter paddings próprios, mas também devem usar tokens (`--page-gutter`, `--duration-*`, etc.).
- O ritmo vertical deve ser consistente entre home, categoria, produto e páginas futuras.
- Em mobile (390px), o espaçamento de seção continua confortável; não reduza abaixo de 80px.

### 3.4 Cards: um único estilo de produto e um único de categoria

**Card de produto — fonte única:**

- Use sempre `src/components/catalog/CatalogProductCard.tsx`.
- Não criar `FeaturedProductCard`, `ProductCardSmall`, `ProductCardHome` ou variações visuais.
- O mesmo card deve ser usado na home, na listagem de categoria, em busca/filtros e em qualquer vitrine.
- Estrutura visual única: mídia com proporção fixa (`aspect-ratio`), categoria (rótulo pequeno), nome, metadados e preço/“Consulte disponibilidade”.
- O card inteiro deve ser um link acessível (`<Link>`), não um `<article onClick>`. Não aninhe botão dentro de link; se houver CTA, use uma área separada ou a técnica de link esticado com cuidado.
- Hover pode ter elevação sutil, mudança de borda ou zoom discreto na imagem (até ~1.05). Nada de glow, spotlight, pixel ou efeito 3D.

**Card de categoria — fonte única:**

- Criar/reutilizar um único `src/components/catalog/CategoryCard.tsx` quando houver card de categoria.
- O card inline de categoria que existe hoje na home deve ser extraído para esse componente e reutilizado.
- Estrutura única: imagem quadrada, nome, subtítulo curto e link. O visual não deve mudar entre home e outras páginas.
- O overlay “Ver” no hover não pode ser a única affordance; o card precisa ser focável e legível no teclado. Prefira nome/subtítulo sempre visíveis.

**Cards administrativos** (`components/admin/*`) são UI interna e não contam como card de produto/categoria, mas ainda devem usar tokens, contraste e foco visível.

### 3.5 Efeitos: no máximo 2 no site inteiro

Efeitos aprovados:

1. **`FadeContent`** — entrada suave de seções ao entrar na viewport. Use uma vez por seção, deslocamento máximo de ~12px, sem blur, duração de `--duration-slow` e `prefers-reduced-motion` respeitado.
2. **`Carousel`** — único componente de carrossel do site. Use para navegação de produtos/categorias, com um único tipo de transição (prefira `fade` ou `scale`), setas e indicadores acessíveis, teclado e arraste. Prefira **sem autoplay**; se usar, ele deve pausar em hover/foco e ser desativado com `prefers-reduced-motion`.

Não usar em código novo (e remover ao tocar nos arquivos que ainda usam):

- `SplitText`
- `BorderGlow`
- `SpotlightCard`
- `PixelCard`
- `SpecularButton`

Regras:

- Não combinar efeitos no mesmo elemento/seção.
- Não adicionar bibliotecas de animação novas sem necessidade comprovada.
- O `Carousel` é um componente funcional de navegação; não o trate como um terceiro efeito decorativo. Ainda assim, use apenas uma variante visual em todo o site.
- O hero deve priorizar tipografia estática e legível. Ao tocar no `Hero`, substitua o `SplitText` por texto normal com tokens de tipografia.

### 3.6 Acessibilidade (prioridade máxima)

O público inclui idosos e cuidadores. Acessibilidade não é opcional.

- **Contraste:** WCAG AA em texto, ícones e foco, tanto no tema claro quanto no escuro.
- **Fonte base:** corpo de texto com no mínimo **17px** (`--text-body`). Não use textos essenciais em 12–13px.
- **Alvos de toque:** todo link, botão, ícone clicável, pill, seta de carrossel e item de navegação deve ter área mínima de **44 × 44px** (`--tap-min`). Links de texto podem ampliar a área com padding.
- **Foco visível:** use `:focus-visible` com anel de 2px, offset de 3px e cor de contraste. Nunca `outline: none` sem substituto visível. Garanta que o anel não seja cortado por `overflow-hidden`.
- **Teclado:** toda funcionalidade deve funcionar sem mouse. Ordem de tabulação lógica, sem armadilhas de foco, `Escape` fecha menus/modais, setas navegam no carrossel.
- **Semântica:** um `<h1>` por página, hierarquia de headings correta, landmarks (`header`, `nav`, `main`, `footer`), `<button>` para ações e `<a>`/`<Link>` para navegação.
- **Formulários:** todo campo com `<label>` associado, mensagens de erro claras, `aria-live` para resultados dinâmicos.
- **Imagens:** `alt` em todas as imagens informativas. `alt=""` + `aria-hidden="true"` apenas para imagens decorativas. O alt deve descrever o produto, não repetir “imagem de”.
- **Movimento:** respeitar `prefers-reduced-motion: reduce`; desligar animações, autoplay, parallax e transições de transformação. Inclua fallback global em CSS.
- **Conteúdo:** linguagem simples, frases curtas, sem jargão. Não dependa de hover para informação essencial.
- **Teste:** navegue por teclado, teste zoom de 200%, teste em leitor de tela quando possível e verifique contraste.

Fallback global recomendado:

```css
@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 3.7 Mobile first

- Projete primeiro para **390px** de largura; depois adapte para 768px e 1280px.
- Use breakpoints `min-width`; não esconda informação essencial no mobile.
- Sem rolagem horizontal na página. Tabelas e carrosséis podem rolar dentro do próprio contêiner.
- Cards em uma coluna no mobile; grid de 2+ colunas só quando houver espaço real.
- Áreas de toque de 44px, tipografia legível e espaçamento generoso também no mobile.
- Prefira `100svh` a `100vh`. Evite `background-attachment: fixed` no mobile por causa de performance e jank.
- Teste mentalmente em 390px antes de considerar a tarefa concluída.

### 3.8 Imagens e placeholders

- As imagens atuais são **placeholders**. Não otimize layout, recorte ou composição para elas.
- O layout deve funcionar com qualquer imagem usando `aspect-ratio`, `object-fit: cover` e dimensões estáveis.
- **Imagens de marketing/categorias/editorial** devem ficar em um arquivo de dados fácil de trocar, por exemplo `src/data/home.ts` ou `src/data/images.ts`, com `src`, `alt`, `width` e `height`. Não hardcode caminhos de imagem em componentes/páginas.
- **Imagens de produto** vêm da API (`image_url`, `image_url_2`, `image_url_3`) e são gerenciadas pelo admin/back-end. Não hardcode caminhos de produto em componentes.
- Não use URLs externas (Unsplash etc.) em componentes; se forem placeholders, coloque-as no arquivo de dados e troque por imagens locais quando possível.
- Use `loading="lazy"` e `decoding="async"` em imagens abaixo da dobra; a imagem principal/LCP pode ser `eager` com prioridade.
- Sempre defina `alt` no arquivo de dados ou no dado do produto.
- Fallback padronizado quando não houver imagem: bloco neutro com `Icon name="tools"` (ou ícone adequado) e texto acessível; nunca deixe um `<img>` quebrado.

### 3.9 Experiência do catálogo

O site deve permitir que o cliente encontre e entenda o produto sem ligar para a loja.

- **Home:** hero claro, categorias visíveis, produtos em destaque e um caminho óbvio para o catálogo completo.
- **Categoria:** breadcrumb, título, contagem de produtos, filtros de subcategoria quando existirem e grid com o card único de produto.
- **Produto:** galeria de imagens, nome, categoria/subcategoria, descrição curta, marca, tamanhos, descrição completa, especificações técnicas, preço ou “Consulte disponibilidade” e CTA de contato oficial.
- **Estados:** carregamento, erro e vazio devem ser explícitos, com texto útil e ação de recuperação (tentar novamente, voltar, limpar filtros). Reutilize `CatalogEmptyState` quando possível.
- **Filtros:** devem refletir na URL, ter estado selecionado visível, opção “Todos” e um jeito fácil de limpar. Resultados dinâmicos usam `aria-live` para leitores de tela.
- **Sem becos sem saída:** toda página tem Header/Footer e um caminho de volta (breadcrumb ou link para o catálogo).
- **Nada de hover-only:** informações essenciais (nome, categoria, preço/fallback, CTA) sempre visíveis e focáveis.
- **Contato como apoio:** WhatsApp/telefone aparecem como alternativa, não como único caminho para descobrir o produto.

---

## 4. Preço e “Consulte disponibilidade”

- O catálogo **não vende online**. O preço é informativo quando existir.
- Poucos produtos terão preço. O campo de preço ainda não existe no tipo `Product`/back-end atuais; quando for adicionado, deve ser **opcional e anulável** (`price?: number | null`).
- **Com preço:** formatar em BRL com `Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })`. Exibir de forma discreta no card e no detalhe.
- **Sem preço:** exibir exatamente **“Consulte disponibilidade”**, sem variações como “Sob consulta”, “Preço a combinar”, “—”, “R$ 0,00” ou “Ligue para saber”.
- O fallback deve ser um texto/rótulo padronizado e reutilizável (idealmente um componente `ProductPrice`). Se for um link, o texto do link deve ser “Consulte disponibilidade” e ele deve levar ao contato oficial (`contact.whatsappHref` ou `contact.phoneHref` em `src/data/sections.ts`).
- Nunca invente preços, descontos, parcelas, frete ou disponibilidade.
- Não criar selos de promoção, contagem regressiva, “últimas unidades” ou qualquer pressão comercial.
- Não usar “Comprar”, “Adicionar ao carrinho” ou “Finalizar compra”. Use “Ver detalhes”, “Falar com a loja”, “Consultar disponibilidade” quando fizer sentido.

---

## 5. Mapa do projeto e componentes existentes

```text
src/
  components/
    bits/        # efeitos; aprovados: FadeContent e Carousel
    catalog/     # CatalogProductCard, CatalogEmptyState; CategoryCard (a criar)
    layout/      # Header, Footer, Hero
    ui/          # Icon
    admin/       # UI interna do painel
  context/       # CatalogContext (produtos, categorias, filtros)
  data/          # sections.ts (contato/links); centralizar imagens/conteúdo aqui
  hooks/         # useTheme
  lib/           # adminSession
  pages/         # HomePage, CategoryPage, ProductDetailPage, AdminPage
  services/      # api.ts (fetch do back-end PHP)
  types/         # product.ts
  index.css      # tokens globais, Tailwind, animações
backend/
  index.php      # API REST PHP
  database.php   # conexão SQLite
  data/          # catalog.sqlite (não editar manualmente)
public/
  images/        # imagens locais/placeholder
  uploads/       # imagens enviadas pelo admin
```

Reutilize:

- `CatalogProductCard` para qualquer produto.
- `CatalogEmptyState` para estados vazios do catálogo.
- `Header`/`Footer` como layout global.
- `Icon` para ícones (já tem `aria-hidden`).
- `contact` e `sectionLinks` de `src/data/sections.ts`.
- `useCatalog`/`CatalogContext` para dados de produto.
- `services/api.ts` para chamadas; não duplique `fetch`.

API atual (via proxy `/api`):

- `GET /products` — produtos ativos (público).
- `GET /products/all` — todos (autenticado).
- `POST /products` — criar (autenticado).
- `PUT /products/:id` — atualizar (autenticado).
- `DELETE /products/:id` — excluir (autenticado).
- Autenticação por Bearer/Basic; nunca hardcode o token no front-end nem exponha `.env`.

---

## 6. Estado atual e dívida técnica a corrigir ao tocar

Não faça refatoração em massa sem pedido, mas corrija estes pontos quando a tarefa passar pelo arquivo:

- Tokens de design ainda não estão centralizados; `src/index.css` tem apenas fonte e animações. Migrar valores para tokens ao editar.
- `CatalogProductCard` usa `<article onClick>` — não é acessível por teclado. Transformar em link/foco acessível.
- `HomePage` tem `FeaturedProductCard` duplicando o card de produto e um card de categoria inline. Consolidar em `CatalogProductCard` e `CategoryCard`.
- `HomePage` usa `SplitText` no hero e um `<h2>` grande em azul. Migrar para texto estático neutro e efeitos aprovados.
- Imagens de categoria, bento e hero estão hardcoded na `HomePage` (algumas externas). Mover para `src/data/home.ts`/`images.ts`.
- Muitos valores arbitrários (`text-[11px]`, `tracking-[0.22em]`, `min-h-[320px]`, `py-8`, etc.). Substituir por tokens/escala.
- Preço ainda não existe em `Product`/API; implementar como opcional e com o fallback padronizado quando a tarefa pedir.
- Carrossel da home usa autoplay; avaliar remoção ou pausa acessível.
- Pills da navegação mobile e alguns botões podem ter menos de 44px de altura; corrigir ao tocar.
- O hero usa `bg-fixed`; evitar no mobile.
- Revisar contrastes de `sky-600`/`green-600` em texto pequeno sobre branco; usar tons `-700` ou mais escuros.

---

## 7. Fluxo de trabalho obrigatório

Antes de alterar:

1. Leia este `AGENTS.md` e os arquivos diretamente relacionados à tarefa.
2. Rode `git status` e preserve alterações existentes do usuário.
3. Procure componentes, tokens e utilitários existentes antes de criar qualquer coisa.
4. Se precisar de um padrão novo, verifique se ele já existe em `components/`, `data/`, `hooks/` ou `services/`.
5. Planeje a menor mudança possível que cumpra a tarefa.

Durante:

- Reutilize. Não duplique componentes. Se um padrão aparece duas vezes, extraia para um componente compartilhado.
- Não crie variações visuais de card de produto/categoria.
- Mantenha o escopo: não reformate arquivos inteiros, não renomeie coisas sem necessidade, não adicione dependências sem justificar.
- Preserve o comportamento existente, salvo quando a tarefa pedir mudança.
- Não altere o back-end, o banco ou o admin sem necessidade.
- Não edite arquivos gerados (`dist/`).
- Não use comandos git destrutivos (`reset --hard`, `checkout --`, `clean -fd`) sem confirmação explícita.

Depois de alterar:

1. Rode `npm run typecheck`, `npm run lint` e `npm run build`.
2. Verifique manualmente (ou mentalmente, no mínimo) em 390px, 768px e 1280px.
3. Teste navegação por teclado, foco visível, contraste e `prefers-reduced-motion`.
4. Confirme que não há rolagem horizontal.
5. Liste **todos os arquivos alterados** na resposta final.
6. Informe o que foi verificado e qualquer pendência/limitação.

---

## 8. Checklist de conclusão

- [ ] Usei apenas as cores da marca como acento, sem blocos grandes de azul/verde.
- [ ] Usei tokens para espaçamento, raios, tipografia, movimento e foco; não deixei valores soltos.
- [ ] Seções usam `--section-y` (`clamp(80px, 12vw, 160px)`).
- [ ] Existe um único estilo de card de produto e um único de categoria, reutilizados.
- [ ] Usei no máximo `FadeContent` + `Carousel`; não usei `SplitText`, `BorderGlow`, `SpotlightCard`, `PixelCard` nem `SpecularButton`.
- [ ] Contraste WCAG AA no claro e no escuro.
- [ ] Corpo de texto com pelo menos 17px.
- [ ] Alvos de toque com pelo menos 44 × 44px.
- [ ] Foco visível no teclado e navegação completa por teclado.
- [ ] Todas as imagens têm `alt` adequado (ou decorativo marcado).
- [ ] `prefers-reduced-motion` desliga animações/autoplay/parallax.
- [ ] Layout testado mentalmente em 390px e sem rolagem horizontal.
- [ ] Imagens de marketing em arquivo de dados; imagens de produto vêm da API.
- [ ] Preço ausente mostra exatamente “Consulte disponibilidade”.
- [ ] Nenhum componente duplicado e nenhum preço/promoção inventado.
- [ ] `npm run typecheck`, `npm run lint` e `npm run build` passam.
- [ ] Listei os arquivos alterados na resposta final.

---

## 9. O que nunca fazer

- Criar carrinho, checkout, pagamento, cupom, promoção, desconto, urgência ou qualquer mecânica de e-commerce.
- Inventar preço, disponibilidade, marca, medida ou especificação.
- Usar azul/verde em parágrafos ou títulos grandes.
- Usar `outline: none` sem um foco visível equivalente.
- Usar `onClick` em elemento não interativo para navegação.
- Usar hover como única forma de acessar informação essencial.
- Usar `text-xs`/`text-sm` para conteúdo principal.
- Usar valores mágicos de design em componentes.
- Criar uma segunda versão visual do card de produto ou de categoria.
- Adicionar efeitos novos ou combinar os efeitos existentes.
- Hardcodar imagens de marketing ou URLs externas em páginas/componentes.
- Expor token de API, credenciais ou dados do `.env`.
- Editar `dist/`, `node_modules/` ou o SQLite manualmente sem pedido.
- Fazer refatoração ampla não solicitada.
