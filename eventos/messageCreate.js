const { MessageEmbed, MessageButton } = require("discord.js");
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

        //* Executar apenas se for o dono do bot
        if (!client.dono.includes(msg.author.id)) {
            //TEMP Mensagem para avisar que apenas aceitarar comandos barra
            const Embed = new MessageEmbed()
                .setColor(client.defs.corEmbed.nao)
                .setTitle('❌ Comandos por texto removidos')
                .setDescription(
                    'em resumo o Discord **removerar** o acesso dos bots verificados a ler o conteúdo das mensagens, '
                    + 'esse bot não é verificado então **não será afetado**, '
                    + 'mas para **padronizar** e **facilitar** o uso dos comandos, '
                    + 'irei **apenas** aceitar comandos por `/`'
                );

            const botao = new MessageButton()
                .setStyle("LINK")
                .setURL("https://support-dev.discord.com/hc/pt-br/articles/4404772028055-Message-Content-Privileged-Intent-for-Verified-Bots")
                .setLabel("Saiba mais")
            return msg.channel.send({
                content: null,
                embeds: [Embed],
                components: [{ type: 'ACTION_ROW', components: [botao] }],
                reply: { messageReference: msg }
            }).catch();
        }

        //* Executar comando
        try {
            await comando.executarMsg(msg, args);
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