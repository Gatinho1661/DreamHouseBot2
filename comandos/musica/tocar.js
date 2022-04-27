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
            required: true,
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
    testando: false,

    //* Comando
    async executar(iCmd, opcoes) {

        const resposta = await iCmd.deferReply();


        client.log("api", `DisTube: Procurando por música "${opcoes.musica}"`);

        // Procurar e iniciar música
        await client.distube.play(iCmd.member.voice.channel, opcoes.musica, {
            member: iCmd.member,
            textChannel: iCmd.channel,
            metadata: {
                id: null,                   // Id de música gerada para poder procurar depois
                iCmd,                       // Comando para ser respondido nos eventos
                msgAdicionadaEm: resposta,  // Mensagem que a música ou playlist foi adicionada
                msgsParaApagar: [],         // Mensagens que serão apagadas quando a música acabar
            }
        });

        // Resto do comando está nos eventos addList e addList do DisTube...
        // é o que eu consegui fazer sem suporte a comandos / do Distube
    },

    //* Autocompletar
    async autocompletar(iteracao, pesquisa) {

        if (pesquisa.value.length <= 2) return [];

        //* Pegar fila de música
        const musicas = await client.distube.search(pesquisa.value, {
            limit: 5,
            type: "video",
            safeSearch: false
        }).catch(() => {
            client.log("api", `DisTube: Nenhum resultado foi retornado`)
            return [];
        });

        const resultados = musicas.map(resultado => ({ name: resultado.name.slice(0, 100), value: resultado.url }));

        return resultados;
    }
}