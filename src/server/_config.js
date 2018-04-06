var config = {};

// mongo uri
config.mongoURI = {
    development: "mongodb://localhost/demo-server",
    test: "mongodb://localhost/demo-server-test",
    stage: process.env.MONGOLAB_URI
};

module.exports = config;