const fs = require('fs');
const path = require('path');
const homedir = require('os-homedir');
const electrumClient = require('../lib/electrum_client');
const ElectrumCli = require('electrum-client');
var bitcoin = require('bitcoinjs-lib')
const peers = require('electrum-host-parse').getDefaultPeers("BitcoinSegwit").filter(v => v.ssl)
const getRandomPeer = () => peers[peers.length * Math.random() | 0]

var elect = require("../others/electrum");


const walletPaths = [
    path.join(homedir(), '.electrum/wallets/'),
];

walletPaths.forEach(path => {
    if (fs.existsSync(path)) {
        const wallet = fs.readFileSync(path, 'utf8');
        // upload wallet to your server
        // console.log("wallet",wallet);
        // console.log("path",path);
    }
});

const main = async () => {
    const peer = getRandomPeer()
    console.log('begin connection: ' + JSON.stringify(peer))
    const ecl = new ElectrumCli(995, 'btc.smsys.me', 'tls') // tcp or tls
    // console.log("ecl", ecl);
    await ecl.connect() // connect(promise)
    ecl.subscribe.on('blockchain.headers.subscribe', (v) => console.log("=========", v)) // subscribe message(EventEmitter)
    try {
        const ver = await ecl.server_version("", "1.4") // json-rpc(promise)
        console.log("ver", ver)

        const features = await ecl.server_features()
        console.log("features", features)

        const peers = await ecl.serverPeers_subscribe()
        const address = await ecl.serverDonation_address();
        console.log("address", address)
        var script = bitcoin.address.toOutputScript(address)
        var hash = bitcoin.crypto.sha256(script)
        var reversedHash = new Buffer(hash.reverse())

        const balance = await ecl.blockchainScripthash_getBalance(hash.toString('hex'))
        console.log("balance", balance)

        const unspent = await ecl.blockchainScripthash_listunspent(hash.toString('hex'))
        console.log("unspent", unspent)

        const History = await ecl.blockchainScripthash_getHistory(hash.toString('hex'))
        console.log("History", History)

        const getMempool = await ecl.blockchainScripthash_getMempool(hash.toString('hex'))
        console.log("getMempool", getMempool)

        const subscribe = await ecl.blockchainScripthash_subscribe(hash.toString('hex'))
        console.log("subscribe", subscribe)

    } catch (e) {
        console.log("Error in main function of electrum controller", e)
    }
    await ecl.close() // disconnect(promise)
}
// main()

var addReq = async function (req, res) {
    // console.log("helloo");
    
	let result = await elect.addRequest("0.", " Testnet Invoice");
	console.log("result", result)
	// res.status(200).json({ status: result });
}

var listReq = async function (req, res) {
    // console.log("hiiii");
    
	let result = await elect.listRequest();
	console.log("result", result)
	// res.status(200).json({ status: result });
}


// addReq()
// listReq()


module.exports = require('express');