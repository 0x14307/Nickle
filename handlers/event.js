const fs = require("fs");

module.exports = (client) => {
    fs.readdir("./events/", (err, files) => {
        if (err) return console.error;
        files.forEach(file => {
            if (!file.endsWith(".js")) return;
            const evt = new (require(`../events/${file}`))(client)
            let evtName = file.split(".")[0];
            client.on(evtName, (...args) => evt.execute(...args));
            client.events.set(evtName, evt)
            console.log(`[EVENT Handler] : Loaded event '${evtName}'`);
        });
    });
}