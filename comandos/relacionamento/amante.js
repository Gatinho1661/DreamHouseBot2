const { MessageButton, MessageEmbed } = require("discord.js");
const { aceitas } = require("../../modulos/interações");

module.exports = {
    //* Infomações do comando
    emoji: "💕",
    nome: "amante",
    sinonimos: ["amantes"],
    descricao: "Seja amante com uma pessoa do seus sonhos",
    exemplos: [
        { comando: "amante [usuario]", texto: "Seja amante com uma pessoa mencionada" },
        { comando: "amante [número]", texto: "Remova um amante da lista" },
        { comando: "amante", texto: "Veja a lista de seus amantes" },

    ],
    args: "({usuario} ou {numero})",
    canalVoz: false,
    contaPrimaria: false,
    apenasServidor: false,
    apenasDono: false,
    nsfw: false,
    permissoes: {
        usuario: [],
        bot: ["SEND_MESSAGES"]
    },
    cooldown: 1,

    //* Comando
    async executar(msg, args) {

        if (!args[0]) return client.responder(msg, this, "uso", "Faltando argumentos", "Você precisa mencionar *aquela* pessoa");

        const usuario = msg.mentions.users.first()
        if (!usuario) return client.responder(msg, this, "bloqueado", "Usuario não encontrado", "Você precisa mencionar *aquela* pessoa");
        if (usuario.id === client.user.id) return client.responder(msg, this, "bloqueado", "Ewww", "Não.");
        if (usuario.bot) return client.responder(msg, this, "bloqueado", "Você não pode se casar com um bot", "Eles não tem sentimentos, acredita em mim...");
        if (usuario.id === msg.author.id) return client.responder(msg, this, "bloqueado", "Você não pode ser amante com você mesmo", "Isso seria muito triste...")

        //* Define o relacionamento da pessoa caso nao tenha
        client.relacionamento.ensure(`${msg.author.id}`, {
            usuario: msg.author.username,
            conjuge: 0,
            amantes: [],
            textinho: "",
            timestamp: 0,
        });

        //* Define o relacionamento do usuario caso nao tenha
        client.relacionamento.ensure(`${usuario.id}`, {
            usuario: usuario.username,
            conjuge: 0,
            amantes: [],
            textinho: "",
            timestamp: 0,
        });

        const conjuge = client.relacionamento.get(msg.author.id, 'conjuge');
        const amantes = client.relacionamento.get(msg.author.id, 'amantes');
        const amantesUsu = client.relacionamento.get(usuario.id, 'amantes');

        if (conjuge === usuario.id) return client.responder(msg, this, "bloqueado", "Você não pode ser amante com seu proprio cônjuge", "Isso não faria sentido nenhum");
        if (amantes.length > 9) return client.responder(msg, this, "bloqueado", "Você não pode ter mais que 10 amantes", `Remova um amante com ${client.prefixo}amante [\`[número]\`](https://nao.clique/de-hover-sobre 'Número do amante')`);
        if (amantesUsu.length > 9) return client.responder(msg, this, "bloqueado", "Essa pessoa atingiu o limite de amantes", `Chegou atrasado no role...`);
        if (amantesUsu.includes(usuario.id)) return client.responder(msg, this, "bloqueado", "Essa pessoa já é sua amante", `se você já esqueceu disso, provavelmente não ta indo muito bem as coisas...`);

        const aceitar = new MessageButton()
            .setCustomId(`aceitar`)
            .setLabel(`Aceitar`)
            .setDisabled(false)
            .setStyle(`SUCCESS`);

        const rejeitar = new MessageButton()
            .setCustomId('rejeitar')
            .setLabel('Rejeitar')
            .setDisabled(false)
            .setStyle("DANGER");

        let botoes = [aceitar, rejeitar];

        //* Aceitas?
        const Embed = new MessageEmbed()
            .setColor(client.defs.corEmbed.carregando)
            .setTitle(`💕 Amantes!`)
            .setDescription(`${msg.author.toString()} está pedindo ${usuario.toString()} para ser seu amante`)
            .setFooter("escolha clicando nos botões");
        const resposta = await msg.channel.send({
            content: null,
            embeds: [Embed],
            components: [{ type: 'ACTION_ROW', components: botoes }],
            reply: { messageReference: msg }
        }).catch();

        //* Respostas para cada botão apertado
        const respostas = {
            aceitar(i) {
                // Confirmar novamente para não ter erro
                if (conjuge === usuario.id) {
                    client.responder(msg, this, "bloqueado", "Você não pode ser amante com seu proprio cônjuge", "Isso não faria sentido nenhum");
                    throw new Error("Usuário tentado ser amante com seu proprio cônjuge");
                }
                if (amantes.length > 9) {
                    client.responder(msg, this, "bloqueado", "Você não pode ter mais que 10 amantes", `Remova um amante com ${client.prefixo}amante [\`[número]\`](https://nao.clique/de-hover-sobre 'Número do amante')`);
                    throw new Error("Usuário já atingiu o limite de amantes");
                }
                if (amantesUsu.length > 9) {
                    client.responder(msg, this, "bloqueado", "Essa pessoa atingiu o limite de amantes", `Chegou atrasado no role...`);
                    throw new Error("Amante já atingiu o limite de amantes");
                }
                if (amantesUsu.includes(usuario.id)) {
                    client.responder(msg, this, "bloqueado", "Essa pessoa já é sua amante", `se você já esqueceu disso, provavelmente não ta indo muito bem as coisas...`);
                    throw new Error("Usuário já é amante essa pessoa");
                }

                //* Adicionar amante
                client.relacionamento.push(msg.author.id, usuario.id, 'amantes');
                client.relacionamento.push(usuario.id, msg.author.id, 'amantes');

                if (conjuge === 0) {
                    Embed
                        .setColor(client.defs.corEmbed.sim)
                        .setTitle(`🎉 Felicidades aos amantes!`)
                        .setDescription(`${msg.author.toString()} e ${usuario.toString()} agora são amantes`)
                        .setFooter("");
                    botoes = [[aceitar.setDisabled(true)]];
                } else {
                    Embed
                        .setColor(client.defs.corEmbed.sim)
                        .setTitle(`💍 Parece que ${msg.author.username} não é tão fiel assim...`)
                        .setDescription(`${msg.author.toString()} e ${usuario.toString()} agora são amantes`)
                        .setFooter("");
                    botoes = [aceitar.setDisabled(true)];
                }

                i.update({
                    content: resposta.content || null,
                    embeds: [Embed],
                    components: [{ type: 'ACTION_ROW', components: botoes }],
                });

                client.log("info", `${msg.author.username} e ${usuario.username} agora são amantes`);

                return true;
            },
            rejeitar(i) {

                const uConjuge = client.relacionamento.get(usuario.id, 'conjuge');

                if (conjuge !== 0) {
                    Embed
                        .setColor(client.defs.corEmbed.nao)
                        .setTitle(`💔 Isso que da não ser fiel`)
                        .setDescription(`${msg.author.toString()} foi rejeitado por ${usuario.toString()} para ser seu amante`)
                        .setFooter("");
                } else if (uConjuge !== 0) {
                    Embed
                        .setColor(client.defs.corEmbed.nao)
                        .setTitle(`💍 Parece que ${usuario.username} é muito fiel a seu casamento`)
                        .setDescription(`${msg.author.toString()} foi rejeitado por ${usuario.toString()} para ser seu amante`)
                        .setFooter("");
                } else {
                    Embed
                        .setColor(client.defs.corEmbed.nao)
                        .setTitle(`💔 Ainda há muito peixe no mar`)
                        .setDescription(`${msg.author.toString()} foi rejeitado por ${usuario.toString()} para ser seu amante`)
                        .setFooter("");
                }
                botoes = [rejeitar.setDisabled(true)];

                i.update({
                    content: resposta.content || null,
                    embeds: [Embed],
                    components: [{ type: 'ACTION_ROW', components: botoes }],
                });

                return true;
            }
        }

        //* Coletor de interações
        const filtro = (i) => i.user.id !== usuario.id
        aceitas(this, msg, resposta, respostas, filtro);
    }
};
