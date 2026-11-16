<!-- <script setup>
import { onMounted } from 'vue'
import { listarProdutos } from '../services/produtoService.js'
import { useListagem } from '../composables/useListagem.js'
import PainelLista from './PainelLista.vue'
import ProdutoCard from './ProdutoCard.vue'

const { itens: produtos, carregando, erro, vazio, total, carregar: carregarProdutos } = useListagem(listarProdutos)

defineExpose({ carregarProdutos })
onMounted(() => { carregarProdutos() })
</script>

<template>
    <PainelLista titulo="Catálogo de produtos" :total="total"
        :carregando="carregando" :erro="erro" :vazio="vazio"
        mensagem-vazio="Nenhum produto cadastrado."
        @atualizar="carregarProdutos">
        <section class="produto-grid">
            <ProdutoCard v-for="produto in produtos" :key="produto.id" :produto="produto" />
        </section>
    </PainelLista>
</template> -->


<script setup>
import { watch, onMounted, computed } from 'vue'
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

function buscador({ page, size }) {
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

const produtosVisiveis = computed(() => {
    return produtos.value.filter((p) => {
        const preco = Number(p.preco)
        if (filtros.precoMin !== null && preco < filtros.precoMin) return false
        if (filtros.precoMax !== null && preco > filtros.precoMax) return false
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
        <section class="produto-grid">
            <ProdutoCard v-for="produto in produtosVisiveis" :key="produto.id" :produto="produto" />
        </section>
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
        <template #filtros>
            <ProdutoFiltros :filtros="filtros" @limpar="limparFiltros" />    
        </template>   
    </PainelLista>
</template>