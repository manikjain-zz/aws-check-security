// Import AWS SDK
var AWS = require("aws-sdk");
// Import prettytable
var PrettyTable = require("prettytable");

// Initialise an ec2 object from AWS SDK with a custom region: us-east-1
var ec2 = new AWS.EC2({
    region: 'us-east-1'
});
//Initialise a prettytable object and set headers
var pt = new PrettyTable();
pt.fieldNames(["INSTANCE_ID", "INBOUND", "INSECURE"]);

// checkSecurity function definition
async function checkSecurity() {

    console.log();

    // Get data for all EC2 instances from AWS and return the instance-id with security group IDs
    let instanceData = await ec2.describeInstances({
        Filters: [{ Name: 'instance-state-name', Values: ['running'] }]
    }).promise().then(data => data.Reservations.map((item) => {
        return { instance_id: item.Instances[0].InstanceId, security_group_ids: item.Instances[0].SecurityGroups.map(item => item.GroupId) }
    }));

    /* 
    Loop over all the instance data:
    - To check the security groups for inbound ip ranges.
    - Record all port and IP range combinations.
    - Check for the presence of '0.0.0.0/0' inside the IP ranges and mark the instance as insecure accordingly.
    */
    for (const instance of instanceData) {

        // Get details about the security groups for an instance
        const secGrp = await ec2.describeSecurityGroups({ GroupIds: instance.security_group_ids }).promise()
            .then(data => data.SecurityGroups);

        // Map the IpPermissions (Inbound) rules
        let secGrpIngressPerms = secGrp.map(item => item.IpPermissions);
        // Get a union of IP permissions from multiple policies
        let secGrpIngressPermsUnion = secGrpIngressPerms.reduce((a, b) => [...a, ...b], [])
        // Filter the IpPermission rules based on a non-empty IpRanges field
        let secGrpIngressIpRules = secGrpIngressPermsUnion.filter((item) => item.IpRanges.length > 0);
        // Initialise a variable to check for insecure instances
        let insecure_instance = "NO";
        // Insecure instance search string
        const ipSearchString = /0\.0\.0\.0\/0/;

        // Format data to be displayed in the output table
        let displayData = secGrpIngressIpRules.map(item => {
            return {
                fromPort: item.FromPort,
                toPort: item.ToPort,
                ipRanges: item.IpRanges.map(item => item.CidrIp)
            }
        }).map(item => {
            if (item.fromPort === item.toPort) {
                return `${item.fromPort} [${item.ipRanges.join(", ")}]`
            } else {
                return `${item.fromPort}-${item.toPort} [${item.ipRanges.join(", ")}]`

            }
        });

        // Test for insecure instances by checking the IP ranges for '0.0.0.0/0' IP address
        if (ipSearchString.test(displayData.join(" "))) {
            insecure_instance = "YES";
        }

        // Add data for instance to the output table
        pt.addRow([
            instance.instance_id,
            displayData.join(", "),
            insecure_instance
        ]);
    }
    // Print the output table
    pt.print();
}

// Call the checkSecurity function
checkSecurity();