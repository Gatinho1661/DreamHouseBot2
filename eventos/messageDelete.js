const { formatarCanal } = require("./../modulos/utils")

// Emitido quando uma mensagem é deletada
module.exports = {
    nome: "messageDelete",
    once: false, // Se deve ser executado apenas uma vez

    async executar(msg) {
        if (msg.type === null) client.log("aviso", "Mensagem apagada não salva");
        if (!msg.content) return;
        if (msg.author.bot) return;

        client.log(null, `#${formatarCanal(msg.channel)} | @${msg.author.tag} deletou: ${msg.content.slice(0, 100).replaceAll("\n", " ")}`);

        const snipes = client.snipes.get(msg.channel.id) || [];
        snipes.unshift({
            mensagem: msg.content,
            imagem: msg.content.match(/https?:\/\/(www.)?([/|.|\w|-])*\.(?:jpg|jpeg|gif|png|webp)/),
            autor: msg.author,
            data: msg.createdAt
        });

        client.snipes.set(msg.channel.id, snipes);
    }
}