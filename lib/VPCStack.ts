import { Stack, StackProps } from "aws-cdk-lib";
import { SubnetType, Vpc } from "aws-cdk-lib/aws-ec2";
import { Construct } from "constructs";

export class VPCStack extends Stack {
  public readonly vpc: Vpc;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    this.vpc = new Vpc(this, `${id}-vpc`, {
      cidr: "10.16.0.0/24",
      enableDnsHostnames: true,
      enableDnsSupport: true,
      maxAzs: 1,
      natGateways: 0,
      subnetConfiguration: [
        {
          name: `${id}-public-subnet`,
          subnetType: SubnetType.PUBLIC,
          mapPublicIpOnLaunch: true,
          cidrMask: 26
        },
      ],
    });
    }
  
}
