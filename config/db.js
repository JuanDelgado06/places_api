const mongoose = require('mongoose');

const dbName = 'places_mevn_api';

module.exports = {
    connect: () => mongoose.connect('mongodb://localhost/'+dbName),
    dbName: dbName,
    connection: () => {
        if(mongoose.connection) 
            return mongoose.connection
        return this.connect();
    }
}