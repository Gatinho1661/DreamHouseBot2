const { MessageEmbed } = require("discord.js");

// Emitido quando um membro entra no servidor
module.exports = {
    nome: "guildMemberAdd",
    once: false, // Se deve ser executado apenas uma vez

    async executar(membro) {
        try {
            const config = client.config.get("chegou");

            if (!config) return client.log("servidor", "Config de aviso chegada não encontrada", "erro");
            if (!config.msg) return client.log("servidor", "Mensagem de aviso chegada não encontrada", "erro");
            if (!config.gif) return client.log("servidor", "Gif de aviso chegada não encontrada", "erro");
            if (!config.canalID) return client.log("servidor", "Canal de aviso chegada não encontrada", "erro");

            const canal = await client.channels.fetch(config.canalID);
            if (!config.canalID) return client.log("servidor", "Canal de aviso chegada não encontrada", "erro");

            //* Enviar aviso
            const Embed = new MessageEmbed()
                .setColor(client.defs.corEmbed.entrada)
                .setAuthor({ name: `${membro.user.tag}`, iconURL: membro.user.displayAvatarURL({ dynamic: true, size: 32 }) })
                .setTitle(config.msg)
                .setImage(config.gif)
                .setTimestamp()
            canal.send({ content: `> <@!${membro.user.id}> Seja bem-vindo(a)`, embeds: [Embed] }).catch();

            client.log("servidor", `${membro.user.username} entrou no servidor`);

            if (!client.cargosSalvos.has(membro.id)) return client.log("info", "nenhum cargo foi encontrado");
            const { cargos, cargosPerdidos } = client.cargosSalvos.get(membro.id);

            //* Devolvendo cargos antigos
            membro.roles.add(cargos, "Devolvendo cargos antigos").then(() => {
                if (cargosPerdidos.length === 0) {
                    client.log("info", "Todos os seus cargos foram devolvidos");
                    const devolvidoEmbed = new MessageEmbed()
                        .setColor(client.defs.corEmbed.sim)
                        .setTitle('✅ Devolvi todos os seus cargos antigos')
                        .setDescription(`bem vindo(a) de volta`)
                    membro.send({ content: null, embeds: [devolvidoEmbed] }).catch();
                } else {
                    client.log("info", `Cargos perdidos: ${cargosPerdidos.join(", ")}`);
                    const naoEmbed = new MessageEmbed()
                        .setColor(client.defs.corEmbed.nao)
                        .setTitle('❌ Não consegui devolver todos os seus cargos')
                        .setDescription(`fale com algum superior para adicionar:\n${cargosPerdidos.join("\n")}`)
                    membro.send({ content: null, embeds: [naoEmbed] }).catch();
                }

                client.cargosSalvos.delete(membro.id);
            }).catch(err => {
                client.log("servidor", `Ocorreu um erro ao devolver os cargos de volta`, "erro");
                client.log("erro", err.stack);
                const erroEmbed = new MessageEmbed()
                    .setColor(client.defs.corEmbed.erro)
                    .setTitle('❗ Ocorreu um erro')
                    .setDescription('não consegui adicionar seus cargos de volta, fale com algum superior para adicionar seus cargos de volta')
                membro.send({ content: null, embeds: [erroEmbed] }).catch();
            })
        } catch (err) {
            client.log("servidor", `Ocorreu um erro ao enviar a mensagem de chegada`, "erro");
            client.log("erro", err.stack)
        }
    }
}