//const { MessageButton, MessageEmbed } = require("discord.js");
const { Command } = require('discord.js-commando');
//const chrono = require('chrono-node');
const cron = require('node-cron');

module.exports = class Comando extends Command {
    constructor(client) {
        super(client, {
            name: "teste",
            memberName: "teste",
            aliases: ["test", "t"],
            group: "dono",
            argsType: "single",
            argsCount: 0,
            description: "Testa coisas.",
            examples: ["!teste"],
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
        const usuarios = client.usuarios.filterArray(u => u.aniversario !== null);

        const aniversariantes = {}
        for (const usuario of usuarios) {
            const data = new Date(usuario.aniversario)
            const a = `${data.getDate()}-${data.getMonth()}`

            aniversariantes[a] ? aniversariantes[a].push(usuario.id) : aniversariantes[a] = [usuario.id]
        }
        console.debug(aniversariantes)
        // eslint-disable-next-line guard-for-in
        for (var key in aniversariantes) {

            // eslint-disable-next-line no-loop-func
            var aviso = cron.schedule(`0 0 0 ${key.split("-")[0]} ${key.split("-")[1]} *`, () => {
                client.emit("aniversario", aniversariantes[key])
                aviso.destroy();
            });
        }

        client.emit("executado", excTempo, this, msg, args)
    }

    onError() {
        // evita enviar a msg padrão de erro
    }

    onBlock() {
        // evita enviar a msg padrão de block
    }
};