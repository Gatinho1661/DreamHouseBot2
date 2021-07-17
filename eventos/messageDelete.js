const { formatarCanal } = require("./../modulos/utils")

// Emitido quando uma mensagem é deletada
module.exports = {
    nome: "messageDelete",
    once: false, // Se deve ser executado apenas uma vez

    async executar(msg) {
        if (msg.author.bot) return; // ignorar se for uma msg de bot
        if (!msg.content) return console.debug(msg);

        client.log(null, `#${formatarCanal(msg.channel)} | @${msg.author.tag} deletou: ${msg.content.slice(0, 100).replaceAll("\n", " ")}`);
    }
}