const { MessageEmbed } = require("discord.js");

exports.iniciar = function (msg, participantesMsg, cargo) {
  client.nfs.set("ligado", true);

  client.nfs.set("msgId", participantesMsg.id);
  client.nfs.set("canal", msg.channel.id);
  client.nfs.set("cargo", cargo.id);
  client.nfs.set("participantes", []);
  client.nfs.set("checks", []);
};
exports.finalizar = function () {
  client.nfs.set("ligado", false);
};
exports.limpar = function () {
  client.nfs.set("msgId", "");
  client.nfs.set("canal", "");
  client.nfs.set("cargo", "");
  client.nfs.set("participantes", []);
  client.nfs.set("checks", []);
};
exports.check = function (checkMsg, dia) {
  const checks = client.nfs.get("checks") || [];
  checks[dia.getDate() - 1] = {
    dia: `${dia.getDate()}`,
    id: checkMsg.id,
    ganhadores: [],
    perdedores: [],
  };
  client.nfs.set("checks", checks);
};
exports.interacoes = async function (i, id, valor) {
  if (client.config.get("nfs") !== true) {
    const embed = new MessageEmbed()
      .setColor(client.defs.corEmbed.nao)
      .setTitle("🚫 Evento finalizado")
      .setDescription("Esse evento já foi finalizado");
    return i.reply({ content: null, embeds: [embed], ephemeral: true }).catch();
  }

  if (id === "participar") {
    if (!client.nfs.has("participantes")) {
      return client.log("erro", "Não consegui adicionar participante ao evento");
    }

    let participantes = client.nfs.get("participantes");

    if (participantes.find(u => u.id === i.user.id)) {
      const embed = new MessageEmbed()
        .setColor(client.defs.corEmbed.nao)
        .setTitle("🚫 Já participando")
        .setDescription("Você já está participando do **No Fap September**");
      return i.reply({ content: null, embeds: [embed], ephemeral: true }).catch();
    }
    const usuario = {
      id: i.user.id,
      nome: i.user.username,
      perdeu: false,
      perdeuEm: null,
    };
    client.nfs.push("participantes", usuario);
    participantes = client.nfs.get("participantes").map(part => part.id);

    i.message.edit({
      content: null,
      embeds: [i.message.embeds[0].setDescription("• <@" + participantes.join(">\n• <@") + ">")],
      components: i.message.components
    }).catch();

    const cargoId = client.nfs.get("cargo");
    const cargo = await i.channel.guild.roles.fetch(cargoId);

    if (
      i.channel.permissionsFor(client.user).has(["SEND_MESSAGES", "MANAGE_ROLES"])
      || cargo.comparePositionTo(i.channel.guild.me.roles.highest) <= 0
    ) {

      i.member.roles.add(cargo, "Participando do No Fap September");

      const embed = new MessageEmbed()
        .setColor(client.defs.corEmbed.sim)
        .setTitle("✅ Participando")
        .setDescription(
          `Você está participando do **No Fap September**\nvocê recebeu o cargo: <@&${cargoId}>`
        );
      i.reply({ content: null, embeds: [embed], ephemeral: true }).catch();
    } else {
      client.log("aviso", "Não consigo adicionar cargo por falta de permissão");

      const embed = new MessageEmbed()
        .setColor(client.defs.corEmbed.sim)
        .setTitle("✅ Participando")
        .setDescription(
          `Você está participando do **No Fap September**\n\
            não consigo adicionar o cargo: <@&${cargoId}> para você`
        );
      i.reply({ content: null, embeds: [embed], ephemeral: true }).catch();
    }
    client.log("servidor", `${i.user.tag} está participando do NFS`);
  }
  if (id === "passou") {
    const dia = valor;
    if (!dia) throw new Error(`Sem dia em botão da msg ${i.message.id}`);

    const checks = client.nfs.get("checks");
    if (!checks || checks.length === 0) throw new Error("Nenhum checks do dia encontrado");

    const checkIndex = checks.findIndex(check => check.dia === valor);
    const check = checks[checkIndex];
    if (!check) throw new Error(`Sem check do dia ${dia}`);

    if (check.ganhadores.includes(i.user.id) || check.perdedores.includes(i.user.id)) {
      const embed = new MessageEmbed()
        .setColor(client.defs.corEmbed.nao)
        .setTitle("🚫 Já respondido")
        .setDescription("Você já respondeu esse check");
      return i.reply({ content: null, embeds: [embed], ephemeral: true }).catch();
    }

    const participantes = client.nfs.get("participantes");
    if (!participantes || participantes.length === 0) throw new Error("Nenhum participante encontrado");

    const participanteIndex = participantes.findIndex(participante => participante.id === i.user.id);
    const participante = participantes[participanteIndex];
    if (!participante) {
      const embed = new MessageEmbed()
        .setColor(client.defs.corEmbed.nao)
        .setTitle("🚫 Não participando")
        .setDescription("Você não está participando desse evento");
      return i.reply({ content: null, embeds: [embed], ephemeral: true }).catch();
    }
    if (participante.perdeu === true) {
      const embed = new MessageEmbed()
        .setColor(client.defs.corEmbed.nao)
        .setTitle("🚫 Você já perdeu")
        .setDescription("Você já perdeu, não adianta");
      return i.reply({ content: null, embeds: [embed], ephemeral: true }).catch();
    }

    check.ganhadores.push(i.user.id);
    checks[checkIndex] = check;

    client.log("servidor", `${i.user.tag} respondeu o check ${dia} com passado`);

    client.nfs.set("checks", checks);
    const embed = new MessageEmbed()
      .setColor(client.defs.corEmbed.sim)
      .setTitle("✅ Check feito")
      .setDescription("Boa, continue forte");
    i.reply({ content: null, embeds: [embed], ephemeral: true }).catch();

    const cargoId = client.nfs.get("cargo");

    const checkEmbed = new MessageEmbed()
      .setColor(client.defs.corEmbed.normal)
      .setTitle(`☑️ Check diário (Dia ${dia})`)
      .setDescription(
        "Você pode marcar a qualquer momento\n"
        + "mas não pode mudar o resultado depois"
      )
      .addField(
        "Ganhadores",
        check.ganhadores.length > 0 ? `• <@${check.ganhadores.join(">\n• <@")}>` : "• Ninguém",
        true
      )
      .addField(
        "Perdedores",
        check.perdedores.length > 0 ? `• <@${check.perdedores.join(">\n• <@")}>` : "• Ninguém",
        true
      )
      .setFooter({ text: "Marque seu resultado" });
    i.message.edit({
      content: `> <@&${cargoId}>`,
      embeds: [checkEmbed],
      components: i.message.components
    }).catch();
  }
  if (id === "perdeu") {
    const dia = valor;
    if (!dia) throw new Error(`Sem dia em botão da msg ${i.message.id}`);

    const checks = client.nfs.get("checks");
    if (!checks || checks.length === 0) throw new Error("Nenhum checks do dia encontrado");

    const checkIndex = checks.findIndex(check => check.dia === valor);
    const check = checks[checkIndex];
    if (!check) throw new Error(`Sem check do dia ${dia}`);

    if (check.ganhadores.includes(i.user.id) || check.perdedores.includes(i.user.id)) {
      const embed = new MessageEmbed()
        .setColor(client.defs.corEmbed.nao)
        .setTitle("🚫 Já respondido")
        .setDescription("Você já respondeu esse check");
      return i.reply({ content: null, embeds: [embed], ephemeral: true }).catch();
    }

    const participantes = client.nfs.get("participantes");
    if (!participantes || participantes.length === 0) throw new Error("Nenhum participante encontrado");

    const participanteIndex = participantes.findIndex(participante => participante.id === i.user.id);
    const participante = participantes[participanteIndex];
    if (!participante) {
      const embed = new MessageEmbed()
        .setColor(client.defs.corEmbed.nao)
        .setTitle("🚫 Não participando")
        .setDescription("Você não está participando desse evento");
      return i.reply({ content: null, embeds: [embed], ephemeral: true }).catch();
    }
    if (participante.perdeu === true) {
      const embed = new MessageEmbed()
        .setColor(client.defs.corEmbed.nao)
        .setTitle("🚫 Você já perdeu")
        .setDescription("Você já perdeu, não adianta");
      return i.reply({ content: null, embeds: [embed], ephemeral: true }).catch();
    }

    check.perdedores.push(i.user.id);
    checks[checkIndex] = check;

    client.log("servidor", `${i.user.tag} respondeu o check ${dia} com perdido`);

    client.nfs.set("checks", checks);
    participantes[participanteIndex] = {
      id: i.user.id,
      nome: i.user.username,
      perdeu: true,
      perdeuEm: dia,
    };
    client.nfs.set("participantes", participantes);

    const embed = new MessageEmbed()
      .setColor(client.defs.corEmbed.sim)
      .setTitle("✅ Check feito")
      .setDescription("Puts, boa sorte no próximo ano");
    i.reply({ content: null, embeds: [embed], ephemeral: true }).catch();

    const cargoId = client.nfs.get("cargo");

    const checkEmbed = new MessageEmbed()
      .setColor(client.defs.corEmbed.normal)
      .setTitle(`☑️ Check diário (Dia ${dia})`)
      .setDescription(
        "Você pode marcar a qualquer momento\n"
        + "mas não pode mudar o resultado depois"
      )
      .addField(
        "Ganhadores",
        check.ganhadores.length > 0 ? `• <@${check.ganhadores.join(">\n• <@")}>` : "• Ninguém",
        true
      )
      .addField(
        "Perdedores",
        check.perdedores.length > 0 ? `• <@${check.perdedores.join(">\n• <@")}>` : "• Ninguém",
        true
      )
      .setFooter({ text: "Marque seu resultado" });
    i.message.edit({
      content: `> <@&${cargoId}>`,
      embeds: [checkEmbed],
      components: i.message.components
    }).catch();
  }
};