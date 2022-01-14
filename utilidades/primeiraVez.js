module.exports = () => {

    console.log("Iniciando pela primeira vez");

    client.config.set("primeiraVez", false);
    client.config.ensure("salvarMsgs", true);
    client.config.ensure("todosComandosDesativado", false);
    client.config.ensure("comandosDesativado", []);
    client.config.ensure("fixados", "");
    client.config.ensure("bichinhos", "");
    client.config.ensure("aniversarios", {
        "ativado": true,
        "alterarTop": true,
        "canal": null
    });
    client.config.ensure("msgCargos", {
        "canal": null,
        "id": null,
        "servidor": null
    });
    client.config.ensure("chegou", {
        "canalID": null,
        "gif": "",
        "msg": "Chegou sem escândalo ✨"
    });
    client.config.ensure("saida", {
        "canalID": null,
        "gif": "",
        "msg": "Saiu do servidor 😢"
    });
    client.config.ensure("log", {
        "normal": false,
        "custom": true,
        "log": true,
        "verbose": true,
        "info": true,
        "servidor": true,
        "meme": true,
        "comando": true,
        "aviso": true,
        "erro": true,
        "critico": true,
        "api": true,
        "bot": true
    });
}