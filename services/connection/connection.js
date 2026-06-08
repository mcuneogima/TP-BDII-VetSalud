const mongoose = require('mongoose');
const cassandra = require('cassandra-driver');

const connectMongo = async () => {
    await mongoose.connect('mongodb://localhost:27017');
    console.log('Connecting to MongoDB');
};

const cassandraClient = new cassandra.Client({
    contactPoints: ['127.0.0.1'],
    localDataCenter: 'datacenter1'
});

const connectCassandra = async () => {
    await cassandraClient.connect();
    console.log('Connecting to Cassandra');
};

module.exports = {connectMongo, cassandraClient, connectCassandra};