var AWS = require('aws-sdk');

AWS.config.loadFromPath('./config.json');
var ec2 = new AWS.EC2();

var params = {
    InstanceIds: [
        "i-1234567890abcdef0"
    ]
};
ec2.describeInstances(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
    /*
    data = {
    }
    */
});