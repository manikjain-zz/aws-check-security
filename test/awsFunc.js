// Import AWS module
var AWS = require("aws-sdk");

// Initialise an ec2 object from AWS SDK with a custom region: us-east-1
var ec2 = new AWS.EC2({
    region: 'us-east-1'
});

// Export AWS API functions for use in tests
module.exports = {
    describeInstances: async () => {
        return await ec2.describeInstances({
            MaxResults: 5,
            Filters: [{ Name: 'instance-state-name', Values: ['running'] }]
        }).promise();
    },
    describeSecurityGroups: async () => {
        return await ec2.describeSecurityGroups().promise();
    }
}