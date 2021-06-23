const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");

// Emitido quando uma mensagem nova é enviada
module.exports = (client, i) => {
    try {
        if (i.isCommand()) {
            const meme = client.memes.get(i.commandName) // pegar meme
            const canal = /store|news|text/i.test(i.channel.type) ? (i.channel.name.includes("│") ? i.channel.name.split("│")[1] : i.channel.name) : "DM"

            if (meme) {
                i.reply({
                    content: meme.meme,
                })
                client.log("log", `#${canal} | @${i.user.tag} Meme: ${i.commandName}`)
                return;
            }

            client.log("verbose", `Comando ${i.commandName} usado`)
        }

        /*if (i.isMessageComponent()) {
            //client.log("debug", `Botão clickado: ${i.customID}`)
        }*/
    } catch (err) {
        client.log("erro", err.stack)
    }
    //console.debug(i)
}

// TODO refazer isso ai para usar collector
