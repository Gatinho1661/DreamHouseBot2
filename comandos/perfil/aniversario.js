const { MessageButton, MessageEmbed } = require("discord.js");
const chrono = require('chrono-node');
const { aceitas } = require("../../utilidades/interações");

module.exports = {
    //* Infomações do comando
    emoji: "🎉",
    nome: "aniversario",
    sinonimos: ["aniversário"],
    descricao: "Edite sua data de aniversário e sua idade",
    exemplos: [
        { comando: "aniversario [data]", texto: "Define seu aniversário e sua idade" }
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
    escondido: false,

    //* Comando
    async executar(msg, args) {

        //* caso não tenha nenhum args
        if (!args[0]) return client.responder(msg, this, "uso", "Faltando argumentos", "Você tem que enviar sua data de nascimento ou de aniversário");

        //* define os dados do usuario da pessoa caso nao tenha
        client.usuarios.ensure(`${msg.author.id}`, {
            textinho: null,
            aniversario: null,
            idade: null,
            orientacao: null,
            pronome: null,
            nome: msg.author.username,
            id: msg.author.id
        });

        //* Pegar dados do usuário
        const usuario = client.usuarios.get(msg.author.id);
        const aniversario = new Date(usuario.aniversario)

        //* Transformar texto em data
        let data = chrono.pt.strict.parseDate(args[0])
        if (!data) return client.responder(msg, this, "uso", "Argumentos errados", "Você tem que enviar sua data de nascimento");
        data.setHours(0, 0, 0);

        //* Calcular idade
        const idade = new Date().getFullYear() - data.getFullYear();
        if (idade < 1) return client.responder(msg, this, "uso", "Argumentos errados", `Você tem que enviar sua data de nascimento, se você não quer dizer sua idade fale com <!@${client.dono[0]}>`);

        if (aniversario.getTime() === data.getTime()) return client.responder(msg, this, "uso", "Argumentos errados", `Sua data de nascimento já está definido para esse dia`);

        const sim = new MessageButton()
            .setCustomId(`sim`)
            .setLabel(`Sim`)
            .setDisabled(false)
            .setStyle(`SUCCESS`);

        const editar = new MessageButton()
            .setCustomId("editar")
            .setLabel("Editar")
            .setDisabled(false)
            .setStyle("PRIMARY");

        const cancelar = new MessageButton()
            .setCustomId('cancelar')
            .setLabel('Cancelar')
            .setDisabled(false)
            .setStyle("DANGER");

        const adicionando = usuario.aniversario === null
        let botoes = adicionando ? [sim, cancelar] : [editar, cancelar];

        const Embed = new MessageEmbed()
            .setColor(client.defs.corEmbed.carregando)
            .setTitle(adicionando ? '❓ Adicionar aniversário' : '❓ Editar aniversário')
            .setFooter("escolha clicando nos botões");
        adicionando
            ? Embed.addFields([
                { name: "Você nasceu em", value: `<t:${Math.floor(data.getTime() / 1000)}:d> <t:${Math.floor(data.getTime() / 1000)}:R>`, inline: false },
            ])
            : Embed.addFields([
                { name: "Você nasceu em", value: `<t:${Math.floor(aniversario.getTime() / 1000)}:d> <t:${Math.floor(aniversario.getTime() / 1000)}:R>`, inline: false },
                { name: "Você deseja editar para", value: `<t:${Math.floor(data.getTime() / 1000)}:d> <t:${Math.floor(data.getTime() / 1000)}:R>`, inline: false },
            ])
        const resposta = await msg.channel.send({
            content: null,
            embeds: [Embed],
            components: [{ type: 'ACTION_ROW', components: botoes }],
            reply: { messageReference: msg }
        }).catch();

        //* Respostas para cada botão apertado
        const respostas = {
            sim(i) {
                client.usuarios.set(msg.author.id, `${data.getFullYear()} ${data.getMonth() + 1} ${data.getDate()} 00:00:00`, 'aniversario');
                client.usuarios.set(msg.author.id, idade, 'idade');
                client.log("info", `Aniversário de ${msg.author.tag} foi definido para ${data.toLocaleDateString()} e com ${idade} anos`);

                Embed
                    .setColor(client.defs.corEmbed.sim)
                    .setTitle("✅ Adicionar aniversário")
                    .setFooter("");
                botoes = [sim.setDisabled(true)];

                i.update({
                    content: resposta.content || null,
                    embeds: [Embed],
                    components: [{ type: 'ACTION_ROW', components: botoes }],
                });

                return true;
            },
            editar(i) {
                client.usuarios.set(msg.author.id, `${data.getFullYear()} ${data.getMonth() + 1} ${data.getDate()} 00:00:00`, 'aniversario');
                client.usuarios.set(msg.author.id, idade, 'idade');
                client.log("info", `Aniversário de ${msg.author.tag} foi definido para ${data.toLocaleDateString()} e com ${idade} anos`);

                Embed
                    .setColor(client.defs.corEmbed.sim)
                    .setTitle("✅ Editar aniversário")
                    .setFooter("");
                botoes = [editar.setDisabled(true)];

                i.update({
                    content: resposta.content || null,
                    embeds: [Embed],
                    components: [{ type: 'ACTION_ROW', components: botoes }],
                });

                return true;
            },
            cancelar(i) {
                client.log("info", `Cancelado`);

                Embed
                    .setColor(client.defs.corEmbed.nao)
                    .setTitle("❌ Cancelado")
                    .setFooter("");
                botoes = [cancelar.setDisabled(true)];

                i.update({
                    content: resposta.content || null,
                    embeds: [Embed],
                    components: [{ type: 'ACTION_ROW', components: botoes }],
                });

                return true;
            }
        }

        //* Coletor de interações
        const filtro = (i) => i.user.id !== msg.author.id
        aceitas(this, msg, resposta, respostas, filtro);
    }
};