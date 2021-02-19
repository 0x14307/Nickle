const fs = require('fs');
const util = require("util")
readdir = util.promisify(fs.readdir)

module.exports = async (client) => {
	const directories = await readdir("./commands/");
	directories.forEach(async (dir) => {
		const commands = await readdir("./commands/"+dir+"/");
		commands.filter((cmd) => cmd.split(".").pop() === "js").forEach((cmd) => {
			const response = client.loadCommand("./commands/"+dir, cmd);
			if(response){
				console.log(response, "error");
			}
		});
	});
}