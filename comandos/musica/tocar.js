const { MessageEmbed } = require("discord.js");

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
    testando: true,

    //* Comando
    async executar(iCmd, opcoes) {

        const Embed = new MessageEmbed()
            .setColor(client.defs.corEmbed.carregando)
            //.setTitle(`${this.emoji} Música adicionada`)
            .setAuthor({ name: "Adicionando música...", iconURL: client.defs.imagens.carregando })
            .setDescription(`${opcoes.musica}`)
            .setFooter({ text: `${iCmd.member.displayName}`, iconURL: iCmd.member.displayAvatarURL({ dynamic: true, size: 32 }) });
        const resposta = await iCmd.reply({ content: null, embeds: [Embed], fetchReply: true }).catch();

        // Procurar e iniciar música
        await client.distube.play(iCmd.member.voice.channel, opcoes.musica, {
            member: iCmd.member,
            textChannel: iCmd.channel,
            metadata: { iCmd, resposta }
        });
    },

    //* Autocompletar
    async autocompletar(iteracao, pesquisa) {

        if (pesquisa.value.length <= 2) return [];

        //* Pegar lista de memes
        const musicas = await client.distube.search(pesquisa.value, {
            limit: 25,
            type: "video",
            safeSearch: false
        });

        //const filtrado = musicas.filter(meme => meme.startsWith(pesquisa.value.toLowerCase()));
        const resultados = musicas.map(resultado => ({ name: resultado.name.slice(0, 100), value: resultado.url }));

        return resultados;
    }
}