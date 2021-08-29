const { MessageEmbed } = require("discord.js");
const { formatarCanal } = require("../modulos/utils")

// Emitido quando uma mensagem nova é enviada
module.exports = {
    nome: "interactionCreate",
    once: false, // Se deve ser executado apenas uma vez

    async executar(i) {
        try {
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

            if (i.isMessageComponent()) {
                //client.log("info", `Botão clickado: ${i.customId}`)

                let botaoId = i.customId.split("=")
                const tipoBotao = botaoId[0];
                const id = botaoId[1];
                const valor = botaoId[2];

                if (tipoBotao === "cargo") {
                    if (!i.channel.permissionsFor(client.user).has(['SEND_MESSAGES', 'MANAGE_ROLES'])) return client.log("aviso", "Não consigo adicionar cargo por falta de permissão")

                    const cargoId = id

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
                if (tipoBotao === "nfs") {
                    if (id === "participar") {
                        if (!client.nfs.has("participantes")) return client.log("erro", "Não consegui adicionar participante ao evento");

                        let participantes = client.nfs.get("participantes")

                        if (participantes.find(u => u.id === i.user.id)) {
                            const embed = new MessageEmbed()
                                .setColor(client.defs.corEmbed.nao)
                                .setTitle("🚫 Já participando")
                                .setDescription(`Você já está participando do **No Fap September**`)
                            return i.reply({ content: null, embeds: [embed], ephemeral: true }).catch();
                        }
                        const usuario = {
                            id: i.user.id,
                            nome: i.user.username,
                            perdeu: false,
                            perdeuEm: null,
                        }
                        client.nfs.push("participantes", usuario);

                        const cargo = client.nfs.get("cargo")

                        const embed = new MessageEmbed()
                            .setColor(client.defs.corEmbed.sim)
                            .setTitle("✅ Participando")
                            .setDescription(`Você está participando do **No Fap September**\nvocê recebeu o cargo: <@&${cargo}>`)
                        i.reply({ content: null, embeds: [embed], ephemeral: true }).catch();
                        client.log("servidor", `${i.user.tag} está participando do NFS`);

                        participantes = client.nfs.get("participantes").map(part => part.id);

                        i.message.edit({
                            content: null,
                            embeds: [i.message.embeds[0].setDescription("• <@" + participantes.join(">\n• <@") + ">")],
                            components: i.message.components
                        }).catch();
                    }
                    if (id === "passou") {
                        const dia = valor;
                        if (!dia) throw new Error(`Sem dia em botão da msg ${i.message.id}`);

                        const checks = client.nfs.get("checks");
                        if (!checks || checks.length === 0) throw new Error(`Nenhum checks do dia encontrado`);

                        const checkIndex = checks.findIndex(check => check.dia === valor);
                        const check = checks[checkIndex];
                        if (!check) throw new Error(`Sem check do dia ${dia}`);

                        if (check.ganhadores.includes(i.user.id) || check.perdedores.includes(i.user.id)) {
                            const embed = new MessageEmbed()
                                .setColor(client.defs.corEmbed.nao)
                                .setTitle("🚫 Já respondido")
                                .setDescription(`Você já respondeu esse check`)
                            return i.reply({ content: null, embeds: [embed], ephemeral: true }).catch();
                        }

                        const participantes = client.nfs.get("participantes");
                        if (!participantes || participantes.length === 0) throw new Error(`Nenhum participante encontrado`);

                        const participanteIndex = participantes.findIndex(participante => participante.id === i.user.id);
                        const participante = participantes[participanteIndex];
                        if (!participante) {
                            const embed = new MessageEmbed()
                                .setColor(client.defs.corEmbed.nao)
                                .setTitle("🚫 Não participando")
                                .setDescription(`Você não está participando desse evento`)
                            return i.reply({ content: null, embeds: [embed], ephemeral: true }).catch();
                        }
                        if (participante.perdeu === true) {
                            const embed = new MessageEmbed()
                                .setColor(client.defs.corEmbed.nao)
                                .setTitle("🚫 Você já perdeu")
                                .setDescription(`Você já perdeu, não adianta`)
                            return i.reply({ content: null, embeds: [embed], ephemeral: true }).catch();
                        }

                        check.ganhadores.push(i.user.id);
                        checks[checkIndex] = check;

                        client.nfs.set("checks", checks);
                        const embed = new MessageEmbed()
                            .setColor(client.defs.corEmbed.sim)
                            .setTitle("✅ Check feito")
                            .setDescription(`Boa, continue forte`)
                        i.reply({ content: null, embeds: [embed], ephemeral: true }).catch();
                    }
                }
            }
        } catch (err) {
            client.log("erro", err.stack)
        }
        //console.debug(i)
    }
}