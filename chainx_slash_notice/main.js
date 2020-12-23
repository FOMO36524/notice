'use strict';

require("dotenv").config();
const cfg = require("../dataJson/urls");
const cfgEmail = require("../public/config");
// console.log(cfg)
const curTime = require("../public/util_time");
const email = require("../public/util_email");

const { ApiPromise } = require("@polkadot/api");
const { WsProvider } = require("@polkadot/rpc-provider");
const { options } = require("@chainx-v2/api");

async function notify(height, addr, slashAmount) {
    let content = 'Slash happened at ' + height + ' for ' + cfg.validators[addr].name + ' with amount ' + slashAmount;
    console.log(curTime(), content);
    let to = cfg.validators[addr].email_to.join(', ');
    if (cfgEmail.email.enable && to != "") {
        console.log(curTime(), 'Sending email ...');
        email.sendMail('ChainX20 Slash Notice', content, to);
    }

}

async function listenBlock(api, addr, slashAmount) {
    const unsubscribe = await api.rpc.chain.subscribeNewHeads((header) => {
        console.log(curTime(), `Chain Block: #${header.number}`);
        unsubscribe();
        notify(header.number, addr, slashAmount);
    });
}

const main = async function() {
    console.log(curTime(), 'Slash Notice for ChainX20. Version: 0.9.0');
    console.log('Env is:');
    console.log('chainx_ws_addr:', process.env.chainx_ws_addr);
    console.log('CfgEmail is:');
    console.log('email enabled:', cfgEmail.email.enable);
    console.log('email host:', cfgEmail.email.host);
    console.log('email port:', cfgEmail.email.port);
    console.log('email ssl:', cfgEmail.email.ssl);
    console.log('email uid:', cfgEmail.email.uid);
    console.log('email from:', cfgEmail.email.from);
    console.log('');
    // email.sendMail('ChainX20 Slash Notice', 'content', 'to');

    const wsProvider = new WsProvider(process.env.chainx_ws_addr);
    const api = await ApiPromise.create(options({ provider: wsProvider }));
    //
    //
    // console.log('api.rpc')
    // console.log(wsProvider)
    // email.sendMail('ChainX20 Slash Notice', 'content', 'to');
    // listenBlock(api, 'n/a', 'slashAmount');
    // console.log(api.rpc)
    // console.log(api)
    await api.isReady;
    //
    //
    const [chain, nodeName, nodeVersion] = await Promise.all([
        api.rpc.system.chain(),
        api.rpc.system.name(),
        api.rpc.system.version(),
    ]);
    //
    console.log(curTime(),
        `You are connected to chain ${chain} using ${nodeName} v${nodeVersion} `
    );

    api.query.system.events((events) => {
        console.log(curTime(), `[Debug] Received ${events.length} events.`);

        // console.log(events)
        // console.log(events['event'])
        // Loop through the Vec<EventRecord>
        events.forEach((record) => {
            // Extract the phase, event and the event types
            const { event, phase } = record;
            const types = event.typeDef;
            // console.log(event)

            if (event.method == 'Slashed') {

                // Show what we are busy with
                console.log(`\t${event.section}:${event.method}:: (phase=${phase.toString()})`);
                console.log(`\t${event.meta.documentation.toString()}`);

                let addr = 'N/A';
                let slashAmount = 'N/A';
                // Loop through each of the parameters, displaying the type and data
                event.data.forEach((data, index) => {
                    console.log(`\t\t${types[index].type}: ${data.toString()}`);
                    if (types[index].type == 'AccountId') {
                        addr = data.toString();
                    }
                    if (types[index].type == 'Balance') {
                        slashAmount = data.toString();
                    }
                });
                if (addr in cfg.validators) {
                    listenBlock(api, addr, slashAmount);
                }

            }

        }); // end of events.forEach

    });
}
module.exports = main;
