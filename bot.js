const Discord = require('discord.js');
const Enmap = require("enmap");
require('dotenv').config();

global.client = new Discord.Client({ // define client como um objeto global
    intents: [
        'GUILDS',
        'GUILD_MEMBERS',
        'GUILD_BANS',
        'GUILD_EMOJIS',
        'GUILD_INTEGRATIONS',
        //'GUILD_WEBHOOKS',
        //'GUILD_INVITES',
        //'GUILD_VOICE_STATES',
        //'GUILD_PRESENCES',
        'GUILD_MESSAGES',
        'GUILD_MESSAGE_REACTIONS',
        //'GUILD_MESSAGE_TYPING',
        'DIRECT_MESSAGES',
        //'DIRECT_MESSAGE_REACTIONS',
        //'DIRECT_MESSAGE_TYPING',
    ],
    partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'GUILD_MEMBER', 'USER'],
    presence: {
        activities: [
            {
                name: "testes",
                type: "WATCHING"
            }
        ]
    }
});

client.defs = require("./data/defs.json");
client.log = require("./modulos/log.js");
client.responder = require("./modulos/responder.js");
client.dir = __dirname;
client.prefixo = process.env.prefixo;
client.dono = process.env.dono.split(" ");

client.comandos = new Discord.Collection();
client.snipes = new Discord.Collection();
client.editSnipes = new Discord.Collection();
client.mensagens = new Discord.Collection();
client.cargosSalvos = new Discord.Collection();

client.config = new Enmap("config");
client.usuarioOld = new Enmap("usuario"); // Para compatibilidade com o Banco de dados antigo
client.usuarios = new Enmap("usuarios");
client.memes = new Enmap("memes");
client.relacionamento = new Enmap("memes");

process.on("uncaughtException", (erro) => {
    client.log("critico", `Unhandled error: ${erro.stack}`);
});

require("./modulos/comandos")();
require("./modulos/aniversarios")();
require("./modulos/eventos")();

// Fazer login
client.login(process.env.TOKEN);

//? continuo a dar fetch ou eu mudo para cache.get()?
//? Colocar todos os Coletor de interações em um utilitario