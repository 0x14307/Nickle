const Client = require("./class/Client"),
    client = new Client();

// Handlers Setup.
["cmd", "event"].forEach(handler => {

    require(`./handlers/${handler}`)(client);
    console.log(`[Handlers Setup] : Loaded Handlers : ${handler}`)


});
client.login(client.config.TOKEN);