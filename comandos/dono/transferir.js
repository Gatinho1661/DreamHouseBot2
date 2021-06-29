//const { MessageButton, MessageEmbed } = require("discord.js");
const { Command } = require('discord.js-commando');

module.exports = class Comando extends Command {
    constructor(client) {
        super(client, {
            name: "transferir",
            memberName: "transferir",
            aliases: [],
            group: "dono",
            argsType: "multiple",
            argsCount: 0,
            description: "Tranferir banco de dados para nova versão.",
            examples: ["!transferir"],
            guildOnly: false,
            ownerOnly: true,
            userPermissions: [],
            clientPermissions: [],
            nsfw: false,
            hidden: true,
            throttling: {
                usages: 1,
                duration: 1,
            }
        });
    }

    async run(msg, args) {
        const excTempo = new Date

        const indexes = client.usuarioOld.indexes

        for (let i = 0; i < indexes.length; i++) {
            const usuarioId = indexes[i];

            let data = client.usuarioOld.get(usuarioId)

            data.nome = data.usuario
            delete data.usuario
            client.log("verbose", `nome foi definido ${data.nome} `)

            data.id = usuarioId
            client.log("verbose", `${data.nome} teve seu id definido ${data.id}`)

            if (data.aniversario !== null) {
                data.aniversario = `${2021 - data.idade} ${data.aniversario.mes} ${data.aniversario.dia} 00:00:00`
                client.log("verbose", `o aniversario de ${data.nome} foi definido para ${new Date(data.aniversario)}`)
            } else {
                client.log("verbose", `${data.nome} não tem aniversario`)
            }

            client.usuarios.set(usuarioId, data)
        }

        msg.react("👍");
        client.emit("executado", excTempo, this, msg, args)
    }

    onError() {
        // evita enviar a msg padrão de erro
    }

    onBlock() {
        // evita enviar a msg padrão de block
    }
};