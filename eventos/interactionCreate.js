
const { formatarCanal } = require("../modulos/utils")
const autoCargos = require("../modulos/autoCargos")
const { interacoes } = require("../modulos/nfs")

// Emitido quando uma mensagem nova é enviada
module.exports = {
    nome: "interactionCreate",
    once: false, // Se deve ser executado apenas uma vez

    async executar(i) {
        try {
            //* Comandos
            if (i.isCommand()) {
                const meme = client.memes.get(i.commandName) // pegar meme

                if (meme) {
                    i.reply({
                        content: meme.meme,
                    })
                    client.log("log", `#${formatarCanal(i.channel)} | @${i.user.tag} Meme: ${i.commandName}`)
                    return;
                }

                client.log("verbose", `Comando ${i.commandName} usado`)
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