
const { MessageEmbed, Constants } = require("discord.js");
const { formatarCanal } = require("../modulos/utils")
const autoCargos = require("../utilidades/autoCargos")
const { interacoes } = require("../modulos/nfs")

// Emitido quando uma interação é recebida
module.exports = {
    nome: "interactionCreate",
    once: false, // Se deve ser executado apenas uma vez

    async executar(iteracao) {
        try {
            switch (iteracao.type) {
                //* Comandos
                case "APPLICATION_COMMAND": {
                    const iCmd = iteracao;

                    const excTempo = new Date();
                    client.log("comando", `${iCmd.commandName} usando em #${formatarCanal(iCmd.channel)} por @${iCmd.user.tag}`);
                    //client.log("comando", `Comando ${i.commandName} usado`)

                    const comando = client.comandos.get(iCmd.commandName)
                    if (!comando) return client.log("critico", `Comando "${iCmd.commandName}" não encontrado`);

                    //* Verificar se comando pode ser executado
                    if (client.config.get("todosComandosDesativado") === true) {
                        if (!client.dono.includes(iCmd.user.id)) return
                    }
                    const desativado = client.config.get("comandosDesativado").find(c => c.nome === comando.nome)
                    if (desativado) {
                        if (!client.dono.includes(iCmd.user.id)) {
                            //if (!desativado.motivo) return
                            const data = { motivo: desativado.motivo };
                            return client.emit("comandoBloqueado", iCmd, "desativado", data);
                        }
                    }
                    if (iCmd.channel.type !== Constants.ChannelTypes.DM && comando.permissoes.bot) {
                        const faltando = iCmd.channel.guild.me.permissions.missing(comando.permissoes.bot);
                        if (faltando.length > 0) {
                            const data = { faltando };
                            return client.emit("comandoBloqueado", iCmd, "permBot", data);
                        }
                    }
                    if (comando.permissoes.usuario) {
                        const faltando = iCmd.member.permissions.missing(comando.permissoes.usuario);
                        if (faltando.length > 0) {
                            const data = { faltando };
                            return client.emit("comandoBloqueado", iCmd, "permUsuario", data);
                        }
                    }
                    if (comando.apenasDono) {
                        if (!client.dono.includes(iCmd.user.id)) {
                            const data = {};
                            return client.emit("comandoBloqueado", iCmd, "apenasDono", data);
                        }
                    }
                    if (comando.apenasServidor) {
                        if (iCmd.channel.type === "dm" ?? "unknown") {
                            const data = {};
                            return client.emit("comandoBloqueado", iCmd, "apenasServidor", data);
                        }
                    }
                    if (comando.canalVoz) {
                        if (iCmd.channel.type !== "voice" ?? "stage") {
                            const data = {};
                            return client.emit("comandoBloqueado", iCmd, "canalVoz", data);
                        }
                    }
                    if (comando.nsfw) {
                        if (!iCmd.channel.nsfw) {
                            const data = {};
                            return client.emit("comandoBloqueado", iCmd, "nsfw", data);
                        }
                    }

                    //* Executar comando
                    try {
                        const opcoes = {}
                        for (const opcao of iCmd.options.data) {
                            switch (opcao.type) {
                                case "USER": {
                                    opcoes[opcao.name] = { usuario: opcao.user, membro: opcao.member };
                                    break;
                                }

                                case "CHANNEL": {
                                    opcoes[opcao.name] = opcao.channel;
                                    break;
                                }

                                case "ROLE": {
                                    opcoes[opcao.name] = opcao.role;
                                    break;
                                }

                                case "MENTIONABLE": {
                                    opcoes[opcao.name] = { usuario: opcao.user, membro: opcao.member };
                                    break;
                                }

                                default: {
                                    opcoes[opcao.name] = opcao.value;
                                    break;
                                }
                            }
                        }

                        await comando.executar(iCmd, opcoes);
                        client.log("comando", `${comando.nome} foi respondido em ${(new Date().getTime() - excTempo.getTime())}ms`);
                    } catch (err) {
                        //if (!msg.channel.permissionsFor(client.user).has('SEND_MESSAGES')) return client.log("aviso", "A mensagem de erro não foi enviada por falta de permissões")

                        client.log("erro", err.stack)
                        client.log("comando", `Ocorreu um erro em ${comando.nome} ao ser executado por @${iCmd.user.tag}`, "erro");

                        const Embed = new MessageEmbed()
                            .setColor(client.defs.corEmbed.erro)
                            .setTitle('❗ Ocorreu um erro ao executar esse comando')
                            .setDescription('fale com o <@252902151469137922> para arrumar isso.');
                        if (iCmd.replied) iCmd.followUp({ content: null, embeds: [Embed], ephemeral: true }).catch();
                        else iCmd.reply({ content: null, embeds: [Embed], ephemeral: true }).catch();
                    }
                    break;
                }

                //* Componente de mensagem
                case "MESSAGE_COMPONENT": {
                    const iCMsg = iteracao

                    let botaoId = iCMsg.customId.split("=")
                    const categoria = botaoId[0];
                    const id = botaoId[1];
                    const valor = botaoId[2];

                    // eslint-disable-next-line no-bitwise
                    console.log(iCMsg.message.flags.has(1 << 6))

                    client.log("verbose", `@${iCMsg.user.tag} apertou "${iCMsg.customId}" msgId:${iCMsg.message.id}`);

                    if (categoria === "cargo") autoCargos(iCMsg, id);
                    if (categoria === "nfs") interacoes(iCMsg, id, valor);
                    break;
                }

                case "APPLICATION_COMMAND_AUTOCOMPLETE": {
                    const excTempo = new Date();
                    const pesquisa = iteracao.options.getFocused(true)

                    //* Pegar autocompletar do comando
                    const comando = client.comandos.get(iteracao.commandName);
                    if (!comando) return client.log("critico", `Comando "${iteracao.commandName}" não encontrado`);

                    //* Executar o autocompletar do comando
                    const resultados = await comando.autocompletar(iteracao, pesquisa);
                    await iteracao.respond(resultados);

                    client.log("verbose", `Autocompletar em ${comando.nome} respondido com ${resultados.length} resultados em ${(new Date().getTime() - excTempo.getTime())}ms`);
                    break;
                }

                default:
                    client.log("erro", `Interação recebida desconhecida: ${iteracao.type}`)
                    break;
            }
        } catch (err) {
            client.log("erro", err.stack)
        }
    }
}