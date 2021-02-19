const Client = require("./class/Client"),
    client = new Client();

// Handlers Setup.
["cmd", "event"].forEach(handler => {

    try {
        require(`./handlers/${handler}`)(client);
        console.log(`[Handlers Setup] : Loaded Handlers : ${handler}`)
    } catch (e) {
        return console.log(`[Handlers Setup] : ${handler} failed to load : ${e}`)
    }

});
client.login(client.config.TOKEN);