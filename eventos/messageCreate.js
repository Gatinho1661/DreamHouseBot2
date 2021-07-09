const { MessageEmbed } = require("discord.js");
const desconhecido = require("./../modulos/desconhecido");
const { formatarCanal } = require("./../modulos/utils")

// Emitido quando uma mensagem nova é enviada
module.exports = {
    nome: "messageCreate",
    once: false, // Se deve ser executado apenas uma vez

    async executar(msg) {
        if (msg.author.bot) return; // ignorar se for uma msg de bot

        const mensagem = msg.content.length > 100 ? msg.content.slice(0, 100).replaceAll("\n", " ") + "..." : msg.content.replaceAll("\n", " ");

        client.log(null, `#${formatarCanal(msg.channel)} | @${msg.author.tag}: ${mensagem}`);

        //* Verificar se é um comando
        if (!msg.content.startsWith(client.prefixo)) return;
        const excTempo = new Date();

        const args = msg.content.slice(client.prefixo.length).trim().split(/ +/);
        const nomeComando = args.shift().toLowerCase();

        const comando = client.comandos.get(nomeComando)
            || client.comandos.find(cmd => cmd.sinonimos && cmd.sinonimos.includes(nomeComando));
        if (!comando) return desconhecido(msg, nomeComando, args)

        //* Verificar se comando pode ser executado
        if (comando.permissoes.bot) {
            const faltando = msg.channel.permissionsFor(client.user).missing(comando.permissoes.bot);
            if (faltando.length > 0) {
                const data = { faltando };
                return client.emit("comandoBloqueado", comando, msg, "permBot", data);
            }
        }
        if (comando.permissoes.usuario) {
            const faltando = msg.channel.permissionsFor(msg.author).missing(comando.permissoes.bot);
            if (faltando.length > 0) {
                const data = { faltando };
                return client.emit("comandoBloqueado", comando, msg, "permUsuario", data);
            }
        }
        if (comando.apenasDono) {
            if (!client.dono.includes(msg.author.id)) {
                const data = {};
                return client.emit("comandoBloqueado", comando, msg, "apenasDono", data);
            }
        }
        if (comando.apenasServidor) {
            if (msg.channel.type === "dm" ?? "unknown") {
                const data = {};
                return client.emit("comandoBloqueado", comando, msg, "apenasServidor", data);
            }
        }
        if (comando.canalVoz) {
            if (msg.channel.type !== "voice" ?? "stage") {
                const data = {};
                return client.emit("comandoBloqueado", comando, msg, "canalVoz", data);
            }
        }
        if (comando.nsfw) {
            if (!msg.channel.nsfw) {
                const data = {};
                return client.emit("comandoBloqueado", comando, msg, "nsfw", data);
            }
        }

        //? Adicionar cooldowns
        //? Adicionar suporte a conta primaria

        //* Executar comando
        try {
            await comando.executar(msg, args);
            client.log("comando", `${comando.nome} foi respondido em ${(new Date().getTime() - excTempo.getTime())}ms`)
        } catch (err) {
            if (!msg.channel.permissionsFor(client.user).has('SEND_MESSAGES')) return client.log("aviso", "A mensagem de erro não foi enviada por falta de permissões")

            client.log("erro", err.stack)
            client.log("comando", `Ocorreu um erro em ${comando.nome} ao ser executado por @${msg.author.tag}`, "erro");

            const Embed = new MessageEmbed()
                .setColor(client.defs.corEmbed.erro)
                .setTitle('❗ Ocorreu um erro ao executar esse comando')
                .setDescription('fale com o <@252902151469137922> para arrumar isso.');
            msg.channel.send({ content: null, embeds: [Embed], reply: { messageReference: msg } }).catch();
        }
    }
}