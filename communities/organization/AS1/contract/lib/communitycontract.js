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

    /**
     * Modify a community
     *
     * @param {Context} ctx the transaction context
     * @param {String} issuer commercial paper issuer
     * @param {Integer} paperNumber paper number for this issuer
     * @param {String} currentOwner current owner of paper
     * @param {String} newOwner new owner of paper
     * @param {Integer} price price paid for this paper
     * @param {String} purchaseDateTime time paper was purchased (i.e. traded)
    */
    async getCommunity(ctx, autonomousSystem, communityNumber) {

        // Retrieve the current paper using key fields provided
        let communityKey = Community.makeKey([autonomousSystem, communityNumber]);
        let community = await ctx.communityList.getCommunity(communityKey);

        if(community == null){
            throw new Error('Community ' + autonomousSystem + ':' + communityNumber + ' does not exist');
        }
        /*// Validate current owner
        if (paper.getOwner() !== currentOwner) {
            throw new Error('Paper ' + issuer + paperNumber + ' is not owned by ' + currentOwner);
        }

        // First buy moves state from ISSUED to TRADING
        if (paper.isIssued()) {
            paper.setTrading();
        }

        // Check paper is not already REDEEMED
        if (paper.isTrading()) {
            paper.setOwner(newOwner);
        } else {
            throw new Error('Paper ' + issuer + paperNumber + ' is not trading. Current state = ' +paper.getCurrentState());
        }

        // Update the paper
        await ctx.communityList.updatePaper(paper);*/
        return community.toBuffer();
    }

    async throwError(){
        throw new Error('A random error');
    }

}

module.exports = CommunityContract;
/*
let cc = new CommunityContract();

let ctx = new CommunityContext();
cc.newCommunity(ctx, 'autonomousSystem', 'communityNumber', 'rule', 'to', 'value')*/
