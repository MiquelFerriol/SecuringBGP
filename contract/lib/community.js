'use strict';

// Utility class for ledger state
const State = require('./../ledger-api/state.js');

/**
 * Community class extends State class
 * Class will be used by application and smart contract to define a community
 */
class Community extends State {

    constructor(obj) {
        super(Community.getClass(), [obj.autonomousSystem, obj.communityNumber]);
        Object.assign(this, obj);
    }

    /**
     * Useful methods to encapsulate community states
     */

    static fromBuffer(buffer) {
        return Community.deserialize(Buffer.from(JSON.parse(buffer)));
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    /**
     * Deserialize a state data to community
     * @param {Buffer} data to form back into the object
     */
    static deserialize(data) {
        return State.deserializeClass(data, Community);
    }

    /**
     * Factory method to create a community object
     */
    static createInstance(autonomousSystem, communityNumber, rule, to, value, dateTime) {
        return new Community({autonomousSystem, communityNumber, rule, to, value, dateTime});
    }

    static getClass() {
        return 'securingBGP.community';
    }
}

module.exports = Community;
