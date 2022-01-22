const { MessageEmbed } = require("discord.js");

module.exports = {
    //* Infomações do comando
    emoji: "⏸️",
    nome: "pausar",
    sinonimos: [],
    descricao: "Pausa a música que estou tocando",
    exemplos: [
        { comando: "parar", texto: "Pausa a música no canal que você está" },
    ],
    args: "",
    opcoes: [],
    canalVoz: true,
    contaPrimaria: false,
    apenasServidor: true,
    apenasDono: false,
    nsfw: false,
    permissoes: {
        usuario: [],
        bot: ["SEND_MESSAGES"]
    },
    cooldown: 1,
    escondido: false,
    suporteBarra: true,
    testando: true,

    //* Comando
    async executar(iCmd) {
        // Pegar fila de músicas do servidor
        const filaMusicas = client.player.getQueue(iCmd.guild);

        // Caso não tenha
        if (!filaMusicas) return client.responder(iCmd, "bloqueado", "Está bem quieto aqui...", "Nenhuma música está sendo tocada nesse servidor")

        // Pausar a música
        filaMusicas.setPaused(true);

        const Embed = new MessageEmbed()
            .setColor(client.defs.corEmbed.normal)
            .setTitle(`${this.emoji} Música pausada`)
            .setDescription(`${filaMusicas.current.title}`)
        await iCmd.reply({ content: null, embeds: [Embed] }).catch();
    }
}