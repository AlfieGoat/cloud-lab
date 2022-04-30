#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { VPCStack } from "../lib/VPCStack";
import { EC2Stack } from "../lib/EC2Stack";
import { HostedZoneStack } from "../lib/HostedZoneStack";
import {} from "aws-cdk-lib/aws-route53-targets";
import { RecordTarget } from "aws-cdk-lib/aws-route53";

const ENV = { account: "754736151010", region: "eu-west-1" };
const ZONE_ID = "Z042311036FBKI83JWQWD";
const ZONE_NAME = "goatcher.net";

const app = new cdk.App();
const vpcStack = new VPCStack(app, "cloud-lab-vpc-stack", {
  stackName: "cloud-lab-vpc-stack",
  env: ENV,
});

const ec2Stack = new EC2Stack(app, "cloud-lab-ec2-stack", {
  vpc: vpcStack.vpc,
  env: ENV,
});

const hostedZoneStack = new HostedZoneStack(
  app,
  `cloud-lab-hosted-zone-stack`,
  { zoneId: ZONE_ID, zoneName: ZONE_NAME, env: ENV }
);

hostedZoneStack.createARecord(
  "nextcloud.goatcher.net",
  RecordTarget.fromIpAddresses(ec2Stack.ec2.instancePublicIp)
);
