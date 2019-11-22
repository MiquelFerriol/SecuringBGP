var AWS = require('aws-sdk');

AWS.config.loadFromPath('./config.json');
var ec2 = new AWS.EC2();


ec2.describeInstances({}, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else{
        var buf = '';
        data['Reservations'].forEach(function (value) {
            let instance = value['Instances'][0];
            buf += instance['Tags'][0].Value + "_IP="+instance['PublicIpAddress']+'\n';

        });

        const fs = require('fs');

        buf = buf.toUpperCase();

        fs.writeFile("../aws-network/deployment/.env", buf, (err) => {
            if (err) console.log(err);
            console.log(buf);
        });
    }
});