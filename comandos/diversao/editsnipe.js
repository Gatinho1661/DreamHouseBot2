const { MessageEmbed } = require("discord.js");

module.exports = {
    //* Infomações do comando
    emoji: "✏️",
    nome: "editsnipe",
    sinonimos: [],
    descricao: "Mostra as mensagens editadas do canal",
    exemplos: [
        { comando: "snipe", texto: "Mostra a ultima mensagem editada do canal" },
        { comando: "snipe [número]", texto: "Mostra uma mensagem específica editada do canal" },
        { comando: "snipe [canal]", texto: "Mostra a ultima mensagem editada de um canal específico" },
        { comando: "snipe [número] [canal]", texto: "Mostra uma mensagem específica editada de um canal específico" }
    ],
    args: "{numero}, {canal}",
    opcoes: [
        {
            name: "numero",
            description: "Número de uma editsnipe específico",
            type: client.defs.tiposOpcoes.NUMBER,
            required: false,
        },
        {
            name: "canal",
            description: "Canal para dar editsnipe",
            type: client.defs.tiposOpcoes.CHANNEL,
            required: false,
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
        const editSnipes = client.editSnipes.get(opcoes.canal?.id || iCmd.channel.id) || [];
        if (!editSnipes?.length > 0) return client.responder(iCmd, "bloqueado", "Nenhuma mensagem editada encontrada", `Se isso persistir fale com o <@${client.dono[0]}> para arrumar isso`);

        const editSnipedmsg = editSnipes[opcoes?.numero - 1 || 0];
        if (!editSnipedmsg && opcoes?.numero) return client.responder(iCmd, "bloqueado", "Editsnipe escolhido não encontrado", `Escolha um editsnipe entre 1 e ${editSnipes.length}`);

        const msgAntiga = editSnipedmsg.msgAntiga.length > 1024 ? editSnipedmsg.msgAntiga.slice(0, 1021) + "..." : editSnipedmsg.msgAntiga
        const msgNova = editSnipedmsg.msgNova.length > 1024 ? editSnipedmsg.msgNova.slice(0, 1021) + "..." : editSnipedmsg.msgNova

        client.log("info", `${editSnipedmsg.autor.username}: ${editSnipedmsg.mensagem} | ${editSnipedmsg.data.toLocaleString()}`)

        const Embed = new MessageEmbed()
            .setColor(client.defs.corEmbed.aviso)
            .setAuthor({ name: `${editSnipedmsg.autor.username} editou:`, iconURL: editSnipedmsg.autor.displayAvatarURL({ dynamic: true, size: 32 }) })
            .addFields(
                { name: 'Antes', value: `"${msgAntiga}"`, inline: true },
                { name: 'Depois', value: `"${msgNova}"`, inline: true },
            )
            .setFooter({ text: `Mensagem: ${opcoes?.numero || 1}/${editSnipes.length}` })
            .setTimestamp(editSnipedmsg.data.toISOString());
        if (editSnipedmsg.imagem !== null) Embed.setImage(editSnipedmsg.imagem[0]);
        await iCmd.reply({ content: null, embeds: [Embed] }).catch();
    }
}