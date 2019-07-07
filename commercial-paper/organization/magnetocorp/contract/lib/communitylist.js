/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for collections of ledger states --  a state list
const StateList = require('./../ledger-api/statelist.js');

const Community = require('./community.js');

class CommunityList extends StateList {

    constructor(ctx) {
        super(ctx,'org.papernet.commercialpaper');
        this.use(Community);
    }

    async addCommunity(community) {
        return this.addState(community);
    }

    async getCommunity(communityKey) {
        return this.getState(communityKey);
    }

    async updateCommunity(community) {
        return this.updateState(community);
    }
}


module.exports = CommunityList;
