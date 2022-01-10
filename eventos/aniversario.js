const { MessageEmbed } = require("discord.js");

// Emitido quando um usuario faz aniversario
module.exports = {
    nome: "aniversario",
    once: false, // Se deve ser executado apenas uma vez

    async executar(aniversariantes) {
        try {
            const canalId = client.config.get("aniversarios", "canal")
            if (!canalId) return client.log("bot", "Nenhum canal para aniversários definido", "aviso");

            //* Encontrar canal de aniversários
            const canal = await client.channels.fetch(canalId);
            if (!canal) return client.log("bot", "Canal de aniversários não foi encontrado", "erro");

            //* Verificar permissões no canal
            if (!canal.permissionsFor(client.user).has('SEND_MESSAGES')) return client.log("aviso", "A mensagem de aniversário não foi enviada por falta de permissões")

            //* Encontrar aniversariantes
            const usuarios = [];
            const usuariosNomes = [];
            for (const aniversariante of aniversariantes) {
                const usuario = await client.users.fetch(aniversariante);

                if (usuario) {
                    usuarios.push(usuario);
                    usuariosNomes.push(usuario.username);
                } else client.log("servidor", `Aniversariante (${aniversariante}) não encontrado`, "aviso");
            }
            if (!usuarios) return client.log("servidor", `Nenhum aniversariante foi encontrado`, "erro");

            client.log('servidor', `Hoje é aniversário de ${usuariosNomes.join(", ")}`);

            const Embed = new MessageEmbed()
                .setColor(client.defs.corEmbed.normal)
                .setDescription(`🎉 Hoje é aniversário de ${usuarios.join(", ")}`)
                .setImage(client.defs.imagens.anivesario);
            canal.send({ content: null, embeds: [Embed] })

            if (!canal.permissionsFor(client.user).has('MANAGE_CHANNELS')) return client.log("aviso", "Não consigo alterar o tópico do canal por falta de permissões")
            canal.setTopic(`🎉 Hoje é aniversário de ${usuarios.join(", ")}`);

        } catch (err) {
            client.log("servidor", `Ocorreu um erro ao enviar um aniversário`, "erro");
            client.log("erro", err.stack)
        }
    }
}