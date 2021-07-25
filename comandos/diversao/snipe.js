const { MessageEmbed } = require("discord.js");

module.exports = {
    //* Infomações do comando
    emoji: "🗑️",
    nome: "snipe",
    sinonimos: ["sniper", "deletado"],
    descricao: "Mostra as mensagens deletadas do canal",
    exemplos: [
        { comando: "snipe", texto: "Mostra a ultima mensagem apagada do canal" },
        { comando: "snipe [número]", texto: "Mostra uma mensagem específica apagada do canal" },
        { comando: "snipe [canal]", texto: "Mostra a ultima mensagem apagada de um canal específico" },
        { comando: "snipe [número] [canal]", texto: "Mostra uma mensagem específica apagada de um canal específico" }
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
        const snipes = client.snipes.get(canal.id) || [];

        const snipedmsg = snipes[args[0] - 1 || 0];

        if (Number(args[0]) > snipes.length) return client.responder(msg, this, "bloqueado", "🚫 Não tenho tantas mensagens salvas", `Eu tenho salvo ${snipes.length} mensagens deletadas nesse canal, todas as mensagens salvas são deletadas quando o bot é reiniciado`);
        if (!snipedmsg) return client.responder(msg, this, "bloqueado", "🚫 Nenhuma mensagem deletada encontrada", `Se isso persistir fale com o <@${client.dono[0]}> para arrumar isso`);

        const mensagem = snipedmsg.mensagem.length > 1024 ? snipedmsg.mensagem.slice(0, 1021) + "..." : snipedmsg.mensagem

        client.log("info", `${snipedmsg.autor.username}: ${snipedmsg.mensagem} | ${snipedmsg.data.toLocaleString()}`)

        const Embed = new MessageEmbed()
            .setColor(client.defs.corEmbed.nao)
            .setAuthor(`${snipedmsg.autor.username} falou:`, snipedmsg.autor.displayAvatarURL({ dynamic: true, size: 16 }))
            .setDescription(`"${mensagem}"`)
            .setFooter(`Mensagem: ${Number(args[0]) || 1}/${snipes.length}`)
            .setTimestamp(snipedmsg.data.toISOString());
        if (snipedmsg.imagem !== null) Embed.setImage(snipedmsg.imagem[0]);
        await msg.channel.send({ content: null, embeds: [Embed], reply: { messageReference: msg } }).catch();
    }
}