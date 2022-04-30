import { Size, Stack, StackProps } from "aws-cdk-lib";
import {
  AmazonLinuxImage,
  BlockDeviceVolume,
  EbsDeviceVolumeType,
  Instance,
  InstanceClass,
  InstanceSize,
  InstanceType,
  Peer,
  Port,
  SecurityGroup,
  Vpc,
} from "aws-cdk-lib/aws-ec2";
import { Construct } from "constructs";

interface EC2StackProps extends StackProps {
  vpc: Vpc;
}

export class EC2Stack extends Stack {
  public readonly ec2: Instance;
  constructor(scope: Construct, id: string, props: EC2StackProps) {
    super(scope, id, props);

    const securityGroup = new SecurityGroup(this, `${id}-security-group`, {
      vpc: props.vpc,

    });

    securityGroup.addIngressRule(Peer.anyIpv4(), Port.tcp(22));
    securityGroup.addIngressRule(Peer.anyIpv4(), Port.tcp(80));
    securityGroup.addIngressRule(Peer.anyIpv4(), Port.tcp(443));

    const bootVolume = BlockDeviceVolume.ebs(16, {
      encrypted: true,
      deleteOnTermination: false,
      volumeType: EbsDeviceVolumeType.GP3,
    });

    const dataVolumeBackup = BlockDeviceVolume.ebs(125, {
      encrypted: true,
      deleteOnTermination: false,
      volumeType: EbsDeviceVolumeType.COLD_HDD,
    });

    const dataVolumeNoBackup = BlockDeviceVolume.ebs(125, {
      encrypted: true,
      deleteOnTermination: false,
      volumeType: EbsDeviceVolumeType.COLD_HDD,
    });
    

    this.ec2 = new Instance(this, `${id}-ec2-instance`, {
      instanceType: InstanceType.of(InstanceClass.T3A, InstanceSize.MICRO),
      machineImage: new AmazonLinuxImage(),
      vpc: props.vpc,
      securityGroup: securityGroup,
      blockDevices: [
        { deviceName: `/dev/xvda`, volume: bootVolume },
        { deviceName: `/dev/sdf`, volume: dataVolumeBackup },
        { deviceName: `/dev/sdg`, volume: dataVolumeNoBackup },
      ],
      keyName: "cloud-lab",

    });




  }
}
