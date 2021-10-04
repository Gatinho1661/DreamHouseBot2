const { MessageEmbed } = require("discord.js");
const desconhecido = require("./../utilidades/desconhecido");
const { formatarCanal } = require("./../modulos/utils")

const filtro = /https?:\/\/(www.)?([/|.|\w|-])*\.(?:jpg|jpeg|gif|png|webp)/;

// Emitido quando uma mensagem nova é enviada
module.exports = {
    nome: "messageCreate",
    once: false, // Se deve ser executado apenas uma vez

    async executar(msg) {
        if (msg.author.bot) return; // ignorar se for uma msg de bot

        const mensagem = msg.content.length > 100 ? msg.content.slice(0, 100).replaceAll("\n", " ") + "..." : msg.content.replaceAll("\n", " ");

        //* Verificar se é uma mensagem nos fixados
        const canalFixadosId = client.config.get("fixados");
        const canalBichinhosId = client.config.get("bichinhos");
        if (msg.channel.id === canalFixadosId) {
            if (msg.attachments.first() ? filtro.test(msg.attachments.first().proxyURL) : filtro.test(msg.content)) {
                const fixados = client.mensagens.get("fixados") || [];

                fixados.unshift(msg);
                client.mensagens.set("fixados", fixados);
                client.log("bot", `Fixado novo de @${msg.author.tag} adicionado (${msg.id})`);
            }
        }
        //* Verificar se é uma mensagem nos bichinhos
        if (msg.channel.id === canalBichinhosId) {
            if (msg.attachments.first() ? filtro.test(msg.attachments.first().proxyURL) : filtro.test(msg.content)) {
                const bichinhos = client.mensagens.get("bichinhos") || [];

                bichinhos.unshift(msg);
                client.mensagens.set("bichinhos", bichinhos);
                client.log("bot", `Bichinho novo de @${msg.author.tag} adicionado (${msg.id})`);
            }
        }

        //* Verificar se é um comando
        if (!msg.content.startsWith(client.prefixo)) return client.log(null, `#${formatarCanal(msg.channel)} | @${msg.author.tag}: ${mensagem}`);
        client.log("comando", `#${formatarCanal(msg.channel)} | @${msg.author.tag}: ${mensagem}`);
        const excTempo = new Date();

        const args = msg.content.slice(client.prefixo.length).trim().split(/ +/);
        const nomeComando = args.shift().toLowerCase();

        const comando = client.comandos.get(nomeComando)
            || client.comandos.find(cmd => cmd.sinonimos && cmd.sinonimos.includes(nomeComando));
        if (!comando) return desconhecido(msg, nomeComando, args)

        //* Verificar se comando pode ser executado
        if (client.config.get("todosComandosDesativado") === true) {
            if (!client.dono.includes(msg.author.id)) return
        }
        const desativado = client.config.get("comandosDesativado").find(c => c.nome === comando.nome)
        if (desativado) {
            if (!client.dono.includes(msg.author.id)) {
                //if (!desativado.motivo) return
                const data = { motivo: desativado.motivo };
                return client.emit("comandoBloqueado", msg, comando, "desativado", data);
            }
        }
        if (comando.permissoes.bot) {
            const faltando = msg.channel.permissionsFor(client.user).missing(comando.permissoes.bot);
            if (faltando.length > 0) {
                const data = { faltando };
                return client.emit("comandoBloqueado", msg, comando, "permBot", data);
            }
        }
        if (comando.permissoes.usuario) {
            const faltando = msg.channel.permissionsFor(msg.author).missing(comando.permissoes.bot);
            if (faltando.length > 0) {
                const data = { faltando };
                return client.emit("comandoBloqueado", msg, comando, "permUsuario", data);
            }
        }
        if (comando.apenasDono) {
            if (!client.dono.includes(msg.author.id)) {
                const data = {};
                return client.emit("comandoBloqueado", msg, comando, "apenasDono", data);
            }
        }
        if (comando.apenasServidor) {
            if (msg.channel.type === "dm" ?? "unknown") {
                const data = {};
                return client.emit("comandoBloqueado", msg, comando, "apenasServidor", data);
            }
        }
        if (comando.canalVoz) {
            if (msg.channel.type !== "voice" ?? "stage") {
                const data = {};
                return client.emit("comandoBloqueado", msg, comando, "canalVoz", data);
            }
        }
        if (comando.nsfw) {
            if (!msg.channel.nsfw) {
                const data = {};
                return client.emit("comandoBloqueado", msg, comando, "nsfw", data);
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