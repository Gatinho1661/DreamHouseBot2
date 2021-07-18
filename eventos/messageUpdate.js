const { formatarCanal } = require("../modulos/utils")

// Emitido quando uma mensagem é deletada
module.exports = {
    nome: "messageUpdate",
    once: false, // Se deve ser executado apenas uma vez

    async executar(msgAntiga, msgNova) {
        if (msgNova.author.bot) return; // ignorar se for uma msg de bot
        if (!msgAntiga.content || !msgNova.content) return console.debug(msgNova);

        client.log(null, `#${formatarCanal(msgNova.channel)} | @${msgNova.author.tag} editou: ${msgAntiga.content.slice(0, 100).replaceAll("\n", " ")} -> ${msgNova.content.slice(0, 100).replaceAll("\n", " ")}`);

        const editSnipes = client.editSnipes.get(msgNova.channel.id) || [];
        editSnipes.unshift({
            msgAntiga: msgAntiga.content,
            msgNova: msgNova.content,
            imagem: msgAntiga.content.match(/https?:\/\/(www.)?([/|.|\w|-])*\.(?:jpg|gif|png)/),
            autor: msgNova.author,
            data: msgNova.editedAt
        });

        client.editSnipes.set(msgNova.channel.id, editSnipes);
    }
}