const { MessageEmbed } = require("discord.js");
const { encontrarPosicao } = require("../../modulos/utils");

module.exports = {
    //* Infomações do comando
    emoji: "⏮️",
    nome: "voltar",
    sinonimos: [],
    descricao: "Volta para música anterior",
    exemplos: [
        { comando: "parar", texto: "Volta para música anterior tocada do canal que você está" },
    ],
    args: "",
    opcoes: [
        {
            name: "para",
            description: "Música para voltar para",
            type: client.defs.tiposOpcoes.INTEGER,
            required: false,
            autocomplete: true
        },
    ],
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
    async executar(iCmd, opcoes) {
        // Pegar fila de músicas do servidor
        const filaMusicas = client.distube.getQueue(iCmd.guild);
        if (!filaMusicas) return client.responder(iCmd, "bloqueado", "Está bem quieto aqui...", "Nenhuma música está sendo tocada nesse servidor")

        //* Voltar até a música selecionada ou voltar música anterior
        if (opcoes.para) await filaMusicas.jump(opcoes.para);
        else await filaMusicas.previous();

        // Próxima música, música selecionada ou música relacionada
        let musicaProxima = filaMusicas.previousSongs.at(-1);
        const posicaoProxima = encontrarPosicao(filaMusicas, musicaProxima);

        if (!musicaProxima) return client.responder(iCmd, "bloqueado", "Nenhuma música na fila", "Acabou as músicas");

        const Embed = new MessageEmbed()
            .setColor(client.defs.corEmbed.aviso)
            .setTitle(`${this.emoji} Música voltada para`)
            .setDescription(`[${musicaProxima.uploader.name}](${musicaProxima.uploader.url} 'Ir para autor') - ${musicaProxima.name}`)
            .addField("👤 Adicionado por", `${musicaProxima.member.toString()}`, true)
            .addField("🔢 Posição", `${posicaoProxima.posicaoMusica}/${posicaoProxima.tamanhoFila}`, true)
            .addField("⏳ Duração", `${musicaProxima.formattedDuration}`, true)
            .setFooter({ text: `Essa mensagem será apagada quando essa música acabar` });
        const resposta = await iCmd.reply({
            content: null,
            embeds: [Embed],
            fetchReply: true
        }).catch();

        // Adiciona a mensagem na lista de mensagens para apagar depois que a música finalizar
        const msgsParaApagar = musicaProxima.metadata?.msgsParaApagar || [];
        msgsParaApagar.push(resposta);
        musicaProxima.metadata.msgsParaApagar = msgsParaApagar;
    },

    //* Autocompletar
    async autocompletar(iteracao) {
        // Pegar fila de músicas do servidor
        const filaMusicas = client.distube.getQueue(iteracao.guild);
        if (!filaMusicas) return [];

        const musicas = filaMusicas.previousSongs.slice().reverse();

        return musicas.map((resultado, idx) => ({ name: resultado.name.slice(0, 100), value: -idx - 1 }));
    }
}