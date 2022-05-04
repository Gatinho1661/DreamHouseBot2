const { MessageEmbed, MessageButton } = require("discord.js");
const nfs = require("./../../modulos/nfs");

module.exports = {
  //* Infomações do comando
  emoji: "🚫",
  nome: "nfs",
  sinonimos: ["nofapseptember", "nofapsep"],
  descricao: "Funcionalidades do evento NFS",
  exemplos: [
    { comando: "nfs iniciar [cargo]", texto: "Inicia o evento" },
    { comando: "nfs finalizar", texto: "Finaliza o evento e apaga todos os dados salvos" },
    { comando: "nfs limpar", texto: "Apaga todos os dados salvos" },
    { comando: "nfs grafico", texto: "Mostra o grafico do evento" },
    { comando: "nfs check", texto: "Envia o check do dia" },
    { comando: "nfs resultados", texto: "Envia os resultados" },
    { comando: "nfs regras", texto: "Envia as regras" },
  ],
  args: "[evento]",
  canalVoz: false,
  contaPrimaria: false,
  apenasServidor: true,
  apenasDono: true,
  nsfw: false,
  permissoes: {
    usuario: [],
    bot: ["SEND_MESSAGES", "MANAGE_ROLES"]
  },
  cooldown: 1,
  suporteBarra: false,

  //* Comando
  async executarMsg(msg, args) {
    switch (args[0]) {
      case "iniciar": {
        const cargo = msg.mentions.roles.first();
        if (!cargo) {
          client.responder(
            msg,
            this,
            "uso",
            "Sem cargo",
            "Você precisa mencionar um cargo para iniciar esse evento"
          ); //TODO Arrumar os respoder
          break;
        }

        const regras = new MessageEmbed()
          .setColor(client.defs.corEmbed.nao)
          .setTitle("🚫 Regras")
          .setDescription(
            "• Não pode se masturbar\n"
            + "• É permitido fazer sexo (EZ mode)\n"
            + "• Websexo e Sexting não conta, você ainda perde"
          )
          .addField(
            "E o mais importante", "Não se sinta pressionado em continuar\nninguém vai te julgar"
          );
        const check = new MessageEmbed()
          .setColor(client.defs.corEmbed.sim)
          .setTitle("✅ Check")
          .setDescription(
            "Todo dia, **meia noite** será enviado o **check** do dia,\n"
            + "que você tera que marcar seu resultado\n\n"
            + "Você pode marcar a qualquer momento\n"
            + "mas não pode mudar o resultado depois"
          );
        await msg.channel.send({ content: "> **No Fap September**", embeds: [regras, check] }).catch();

        const participar = new MessageButton()
          .setEmoji()
          .setCustomId("nfs=participar")
          .setLabel("Participar")
          .setStyle("PRIMARY");
        const participantes = new MessageEmbed()
          .setColor(client.defs.corEmbed.normal)
          .setTitle("👥 Participantes")
          .setDescription(`Ao participar você recebe o cargo: <@&${cargo.id}>`)
          .setFooter({ text: "clique no botão para participar" });
        const participantesMsg = await msg.channel.send({
          content: null,
          embeds: [participantes],
          components: [{ type: "ACTION_ROW", components: [participar] }]
        }).catch();

        nfs.iniciar(msg, participantesMsg, cargo);
        break;
      }
      case "finalizar": {
        const participantes = client.nfs.get("participantes");
        if (!participantes || participantes.length === 0) {
          throw new Error("Nenhum participante encontrado");
        }

        const ganhadores = participantes.filter(p => p.perdeu === false).map(p => `• <@${p.id}>`);
        let perdedores = participantes.filter(p => p.perdeu === true)
          .sort((a, b) => a.perdeuEm - b.perdeuEm)
          .map(p => `• <@${p.id}> no ${p.perdeuEm}º dia`);

        const resultados = new MessageEmbed()
          .setColor(client.defs.corEmbed.normal)
          .setTitle("🎊 Resultados")
          .setDescription("Parabéns a todos os ganhadores")
          .addField("Ganhadores", ganhadores.length > 0 ? ganhadores.join("\n") : "• Ninguém", true)
          .addField("Perdedores", perdedores.length > 0 ? perdedores.join("\n") : "• Ninguém", true)
          .setFooter({ text: "resultados de" })
          .setTimestamp();
        await msg.channel.send({
          content: "> **No Fap September**",
          embeds: [resultados],
        }).catch();

        nfs.finalizar();
        client.log("bot", "NFS finalizado");
        break;
      }
      case "limpar": {
        break;
      }
      case "grafico": {
        //TODO grafico
        break;
      }
      case "check": {
        const dia = new Date();
        const numero = Number(args[1]);
        if (numero && numero > 0 && numero < 31) dia.setDate(numero);
        const cargoId = client.nfs.get("cargo");

        const passou = new MessageButton()
          //.setEmoji("✅")
          .setCustomId(`nfs=passou=${dia.getDate()}`)
          .setLabel("Passei")
          .setStyle("SUCCESS");
        const perdeu = new MessageButton()
          //.setEmoji("❌")
          .setCustomId(`nfs=perdeu=${dia.getDate()}`)
          .setLabel("Perdi")
          .setStyle("DANGER");
        const check = new MessageEmbed()
          .setColor(client.defs.corEmbed.normal)
          .setTitle(`☑️ Check diário (Dia ${dia.getDate()})`)
          .setDescription(
            "Você pode marcar a qualquer momento\n"
            + "mas não pode mudar o resultado depois"
          )
          .addField("Ganhadores", "• Ninguém", true)
          .addField("Perdedores", "• Ninguém", true)

          .setFooter({ text: "Marque seu resultado" });
        const checkMsg = await msg.channel.send({
          content: `> <@&${cargoId}>`,
          embeds: [check],
          components: [{ type: "ACTION_ROW", components: [passou, perdeu] }]
        }).catch();

        nfs.check(checkMsg, dia);
        break;
      }
      case "resultados": {
        const participantes = client.nfs.get("participantes");
        if (!participantes || participantes.length === 0) {
          throw new Error("Nenhum participante encontrado");
        }

        const ganhadores = participantes.filter(p => p.perdeu === false).map(p => `• <@${p.id}>`);
        let perdedores = participantes.filter(p => p.perdeu === true)
          .sort((a, b) => a.perdeuEm - b.perdeuEm)
          .map(p => `• <@${p.id}> no ${p.perdeuEm}º dia`);

        const resultados = new MessageEmbed()
          .setColor(client.defs.corEmbed.normal)
          .setTitle("🎊 Resultados até agora")
          .setDescription("Parabéns a todos os que continuam firme e forte nessa batalha")
          .addField("Ganhando", ganhadores.length > 0 ? ganhadores.join("\n") : "• Ninguém", true)
          .addField("Perdedores", perdedores.length > 0 ? perdedores.join("\n") : "• Ninguém", true)
          .setFooter({ text: "resultados de" })
          .setTimestamp();
        await msg.channel.send({
          content: "> **No Fap September**",
          embeds: [resultados],
        }).catch();
        break;
      }
      case "falta": {
        const participantes = client.nfs.get("participantes").filter(p => p.perdeu === false);
        if (!participantes || participantes.length === 0) {
          throw new Error("Nenhum participante encontrado");
        }

        const checks = client.nfs.get("checks");
        if (!checks || checks.length === 0) throw new Error("Nenhum check encontrado");

        //const ganhadores = participantes.filter(p => p.perdeu === false).map(p => `${p.id}`);
        //const perdedores = participantes.filter(p => p.perdeu === true).map(p => `${p.id}`);

        for (let i = 0; i < checks.length; i++) {
          const check = checks[i];
          const marcados = check.ganhadores;//.concat(check.perdedores);
          let naoMarcadores = participantes.filter(p => !marcados.includes(p.id));

          console.log(
            `Check dia ${check.dia} faltam marcar:\n`
            + `${naoMarcadores.map(p => `${p.nome}`).join("\n")}\n`
          );
        }
        break;
      }
      default: {
        client.responder(msg, this, "uso", "Argumentos errado");
        break;
      }
    }
  }
};
