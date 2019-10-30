/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Fabric smart contract classes
const { Contract, Context } = require('fabric-contract-api');

// PaperNet specifc classes
const Community = require('./community.js');
const CommunityList = require('./communitylist.js');

/**
 * A custom context provides easy access to list of all communities
 */
class CommunityContext extends Context {

    constructor() {
        super();
        // All papers are held in a list of papers
        this.communityList = new CommunityList(this);
    }

}

/**
 * Define community smart contract by extending Fabric Contract class
 *
 */
class CommunityContract extends Contract {

    constructor() {
        // Unique namespace when multiple contracts per chaincode file
        super('securingBGP.community');
    }

    async existsCommunity(ctx, autonomousSystem, communityNumber){
        try{
            let communityKey = Community.makeKey([autonomousSystem, communityNumber]);
            await ctx.communityList.getCommunity(communityKey);
            return true.toString()
        }
        catch(error){
            return false
        }
    }

    /**
     * Define a custom context for community
    */
    createContext() {
        return new CommunityContext();
    }

    /**
     * Instantiate to perform any setup of the ledger that might be required.
     * @param {Context} ctx the transaction context
     */
    async instantiate(ctx) {
        console.log('Instantiate the contract');
    }

    /**
     * Create new community
     *
     * @param {Context} ctx the transaction context
     * @param {Integer} autonomousSystem autonomousSystem that creates the community
     * @param {Integer} communityNumber community number
     * @param {String} rule community rule
     * @param {String} to to whom the rule refers
     * @param {Integer} value value of the community
    */
    async newCommunity(ctx, autonomousSystem, communityNumber, rule, to, value) {

        // create an instance of the paper
        let unixts = Math.round((new Date()).getTime() / 1000);

        let community = Community.createInstance(autonomousSystem, communityNumber, rule, to, value, unixts);

        // Add the paper to the list of all similar commercial papers in the ledger world state
        await ctx.communityList.addCommunity(community);

        // Must return a serialized paper to caller of smart contract
        return community.toBuffer();
    }

    async communityBulkTransfer(ctx, autonomousSystem, communityNumber, rule, to, value) {
        console.log("autonomousSystem")
        console.log(autonomousSystem)
        autonomousSystem = autonomousSystem.split(",");
        communityNumber = communityNumber.split(",");
        rule = rule.split(",");
        to = to.split(",");
        // create an instance of the paper
        var communitites = [];

        for (var i = 0; i < autonomousSystem.length; i++) {

            let unixts = Math.round((new Date()).getTime() / 1000);

            let community = Community.createInstance(autonomousSystem[i], communityNumber[i], rule[i], to[i], value, unixts);
            communitites.push(community)
            // Add the paper to the list of all similar commercial papers in the ledger world state
            await ctx.communityList.addCommunity(community);

        }
        // Must return a serialized paper to caller of smart contract
        return Buffer.from(JSON.stringify(communitites));
    }

    /**
     * Modify a community
     *
     * @param {Context} ctx the transaction context
     * @param {Integer} autonomousSystem autonomousSystem that creates the community
     * @param {Integer} communityNumber community number
    */
    async getCommunity(ctx, autonomousSystem, communityNumber) {

        let communityKey = Community.makeKey([autonomousSystem, communityNumber]);
        let community = await ctx.communityList.getCommunity(communityKey);

        if(community == null){
            throw new Error('Community ' + autonomousSystem + ':' + communityNumber + ' does not exist');
        }

        return community.toBuffer();
    }

    async throwError(){
        throw new Error('A random error');
    }

}

module.exports = CommunityContract;
