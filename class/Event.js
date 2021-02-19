module.exports = class Event {
    constructor(client, {
        name = null
    }) {
        this.client = client;
        this.name = name
    }

    execute() {
        throw new Error(`[Event Class] ${this.name} doesn't have an execute method.`);
    }
};