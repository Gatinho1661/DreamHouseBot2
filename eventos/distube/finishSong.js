const { Queue, Song } = require("distube"); // eslint-disable-line no-unused-vars

// Emitido quando uma música é finalizada
module.exports = {
    nome: "finishSong",
    once: false, // Se deve ser executado apenas uma vez
    origem: client.distube,

    /**
     * 
     * @param {Queue} filaMusicas 
     * @param {Song} musica 
     */
    async executar(filaMusicas, musica) {
        console.debug(`Música finalizada: ${musica.name} em: ${filaMusicas.voiceChannel?.name}`)

        // Apagar as mensagens para não deixar um monte de spam
        if (musica.metadata?.msgsParaApagar) {

            const msgsParaApagar = [...musica.metadata.msgsParaApagar];
            musica.metadata.msgsParaApagar = [];

            // eu poderia usar bulkDelete(msgsParaApagar)
            // mas ai eu ia fazer spam no log do servidor

            const delay = async (ms) => new Promise(res => setTimeout(res, ms)); // eslint-disable-line no-promise-executor-return

            for (const msg of msgsParaApagar) {
                if (msg.deletable) await msg.delete();
                else client.log("aviso", "Mensagem para apagar não pode ser apagada");
                await delay(1000); // Esperar 1 segundo para apagar a próxima mensagem
            }
        }
    }
}