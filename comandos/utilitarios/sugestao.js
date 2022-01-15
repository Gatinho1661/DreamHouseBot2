const { MessageEmbed } = require("discord.js");

module.exports = {
    //* Infomações do comando
    emoji: "📝",
    nome: "sugestao",
    sinonimos: [],
    descricao: "Tem alguma sugestão para fazer? Use esse comando e me diga o que mudar",
    exemplos: [
        { comando: "ajuda", texto: "Mostra a lista de categorias dos comandos" },
        { comando: "ajuda [número]", texto: "Mostra a lista com todos os comandos de uma categoria" },
        { comando: "ajuda [comando]", texto: "Mostra ajuda sobre um comando específico" }
    ],
    args: "",
    opcoes: [
        {
            name: "para",
            description: "Que tipo de sugestão deseja fazer?",
            type: client.defs.tiposOpcoes.STRING,
            required: true,
            choices: [
                {
                    name: "Adicionar",
                    value: "adicionar"
                },
                {
                    name: "Remover",
                    value: "remover"
                },
                {
                    name: "Modificar",
                    value: "modificar"
                },
                {
                    name: "Arrumar",
                    value: "arrumar"
                },
            ]
        },
        {
            name: "sugestao",
            description: "Diga me sua sugestão a fazer",
            type: client.defs.tiposOpcoes.STRING,
            required: true,
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
    suporteBarra: true,
    testando: false,

    //* Comando
    async executar(iCmd, opcoes) {
        if (!/^[a-zA-Zà-úÀ-Ú]{1,100}$/.test(opcoes.para)) return client.responder(iCmd, "bloqueado", "Tipo de sugestão inválido", "O tipo só pode conter letras com o máximo de 100 caracteres");
        if (!/^.{1,4000}$/.test(opcoes.sugestao)) return client.responder(iCmd, "bloqueado", "Sugestão inválida", "A sugestão só pode conter o máximo de 4000 caracteres");

        const dono = await client.users.fetch(client.dono[0]);
        if (!dono) throw Error("Dono do bot não encontrado");

        //* Enviar sugestão para o dono do bot
        const Sugestao = new MessageEmbed()
            .setColor(client.defs.corEmbed.normal)
            .setAuthor({ name: iCmd.user.tag, iconURL: iCmd.user.displayAvatarURL({ dynamic: true, size: 32 }) })
            .setTitle(`📝 Sugestão - ${opcoes.para}`)
            .setDescription(opcoes.sugestao);
        await dono.send({ content: null, embeds: [Sugestao] }).catch();

        //* Avisar que foi enviado
        const Embed = new MessageEmbed()
            .setColor(client.defs.corEmbed.sim)
            .setTitle(`📝 Sugestão enviada`)
            .setDescription("Sua sugestão foi enviada");
        await iCmd.reply({ content: null, embeds: [Embed], ephemeral: true }).catch();
    }
};
