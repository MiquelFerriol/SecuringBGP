/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Bring key classes into scope, most importantly Fabric SDK network class
const fs = require('fs');
const yaml = require('js-yaml');
const { FileSystemWallet, Gateway } = require('fabric-network');
const command = 'docker exec peer0.org1.example.com du -ks /var/hyperledger/production/ledgersData/';
const Community = require('../contract/lib/community.js');
// A wallet stores a collection of identities for use
//const wallet = new FileSystemWallet('../user/isabella/wallet');
const wallet = new FileSystemWallet('../identity/user/isabella/wallet');

// Main program function
async function main() {

    // A gateway defines the peers used to access Fabric networks
    const gateway = new Gateway();

    // Main try/catch block
    try {

        // Specify userName for network access
        // const userName = 'isabella.issuer@magnetocorp.com';
        const userName = 'User1@org1.example.com';

        // Load connection profile; will be used to locate a gateway
        let connectionProfile = yaml.safeLoad(fs.readFileSync('../gateway/networkConnection.yaml', 'utf8'));

        // Set connection options; identity and wallet
        let connectionOptions = {
            identity: userName,
            wallet: wallet,
            discovery: {enabled: false, asLocalhost: true}
        };

        // Connect to gateway using application specified parameters
        console.log('Connect to Fabric gateway.');

        await gateway.connect(connectionProfile, connectionOptions);

        // Access network
        console.log('Use network channel: mychannel.');

        const network = await gateway.getNetwork('mychannel');

        // Get addressability to community contract

        console.log('Use securingBGP.community smart contract.');
        let RULES = ['NO_EXPORT','LOCAL_PREFERENCE', 'PREPEND', 'NO_ANNOUNCE', 'NO_EXPORT'];
        let ISO = ['ABW','AFG','AGO','AIA','ALA','ALB','AND','ARE','ARG','ARM','ASM','ATA','ATF','ATG']
        let length = 100;

        const {exec} = require('child_process');
        exec(command, (err, stdout, stderr) => {
            if (err) {
                //some err occurred
                console.error(err);
            } else {
                // the *entire* stdout and stderr (buffered)
                console.log(stdout);
                fs.appendFileSync('size.txt', '0 ,' + stdout);
            }
        });

        for (let i = 1; i <= 10000; i++) {

            const contract = await network.getContract('communitycontract', 'securingBGP.community');

            console.log('Submitting transaction.');


            let AS = Array.from({length: length}, () => Math.floor(Math.random() * 2**16));
            let CommunityNum = Array.from({length: length}, () => Math.floor(Math.random() * 2**16));
            let rules = Array.from({length: length}, () => RULES[Math.floor(Math.random()*RULES.length)]);
            let to = Array.from({length: length}, () => ISO[Math.floor(Math.random()*ISO.length)]);

            const issueResponse = await contract.submitTransaction('newCommunity', AS.toString(), CommunityNum.toString(), rules.toString(), to.toString());

            // process response
            console.log('Process issue transaction response.');

            let community = Community.fromBuffer(issueResponse);

            console.log(community);


            if(i%10 === 0) {
                const {exec} = require('child_process');
                exec(command, (err, stdout, stderr) => {
                    if (err) {
                        //some err occurred
                        console.error(err);
                    } else {
                        // the *entire* stdout and stderr (buffered)
                        console.log(stdout);
                        fs.appendFileSync('size.txt', (i*100).toString() + ' ,' + stdout);
                    }
                });
            }

        }

    } catch (error) {
        console.log(`Error processing transaction. ${error}`);
        console.log(error.stack);

    } finally {

        // Disconnect from the gateway
        console.log('Disconnect from Fabric gateway.');
        gateway.disconnect();

    }
}

main().then(() => {

    console.log('NewCommunity program complete.');

}).catch((e) => {

    console.log('NewCommunity program exception.');
    console.log(e);
    console.log(e.stack);
    process.exit(-1);

});