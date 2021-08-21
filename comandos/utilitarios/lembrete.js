const { MessageEmbed, MessageButton } = require("discord.js");
const chrono = require('chrono-node');
const criarLembrete = require('./../../modulos/lembretes');
const { aceitas } = require("../../modulos/interações");

module.exports = {
    //* Infomações do comando
    emoji: "⏰",
    nome: "lembrete",
    sinonimos: ["lembrar", "rolê", "role", "remind", "reminder"],
    descricao: "Fazer um lembrete pessoal para você ou marcar um role com outras pessoas",
    exemplos: [
        { comando: "lembrete [texto] [data]", texto: "Fazer um lembrete pessoal" },
        { comando: "lembrete [texto] [data] [menções]", texto: "Marcar um rolê com outras pessoas" },
    ],
    args: "{texto} {tempo} ({usuario} ou {cargo})",
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

        if (args.length === 0) return client.responder(msg, this, "uso", "Faltando argumentos", "Você tem que enviar quando irei te lembrar");

        const x = args.join(" ").split(",").filter(x => x);
        let texto = x.shift().replace(/<@(&|!)?([0-9]+)>/g, "").trim();
        let tempo = x.shift();

        tempo = chrono.pt.parseDate(tempo);
        if (args.length === 0) return client.responder(msg, this, "bloqueado", "Não entendi", "Não entendi a data que você colocou");

        const agora = new Date()
        if ((agora.getTime() - tempo.getTime()) > 0) tempo.setFullYear(agora.getFullYear() + 1)

        const ms = Math.floor(tempo.getTime() / 1000);

        let mencoes = []
        msg.mentions.members.forEach(pessoa => {
            mencoes.push(`<@${pessoa.id}>`)
        })
        msg.mentions.roles.forEach(cargo => {
            mencoes.push(`<@&${cargo.id}>`)
        })

        const sim = new MessageButton()
            .setCustomId(`sim`)
            .setLabel(`Sim`)
            .setDisabled(false)
            .setStyle(`SUCCESS`);

        const cancelar = new MessageButton()
            .setCustomId('cancelar')
            .setLabel('Cancelar')
            .setDisabled(false)
            .setStyle("DANGER");

        let botoes = [sim, cancelar];

        const Embed = new MessageEmbed()
            .setColor(client.defs.corEmbed.carregando)
            .setTitle(`⏰ Definir um ${mencoes.length > 0 ? `Rolê` : "Lembrete"}`)
            .addFields(
                { name: "ℹ️ Sobre", value: texto },
                { name: "📅 Em", value: `<t:${ms}:f> <t:${ms}:R>` },
                { name: "👥 Com", value: mencoes.join(", ") || "ninguém" },
            )
            .setFooter("escolha clicando nos botões");
        const resposta = await msg.channel.send({
            content: null,
            embeds: [Embed],
            components: [{ type: 'ACTION_ROW', components: botoes }],
            reply: { messageReference: msg }
        }).catch();

        //* Respostas para cada botão apertado
        const respostas = {
            sim(i) {
                criarLembrete(msg.id, msg.channel, msg.member, mencoes, texto, tempo);

                Embed
                    .setColor(client.defs.corEmbed.sim)
                    .setTitle(`⏰ ${mencoes.length > 0 ? "Rolê" : "Lembrete"} definido`)
                    .setFooter("");
                // Os fields não mudarão
                botoes = [sim.setDisabled(true)];

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
                    .setTitle(`❌ ${mencoes.length > 0 ? "Rolê" : "Lembrete"} cancelado`)
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
}