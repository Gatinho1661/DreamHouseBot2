// Emitido quando uma fila de música é finalizada
module.exports = {
    nome: "finish",
    once: false, // Se deve ser executado apenas uma vez
    origem: client.distube,

    async executar(filaMusicas) {
        client.log("musica", `Fila de música finalizada em: ${filaMusicas.voiceChannel?.name}`);
    }
}