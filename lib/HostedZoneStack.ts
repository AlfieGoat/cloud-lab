import { Duration, Stack, StackProps } from "aws-cdk-lib";
import { ARecord, HostedZone, IHostedZone, RecordTarget } from "aws-cdk-lib/aws-route53";
import { Construct } from "constructs";

interface HostedZoneStackProps extends StackProps {
  zoneId: string;
  zoneName: string;
}

export class HostedZoneStack extends Stack {
  public readonly hostedZone: IHostedZone;

  constructor(scope: Construct, id: string, props: HostedZoneStackProps) {
    super(scope, id, props);
    this.hostedZone = HostedZone.fromHostedZoneAttributes(this, `${id}-hosted-zone`, {hostedZoneId: props.zoneId, zoneName: props.zoneName})
  }

  public createARecord(recordName: string, target: RecordTarget) {
    new ARecord(this, `${recordName}-A-Record`, {
      zone: this.hostedZone,
      recordName: recordName,
      ttl: Duration.seconds(0),
      target,
    });
  }
}
