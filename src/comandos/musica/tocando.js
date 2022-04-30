const { MessageEmbed, MessageButton } = require("discord.js");
const { criarBarraProgresso, encontrarPosicao } = require("../../modulos/utils");

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
    testando: false,

    //* Comando
    async executar(iCmd) {
        // Pegar fila de músicas do servidor
        const filaMusicas = client.distube.getQueue(iCmd.guild);

        // Caso não tenha
        if (!filaMusicas) return client.responder(iCmd, "bloqueado", "Está bem quieto aqui...", "Nenhuma música está sendo tocada nesse servidor")

        const musica = filaMusicas.songs[0];
        const posicao = encontrarPosicao(filaMusicas, musica);
        const barraProgresso = criarBarraProgresso(filaMusicas.currentTime / musica.duration);

        const link = new MessageButton()
            .setLabel("Ir para música")
            .setStyle("LINK")
            .setURL(musica.url)
        const Embed = new MessageEmbed()
            .setColor(client.defs.corEmbed.normal)
            .setTitle(`${this.emoji} Música atual`)
            .setDescription(`[${musica.uploader.name}](${musica.uploader.url} 'Ir para autor') - ${musica.name}`)
            .addField("👤 Adicionado por", `${musica.member.toString()}`, true)
            .addField("🔢 Posição", `${posicao.posicaoMusica}/${posicao.tamanhoFila}`, true)
            .addField("⏳ Duração", `[${barraProgresso}] [${filaMusicas.formattedCurrentTime}/${musica.formattedDuration}]`, false)
            .setImage(musica.thumbnail)
            .setFooter({ text: `Essa mensagem será apagada quando essa música acabar` });
        const resposta = await iCmd.reply({
            content: null,
            embeds: [Embed],
            components: [{ type: 'ACTION_ROW', components: [link] }],
            fetchReply: true
        }).catch();

        // Adiciona a mensagem na lista de mensagens para apagar depois que a música finalizar
        const msgsParaApagar = musica.metadata?.msgsParaApagar || [];
        msgsParaApagar.push(resposta);
        musica.metadata.msgsParaApagar = msgsParaApagar;
    }
}