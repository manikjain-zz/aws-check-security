
# aws-security-check

This script uses the AWS SDK to list and find all instances with security group inbound rules allowing '0.0.0.0/0' addresses. (Note:- AWS region in the script defaults to `us-east-1`)

Table of Contents
=================
* [Prerequisites](#prerequisites)
* [Install and run the script](#install-and-run-the-script)
  * [Sample run of the script](sample-run-of-the-script)
* [Unit tests](unit-tests)
  * [Sample run of unit tests](sample-run-of-unit-tests)

## Prerequisites:
1. Node.js (> v12.0.0) must be installed on your machine. Download from [https://nodejs.org/en/download/](https://nodejs.org/en/download/), if not already installed.
2. You will need an AWS IAM user/root account with programmatic access enabled and access keys placed at the following paths (based on your OS). For Linux, Unix, and macOS: `~/.aws/credentials`, Windows:  `C:\Users\USER_NAME\.aws\credentials`.
3. Your AWS account must have permissions to `describeInstances` and `describeSecurityGroups` in EC2  You may use a managed IAM policy which provides these permissions or an inline/custom policy as follows. Here is a sample IAM policy to assign these permissions:
```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "VisualEditor0",
            "Effect": "Allow",
            "Action": [
                "ec2:DescribeInstances",
                "ec2:DescribeSecurityGroups"
            ],
            "Resource": "*"
        }
    ]
}
```

## Install and run the script
1. Clone this repository on your local machine with `git clone git@github.com:manikjain/aws-check-security.git`.
2. Change directory with `cd aws-check-security`.
3. Run `npm install` to install the dependencies.
4. Run `node aws-check-security.js`.

### Sample run of the script

```
$ node aws-check-security.js

+---------------------+------------------------------------------------------------------------------------------------------------------------------------+----------+
| INSTANCE_ID         | INBOUND                                                                                                                            | INSECURE |
+---------------------+------------------------------------------------------------------------------------------------------------------------------------+----------+
| i-0af037ebd59409f58 | 22 [0.0.0.0/0], 8000-9000 [172.0.0.0/16, 192.0.0.0/8, 10.0.0.0/16], 1024-2048 [10.0.0.0/24], 0-65535 [173.5.1.0/24, 184.98.4.0/24] | YES      |
| i-063ab80e8db3497c3 | 53 [102.5.5.0/24], 389 [0.0.0.0/0]                                                                                                 | YES      |
| i-05c4cc3fef54eb4aa | 0-65535 [173.5.1.0/24, 184.98.4.0/24]                                                                                              | NO       |
+---------------------+------------------------------------------------------------------------------------------------------------------------------------+----------+
```

## Unit tests

There are two tests which hit the AWS API to check if data is returned from the `describeInstances` and `describeSecurityGroups` endpoints.

1. Ensure that dependencies are installed using `npm install` and not `npm install --production`, so that `mocha` is available.
1. To execute unit tests using mocha, run `npm test` from within the main repository directory.

### Sample run of unit tests

```
$ npm test

> aws-check-security@1.0.1 test /Users/manikjain/aws-check-security
> mocha --timeout 5000



  #Get instance data from AWS
    ✓ should return instance data (2000ms)

  #Get security groups from AWS
    ✓ should return security group data (1364ms)


  2 passing (3s)

```
