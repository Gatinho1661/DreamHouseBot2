const { MessageEmbed, MessageButton } = require("discord.js");

module.exports = {
    //* Infomações do comando
    emoji: "🎶",
    nome: "tocando",
    sinonimos: [],
    descricao: "Veja a música que estou tocando",
    exemplos: [
        { comando: "tocando", texto: "Veja a música que estou tocando em um canal de voz" },
    ],
    args: "",
    opcoes: [],
    canalVoz: false,
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

        const musicaAtual = filaMusicas.current;
        const barraProgresso = filaMusicas.createProgressBar({
            indicator: "🔘",
            line: "▬",
            timecodes: false,
            length: 10
        });
        const tempoProgresso = filaMusicas.getPlayerTimestamp();

        // Fila com músicas anteriores e próximas
        const filaCompleta = filaMusicas.previousTracks.concat(filaMusicas.tracks);

        const link = new MessageButton()
            .setLabel("Ir para música")
            .setStyle("LINK")
            .setURL(musicaAtual.url)
        const Embed = new MessageEmbed()
            .setColor(client.defs.corEmbed.normal)
            .setTitle(`${this.emoji} Música atual`)
            .setDescription(`${musicaAtual.title}`)
            .setImage(musicaAtual.thumbnail)
            .setFooter({ text: `Adicionado por ${iCmd.member.displayName}`, iconURL: iCmd.member.displayAvatarURL({ dynamic: true, size: 32 }) })
            .addField("👤 Autor", `${musicaAtual.author}`, true);
        if (musicaAtual.views) Embed.addField("👀 Visualizações", `${musicaAtual.views.toLocaleString()}`, true)
        Embed.addField("🔢 Posição", `${filaMusicas.previousTracks.length}/${filaCompleta.length}`, true)
        Embed.addField("⏳ Duração", `[${barraProgresso}] [**${tempoProgresso.current}**/**${tempoProgresso.end}**]`, false)

        await iCmd.reply({
            content: null,
            embeds: [Embed],
            components: [{ type: 'ACTION_ROW', components: [link] }]
        }).catch();
    }
}