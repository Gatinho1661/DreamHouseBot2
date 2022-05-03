const { MessageEmbed, MessageButton } = require("discord.js");
const cron = require("node-cron");
const { check } = require("./../modulos/nfs");

module.exports = () => {
  cron.schedule("10 0 0 * * *", async () => {
    const dia = new Date();
    dia.setDate(dia.getDate() - 1);
    client.log("servidor", `Enviando o check diario do dia ${dia.getDate()}`);

    const cargoId = client.nfs.get("cargo");
    const canalId = client.nfs.get("canal");
    const canal = await client.channels.fetch(canalId);

    const passou = new MessageButton()
      .setCustomId(`nfs=passou=${dia.getDate()}`)
      .setLabel("Passei")
      .setStyle("SUCCESS");
    const perdeu = new MessageButton()
      .setCustomId(`nfs=perdeu=${dia.getDate()}`)
      .setLabel("Perdi")
      .setStyle("DANGER");
    const checkEmbed = new MessageEmbed()
      .setColor(client.defs.corEmbed.normal)
      .setTitle(`☑️ Check diário (Dia ${dia.getDate()})`)
      .setDescription(
        "Você pode marcar a qualquer momento\n"
        + "mas não pode mudar o resultado depois"
      )
      .addField("Ganhadores", "• Ninguém", true)
      .addField("Perdedores", "• Ninguém", true)

      .setFooter({ text: "Marque seu resultado" });
    const checkMsg = await canal.send({
      content: `> <@&${cargoId}>`,
      embeds: [checkEmbed],
      components: [{ type: "ACTION_ROW", components: [passou, perdeu] }]
    }).catch();

    check(checkMsg, dia);
  });
};