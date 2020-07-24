// Import modules
var AWS = require("aws-sdk");
var assert = require("assert");

// Initialise an ec2 object from AWS SDK with a custom region: us-east-1
var ec2 = new AWS.EC2({
    region: 'us-east-1'
});

describe('#Get instance data from AWS', () => {
    it('should return instance data', () => {
        return describeInstances().then(data => {
            assert.notEqual(data, null);
        });
    });
});

describe('#Get security groups from AWS', () => {
    it('should return security group data', () => {
        return describeSecurityGroups().then(data => {
            assert.notEqual(data, null);
        });
    });
});

async function describeInstances() {
    return await ec2.describeInstances({
        MaxResults: 5,
        Filters: [{ Name: 'instance-state-name', Values: ['running'] }]
    }).promise();
}

async function describeSecurityGroups() {
    return await ec2.describeSecurityGroups().promise();
}