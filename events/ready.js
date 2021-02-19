const Event = require('../class/Event')

module.exports = class Ready extends Event {
    constructor(...args) {
        super(...args, {
            name: "Ready"
        })
    }
    async execute() {
        console.log(`Connected as ${this.client.user.tag}`)
    }
};