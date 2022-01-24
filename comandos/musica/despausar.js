const { MessageEmbed } = require("discord.js");

module.exports = {
    //* Infomações do comando
    emoji: "▶️",
    nome: "despausar",
    sinonimos: [],
    descricao: "Despausa a música que estou tocando",
    exemplos: [
        { comando: "parar", texto: "Despausa a música no canal que você está" },
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
        const filaMusicas = client.distube.getQueue(iCmd.guild);

        // Caso não tenha
        if (!filaMusicas) return client.responder(iCmd, "bloqueado", "Está bem quieto aqui...", "Nenhuma música está sendo tocada nesse servidor")

        // Pausar a música
        filaMusicas.resume();

        const Embed = new MessageEmbed()
            .setColor(client.defs.corEmbed.normal)
            .setTitle(`${this.emoji} Música despausada`)
            .setDescription(`${filaMusicas.songs[0].name}`)
        await iCmd.reply({ content: null, embeds: [Embed] }).catch();
    }
}