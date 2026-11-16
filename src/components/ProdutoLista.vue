<script setup>
import { watch, onMounted, onBeforeUnmount, computed } from 'vue'
import { buscarProdutosPaginados } from '../services/produtoService.js'
import { useListagemPaginada } from '../composables/useListagemPaginada.js'
import { useFiltro } from '../composables/useFiltro.js'
import PainelLista from './PainelLista.vue'
import ProdutoCard from './ProdutoCard.vue'
import ProdutoFiltros from './ProdutoFiltros.vue'
import ProdutoPaginacao from './ProdutoPaginacao.vue'

const { filtros, limpar: limparFiltros } = useFiltro({
    nome: '',
    categoriaId: null,
    precoMin: null,
    precoMax: null,
    apenasDisponiveis: false,
})

// atraso artificial opcional para visualizar o skeleton (VITE_ATRASO_SIMULADO_MS no .env)
const ATRASO_SIMULADO_MS = Number(import.meta.env.VITE_ATRASO_SIMULADO_MS) || 0

function esperar(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

// Filtros de nome e categoria vão para o backend
async function buscador({ page, size }) {
    if (ATRASO_SIMULADO_MS > 0) await esperar(ATRASO_SIMULADO_MS)
    return buscarProdutosPaginados({ page, size, nome: filtros.nome, categoriaId: filtros.categoriaId })
}

const { itens: produtos, carregando, erro, vazio, total, pagina,
        carregar: carregarProdutos, reiniciar, proxima, anterior, mudarTamanho }
    = useListagemPaginada(buscador)

// debounce: aguarda 350ms após parar de digitar antes de buscar
let temporizador = null
watch(
    () => [filtros.nome, filtros.categoriaId],
    () => {
        clearTimeout(temporizador)
        temporizador = setTimeout(() => { reiniciar() }, 350)
    }
)
onBeforeUnmount(() => clearTimeout(temporizador))

// campo de número vazio vira '' com v-model.number, então '' e null significam "sem filtro"
function temValor(valor) {
    return valor !== null && valor !== undefined && valor !== '' && !Number.isNaN(Number(valor))
}

// Filtros de preço e disponibilidade são aplicados localmente sobre os itens da página atual
const produtosVisiveis = computed(() => {
    return produtos.value.filter((p) => {
        const preco = Number(p.preco)
        if (temValor(filtros.precoMin) && preco < Number(filtros.precoMin)) return false
        if (temValor(filtros.precoMax) && preco > Number(filtros.precoMax)) return false
        if (filtros.apenasDisponiveis && Number(p.estoque) <= 0) return false
        return true
    })
})

defineExpose({ carregarProdutos })
onMounted(() => { carregarProdutos() })
</script>

<template>
    <PainelLista titulo="Catálogo de produtos" :total="total"
        :carregando="carregando" :erro="erro" :vazio="vazio"
        mensagem-vazio="Nenhum produto encontrado."
        @atualizar="reiniciar">
        <template #filtros>
            <ProdutoFiltros :filtros="filtros" @limpar="limparFiltros" />
        </template>
        <section v-if="produtosVisiveis.length" class="produto-grid">
            <ProdutoCard v-for="produto in produtosVisiveis" :key="produto.id" :produto="produto" />
        </section>
        <p v-else class="aviso">
            Nenhum produto desta página atende aos filtros de preço/disponibilidade.
        </p>
        <ProdutoPaginacao
            :numero="pagina.numero"
            :total-paginas="pagina.totalPaginas"
            :total-itens="pagina.totalItens"
            :tamanho="pagina.tamanho"
            :primeira="pagina.primeira"
            :ultima="pagina.ultima"
            :desabilitado="carregando"
            @proxima="proxima"
            @anterior="anterior"
            @mudar-tamanho="mudarTamanho"
        />
    </PainelLista>
</template>
