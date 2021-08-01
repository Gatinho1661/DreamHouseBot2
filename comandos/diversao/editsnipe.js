const { MessageEmbed } = require("discord.js");

module.exports = {
    //* Infomações do comando
    emoji: "✏️",
    nome: "editsnipe",
    sinonimos: ["editsniper", "editado"],
    descricao: "Mostra as mensagens editadas do canal",
    exemplos: [
        { comando: "snipe", texto: "Mostra a ultima mensagem editada do canal" },
        { comando: "snipe [número]", texto: "Mostra uma mensagem específica editada do canal" },
        { comando: "snipe [canal]", texto: "Mostra a ultima mensagem editada de um canal específico" },
        { comando: "snipe [número] [canal]", texto: "Mostra uma mensagem específica editada de um canal específico" }
    ],
    args: "{numero}, {canal}",
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

    //* Comando
    async executar(msg, args) {
        const canal = msg.mentions.channels.first() || msg.channel
        const editSnipes = client.editSnipes.get(canal.id) || [];

        const editSnipedmsg = editSnipes[args[0] - 1 || 0];

        if (Number(args[0]) > editSnipes.length) return client.responder(msg, this, "bloqueado", "Não tenho tantas mensagens salvas", `Eu tenho salvo ${editSnipes.length} mensagens editada nesse canal, todas as mensagens salvas são deletadas quando o bot é reiniciado`);
        if (!editSnipedmsg) return client.responder(msg, this, "bloqueado", "Nenhuma mensagem editada encontrada", `Se isso persistir fale com o <@${client.dono[0]}> para arrumar isso`);

        const msgAntiga = editSnipedmsg.msgAntiga.length > 1024 ? editSnipedmsg.msgAntiga.slice(0, 1021) + "..." : editSnipedmsg.msgAntiga
        const msgNova = editSnipedmsg.msgNova.length > 1024 ? editSnipedmsg.msgNova.slice(0, 1021) + "..." : editSnipedmsg.msgNova

        client.log("info", `${editSnipedmsg.autor.username}: ${editSnipedmsg.mensagem} | ${editSnipedmsg.data.toLocaleString()}`)

        const Embed = new MessageEmbed()
            .setColor(client.defs.corEmbed.aviso)
            .setAuthor(`${editSnipedmsg.autor.username} editou:`, editSnipedmsg.autor.displayAvatarURL({ dynamic: true, size: 16 }))
            .addFields(
                { name: 'Antes', value: `"${msgAntiga}"`, inline: true },
                { name: 'Depois', value: `"${msgNova}"`, inline: true },
            )
            .setFooter(`Mensagem: ${Number(args[0]) || 1}/${editSnipes.length}`)
            .setTimestamp(editSnipedmsg.data.toISOString());
        if (editSnipedmsg.imagem !== null) Embed.setImage(editSnipedmsg.imagem[0]);
        await msg.channel.send({ content: null, embeds: [Embed], reply: { messageReference: msg } }).catch();
    }
}