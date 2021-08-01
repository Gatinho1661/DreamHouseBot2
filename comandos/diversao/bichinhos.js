const { MessageEmbed } = require("discord.js");

module.exports = {
    //* Infomações do comando
    emoji: "🐶",
    nome: "bichinhos",
    sinonimos: ["bichinho"],
    descricao: "Receba um bichinho aleatorio",
    exemplos: [
        { comando: "bichinhos", texto: "Mostra um bichinho aleatorio" },
        { comando: "bichinhos [número]", texto: "Mostra um bichinho específico" },
    ],
    args: "{numero}",
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
        const bichinhos = client.mensagens.get("bichinhos");
        if (!bichinhos.length > 0) return client.responder(msg, this, "erro", "Uhm... parabéns?", "você encontrou uma mensagem rara, eu não encontrei nenhum bichinho salvo, provavelmente eu ainda estou salvando as mensagens, tente novamente mais tarde");

        const escolhido = args[0] ? args[0] - 1 : Math.floor(Math.random() * bichinhos.length);
        const bichinho = bichinhos[escolhido];
        if (!bichinho && args[0]) return client.responder(msg, this, "bloqueado", "Bichinho escolhido não encontrado", `Escolha um bichinho entre 1 e ${bichinhos.length}`);
        if (!bichinho && !args[0]) return client.responder(msg, this, "erro", "Ocorreu um erro", "estranho não sei nem como explicar o erro que ocorreu");

        client.log("info", `Bichinho escolhido: [${bichinho.createdAt.toLocaleString()}] ${bichinho.author.tag}:"${bichinho.content}" imagem:${bichinho.attachments.first() ? bichinho.attachments.first().proxyURL : "nenhum anexo"} id:${bichinho.id}`);

        const filtro = /https?:\/\/(www.)?([/|.|\w|-])*\.(?:jpg|jpeg|gif|png|webp)/;
        const imagem = bichinho.attachments.first() ? bichinho.attachments.first().proxyURL : bichinho.content.match(filtro)[0]

        const Embed = new MessageEmbed()
            .setColor(client.defs.corEmbed.normal)
            .setTitle(`🐶 Bichinho aleatório (${escolhido + 1}/${bichinhos.length})`)
            .setTimestamp(bichinho.createdAt.toISOString())
            .setFooter(bichinho.author.tag, bichinho.author.avatarURL({ dynamic: true, size: 16 }));
        if (bichinho.content) Embed.setDescription(bichinho.content);
        if (imagem) Embed.setImage(imagem);
        await msg.channel.send({ content: null, embeds: [Embed], reply: { messageReference: msg } }).catch();
    }
}