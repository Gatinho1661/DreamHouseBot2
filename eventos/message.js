// Emitido quando uma mensagem nova é enviada
module.exports = (msg) => {
    if (msg.author.bot) return; // ignorar se for uma msg de bot

    const mensagem = msg.content.length > 100 ? msg.content.slice(0, 100).replaceAll("\n", " ") + "..." : msg.content.replaceAll("\n", " ");
    const canal = /store|news|text/i.test(msg.channel.type) ? (msg.channel.name.includes("│") ? msg.channel.name.split("│")[1] : msg.channel.name) : "DM"

    client.log(msg.isCommand ? "log" : null, `#${canal} | @${msg.author.tag}: ${mensagem}`);
}