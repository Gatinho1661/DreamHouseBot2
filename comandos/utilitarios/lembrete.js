const { MessageEmbed, MessageButton } = require("discord.js");
const chrono = require('chrono-node');
const criarLembrete = require('./../../modulos/lembretes');
const { formatarCanal } = require("../../modulos/utils");

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

        let botoes = [[sim, cancelar]];

        const Embed = new MessageEmbed()
            .setColor(client.defs.corEmbed.carregando)
            .setTitle(`⏰ Definir um ${mencoes.length > 0 ? `Rolê` : "Lembrete"}`)
            .addFields(
                { name: "ℹ️ Sobre", value: texto },
                { name: "📅 Em", value: `<t:${ms}:f> <t:${ms}:R>` },
                { name: "👥 Com", value: mencoes.join(", ") || "ninguém" },
            )
            .setFooter("escolha clicando nos botões");
        const resposta = await msg.channel.send({ content: null, embeds: [Embed], components: botoes, reply: { messageReference: msg } }).catch();

        //* Respostas para cada botão apertado
        const respostas = {
            sim(i) {
                criarLembrete(msg.id, msg.channel, msg.member, mencoes, texto, tempo);

                Embed
                    .setColor(client.defs.corEmbed.sim)
                    .setTitle(`⏰ ${mencoes.length > 0 ? "Rolê" : "Lembrete"} definido`)
                    .setFooter("");
                // Os fields não mudarão
                botoes = [[sim.setDisabled(true)]];

                i.update({
                    content: resposta.content || null,
                    embeds: [Embed],
                    components: botoes
                });
            },
            cancelar(i) {
                client.log("info", `Cancelado`);

                Embed
                    .setColor(client.defs.corEmbed.nao)
                    .setTitle(`❌ ${mencoes.length > 0 ? "Rolê" : "Lembrete"} cancelado`)
                    .setFooter("");
                botoes = [[cancelar.setDisabled(true)]];

                i.update({
                    content: resposta.content || null,
                    embeds: [Embed],
                    components: botoes
                });
            }
        }

        //* Coletor de interações
        const coletor = resposta.createMessageComponentCollector({ time: 60000 })
        client.log("info", `Coletor de botões iniciado em #${formatarCanal(msg.channel)} por @${msg.author.tag} id:${msg.id}`);

        //* Quando algum botão for apertado
        coletor.on("collect", i => {
            if (i.user.id !== msg.author.id) {
                client.log("verbose", `@${i.user.tag} apertou "${i.customId}", mas foi bloqueado id:${msg.id}`);

                const cuidaEmbed = new MessageEmbed()
                    .setColor(client.defs.corEmbed.nao)
                    .setTitle(`⛔ Cuida da sua vida`)
                    .setDescription("essa mensagem não foi direcionada a você");
                return i.reply({ content: null, embeds: [cuidaEmbed], ephemeral: true })
            }

            try {
                client.log("verbose", `@${i.user.tag} apertou "${i.customId}" id:${msg.id}`)
                respostas[i.customId](i);
            } catch (err) {
                client.log("erro", err.stack)
                client.log("comando", `Ocorreu um erro em ${this.nome} ao ser executado por @${msg.author.tag}`, "erro");

                coletor.stop("erro")
            } finally {
                coletor.stop("respondido");
            }
        })

        //* Quando o coletor termina
        coletor.once('end', (coletado, razao) => {
            client.log("info", `Coletor de botões terminado por ${razao} em #${formatarCanal(msg.channel)}, coletando ${coletado.size} interações id:${msg.id}`);

            if (razao === "erro") {
                const erro = new MessageButton()
                    .setCustomId(`erro`)
                    .setLabel('Ocorreu um erro')
                    .setDisabled(true)
                    .setStyle('DANGER');
                botoes = [[erro]]

                resposta.edit({
                    content: resposta.content || null,
                    embeds: resposta.embeds,
                    components: botoes
                }).catch();
            }
            if (razao === "time") {
                const tempo = new MessageButton()
                    .setCustomId(`tempo`)
                    .setLabel("Tempo esgotado")
                    .setDisabled(true)
                    .setStyle('SECONDARY');
                botoes = [[tempo]];

                resposta.edit({
                    content: resposta.content || null,
                    embeds: resposta.embeds,
                    components: botoes
                }).catch();
            }
        });
    }
}