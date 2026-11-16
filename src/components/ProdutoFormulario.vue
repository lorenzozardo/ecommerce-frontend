<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { cadastrarProduto } from '../services/produtoService.js'
import { listarCategorias } from '../services/categoriaService.js'
import { mensagemDeErro } from '../services/erros.js'

const emit = defineEmits([
    'produto-cadastrado',
    'fechar'
])

const produto = ref({
    nome: '',
    descricao: '',
    preco: '',
    estoque: '',
    categoriaId: null
})

const tentouEnviar = ref(false)
const salvando = ref(false)
const erroFormulario = ref('')
const categorias = ref([])
const campoNome = ref(null)

function vazio(valor) {
    return valor === '' || valor === null || valor === undefined
}

const erros = computed(() => {
    const e = {}

    const nome = produto.value.nome.trim()
    if (!nome) {
        e.nome = 'Informe o nome do produto.'
    } else if (nome.length < 3) {
        e.nome = 'O nome deve ter pelo menos 3 caracteres.'
    }

    const preco = Number(produto.value.preco)
    if (vazio(produto.value.preco)) {
        e.preco = 'Informe o preço.'
    } else if (Number.isNaN(preco)) {
        e.preco = 'Informe um preço válido.'
    } else if (preco <= 0) {
        e.preco = 'O preço deve ser maior que zero.'
    } else if (Math.round(preco * 100) / 100 !== preco) {
        e.preco = 'O preço deve ter no máximo 2 casas decimais.'
    }

    const estoque = Number(produto.value.estoque)
    if (vazio(produto.value.estoque)) {
        e.estoque = 'Informe o estoque.'
    } else if (estoque < 0) {
        e.estoque = 'O estoque não pode ser negativo.'
    } else if (!Number.isInteger(estoque)) {
        e.estoque = 'O estoque deve ser um número inteiro.'
    }

    if (!produto.value.categoriaId) {
        e.categoriaId = 'Selecione uma categoria.'
    }

    return e
})

const formularioValido = computed(() => {
    return Object.keys(erros.value).length === 0
})

async function salvarProduto() {
    tentouEnviar.value = true

    if (!formularioValido.value) {
        return
    }

    salvando.value = true
    erroFormulario.value = ''

    try {
        const {
            nome,
            descricao,
            preco,
            estoque,
            categoriaId
        } = produto.value

        const produtoCriado = await cadastrarProduto({
            nome: nome.trim(),
            descricao: descricao.trim(),
            preco: Number(preco),
            estoque: Number(estoque),
            categoriaId: Number(categoriaId)
        })

        produto.value = {
            nome: '',
            descricao: '',
            preco: '',
            estoque: '',
            categoriaId: null
        }

        tentouEnviar.value = false

        emit('produto-cadastrado', produtoCriado)

    } catch (error) {
        console.error(error)

        // mostra a mensagem do backend quando existir (ex.: "Categoria não encontrada")
        erroFormulario.value = mensagemDeErro(
            error,
            'Não foi possível cadastrar o produto. Tente novamente.'
        )

    } finally {
        salvando.value = false
    }
}

// não deixa fechar no meio do envio
function fechar() {
    if (!salvando.value) {
        emit('fechar')
    }
}

function fecharComEsc(evento) {
    if (evento.key === 'Escape') {
        fechar()
    }
}

onMounted(async () => {
    window.addEventListener('keydown', fecharComEsc)
    campoNome.value?.focus()

    try {
        categorias.value = await listarCategorias()
    } catch (error) {
        erroFormulario.value = 'Não foi possível carregar as categorias. Verifique se o backend está no ar.'
    }
})

onBeforeUnmount(() => {
    window.removeEventListener('keydown', fecharComEsc)
})
</script>

<template>
    <div
        class="modal-overlay"
        @click.self="fechar"
    >
        <div
            class="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-formulario"
        >

            <div class="modal-header">

                <div>
                    <h2 id="titulo-formulario">Cadastrar Produto</h2>
                    <p>Informe os dados do novo produto.</p>
                </div>

                <button
                    type="button"
                    class="modal-fechar"
                    aria-label="Fechar"
                    @click="fechar"
                >
                    ×
                </button>

            </div>

            <form novalidate @submit.prevent="salvarProduto">

                <p
                    v-if="erroFormulario"
                    class="erro"
                >
                    {{ erroFormulario }}
                </p>

                <div class="campo">

                    <label for="nome">
                        Nome
                    </label>

                    <input
                        id="nome"
                        ref="campoNome"
                        v-model="produto.nome"
                        type="text"
                        maxlength="100"
                        placeholder="Digite o nome do produto"
                        :class="{
                            'input-error':
                                tentouEnviar && erros.nome
                        }"
                    />

                    <span
                        v-if="tentouEnviar && erros.nome"
                        class="field-error"
                    >
                        {{ erros.nome }}
                    </span>

                </div>

                <div class="campo">

                    <label for="descricao">
                        Descrição
                    </label>

                    <textarea
                        id="descricao"
                        v-model="produto.descricao"
                        maxlength="500"
                        placeholder="Descreva o produto..."
                    ></textarea>

                    <span class="field-help">
                        {{ produto.descricao.length }}/500 caracteres
                    </span>

                </div>

                <div class="form-row">

                    <div class="campo">

                        <label for="preco">
                            Preço (R$)
                        </label>

                        <input
                            id="preco"
                            type="number"
                            step="0.01"
                            v-model="produto.preco"
                            placeholder="0,00"
                            :class="{
                                'input-error':
                                    tentouEnviar && erros.preco
                            }"
                        />

                        <span
                            v-if="tentouEnviar && erros.preco"
                            class="field-error"
                        >
                            {{ erros.preco }}
                        </span>

                    </div>

                    <div class="campo">

                        <label for="estoque">
                            Estoque
                        </label>

                        <input
                            id="estoque"
                            type="number"
                            step="1"
                            v-model="produto.estoque"
                            placeholder="0"
                            :class="{
                                'input-error':
                                    tentouEnviar && erros.estoque
                            }"
                        />

                        <span
                            v-if="tentouEnviar && erros.estoque"
                            class="field-error"
                        >
                            {{ erros.estoque }}
                        </span>

                    </div>

                </div>

                <div class="campo">

                    <label for="categoria">
                        Categoria
                    </label>

                    <select
                        id="categoria"
                        v-model="produto.categoriaId"
                        :class="{
                            'input-error':
                                tentouEnviar && erros.categoriaId
                        }"
                    >
                        <option :value="null">
                            Selecione uma categoria...
                        </option>

                        <option
                            v-for="c in categorias"
                            :key="c.id"
                            :value="c.id"
                        >
                            {{ c.nome }}
                        </option>
                    </select>

                    <span
                        v-if="tentouEnviar && erros.categoriaId"
                        class="field-error"
                    >
                        {{ erros.categoriaId }}
                    </span>

                </div>

                <div class="modal-footer">

                    <button
                        type="button"
                        class="btn btn-secondary"
                        :disabled="salvando"
                        @click="fechar"
                    >
                        Cancelar
                    </button>

                    <button
                        type="submit"
                        class="btn btn-primary"
                        :disabled="salvando"
                    >
                        {{ salvando ? 'Salvando...' : 'Cadastrar' }}
                    </button>

                </div>

            </form>

        </div>
    </div>
</template>
