// Monta uma mensagem amigável a partir do erro devolvido pelo backend (GlobalExceptionHandler):
// - 404/400 de regra de negócio: texto simples (ex.: "Categoria não encontrada")
// - 400 de validação: mapa { campo: mensagem } (ex.: { "preco": "O preço deve ser maior que zero" })
export function mensagemDeErro(error, mensagemPadrao) {
    const resposta = error?.response

    // sem resposta: backend fora do ar, URL errada ou bloqueio de CORS
    if (!resposta) {
        return 'Não foi possível conectar ao backend. Verifique se ele está no ar.'
    }

    const dados = resposta.data

    if (typeof dados === 'string' && dados.trim() && !dados.trim().startsWith('<')) {
        return dados.trim()
    }

    // mapa de erros de validação (o JSON de erro padrão do Spring tem "status" e não entra aqui)
    if (resposta.status === 400 && dados && typeof dados === 'object' && !('status' in dados)) {
        const mensagens = Object.values(dados).filter((valor) => typeof valor === 'string')
        if (mensagens.length) {
            return mensagens.join(' • ')
        }
    }

    return mensagemPadrao
}
