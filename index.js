const fs = require("fs");
const Client = require("./class/Client"),
    client = new Client();

// Handlers Setup.
fs.readdir("./handlers/", (err, files) => {
    if (err) return console.error;
    files.forEach(handler => {
        if (!handler.endsWith('.js')) return;
        try {
            require(`./handlers/${handler}`)(client);
            console.log(`[Handlers Setup] : Loaded Handlers : ${handler}`)
        } catch (e) {
            return console.log(`[Handlers Setup] : ${handler} failed to load : ${e}`)
        }
    });
});
client.login(client.config.TOKEN);