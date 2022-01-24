// Emitido quando nenhuma música encontrada
module.exports = {
    nome: "searchNoResult",
    once: false, // Se deve ser executado apenas uma vez
    origem: client.distube,

    async executar(msg, pesquisa) {
        console.debug(`Nenhuma música chamada "${pesquisa}" foi encontrada`);
    }
}