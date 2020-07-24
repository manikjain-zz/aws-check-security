// Import modules
var assert = require("assert");
var describeInstances = require("./awsFunc").describeInstances();
var describeSecurityGroups = require("./awsFunc").describeSecurityGroups();

// Test for describeInstances AWS API endpoint
describe('#Get instance data from AWS', () => {
    it('should return instance data', () => {
        return describeInstances.then(data => {
            assert.notEqual(data, null);
        }).catch(err => console.log(err));
    });
});

// Test for describeSecurityGroup AWS API endpoint
describe('#Get security groups from AWS', () => {
    it('should return security group data', () => {
        return describeSecurityGroups.then(data => {
            assert.notEqual(data, null);
        }).catch(err => console.log(err));
    });
});