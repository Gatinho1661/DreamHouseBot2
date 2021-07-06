const { MessageButton, MessageEmbed } = require("discord.js");
const chrono = require('chrono-node');
//const cron = require('node-cron');

module.exports = {
    //* Infomações do comando
    nome: "aniversario",
    sinonimos: ["aniversário"],
    descricao: "Edite sua data de aniversário e sua idade",
    exemplos: [""],
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
    escondido: false,

    //* Comando
    async executar(msg, args) {

        //* caso não tenha nenhum args
        if (!args[0]) return client.responder(msg, this, "uso", "⛔ Faltando argumentos", "Você tem que enviar sua data de nascimento ou de aniversário");

        //* define os dados do usuario da pessoa caso nao tenha
        client.usuario.ensure(`${msg.author.id}`, {
            textinho: null,
            aniversario: null,
            idade: null,
            orientacao: null,
            pronome: null,
            nome: msg.author.username,
            id: msg.author.id
        });

        //* Pegar dados do usuário
        const usuario = client.usuario.get(msg.author.id);

        if (usuario.aniversario === null) {
            //* Adicionar aniversario

            //* Transformar texto em data
            let data = chrono.pt.strict.parseDate(args[1])
            if (!data) return client.responder(msg, this, "uso", "⛔ Argumentos errados", "Você tem que enviar sua data de nascimento ou de aniversário");

            if (data.getFullYear() !== new Date().getFullYear()) {
                //* Se tiver ano definido
                const idade = new Date().getFullYear() - data.getFullYear();
                //TODO verificar se nasceu no futuro ou tem menos de 10 anos

                //* Cria os botões e a embed
                const sim = new MessageButton()
                    .setCustomID(`sim`)
                    .setLabel('Sim')
                    //.setEmoji("✅")
                    .setDisabled(false)
                    .setStyle("SUCCESS");

                const nao = new MessageButton()
                    .setCustomID('nao')
                    .setLabel('Não')
                    //.setEmoji("❌")
                    .setDisabled(false)
                    .setStyle("DANGER");

                const Embed = new MessageEmbed()
                    .setColor(client.defs.corEmbed.carregando)
                    .setTitle('❓ Tem certeza?')
                    .addFields([
                        { name: "Aniversário", value: data.toLocaleDateString(), inline: true },
                        { name: "Idade", value: `${idade} anos`, inline: true }
                    ])
                    .setFooter("escolha clicando nos botões");
                const resposta = await msg.channel.send({
                    content: null,
                    embeds: [Embed],
                    components: [[sim, nao]],
                    reply: { messageReference: msg }
                }).catch();


                //* Inicia coletor de botões
                const filtro = (interaction) => interaction.user.id === msg.author.id;
                resposta.awaitMessageComponentInteraction(filtro, { time: 60000 })
                    .then(async i => {
                        switch (i.customID) {

                            case "sim": {
                                client.usuarios.set(msg.author.id, `${data.getFullYear()} ${data.getMonth() + 1} ${data.getDate()} 00:00:00`, 'aniversario');
                                break;
                            }
                            case "nao": {
                                // TODO nao
                                break;
                            }
                            default: {
                                client.log("erro", `Um botão chamado "${i.customID}" foi precionado, mais nenhuma ação foi definida`)
                                break;
                            }
                        }
                        client.log("verbose", `@${i.user.tag} apertou "${i.customID}" id:${msg.id}`)
                    }).catch(err => {

                        client.log("erro", err.stack)
                        client.log("comando", `Ocorreu um erro em ${this.name} ao ser executado por @${msg.author.tag}`, "erro");

                        const erro = new MessageButton()
                            .setCustomID(`erro`)
                            .setLabel('Ocorreu um erro')
                            .setDisabled(true)
                            .setStyle('DANGER');

                        resposta.edit({
                            content: resposta.content || null,
                            embeds: resposta.embeds,
                            components: [[
                                erro
                            ]]
                        }).catch();
                    })

            }
        }

        const editar = new MessageButton()
            .setCustomID("editar")
            .setLabel(usuario.aniversario ? "editar" : "adicionar")
            .setStyle("PRIMARY");


        const Embed = new MessageEmbed()
            .setColor(client.defs.corEmbed.carregando)
            .setTitle('🎉 Aniversário')
            .addFields([
                { name: "Nascimento", value: usuario.aniversario ? new Date(usuario.aniversario).toLocaleDateString() : "não definido", inline: true },
                { name: "Idade", value: usuario.idade ? `${usuario.idade} anos` : `??`, inline: true }
            ])
            .setFooter("escolha clicando nos botões");
        const resposta = await msg.channel.send({ content: null, embeds: [Embed], components: [[editar]] }).catch();
    }
};