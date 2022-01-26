const { MessageEmbed } = require("discord.js");
const { criarBarraProgresso, encontrarPosicao } = require("../../modulos/utils");

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

        // Música atual que foi pulada
        const musicaPulada = filaMusicas.songs[0];
        const posicaoPulada = encontrarPosicao(filaMusicas, musicaPulada);
        const barraProgresso = criarBarraProgresso(filaMusicas.currentTime / musicaPulada.duration);

        //* Voltar até a música selecionada ou voltar música anterior
        if (opcoes.para) await filaMusicas.jump(opcoes.para);
        else await filaMusicas.previous();

        // Próxima música, música selecionada ou música relacionada
        let musicaProxima = filaMusicas.previousSongs.at(-1);
        const posicaoProxima = encontrarPosicao(filaMusicas, musicaProxima);

        const EmbedAnterior = new MessageEmbed()
            .setColor(client.defs.corEmbed.aviso)
            .setTitle(`${this.emoji} Voltar música`)
            .setDescription(`${musicaPulada.name}`)
            .addField("👤 Autor", `[${musicaPulada.uploader.name}](${musicaPulada.uploader.url} 'Ir para autor')`, true)
            .addField("🔢 Posição", `${posicaoPulada.posicaoMusica}/${posicaoPulada.tamanhoFila}`, true)
            .addField("⏳ Duração", `[${barraProgresso}] [${filaMusicas.formattedCurrentTime}/${musicaPulada.formattedDuration}]`, false)
            .setFooter({ text: `Adicionado por ${musicaPulada.member.displayName}`, iconURL: musicaPulada.member.displayAvatarURL({ dynamic: true, size: 32 }) });

        const EmbedProxima = new MessageEmbed();
        if (musicaProxima) {
            EmbedProxima.setColor(client.defs.corEmbed.normal)
                .setTitle(`▶️ Próxima música`)
                .setDescription(`${musicaProxima.name}`)
                .addField("👤 Autor", `[${musicaProxima.uploader.name}](${musicaProxima.uploader.url} 'Ir para autor')`, true)
                .addField("🔢 Posição", `${posicaoProxima.posicaoMusica}/${posicaoProxima.tamanhoFila}`, true)
                .addField("⏳ Duração", `${musicaProxima.formattedDuration}`, true)
            if (musicaProxima.member) EmbedProxima.setFooter({ text: `Adicionado por ${musicaProxima.member.displayName}`, iconURL: musicaProxima.member.displayAvatarURL({ dynamic: true, size: 32 }) });
            else EmbedProxima.setFooter({ text: `Adicionado por ${iCmd.guild.me.displayName}`, iconURL: iCmd.guild.me.displayAvatarURL({ dynamic: true, size: 32 }) });
        } else {
            EmbedProxima.setColor(client.defs.corEmbed.nao)
                .setTitle(`❌ Nenhuma música na fila`)
                .setDescription(`Acabou as músicas`)
        }
        const resposta = await iCmd.reply({
            content: null,
            embeds: [EmbedAnterior, EmbedProxima],
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