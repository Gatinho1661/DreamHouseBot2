const { MessageEmbed } = require("discord.js");

module.exports = {
    //* Infomações do comando
    emoji: "🗑️",
    nome: "snipe",
    sinonimos: [],
    descricao: "Mostra as mensagens deletadas do canal",
    exemplos: [
        { comando: "snipe", texto: "Mostra a ultima mensagem apagada do canal" },
        { comando: "snipe [número]", texto: "Mostra uma mensagem específica apagada do canal" },
        { comando: "snipe [canal]", texto: "Mostra a ultima mensagem apagada de um canal específico" },
        { comando: "snipe [número] [canal]", texto: "Mostra uma mensagem específica apagada de um canal específico" }
    ],
    args: "{numero}, {canal}",
    opcoes: [
        {
            name: "numero",
            description: "Número de um snipe específico",
            type: client.defs.tiposOpcoes.NUMBER,
            required: false,
        },
        {
            name: "canal",
            description: "Canal para dar snipe",
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
        const snipes = client.snipes.get(opcoes.canal?.id || iCmd.channel.id) || [];

        if (!snipes?.length > 0) return client.responder(iCmd, "bloqueado", "Nenhuma mensagem deletada encontrada", `Se isso persistir fale com o <@${client.dono[0]}> para arrumar isso`);

        const snipedmsg = snipes[opcoes.numero ? opcoes.numero - 1 : 0];
        if (!snipedmsg && opcoes.numero?.value) return client.responder(iCmd, "bloqueado", "Snipe escolhido não encontrado", `Escolha um Snipe entre 1 e ${snipes.length}`);

        const mensagem = snipedmsg.mensagem.length > 1024 ? snipedmsg.mensagem.slice(0, 1021) + "..." : snipedmsg.mensagem

        client.log("info", `${snipedmsg.autor.username}: ${snipedmsg.mensagem} | ${snipedmsg.data.toLocaleString()}`)

        const Embed = new MessageEmbed()
            .setColor(client.defs.corEmbed.nao)
            .setAuthor({ name: `${snipedmsg.autor.username} falou:`, iconURL: snipedmsg.autor.displayAvatarURL({ dynamic: true, size: 32 }) })
            .setDescription(`"${mensagem}"`)
            .setFooter({ text: `Mensagem: ${opcoes.numero || 1}/${snipes.length}` })
            .setTimestamp(snipedmsg.data.toISOString());
        if (snipedmsg.imagem !== null) Embed.setImage(snipedmsg.imagem[0]);
        await iCmd.reply({ content: null, embeds: [Embed] }).catch();
    }
}