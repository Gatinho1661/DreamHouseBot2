const { MessageEmbed } = require("discord.js");
const { criarBarraProgresso, encontrarPosicao } = require("../../modulos/utils");

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
    testando: false,

    //* Comando
    async executar(iCmd) {
        // Pegar fila de músicas do servidor
        const filaMusicas = client.distube.getQueue(iCmd.guild);
        if (!filaMusicas) return client.responder(iCmd, "bloqueado", "Está bem quieto aqui...", "Nenhuma música está sendo tocada nesse servidor")

        // Pausar a música
        filaMusicas.resume();
        client.log("musica", `Música despausada em: ${filaMusicas.voiceChannel?.name}`);

        const musica = filaMusicas.songs[0];
        const posicao = encontrarPosicao(filaMusicas, musica);
        const barraProgresso = criarBarraProgresso(filaMusicas.currentTime / musica.duration);

        const Embed = new MessageEmbed()
            .setColor(client.defs.corEmbed.normal)
            .setTitle(`${this.emoji} Música despausada`)
            .setDescription(`[${musica.uploader.name}](${musica.uploader.url} 'Ir para autor') - ${musica.name}`)
            .addField("👤 Adicionado por", `${musica.member.toString()}`, true)
            .addField("🔢 Posição", `${posicao.posicaoMusica}/${posicao.tamanhoFila}`, true)
            .addField("⏳ Duração", `[${barraProgresso}] [${filaMusicas.formattedCurrentTime}/${musica.formattedDuration}]`, false)
            .setFooter({ text: `Essa mensagem será apagada quando essa música acabar` });
        const resposta = await iCmd.reply({
            content: null,
            embeds: [Embed],
            fetchReply: true
        }).catch();

        // Adiciona a mensagem na lista de mensagens para apagar depois que a música finalizar
        const msgsParaApagar = musica.metadata?.msgsParaApagar || [];
        msgsParaApagar.push(resposta);
        musica.metadata.msgsParaApagar = msgsParaApagar;
    }
}