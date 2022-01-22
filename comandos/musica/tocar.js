const { MessageEmbed, MessageButton } = require("discord.js");

module.exports = {
    //* Infomações do comando
    emoji: "🎵",
    nome: "tocar",
    sinonimos: [],
    descricao: "Toque músicas do YouTube, Spotify ou SoundCloud",
    exemplos: [
        { comando: "tocar [link]", texto: "Toca músicas do YouTube, Spotify ou SoundCloud" },
    ],
    args: "",
    opcoes: [
        {
            name: "musica",
            description: "Nome ou link da música do YouTube, Spotify ou SoundCloud",
            type: client.defs.tiposOpcoes.STRING,
            required: true
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

        await iCmd.deferReply();

        // Pesquisar por músicas
        const pesquisa = opcoes.musica;
        const resultado = await client.player.search(pesquisa, { requestedBy: iCmd.user });

        // Se nada for encontrado
        if (!resultado || !resultado.tracks?.length) return client.responder(iCmd, "bloqueado", "Nenhuma música encontrada", "Verifique que você escreveu corretamente")

        // Criar fila de músicas do servidor
        const filaMusicas = client.player.createQueue(iCmd.guild, {
            metadata: {
                canal: iCmd.channel
            }
        });

        // Conectar ao canal de voz
        if (!filaMusicas.connection) {
            try {
                await filaMusicas.connect(iCmd.member.voice.channel);
            } catch {
                filaMusicas.destroy();
                return client.responder(iCmd, "erro", "Ocorreu um erro", "Não consegui entrar no seu canal de voz");
            }
        }

        // Adicionar música ou playlist encontrada
        resultado.playlist ? filaMusicas.addTracks(resultado.tracks) : filaMusicas.addTrack(resultado.tracks[0]);

        // Iniciar música
        if (!filaMusicas.playing) await filaMusicas.play();

        if (!resultado.playlist) {
            const musicaAdicionada = resultado.tracks[0];

            const link = new MessageButton()
                .setLabel("Ir para música")
                .setStyle("LINK")
                .setURL(musicaAdicionada.url)
            const Embed = new MessageEmbed()
                .setColor(client.defs.corEmbed.normal)
                .setTitle(`${this.emoji} Música adicionada`)
                .setDescription(`${musicaAdicionada.title}`)
                .setImage(musicaAdicionada.thumbnail)
                .setFooter({ text: `Adicionado por ${iCmd.member.displayName}`, iconURL: iCmd.member.displayAvatarURL({ dynamic: true, size: 32 }) })
                .addField("👤 Autor", `${musicaAdicionada.author}`, true);
            if (musicaAdicionada.views) Embed.addField("👀 Visualizações", `${musicaAdicionada.views.toLocaleString()}`, true)
            Embed.addField("⏳ Duração", `${musicaAdicionada.duration}`, true);
            await iCmd.editReply({
                content: null,
                embeds: [Embed],
                components: [{ type: 'ACTION_ROW', components: [link] }]
            }).catch();
        } else {
            const playlistAdicionada = resultado.tracks[0].playlist;

            const link = new MessageButton()
                .setLabel(`Ir para ${playlistAdicionada.type === "playlist" ? "playlist" : "álbum"}`)
                .setStyle("LINK")
                .setURL(playlistAdicionada.url)
            const Embed = new MessageEmbed()
                .setColor(client.defs.corEmbed.normal)
                .setTitle(
                    `${this.emoji} ` + (
                        playlistAdicionada.type === "playlist"
                            ? "Playlist adicionada"
                            : "Álbum adicionado"
                    )
                )
                .setDescription(`${playlistAdicionada.title}`)
                .addField("👤 Autor", `${playlistAdicionada.author.name}`, true)
                .addField("🎶 Músicas", `${playlistAdicionada.tracks.length}`, true)
                .setImage(playlistAdicionada.thumbnail)
                .setFooter({ text: `Adicionado por ${iCmd.member.displayName}`, iconURL: iCmd.member.displayAvatarURL({ dynamic: true, size: 32 }) });
            await iCmd.editReply({
                content: null,
                embeds: [Embed],
                components: [{ type: 'ACTION_ROW', components: [link] }]
            }).catch();
        }
    }
}

/*        const player = createAudioPlayer({
            behaviors: {
                noSubscriber: "pause",
            },
        });

        const musica = createAudioResource("C:/Users/PLay9/Documents/minhas programações/DreamHouse Bot Atingo/data/audios/pessoal/252902151469137922/sayso.mp3");

        player.play(musica);

        const connection = joinVoiceChannel({
            channelId: iCmd.member.voice.channel.id,
            guildId: iCmd.channel.guild.id,
            adapterCreator: iCmd.channel.guild.voiceAdapterCreator,
        });

        await entersState(connection, VoiceConnectionStatus.Ready, 30e3);

        connection.subscribe(player);

        const Embed = new MessageEmbed()
            .setColor(client.defs.corEmbed.normal)
            .setDescription(`${this.emoji} Tocando musica`)
        iCmd.reply({ content: null, embeds: [Embed] }).catch(); */