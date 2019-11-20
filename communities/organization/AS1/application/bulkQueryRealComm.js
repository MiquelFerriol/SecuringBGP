/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';
//the path of the real communities 
const readingFolder = '/home/neck/Documents/Uni/TFG/BGPblockchain/SecuringBGP/communities/organization/AS1/application/as174';
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
        const doc = yaml.safeLoad(fs.readFileSync(readingFolder, 'utf8'));
        let AS = doc.as;
        console.log(AS);
        let total = 0;
        var declared;
        //NOEXPORT
        try {
            doc.noexport.donotsend;
            declared = true;
        } catch(e) {
            declared = false;
        }
        if (declared) {
            for (let j = 0; j < doc.noexport.donotsend.length; j++) {
                const contract = await network.getContract('communitycontract', 'securingBGP.community');
                console.log('Submitting noexport transaction.');
                let CommunityNum = doc.noexport.donotsend[j].community;
                let rules = 'NO_EXPORT_DO_NOT_SEND';
                let to = doc.noexport.donotsend[j].peers;
                const issueResponse = await contract.submitTransaction('newCommunity', AS.toString(), CommunityNum.toString(), rules.toString(), to.toString());
                // process response
                console.log('Process issue transaction response.');
                let community = Community.fromBuffer(issueResponse);
                console.log(community);
                ++total;
            }
        } else {
            console.log("Noexport donot send defined");
        }
        try {
            doc.noexport.setlocpref;
            declared = true;
        } catch(e) {
            declared = false;
        }
        if (declared) {
            for (let j = 0; j < doc.noexport.setlocpref.length; j++) {
                const contract = await network.getContract('communitycontract', 'securingBGP.community');
                console.log('Submitting noexport transaction.');
                let CommunityNum = doc.noexport.setlocpref[j].community;
                let rules = 'NO_EXPORT_SET_LOC_PREF';
                let to = doc.noexport.setlocpref[j].value;
                const issueResponse = await contract.submitTransaction('newCommunity', AS.toString(), CommunityNum.toString(), rules.toString(), to.toString());
                // process response
                console.log('Process issue transaction response.');
                let community = Community.fromBuffer(issueResponse);
                console.log(community);
                ++total;
            }
        } else {
            console.log("Noexport set local preference defined");
        }
        //LOCAL_PREFERENCE
        try {
            doc.localpreference.setcustomerroute;
            declared = true;
        } catch(e) {
            declared = false;
        }
        if (declared) {
            for (let j = 0; j < doc.localpreference.setcustomerroute.length; j++) {
                    const contract = await network.getContract('communitycontract', 'securingBGP.community');
                    console.log('Submitting localpreference transaction.');
                    let CommunityNum = doc.localpreference.setcustomerroute[j].community;
                    let rules = 'LOCAL_PREFERENCE';
                    let to = doc.localpreference.setcustomerroute[j].value;
                    const issueResponse = await contract.submitTransaction('newCommunity', AS.toString(), CommunityNum.toString(), rules.toString(), to.toString());
                    // process response
                    console.log('Process issue transaction response.');
                    let community = Community.fromBuffer(issueResponse);
                    console.log(community);
                    ++total;
            }
        } else {
            console.log("Local preference undefined");
        }
        //PEER_CONTROLS
        try {
            doc.peercontrol.donotannounce;
            declared = true;
        } catch(e) {
            declared = false;
        }
        if (declared) {
            for (let j = 0; j < doc.peercontrol.donotannounce.length; j++) {
                const contract = await network.getContract('communitycontract', 'securingBGP.community');
                console.log('Submitting peercontrol transaction.');
                let CommunityNum = doc.peercontrol.donotannounce[j].community;
                let rules = 'DO_NOT_ANNOUNCE';
                let to = doc.peercontrol.donotannounce[j].peer;
                const issueResponse = await contract.submitTransaction('newCommunity', AS.toString(), CommunityNum.toString(), rules.toString(), to.toString());
                // process response
                console.log('Process issue transaction response.');
                let community = Community.fromBuffer(issueResponse);
                console.log(community);
                ++total;
            }
        } else {
            console.log("No peercontrols do not announce defined");
        }
        try {
            doc.peercontrol.prepend;
            declared = true;
        } catch(e) {
            declared = false;
        }
        if (declared) {
            for (let j = 0; j < doc.peercontrol.prepend.length; j++) {
                const contract = await network.getContract('communitycontract', 'securingBGP.community');
                console.log('Submitting peercontrol transaction.');
                let CommunityNum = doc.peercontrol.prepend[j].community;
                let rules = 'PREPEND';
                let to = doc.peercontrol.prepend[j].times;
                const issueResponse = await contract.submitTransaction('newCommunity', AS.toString(), CommunityNum.toString(), rules.toString(), to.toString());
                // process response
                console.log('Process issue transaction response.');
                let community = Community.fromBuffer(issueResponse);
                console.log(community);
                ++total;
            }
        } else {
            console.log("No peercontrols prepend communities defined");
        }
        
        try {
            doc.other.lenght;
            declared = true;
        } catch(e) {
            declared = false;
        }
        if (declared) {
            for (let i = 0; i < doc.other.lenght; i++) {
                const contract = await network.getContract('communitycontract', 'securingBGP.community');
                console.log('Submitting other transaction.');
                let CommunityNum = doc.other[j].community;
                let rules = 'OTHER';
                let to = doc.other[j].what;
                const issueResponse = await contract.submitTransaction('newCommunity', AS.toString(), CommunityNum.toString(), rules.toString(), to.toString());
                // process response
                console.log('Process issue transaction response.');
                let community = Community.fromBuffer(issueResponse);
                console.log(community);
                ++total;
            }
        } else {
            console.log("No other communities defined");
        }
        console.log("Communities dones: " + total);

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