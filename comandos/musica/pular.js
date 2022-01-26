const { MessageEmbed } = require("discord.js");
const { criarBarraProgresso, encontrarPosicao } = require("../../modulos/utils");

module.exports = {
    //* Infomações do comando
    emoji: "⏭️",
    nome: "pular",
    sinonimos: [],
    descricao: "Pula a música que estou tocando",
    exemplos: [
        { comando: "pular", texto: "Pula a música atual" },
        { comando: "pular [para]", texto: "Pula a música escolhida" },
    ],
    args: "",
    opcoes: [
        {
            name: "para",
            description: "Música para pular para",
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
        const posicaoPulada = encontrarPosicao(filaMusicas, musicaPulada); //filaMusicas.previousSongs.length + 1;

        //* Pular até a música selecionada ou pular música atual
        if (opcoes.para) await filaMusicas.jump(opcoes.para);
        else await filaMusicas.skip();

        // Próxima música, música selecionada ou música relacionada
        let musicaProxima = filaMusicas.songs[1];
        const posicaoProxima = encontrarPosicao(filaMusicas, musicaProxima); //filaMusicas.previousSongs.length + 2;

        //const tamanhoFila = filaMusicas.previousSongs.length + filaMusicas.songs.length;
        const barraProgresso = criarBarraProgresso(filaMusicas.currentTime / musicaPulada.duration);

        const EmbedPulada = new MessageEmbed()
            .setColor(client.defs.corEmbed.aviso)
            .setTitle(`${this.emoji} Música pulada`)
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
            embeds: [EmbedPulada, EmbedProxima],
            fetchReply: true
        }).catch();

        // Adiciona a mensagem na lista de mensagens para apagar depois que a música finalizar
        const msgsParaApagar = musicaProxima.metadata?.msgsParaApagar || [];
        msgsParaApagar.push(resposta);

        console.log(musicaProxima.metadata.id)
        console.log(musicaProxima.metadata.msgsParaApagar.map(m => m.id))

        musicaProxima.metadata.msgsParaApagar = msgsParaApagar;
    },

    //* Autocompletar
    async autocompletar(iteracao) {
        // Pegar fila de músicas do servidor
        const filaMusicas = client.distube.getQueue(iteracao.guild);
        if (!filaMusicas) return [];

        return filaMusicas.songs.map((resultado, idx) => ({ name: resultado.name.slice(0, 100), value: idx })).slice(1);
    }
}