const Commando = require('discord.js-commando');
const path = require("path");
const Enmap = require("enmap");
require('dotenv').config()

const eventos = require("./modulos/eventos");

global.client = new Commando.Client({ // define client como um objeto global
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
    owner: process.env.dono.split(" "),   // Donos do bot
    commandPrefix: process.env.prefixo,   // Prefixo geral do bot
    nonCommandEditable: true,             // Se as mensagens sem comandos podem ser editadas para um comando
    commandEditableDuration: 10           // Tempo em segundos que as mensagens de comando devem ser editáveis
});

client.defs = require("./data/defs.json");
client.log = require("./modulos/log.js");
client.responder = require("./modulos/responder.js");
client.dir = __dirname

client.config = new Enmap("config");
client.usuarios = new Enmap("usuarios");
client.memes = new Enmap("memes");
////client.cargos = new Enmap("cargos");

process.on("uncaughtException", (erro) => {
    client.log("critico", `Unhandled error: ${erro.stack}`);
});

client.registry
    // Registrar grupos de comandos
    .registerGroups([
        ['ações', 'Gifs de ações'],
        ['administração', 'Umas coisinhas para não deixar adms a desejar'],
        ['audios', 'Alguns audios para tocar em call'],
        ['dono', 'Algumas coisinhas divertidas'],
        ['perfil', 'Definições do seu perfil'],
        ['relacionamento', 'Amor está no ar, e o ódio também'],
        ['utilitários', 'Comandos úteis para facilitar sua vida']
    ])

    // Registrar comandos padrões
    //.registerDefaultCommands()

    // Registra tipos de argumentos padrão
    .registerDefaultTypes()

    // Registrar todos os comandos da pasta comandos
    .registerCommandsIn(path.join(client.dir, 'comandos'));

eventos(client); // Registrar eventos

// Fazer login
client.login(process.env.TOKEN);

//module.exports = client;