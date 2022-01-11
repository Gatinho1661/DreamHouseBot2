const { MessageEmbed } = require("discord.js");

module.exports = {
    //* Infomações do comando
    emoji: "🎱",
    nome: "8ball",
    sinonimos: [],
    descricao: "Faça uma pergunta e tenha uma resposta definitiva para seus problemas",
    exemplos: [
        { comando: "8ball [pergunta]", texto: "Pergunta alguma coisa" },
    ],
    args: "",
    opcoes: [
        {
            name: "pergunta",
            description: "Sua pergunta para eu responder para você",
            type: client.defs.tiposOpcoes.STRING,
            required: true
        },
    ],
    canalVoz: false,
    contaPrimaria: false,
    apenasServidor: false,
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
        const respostas = ["Sim", "Claro que sim", "Provavelmente sim", "Provavelmente não", "Claro que não", "Não"]
        const aleatorio = Math.floor(Math.random() * respostas.length);

        const pergunta = opcoes.pergunta.slice(0, 2045);

        const EmbedPergunta = new MessageEmbed()
            .setColor(iCmd.member.displayColor ? iCmd.member.displayHexColor : client.defs.corEmbed.normal)
            .setAuthor({ name: iCmd.member.displayName, iconURL: iCmd.member.displayAvatarURL({ dynamic: true, size: 32 }) })
            .setDescription(`${pergunta}`)
        const EmbedResposta = new MessageEmbed()
            .setColor(iCmd.guild.me.displayColor ? iCmd.guild.me.displayHexColor : client.defs.corEmbed.normal)
            .setAuthor({ name: iCmd.guild.me.displayName, iconURL: iCmd.guild.me.displayAvatarURL({ dynamic: true, size: 32 }) })
            .setDescription(`${respostas[aleatorio]}`)
        iCmd.reply({ content: null, embeds: [EmbedPergunta, EmbedResposta] }).catch();
    }
}