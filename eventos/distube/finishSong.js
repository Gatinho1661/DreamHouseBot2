// Emitido quando uma música é finalizada
module.exports = {
    nome: "finishSong",
    once: false, // Se deve ser executado apenas uma vez
    origem: client.distube,

    async executar(filaMusicas, musica) {
        console.debug(`Música finalizada: ${musica.name} em: ${filaMusicas.voiceChannel?.name}`)
    }
}