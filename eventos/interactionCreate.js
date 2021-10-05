
const { formatarCanal } = require("../modulos/utils")
const autoCargos = require("../utilidades/autoCargos")
const { interacoes } = require("../modulos/nfs")

// Emitido quando uma interação é recebida
module.exports = {
    nome: "interactionCreate",
    once: false, // Se deve ser executado apenas uma vez

    async executar(i) {
        try {
            //* Comandos
            if (i.isCommand()) {
                const meme = client.memes.get(i.commandName) // pegar meme
                const usuario = i.options.getUser("usuario");

                if (meme) {
                    i.reply({ content: usuario ? `${usuario}\n${meme.meme}` : `${meme.meme}` })
                    client.log("meme", `${i.commandName} enviada em #${formatarCanal(i.channel)} por @${i.user.tag}`)
                    return;
                }

                client.log("comando", `Comando ${i.commandName} usado`)
            }

            //* Botões
            if (i.isMessageComponent()) {
                let botaoId = i.customId.split("=")
                const categoria = botaoId[0];
                const id = botaoId[1];
                const valor = botaoId[2];

                client.log("info", `Botão clickado: ${i.customId}`)

                if (categoria === "cargo") autoCargos(i, id);

                if (categoria === "nfs") interacoes(i, id, valor);
            }
        } catch (err) {
            client.log("erro", err.stack)
        }
        //console.debug(i)
    }
}