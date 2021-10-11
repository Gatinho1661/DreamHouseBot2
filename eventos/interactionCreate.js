
const { formatarCanal } = require("../modulos/utils")
const autoCargos = require("../utilidades/autoCargos")
const { interacoes } = require("../modulos/nfs")

// Emitido quando uma interação é recebida
module.exports = {
    nome: "interactionCreate",
    once: false, // Se deve ser executado apenas uma vez

    async executar(i) {
        try {
            switch (i.type) {
                //* Comandos
                case "APPLICATION_COMMAND": {
                    const meme = client.memes.get(i.commandName) // pegar meme

                    if (meme) {
                        const usuario = i.options.getUser("usuario");

                        i.reply({ content: usuario ? `${usuario}\n${meme.meme}` : `${meme.meme}` })
                        client.log("meme", `${i.commandName} enviada em #${formatarCanal(i.channel)} por @${i.user.tag}`)
                        break;
                    }

                    client.log("comando", `Comando ${i.commandName} usado`)
                    break;
                }

                //* Botões
                case "MESSAGE_COMPONENT": {
                    let botaoId = i.customId.split("=")
                    const categoria = botaoId[0];
                    const id = botaoId[1];
                    const valor = botaoId[2];

                    client.log("info", `Botão clickado: ${i.customId}`)

                    if (categoria === "cargo") autoCargos(i, id);

                    if (categoria === "nfs") interacoes(i, id, valor);
                    break;
                }

                default:
                    client.log("erro", `Interação recebida desconhecida: ${i.type}`)
                    break;
            }
        } catch (err) {
            client.log("erro", err.stack)
        }
    }
}