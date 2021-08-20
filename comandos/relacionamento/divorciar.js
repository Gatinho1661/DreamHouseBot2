const { MessageButton, MessageEmbed } = require("discord.js");
const { aceitas } = require("../../modulos/interações");

module.exports = {
    //* Infomações do comando
    emoji: "💔",
    nome: "divorciar",
    sinonimos: ["divorcio", "divorce"],
    descricao: "Divorcie da pessoa que está casada",
    exemplos: [
        { comando: "divorciar", texto: "Divorciar-se do seu cônjuge" },
    ],
    args: "",
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
    async executar(msg) {

        //* Define o relacionamento da pessoa caso nao tenha
        client.relacionamento.ensure(`${msg.author.id}`, {
            usuario: msg.author.username,
            conjuge: 0,
            amantes: [],
            textinho: "",
            timestamp: 0,
        });

        var conjuge = client.relacionamento.get(msg.author.id, 'conjuge')
        if (conjuge === 0) return client.responder(msg, this, "bloqueado", "Você não está casado com ninguém", "Se você já esqueceu disso, provavelmente não ta indo muito bem as coisas...");

        var usuario = client.users.cache.find(usuario => usuario.id === conjuge);
        usuario ??= {
            id: conjuge,
            username: "Usuário não encontrado",
            inexistente: true
        }

        const confirmar = new MessageButton()
            .setCustomId(`confirmar`)
            .setLabel(`Confirmar`)
            .setDisabled(false)
            .setStyle(`DANGER`);

        const cancelar = new MessageButton()
            .setCustomId('cancelar')
            .setLabel('Cancelar')
            .setDisabled(false)
            .setStyle("SECONDARY");

        let botoes = [[confirmar, cancelar]];

        //* Aceitas?
        const Embed = new MessageEmbed()
            .setColor(client.defs.corEmbed.carregando)
            .setTitle(`💔 Divorcio!`)
            .setDescription(`Você tem certeza que quer se divorciar de ${usuario.inexistente ? "`Usuário não encontrado`" : usuario.toString()}?`)
            .setFooter("escolha clicando nos botões");
        const resposta = await msg.channel.send({ content: null, embeds: [Embed], components: botoes, reply: { messageReference: msg } }).catch();

        //* Respostas para cada botão apertado
        const respostas = {
            confirmar(i) {
                conjuge = client.relacionamento.get(msg.author.id, 'conjuge');
                const uConjuge = client.relacionamento.get(usuario.id, 'conjuge');

                // Confirmar novamente para não ter erro
                if (conjuge === 0) {
                    client.responder(msg, this, "bloqueado", "Você já está divorciado", "Não sei como isso aconteceu...");
                    throw new Error("Usuário já está divorciado");
                }
                if (uConjuge === 0) {
                    client.responder(msg, this, "bloqueado", "Seu cônjuge já está divorciado", "Não sei como isso aconteceu...");
                    throw new Error("Conjuge já casado com outra pessoa");
                }

                //* Divorciar
                client.relacionamento.set(msg.author.id, 0, 'conjuge');
                client.relacionamento.set(usuario.id, 0, 'conjuge');

                client.relacionamento.set(msg.author.id, 0, 'timestamp');
                client.relacionamento.set(usuario.id, 0, 'timestamp');

                Embed
                    .setColor(client.defs.corEmbed.nao)
                    .setTitle(`💔 Ainda há muito peixe no mar`)
                    .setDescription(`${msg.author.toString()} divorciou-se de ${usuario.inexistente ? "`Usuário não encontrado`" : usuario.toString()}`)
                    .setFooter("");
                botoes = [[confirmar.setDisabled(true)]];

                i.update({
                    content: resposta.content || null,
                    embeds: [Embed],
                    components: botoes
                });

                client.log("info", `${msg.author.username} divorciou-se de ${usuario.username}`);

                return true;
            },
            cancelar(i) {

                Embed
                    .setColor(client.defs.corEmbed.normal)
                    .setTitle(`💍 Essa foi por pouco`)
                    .setDescription(`${msg.author.toString()} e ${usuario.inexistente ? "`Usuário não encontrado`" : usuario.toString()} ainda estão casados`)
                    .setFooter("");
                botoes = [[cancelar.setDisabled(true).setStyle("PRIMARY")]];

                i.update({
                    content: resposta.content || null,
                    embeds: [Embed],
                    components: botoes
                });

                return true;
            }
        }

        //* Coletor de interações
        const filtro = (i) => i.user.id !== msg.author.id
        aceitas(this, msg, resposta, respostas, filtro);
    }
};
