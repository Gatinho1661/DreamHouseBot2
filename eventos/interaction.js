const { MessageEmbed } = require("discord.js");

// Emitido quando uma mensagem nova é enviada
module.exports = async (client, i) => {
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

        if (i.isMessageComponent()) {
            //client.log("info", `Botão clickado: ${i.customID}`)

            let botaoId = i.customID.split("=")
            const tipoBotao = botaoId.shift();

            if (tipoBotao === "cargo") {
                if (!i.channel.permissionsFor(client.user).has(['SEND_MESSAGES', 'MANAGE_ROLES'])) return client.log("aviso", "Não consigo adicionar cargo por falta de permissão")

                const cargoId = botaoId[0]

                //i.defer({ ephemeral: true })

                //const msgCargos = client.config.get("msgCargos");
                //const servidor = await client.guilds.fetch(msgCargos.servidor);

                const cargo = await i.guild.roles.fetch(cargoId);

                //const membro = servidor.members.fetch(i.user);

                if (!i.member.roles.cache.find(c => c.id === cargo.id)) {
                    //* Adicionar cargo

                    i.member.roles.add(cargo, "Cargo autoaplicado")

                    //i.deferUpdate()

                    const embed = new MessageEmbed()
                        .setColor(client.defs.corEmbed.sim)
                        .setTitle("✅ Cargo adicionado")
                        .setDescription(`${cargo.toString()} foi adicionado`)

                    i.reply({ content: null, embeds: [embed], ephemeral: true }).catch();

                } else {
                    //* Remover cargo

                    i.member.roles.remove(cargo, "Cargo autoremovido")

                    //i.deferUpdate()

                    const embed = new MessageEmbed()
                        .setColor(client.defs.corEmbed.nao)
                        .setTitle("❌ Cargo removido")
                        .setDescription(`${cargo.toString()} foi removido`)

                    i.reply({ content: null, embeds: [embed], ephemeral: true }).catch();
                }
            }
        }
    } catch (err) {
        client.log("erro", err.stack)
    }
    //console.debug(i)
}
