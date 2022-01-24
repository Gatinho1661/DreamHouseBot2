const { MessageEmbed } = require("discord.js");

module.exports = {
    //* Infomações do comando
    emoji: "⏹️",
    nome: "parar",
    sinonimos: [],
    descricao: "Para de tocar as músicas de um canal de voz",
    exemplos: [
        { comando: "parar", texto: "Para de tocar as músicas no canal que você está" },
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

        // Parar de tocar música e sair do canal de voz
        filaMusicas.stop();

        const Embed = new MessageEmbed()
            .setColor(client.defs.corEmbed.normal)
            .setTitle(`${this.emoji} Música parada`)
            .setDescription(`Acabou a festa, estou saindo`)
        await iCmd.reply({ content: null, embeds: [Embed] }).catch();
    }
}