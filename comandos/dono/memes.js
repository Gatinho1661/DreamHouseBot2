const { MessageEmbed, MessageButton } = require("discord.js");
const { coletorICMsg } = require("../../utilidades/coletores");

module.exports = {
    //* Infomações do comando
    emoji: "",
    nome: "memes",
    sinonimos: [],
    descricao: "Atualiza ou remove todos os memes /",
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
    suporteBarra: false,

    //* Comando
    async executarMsg(msg, args) {

        if (!args[0]) {
            const Embed = new MessageEmbed()
                .setColor(client.defs.corEmbed.nao)
                .setTitle(`⛔ Faltando argumentos`)
                .setDescription(`Você quer atualizar ou remover os memes?`);
            await msg.channel.send({ content: null, embeds: [Embed], reply: { messageReference: msg } }).catch();
            return;
        }

        if (args[0] === "remover") {
            const remover = new MessageButton()
                .setCustomId(`remover`)
                .setLabel(`Remover`)
                .setDisabled(false)
                .setStyle(`DANGER`);
            const cancelar = new MessageButton()
                .setCustomId('rejeitar')
                .setLabel('Rejeitar')
                .setDisabled(false)
                .setStyle("PRIMARY");
            let botoes = [remover, cancelar];

            const Embed = new MessageEmbed()
                .setColor(client.defs.corEmbed.carregando)
                .setTitle(`🗑️ Remover memes`)
                .setDescription(`Você deseja remover todos os memes desse servidor`)
                .setFooter({ text: "Escolha clicando nos botões", iconURL: msg.author.displayAvatarURL({ dynamic: true, size: 16 }) });
            const resposta = await msg.channel.send({
                content: null,
                embeds: [Embed],
                components: [{ type: 'ACTION_ROW', components: botoes }],
                reply: { messageReference: msg }
            }).catch();

            //* Respostas para cada botão apertado
            const respostas = {
                async remover(iBto) {
                    await client.application?.commands.set([], msg.guild.id); // Remover os memes do servidor

                    Embed
                        .setColor(client.defs.corEmbed.nao)
                        .setTitle(`🗑️ Comandos removido`)
                        .setDescription(`Todos os comandos globais e do servidor ${msg.guild.name} foram removidos`)
                        .setFooter(null);
                    await iBto.update({ embeds: [Embed] });

                    client.log("bot", `Todos os comandos globais e do servidor ${msg.guild.name} foram removidos`);

                    return true;
                },
                async cancelar(iBto) {

                    Embed
                        .setColor(client.defs.corEmbed.carregando)
                        .setFooter(null);
                    await iBto.update({ embeds: [Embed] });

                    return true;
                }
            }

            //* Coletor de interações
            const filtro = (iBto) => iBto.user.id !== msg.author.id;
            coletorICMsg(msg, this, resposta, respostas, filtro);

        } else if (args[0] === "atualizar") {
            const memesNomes = client.memes.indexes
            const memes = []

            for (let i = 0; i < memesNomes.length; i++) {
                const meme = client.memes.get(memesNomes[i]);

                memes.push({
                    name: memesNomes[i],
                    description: meme.descricao,
                    options: [
                        {
                            name: "usuario",
                            description: "Usuário para eu marcar com esse meme",
                            type: client.defs.tiposOpcoes.USER,
                            required: false
                        }
                    ]
                })
            }

            await client.application?.commands.set(memes, msg.guildId);
            client.log("bot", `Todos os memes de ${msg.guild.name} foram atualizados`);

            const atualizado = new MessageEmbed()
                .setColor(client.defs.corEmbed.nao)
                .setTitle(`✅ Memes atualizados`)
                .setDescription(`Todos os memes de ${msg.guild.name} foram atualizados`);
            await msg.channel.send({ content: null, embeds: [atualizado], reply: { messageReference: msg } }).catch();
        } else {
            const Embed = new MessageEmbed()
                .setColor(client.defs.corEmbed.nao)
                .setTitle(`⛔ Argumentos errados`)
                .setDescription(`Você quer atualizar ou remover os memes?`);
            await msg.channel.send({ content: null, embeds: [Embed], reply: { messageReference: msg } }).catch();
        }
    }
};