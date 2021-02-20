const mongoose = require('mongoose');

module.exports = async (client) => {
    const dbOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        autoIndex: false,
        poolSize: 5,
        family: 4
    };

    mongoose.connect(client.config.MongooseURL, dbOptions);
    mongoose.set('useFindAndModify', false);
    mongoose.Promise = global.Promise;

    mongoose.connection.on('connected', () => {
        console.log('Mongoose has successfully connected!');
    });

    mongoose.connection.on('err', err => {
        console.error(`Mongoose connection error: \n${err.stack}`);
    });

    mongoose.connection.on('disconnected', () => {
        console.warn('Mongoose connection lost');
    });
}