---
name: Header
description: Mesa de operações pessoal contínua, editorial e precisa.
colors:
  light-canvas: "#efede5"
  light-surface: "#f7f5ed"
  light-ink: "#1b1c19"
  light-muted: "#6e6f68"
  light-divider: "rgb(27 28 25 / 0.14)"
  light-soft: "#e6e2d8"
  dark-canvas: "#0d0e0d"
  dark-surface: "#141513"
  dark-ink: "#f1efe7"
  dark-muted: "#999a92"
  dark-divider: "rgb(241 239 231 / 0.13)"
  dark-soft: "#20211e"
  accent-coral: "#ed6846"
  accent-violet: "#8268d8"
  accent-ocean: "#2877bb"
  accent-jade: "#218a78"
  accent-amber: "#c68024"
  accent-berry: "#b35382"
  accent-contrast-dark: "#171713"
  destructive: "#bd3e45"
typography:
  display:
    fontFamily: "Newsreader, Georgia, serif"
    fontSize: "clamp(32px, 4vw, 50px)"
    fontWeight: 520
    lineHeight: 1.08
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Newsreader, Georgia, serif"
    fontSize: "30px"
    fontWeight: 540
    letterSpacing: "-0.04em"
  title:
    fontFamily: "Newsreader, Georgia, serif"
    fontSize: "17px"
    fontWeight: 590
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Segoe UI Variable Text, Segoe UI, ui-sans-serif, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    letterSpacing: "-0.012em"
  label:
    fontFamily: "Segoe UI Variable Text, Segoe UI, ui-sans-serif, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 620
rounded:
  indicator: "2px"
  icon: "8px"
  field: "9px"
  control: "10px"
  banner: "12px"
  shell: "14px"
  circle: "50%"
spacing:
  micro: "6px"
  compact: "9px"
  control: "10px"
  row: "14px"
  section: "20px"
  panel: "28px"
  gutter: "38px"
components:
  button-primary:
    backgroundColor: "{colors.accent-coral}"
    textColor: "{colors.accent-contrast-dark}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "10px 15px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.light-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "10px 15px"
  topbar:
    backgroundColor: "{colors.light-surface}"
    textColor: "{colors.light-ink}"
    rounded: "{rounded.shell}"
    padding: "7px 9px 7px 14px"
  field:
    backgroundColor: "{colors.light-canvas}"
    textColor: "{colors.light-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.field}"
    padding: "10px 12px"
  overlay:
    backgroundColor: "{colors.light-surface}"
    textColor: "{colors.light-ink}"
    rounded: "{rounded.shell}"
    padding: "28px"
---

# Design System: Header

## Overview

**Creative North Star: "Plano Contínuo"**

Header é uma mesa de operações pessoal contínua: agenda arquitetônica, pauta editorial e extrato financeiro no mesmo plano. A experiência é madura, calma e densa sem parecer um dashboard de cartões; títulos serifados, alinhamentos precisos e hairlines conduzem o olhar por tempo, progresso e dinheiro.

O material é fosco em ambos os temas: preto e grafite no escuro, off-white mineral quente no claro. O acento escolhido pela pessoa aparece raramente, mas conecta seleção, eixo do tempo, curva de progresso, finanças e Pomodoro; o restante da interface permanece neutro e estável.

**Key Characteristics:**
- Superfície contínua organizada por tempo e alinhamento.
- Contraste editorial entre Newsreader e Segoe UI Variable.
- Hierarquia construída com espaços, colunas e hairlines.
- Acento vivo, raro e funcional.
- Controles contidos; profundidade reservada ao shell e a overlays.

## Colors

A paleta alterna entre mineral quente e grafite fosco, com uma única voz cromática escolhida pelo usuário.

### Primary
- **Coral Vivo**: acento padrão para ação, seleção e continuidade temporal.
- **Violeta Foco, Oceano Claro, Jade Ativo, Âmbar Ritmo e Ameixa Editorial**: alternativas do mesmo papel primário; nunca funcionam como uma paleta simultânea.

### Neutral
- **Papel Mineral** e **Folha Quente**: canvas e superfície do tema claro.
- **Tinta Grafite** e **Cinza de Leitura**: texto principal e informação secundária no tema claro.
- **Preto Fosco** e **Grafite Elevado**: canvas e superfície do tema escuro.
- **Papel Noturno** e **Cinza Noturno**: texto principal e informação secundária no tema escuro.
- **Hairlines Translúcidas**: separadores derivados da tinta do tema; estruturam sem formar caixas pesadas.

### Named Rules

**The Living Accent Rule.** Use um único acento por vez e limite-o a ação, seleção, tempo vivo, curvas, finanças e Pomodoro; sua raridade é o que mantém a continuidade.

## Typography

**Display Font:** Newsreader (com Georgia e serif como fallback)
**Body Font:** Segoe UI Variable Text (com Segoe UI, ui-sans-serif e system-ui como fallback)

**Character:** Newsreader dá voz editorial a saudações, títulos de área, números financeiros e tempo; Segoe UI Variable mantém navegação, controles e dados compactos claros e familiares. Valores temporais e financeiros usam numerais tabulares.

### Hierarchy
- **Display** (520, `clamp(32px, 4vw, 50px)`, 1.08): saudação e título principal da seção.
- **Headline** (540, 30px): Pomodoro e valores de destaque.
- **Title** (590, 17px): títulos de áreas contínuas e cabeçalhos de ledger.
- **Body** (400, 14px): conteúdo e texto operacional.
- **Label** (620, 12px): navegação, controles e ações compactas; rótulos auxiliares podem descer a 9–11px.

### Named Rules

**The Editorial Pair Rule.** Reserve Newsreader para orientação e leitura de valor; toda interação permanece em Segoe UI Variable.

## Layout

O workspace usa um container fluido de até 1540px, com gutters responsivos entre 20px e 58px. A visão geral combina agenda, ritmo e sinais em três colunas; semana mantém sete colunas estáveis com largura mínima de 170px; calendário preserva sete colunas e uma agenda lateral de 300px; finanças usa uma faixa de quatro métricas acima de ledgers contínuos.

Em 1120px, rótulos da navegação podem ceder e grades intermediárias reorganizam sinais e agenda. Em 800px, a navegação passa a ícones de 42px, os planos principais empilham e grades largas ganham rolagem horizontal. Em 520px, gutters, títulos e células reduzem sem comprimir alvos ou quebrar a ordem de leitura.

**The Stable Grid Rule.** Reorganize colunas por breakpoint, mas nunca deixe a edição de um item deslocar ou redimensionar os demais dias da semana.

## Elevation & Depth

O sistema é plano por padrão. A profundidade vem de mudança tonal e hairlines; sombra aparece somente no shell superior, em modais/popovers e no toast. Não há blur nem vidro nas superfícies finais.

### Shadow Vocabulary
- **Shell Ambient** (`0 14px 38px rgb(14 15 12 / 0.08)`): separa a barra superior do plano de trabalho.
- **Overlay Light** (`0 24px 70px rgb(0 0 0 / 0.22)`): eleva modais e popovers no tema claro.
- **Overlay Dark** (`0 24px 70px rgb(0 0 0 / 0.48)`): reforça o mesmo papel no tema escuro.
- **Toast** (`0 16px 38px rgb(0 0 0 / 0.18)`): destaca feedback temporário.

### Named Rules

**The Flat-by-Default Rule.** Se um conteúdo pode ser separado por espaço, alinhamento ou uma linha de 1px, não o transforme em cartão nem lhe dê sombra.

## Shapes

O vocabulário é contido: 8px em ícones e marcadores, 9px em campos, 10px em controles, 12px em avisos e 14px no shell e overlays. Linhas editoriais, células, ledgers, áreas de evolução e colunas semanais permanecem retas; círculos são reservados a pontos de tempo, swatches, checkboxes e ao anel do Pomodoro.

## Components

### Buttons
- **Shape:** controles compactos com cantos contidos (10px) e altura mínima de 40px.
- **Primary:** acento selecionado, contraste calculado e padding de 10px por 15px; hover sobe apenas 1px.
- **Hover / Focus:** transições de 160ms; foco visível com contorno de 2px no acento e offset de 3px.
- **Secondary / Ghost:** fundo transparente, hairline neutra e preenchimento tonal apenas no hover; ações de texto mudam de muted para ink.

### Cards / Containers
- **Corner Style:** conteúdo ordinário não forma cartões; áreas contínuas usam cantos retos.
- **Background:** transparente sobre o canvas, com superfícies temáticas apenas no shell e overlays.
- **Shadow Strategy:** nenhum relevo em repouso; use a vocabulário de Elevation & Depth somente nos papéis previstos.
- **Border:** hairlines de 1px separam linhas, colunas e grupos.
- **Internal Padding:** 14–30px conforme densidade; preserve ritmo vertical antes de introduzir uma caixa.

### Inputs / Fields
- **Style:** fundo do canvas, hairline temática, canto de 9px e padding de 10px por 12px.
- **Focus:** borda muda para o acento e recebe anel externo tonal de 2px.
- **Error / Disabled:** erro usa vermelho destrutivo suavizado contra o canvas; estados desabilitados preservam legibilidade e impedem interação.

### Navigation
- **Style:** barra superior fosca com marca, seis destinos nomeados e ações de aparência/perfil. Item ativo recebe plano tonal e uma linha de acento de 2px.
- **Responsive:** nomes permanecem visíveis no desktop; abaixo de 800px, os destinos ficam icon-only em alvos de 42px com rótulos acessíveis.

### Living Accent Axis

O mesmo acento marca o instante atual na timeline, desenha a curva semanal, destaca o estado financeiro e fecha o anel do Pomodoro. Mudanças usam 180–250ms; a posição temporal usa a curva `cubic-bezier(.22, 1, .36, 1)`. `prefers-reduced-motion` e a preferência interna reduzem movimento a 0.01ms.

## Do's and Don'ts

### Do:
- **Do** use whitespace, alinhamento e hairlines de 1px antes de criar um container.
- **Do** mantenha os seis destinos nomeados no desktop e icon-only com rótulos acessíveis no móvel.
- **Do** reserve cartões para objetos com ação, estado ou fronteira próprios.
- **Do** aplique o acento escolhido de forma consistente nos dois temas e em todos os seis destinos.
- **Do** respeite transições entre 150ms e 250ms e a redução de movimento.

### Don't:
- **Don't** recupere vidro, blur, gradientes ambientais ou brilho do stylesheet legado.
- **Don't** transforme métricas, dias, ledgers ou hábitos em uma parada de cartões repetitivos.
- **Don't** use emojis, glifos ou caracteres soltos como substitutos de ícones vetoriais.
- **Don't** introduza kickers decorativos, faixas laterais grossas ou sombras em superfícies comuns.
- **Don't** devolva Preferências à navegação principal; personalização pertence ao perfil.
