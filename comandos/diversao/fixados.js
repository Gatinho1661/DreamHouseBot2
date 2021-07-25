const { MessageEmbed } = require("discord.js");

module.exports = {
    //* Infomações do comando
    emoji: "📌",
    nome: "fixados",
    sinonimos: ["fixado"],
    descricao: "Receba um fixado aleatorio",
    exemplos: [
        { comando: "fixados", texto: "Mostra um fixado aleatorio" },
        { comando: "fixados [número]", texto: "Mostra um fixado específico" },
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
        const fixados = client.mensagens.get("fixados");
        if (!fixados.length > 0) return client.responder(msg, this, "erro", "❗ Uhm... parabéns?", "você encontrou uma mensagem rara, eu não encontrei nenhum fixado salvo, provavelmente eu ainda estou salvando as mensagens, tente novamente mais tarde");

        const escolhido = args[0] ? args[0] - 1 : Math.floor(Math.random() * fixados.length);
        const fixado = fixados[escolhido];
        if (!fixado && args[0]) return client.responder(msg, this, "bloqueado", "🚫 Fixado escolhido não encontrado", `Escolha um fixado entre 1 e ${fixados.length}`);
        if (!fixado && !args[0]) return client.responder(msg, this, "erro", "❌ Ocorreu um erro", "estranho não sei nem como explicar o erro que ocorreu");

        client.log("info", `Fixado escolhido: [${fixado.createdAt.toLocaleString()}] ${fixado.author.tag}:"${fixado.content}" imagem:${fixado.attachments.first() ? fixado.attachments.first().proxyURL : "nenhum anexo"} id:${fixado.id}`);

        const filtro = /https?:\/\/(www.)?([/|.|\w|-])*\.(?:jpg|jpeg|gif|png|webp)/;
        const imagem = fixado.attachments.first() ? fixado.attachments.first().proxyURL : fixado.content.match(filtro)[0]

        const Embed = new MessageEmbed()
            .setColor(client.defs.corEmbed.normal)
            .setTitle(`📌 Fixado aleatório (${escolhido + 1}/${fixados.length})`)
            .setTimestamp(fixado.createdAt.toISOString())
            .setFooter(fixado.author.tag, fixado.author.avatarURL({ dynamic: true, size: 16 }));
        if (fixado.content) Embed.setDescription(fixado.content);
        if (imagem) Embed.setImage(imagem);
        await msg.channel.send({ content: null, embeds: [Embed], reply: { messageReference: msg } }).catch();
    }
}