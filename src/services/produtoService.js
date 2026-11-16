import { api } from './api.js'

export async function listarProdutos() {
    const response = await api.get('/produtos/listar-todos')
    return response.data
}

export async function buscarProdutosPaginados({ page, size, nome, categoriaId } = {}) {
    const params = { page, size }
    if (nome?.trim()) params.nome = nome.trim()
    if (categoriaId != null && categoriaId !== '') params.categoriaId = categoriaId
    const response = await api.get('/produtos', { params })
    return response.data
}

export async function cadastrarProduto(produto) {
    const response = await api.post('/produtos', produto)
    return response.data
}
