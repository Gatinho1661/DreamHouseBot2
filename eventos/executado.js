// Emitido quando um comando termina de ser executado
module.exports = async (excTempo, cmd) => { //msg, args
    client.log("comando", `${client.commandPrefix}${cmd.name} terminou de ser executado depois de ${(new Date().getTime() - excTempo.getTime())}ms`);
}