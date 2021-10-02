const { MessageEmbed, MessageButton } = require("discord.js");
const { aceitas } = require("../../modulos/interações")

module.exports = {
    //* Infomações do comando
    emoji: "",
    nome: "desativar",
    sinonimos: ["d"],
    descricao: "Desativa comandos",
    exemplos: [],
    args: "",
    canalVoz: false,
    contaPrimaria: false,
    apenasServidor: false,
    apenasDono: true,
    nsfw: false,
    permissoes: {
        usuario: [],
        bot: ["SEND_MESSAGES"]
    },
    cooldown: 1,
    escondido: true,

    //* Comando
    async executar(msg, args) {

        if (!args[0]) {
            const ativar = new MessageButton()
                .setCustomId(`ativar`)
                .setLabel(`Ativar`)
                .setDisabled(false)
                .setStyle("SUCCESS");
            const desativar = new MessageButton()
                .setCustomId(`desativar`)
                .setLabel(`Desativar`)
                .setDisabled(false)
                .setStyle("DANGER");
            const cancelar = new MessageButton()
                .setCustomId('cancelar')
                .setLabel('Cancelar')
                .setDisabled(false)
                .setStyle("SECONDARY");
            let botoes = client.config.get("todosComandosDesativado") ? [ativar, cancelar] : [desativar, cancelar];

            const aceitasEmbed = new MessageEmbed()
                .setColor(client.defs.corEmbed.carregando)
                .setTitle(`❓ Desativar todos os comandos?`)
                .setDescription(`isso vai desativar todos os comandos`);
            const resposta = await msg.channel.send({
                content: "Aceitas?",
                embeds: [aceitasEmbed],
                components: [{ type: 'ACTION_ROW', components: botoes }],
                reply: { messageReference: msg }
            }).catch();

            const respostas = {
                ativar(i) {
                    client.config.set("todosComandosDesativado", false);

                    client.log("bot", "Comandos ativados", null, false);
                    botoes = [ativar.setDisabled(true)];

                    const ativaaEmbed = new MessageEmbed()
                        .setColor(client.defs.corEmbed.sim)
                        .setTitle(`✅ Comandos ativados`)
                        .setDescription(`todos os comando foram ativados novamente`);
                    i.update({
                        content: null,
                        embeds: [ativaaEmbed],
                        components: [{ type: 'ACTION_ROW', components: botoes }],
                    });
                    return true;
                },
                desativar(i) {
                    client.config.set("todosComandosDesativado", true);

                    client.log("bot", "Comandos desativados", null, false);
                    botoes = [desativar.setDisabled(true)];

                    const desativaaEmbed = new MessageEmbed()
                        .setColor(client.defs.corEmbed.sim)
                        .setTitle(`✅ Comandos desativados`)
                        .setDescription(`todos os comando foram desativados`);
                    i.update({
                        content: null,
                        embeds: [desativaaEmbed],
                        components: [{ type: 'ACTION_ROW', components: botoes }],
                    });
                    return true;
                },
                cancelar(i) {
                    //i.reply({ content: "se desitiu q quer cancelar" });
                    client.log("log", "cancela isso mano", null, false);
                    botoes = [cancelar.setDisabled(true)];

                    const cancelaEmbed = new MessageEmbed()
                        .setColor(client.defs.corEmbed.nao)
                        .setTitle(`❌ Cancelado`)
                        .setDescription(`nada mudou`);
                    i.update({
                        content: null,
                        embeds: [cancelaEmbed],
                        components: [{ type: 'ACTION_ROW', components: botoes }],
                    });
                    return true;
                }
            }

            const filtro = (i) => i.user.id !== msg.author.id
            return aceitas(this, msg, resposta, respostas, filtro);
        }

        const comandoNome = args.shift().toLowerCase();
        const comando = client.comandos.get(comandoNome)
            || client.comandos.find(cmd => cmd.sinonimos.includes(comandoNome));

        if (comando) {

            const comandosDesativado = client.config.get("comandosDesativado");
            const index = comandosDesativado.find(c => c.nome === comando.nome);

            if (index) {
                client.config.set("comandosDesativado", comandosDesativado.slice(index, 0));

                const Embed = new MessageEmbed()
                    .setColor(client.defs.corEmbed.sim)
                    .setTitle(`✅ Comando ativado`)
                    .setDescription(`\`${comando.nome}\` foi ativado novamente`);
                await msg.channel.send({ content: null, embeds: [Embed], reply: { messageReference: msg } }).catch();

            } else {
                const data = {
                    nome: comando.nome,
                    motivo: args.join(),
                }

                client.config.push("comandosDesativado", data);

                const Embed = new MessageEmbed()
                    .setColor(client.defs.corEmbed.sim)
                    .setTitle(`✅ Comando desativado`)
                    .setDescription(`\`${comando.nome}\` foi desativado`);
                await msg.channel.send({ content: null, embeds: [Embed], reply: { messageReference: msg } }).catch();
            }
        } else {
            const falhaEmbed = new MessageEmbed()
                .setColor(client.defs.corEmbed.nao)
                .setTitle('❌ Comando não encontrado')
                .setDescription(`${comandoNome} não foi encontrado`)
            await msg.channel.send({ content: null, embeds: [falhaEmbed], reply: { messageReference: msg } }).catch();
        }
    }
};