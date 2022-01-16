module.exports = {
    logLevel: 'debug',
    apiPort: 3006,
    node: 'wss://ropsten.infura.io/ws/v3/d741a1e0063d4d16ac29e442c308679d',
    nodeOptions: {
        keepAlive: true,
        reconnect: {
            auto: true,
            delay: 5000, // ms
            maxAttempts: 5,
            onTimeout: false
        }
    },
    ipfs: {host: 'ipfs.yonft.com', port: 443, protocol: 'https'},
    mysql: {
        db: 'ctypto_tweeter',
        user: 'root',
        password: '124',
        host: 'localhost',
        logging: 0,
    }
}
