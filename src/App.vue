<script setup>
import { ref } from 'vue'

import AppHeader from './components/AppHeader.vue'
import ProdutoFormulario from './components/ProdutoFormulario.vue'
import ProdutoLista from './components/ProdutoLista.vue'

const produtoLista = ref(null)
const mostrarFormulario = ref(false)

function atualizarProdutos() {
    produtoLista.value?.carregarProdutos()
}

function produtoCadastrado() {
    mostrarFormulario.value = false
    atualizarProdutos()
}
</script>

<template>
    <AppHeader />

    <main class="pagina">

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

    </main>
</template>