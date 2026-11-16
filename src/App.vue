<script setup>
import { ref, onBeforeUnmount } from 'vue'

import AppHeader from './components/AppHeader.vue'
import CategoriaLista from './components/CategoriaLista.vue'
import ProdutoFormulario from './components/ProdutoFormulario.vue'
import ProdutoLista from './components/ProdutoLista.vue'

const secaoAtiva = ref('produtos')
const produtoLista = ref(null)
const mostrarFormulario = ref(false)
const mensagemSucesso = ref('')
let temporizadorMensagem = null

function atualizarProdutos() {
    produtoLista.value?.carregarProdutos()
}

// confirma o cadastro mesmo quando o produto novo cai em outra página da listagem
function mostrarMensagem(texto) {
    mensagemSucesso.value = texto
    clearTimeout(temporizadorMensagem)
    temporizadorMensagem = setTimeout(() => { mensagemSucesso.value = '' }, 4000)
}

function produtoCadastrado(produto) {
    mostrarFormulario.value = false
    atualizarProdutos()
    mostrarMensagem(produto?.nome
        ? `Produto "${produto.nome}" cadastrado com sucesso!`
        : 'Produto cadastrado com sucesso!')
}

onBeforeUnmount(() => clearTimeout(temporizadorMensagem))
</script>

<template>
    <AppHeader
        :secao="secaoAtiva"
        @update:secao="secaoAtiva = $event"
    />

    <main class="pagina">

        <template v-if="secaoAtiva === 'produtos'">

            <div class="pagina-cabecalho">

                <div>
                    <h1>Produtos</h1>
                    <p>Gerencie os produtos cadastrados.</p>
                </div>

                <button
                    class="btn btn-primary"
                    @click="mostrarFormulario = true"
                >
                    + Novo Produto
                </button>

            </div>

            <ProdutoLista
                ref="produtoLista"
            />

            <ProdutoFormulario
                v-if="mostrarFormulario"
                @produto-cadastrado="produtoCadastrado"
                @fechar="mostrarFormulario = false"
            />

        </template>

        <template v-else>

            <div class="pagina-cabecalho">
                <div>
                    <h1>Categorias</h1>
                    <p>Categorias disponíveis para classificar os produtos.</p>
                </div>
            </div>

            <CategoriaLista />

        </template>

    </main>

    <Transition name="toast">
        <div
            v-if="mensagemSucesso"
            class="toast"
            role="status"
        >
            {{ mensagemSucesso }}
        </div>
    </Transition>
</template>
