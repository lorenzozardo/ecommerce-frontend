# E-commerce — Frontend (Vue 3 + Vite)

Interface web de um e-commerce: catálogo de produtos com busca, filtros e paginação, cadastro de produtos em modal e
listagem de categorias. Consome a API REST do repositório
[ecommerce-backend](https://github.com/lorenzozardo/ecommerce-backend).

## Tecnologias

- Vue 3 (Composition API com `<script setup>`)
- Vite 8
- Axios

## Como executar

Pré-requisitos: **Node.js 20.19+ ou 22.12+** e o **backend rodando** em http://localhost:8080.

```bash
npm install
npm run dev
```

Acesse **http://localhost:5173**. O backend libera CORS para essa porta; por isso o Vite está configurado para
não trocar de porta automaticamente (se a 5173 estiver ocupada, ele avisa em vez de subir em outra).

Versão de produção:

```bash
npm run build     # gera a pasta dist/
npm run preview   # serve o build em http://localhost:4173
```

## Configuração (`.env`)

| Variável | Padrão | Descrição |
|---|---|---|
| `VITE_API_URL` | `http://localhost:8080` | URL do backend |
| `VITE_ATRASO_SIMULADO_MS` | `0` | Atraso artificial (ms) na busca de produtos, útil para visualizar o skeleton loading. Ex.: `2000` |

Depois de alterar o `.env`, reinicie o `npm run dev`.

## Funcionalidades

- Catálogo de produtos em cards: categoria, nome, descrição, preço em reais e estoque
- Busca paginada no backend com filtros por **nome** (debounce de 350 ms) e **categoria**
- Filtros locais por **faixa de preço** e **apenas disponíveis**, aplicados sobre a página atual
- Paginação com anterior/próxima e 5, 10, 20 ou 50 itens por página
- **Skeleton loading** enquanto os dados carregam
- Badges **Sem estoque** e **Estoque baixo** (menos de 5 unidades)
- Cadastro de produto em **modal** com validação reativa; fecha pelo ×, por Cancelar, clicando fora ou com Esc
- Mensagens de erro vindas do backend aparecem no formulário (ex.: `Categoria não encontrada`)
- Aviso de sucesso após o cadastro e recarga da listagem sem recarregar a página
- Aba **Categorias** com a quantidade de produtos de cada categoria
- Layout responsivo (celular, tablet e desktop)

## Estrutura

```
src/
├── main.js
├── App.vue                     página principal (produtos/categorias, modal e aviso de sucesso)
├── assets/base.css             estilos globais
├── components/
│   ├── AppHeader.vue           cabeçalho com as abas Produtos/Categorias
│   ├── PainelLista.vue         painel genérico com slots (#filtros, #acoes) e skeleton
│   ├── CategoriaLista.vue      lista de categorias
│   ├── ProdutoLista.vue        listagem paginada com filtros
│   ├── ProdutoCard.vue         card do produto com badges de estoque
│   ├── ProdutoFiltros.vue      filtros (nome, categoria, preço, disponibilidade)
│   ├── ProdutoPaginacao.vue    navegação entre páginas
│   └── ProdutoFormulario.vue   modal de cadastro com validação
├── composables/
│   ├── useListagem.js          carregamento de listas simples
│   ├── useListagemPaginada.js  carregamento paginado (Page do Spring)
│   └── useFiltro.js            filtros reativos
└── services/
    ├── api.js                  instância do Axios (baseURL = VITE_API_URL)
    ├── categoriaService.js
    ├── produtoService.js
    └── erros.js                transforma erros do backend em mensagens
```

## Decisões de implementação

- A lógica de carregamento fica em composables (`useListagem`, `useListagemPaginada` e `useFiltro`), reaproveitados
  pelas listas de produtos e de categorias.
- `PainelLista` é um componente genérico com slots que concentra os estados de carregamento, erro e lista vazia.
- Nome e categoria definem **quais dados buscar** e vão para o backend; preço e disponibilidade definem **o que
  exibir** e são filtrados no navegador.
- Se uma busca antiga terminar depois de uma mais nova (digitação rápida no filtro), a resposta antiga é descartada.
- Campo numérico vazio nos filtros significa "sem filtro".
- Erros do backend, em texto ou como mapa de validação, viram mensagens amigáveis (`services/erros.js`).
