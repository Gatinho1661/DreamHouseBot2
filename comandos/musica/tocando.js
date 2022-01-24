const { MessageEmbed, MessageButton } = require("discord.js");
const { criarBarraProgresso } = require("../../modulos/utils");

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
        const filaMusicas = client.distube.getQueue(iCmd.guild);

        // Caso não tenha
        if (!filaMusicas) return client.responder(iCmd, "bloqueado", "Está bem quieto aqui...", "Nenhuma música está sendo tocada nesse servidor")

        const musica = filaMusicas.songs[0];

        // Fila com músicas anteriores e próximas
        const filaCompleta = filaMusicas.previousSongs.concat(filaMusicas.songs);
        const barraProgresso = criarBarraProgresso(filaMusicas.currentTime / musica.duration);

        const link = new MessageButton()
            .setLabel("Ir para música")
            .setStyle("LINK")
            .setURL(musica.url)
        const Embed = new MessageEmbed()
            .setColor(client.defs.corEmbed.normal)
            .setTitle(`${this.emoji} Música atual`)
            .setDescription(`${musica.name}`)
            .setImage(musica.thumbnail)
            .addField("👤 Autor", `[${musica.uploader.name}](${musica.uploader.url} 'Ir para autor')`, true)
            .addField("👀 Visualizações", `${musica.views.toLocaleString()}`, true)
            .addField("🔢 Posição", `${filaMusicas.previousSongs.length + 1}/${filaCompleta.length}`, true)
            .addField("⏳ Duração", `[${barraProgresso}] [${filaMusicas.formattedCurrentTime}/${musica.formattedDuration}]`, false)
            .setFooter({ text: `Adicionado por ${musica.member.displayName}`, iconURL: musica.member.displayAvatarURL({ dynamic: true, size: 32 }) })
        await iCmd.reply({
            content: null,
            embeds: [Embed],
            components: [{ type: 'ACTION_ROW', components: [link] }]
        }).catch();
    }
}