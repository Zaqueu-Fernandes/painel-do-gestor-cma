

# Plano: Corrigir Estilização do Painel do Gestor CMA

## Contexto
O app "Painel do Gestor - Câmara Municipal de Araripe" está funcional mas sem estilização correta. Vamos portar todos os componentes e configurações de estilo para o projeto Lovable, **sem alterar nenhuma funcionalidade**.

## O que será feito

### 1. Configurar a base de estilos
- Substituir o `index.css` atual pelo CSS original do projeto (Tailwind puro com fundo `bg-gray-50`, animação `fadeIn`, scrollbar customizada verde)
- Atualizar o `tailwind.config` para incluir as cores personalizadas `cma-green` e a animação `fadeIn`
- Adicionar no `index.html` os links do **Font Awesome** (ícones) e da fonte **Inter** do Google Fonts, além do preloader verde institucional

### 2. Portar todos os componentes com suas classes de estilo
- **Login** — Formulário centralizado com card branco, borda verde no topo, ícone de cadeado, botões verdes
- **Cadastro** — Formulário com labels uppercase, inputs com focus verde, máscara de telefone
- **Confirmação** — Tela de sucesso pós-cadastro com ícone check verde, botão WhatsApp
- **PainelGestor** — Cards coloridos (verde/vermelho/laranja/azul) com bordas laterais, tabela com header verde escuro, botão exportar PDF vermelho
- **AnaliseFinanceira** — Gráficos (pizza, barras, linha) em cards brancos com sombra e bordas suaves
- **Layout do Dashboard** — Header com logo CMA e nome do usuário, navegação por abas com indicador verde, footer fixo com contato WhatsApp

### 3. Configurar dependências necessárias
- Adicionar `jspdf` e `jspdf-autotable` para exportação PDF
- Configurar cliente Supabase (`supabase.js`) apontando para o projeto existente
- Adicionar utilitário `exportPDF.js`

### 4. Resultado esperado
O app no Lovable ficará visualmente idêntico ao projeto original: tema verde institucional, fonte Inter, ícones Font Awesome, cards com sombras, tabelas estilizadas e gráficos com as cores da CMA.

