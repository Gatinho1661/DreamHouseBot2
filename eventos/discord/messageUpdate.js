const { formatarCanal } = require("../../modulos/utils")

// Emitido quando uma mensagem é deletada
module.exports = {
    nome: "messageUpdate",
    once: false, // Se deve ser executado apenas uma vez
    origem: client,

    async executar(msgAntiga, msgNova) {
        if (msgNova.type === null) client.log("aviso", "Mensagem apagada não salva");
        if (!msgAntiga.content || !msgNova.content) return
        if (msgNova.author.bot) return;

        client.log(null, `#${formatarCanal(msgNova.channel)} | @${msgNova.author.tag} editou: ${msgAntiga.content.slice(0, 100).replaceAll("\n", " ")} -> ${msgNova.content.slice(0, 100).replaceAll("\n", " ")}`);

        const editSnipes = client.editSnipes.get(msgNova.channel.id) || [];
        editSnipes.unshift({
            msgAntiga: msgAntiga.content,
            msgNova: msgNova.content,
            imagem: msgAntiga.content.match(/https?:\/\/(www.)?([/|.|\w|-])*\.(?:jpg|jpeg|gif|png|webp)/),
            autor: msgNova.author,
            data: msgNova.editedAt
        });

        client.editSnipes.set(msgNova.channel.id, editSnipes);
    }
}