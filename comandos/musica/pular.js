const { MessageEmbed } = require("discord.js");

module.exports = {
    //* Infomações do comando
    emoji: "⏭️",
    nome: "pular",
    sinonimos: [],
    descricao: "Pula a música que estou tocando",
    exemplos: [
        { comando: "parar", texto: "Pula a música atual no canal que você está" },
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

        // Parar de tocar música e sair do canal de voz
        filaMusicas.skip();

        const Embed = new MessageEmbed()
            .setColor(client.defs.corEmbed.normal)
            .setTitle(`${this.emoji} Música pulada`)
            .setDescription(`${filaMusicas.current.title}`)
        await iCmd.reply({ content: null, embeds: [Embed] }).catch();
    }
}