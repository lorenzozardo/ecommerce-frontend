<script setup>
import { ref, computed, onMounted } from 'vue'
import { cadastrarProduto } from '../services/produtoService.js'
import { listarCategorias } from '../services/categoriaService.js'

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

const erros = computed(() => {
    const e = {}

    if (!produto.value.nome.trim()) {
        e.nome = 'Informe o nome do produto.'
    } else if (produto.value.nome.trim().length < 3) {
        e.nome = 'O nome deve ter pelo menos 3 caracteres.'
    }

    if (!produto.value.preco) {
        e.preco = 'Informe o preço.'
    } else if (Number(produto.value.preco) <= 0) {
        e.preco = 'O preço deve ser maior que zero.'
    }

    if (produto.value.estoque === '') {
        e.estoque = 'Informe o estoque.'
    } else if (Number(produto.value.estoque) < 0) {
        e.estoque = 'O estoque não pode ser negativo.'
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

        await cadastrarProduto({
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

        emit('produto-cadastrado')

    } catch (error) {
        console.error(error)

        erroFormulario.value =
            'Não foi possível cadastrar o produto. Tente novamente.'

    } finally {
        salvando.value = false
    }
}

onMounted(async () => {
    categorias.value = await listarCategorias()
})
</script>

<template>
    <div
        class="modal-overlay"
        @click.self="emit('fechar')">
        <div class="modal">

            <div class="modal-header">

                <div>
                    <h2>Cadastrar Produto</h2>
                    <p>Informe os dados do novo produto.</p>
                </div>

                <button
                    type="button"
                    class="modal-fechar"
                    @click="emit('fechar')">×
                </button>

            </div>

            <form @submit.prevent="salvarProduto">

                <p
                    v-if="erroFormulario"
                    class="erro">
                    {{ erroFormulario }}
                </p>

                <div class="campo">

                    <label for="nome">
                        Nome
                    </label>

                    <input
                        id="nome"
                        v-model="produto.nome"
                        type="text"
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
                        @click="emit('fechar')"
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