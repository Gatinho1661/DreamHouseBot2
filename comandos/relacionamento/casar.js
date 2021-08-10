const { MessageButton, MessageEmbed } = require("discord.js");
const { aceitas } = require("../../modulos/interações");

module.exports = {
    //* Infomações do comando
    emoji: "💍",
    nome: "casar",
    sinonimos: ["marry"],
    descricao: "Case com aquela pessoa de seus sonhos",
    exemplos: [
        { comando: "ajuda [usuario]", texto: "Casar-se com uma pessoa mencionada" },
    ],
    args: "{usuario}",
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

        var conjuge = client.relacionamento.get(msg.author.id, 'conjuge');
        var uConjuge = client.relacionamento.get(usuario.id, 'conjuge');

        const amantes = client.relacionamento.get(msg.author.id, 'amantes');
        const saoAmantes = amantes.includes(usuario.id);

        if (conjuge !== 0) return client.responder(msg, this, "bloqueado", "Você já está casado com uma pessoa", "Se você já esqueceu disso, provavelmente não ta indo muito bem as coisas...");
        if (uConjuge !== 0) return client.responder(msg, this, "bloqueado", "Essa pessoa já está casado com uma pessoa", "Você não pode se casar com alguém que já está comprometida");

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

        let botoes = [[aceitar, rejeitar]];

        //* Aceitas?
        const Embed = new MessageEmbed()
            .setColor(client.defs.corEmbed.carregando)
            .setTitle(`💍 Proposta de casamento!`)
            .setDescription(`${msg.author.toString()} está pedindo ${saoAmantes ? "sua amante " : ""}${usuario.toString()} em casamento`)
            .setFooter("escolha clicando nos botões");
        const resposta = await msg.channel.send({ content: null, embeds: [Embed], components: botoes, reply: { messageReference: msg } }).catch();

        //* Respostas para cada botão apertado
        const respostas = {
            aceitar(i) {
                conjuge = client.relacionamento.get(msg.author.id, 'conjuge');
                uConjuge = client.relacionamento.get(usuario.id, 'conjuge');

                if (conjuge !== 0) {
                    client.responder(msg, this, "bloqueado", "Você já está casado com uma pessoa", "Se você já esqueceu disso, provavelmente não ta indo muito bem as coisas...");
                    throw new Error("Usuário já casado com outra pessoa");
                }
                if (uConjuge !== 0) {
                    client.responder(msg, this, "bloqueado", "Essa pessoa já está casado com uma pessoa", "Você não pode se casar com alguém que já está comprometida");
                    throw new Error("Conjuge já casado com outra pessoa");
                }

                //* Casar
                const timestamp = Date.now()
                client.relacionamento.set(msg.author.id, usuario.id, 'conjuge')
                client.relacionamento.set(usuario.id, msg.author.id, 'conjuge')

                client.relacionamento.set(msg.author.id, timestamp, 'timestamp')
                client.relacionamento.set(usuario.id, timestamp, 'timestamp')

                if (saoAmantes) { // remover status de amantes
                    client.relacionamento.remove(msg.author.id, usuario.id, 'amantes')
                    client.relacionamento.remove(usuario.id, msg.author.id, 'amantes')
                }

                Embed
                    .setColor(client.defs.corEmbed.sim)
                    .setTitle(`🎉 Felicidades ao casal!`)
                    .setDescription(`${msg.author.toString()} e ${usuario.toString()} agora estão casados`)
                    .setFooter("");
                botoes = [[aceitar.setDisabled(true)]];

                i.update({
                    content: resposta.content || null,
                    embeds: [Embed],
                    components: botoes
                });

                return true;
            },
            rejeitar(i) {

                Embed
                    .setColor(client.defs.corEmbed.nao)
                    .setTitle(`💔 Ainda há muito peixe no mar`)
                    .setDescription(`${msg.author.toString()} teve seu pedido de casamento rejeitado por ${usuario.toString()}`)
                    .setFooter("");
                botoes = [[rejeitar.setDisabled(true)]];

                i.update({
                    content: resposta.content || null,
                    embeds: [Embed],
                    components: botoes
                });

                return true;
            }
        }

        //* Coletor de interações
        const filtro = (i) => i.user.id !== usuario.id
        aceitas(this, msg, resposta, respostas, filtro);
    }
};
