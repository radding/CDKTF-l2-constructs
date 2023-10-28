import { TerraformStack } from "cdktf";
import { Construct } from "constructs";
import { AWSRegion } from "../constants/regions";
import { AwsProvider, AwsProviderConfig } from "@cdktf/provider-aws/lib/provider";

export type AwsStackProps = {
    env: {
        region: AWSRegion,
        acccountID: string;
    } & Omit<AwsProviderConfig, "region" | "allowedAccountIds" | "forbiddenAccountIds">
}

export class AWSStack extends TerraformStack {

    protected provider: AwsProvider;
    
    constructor(scope: Construct, id: string, props: AwsStackProps) {
        super(scope, id);
        this.provider = new AwsProvider(this, "AWS", {
            region: props.env.region,
            allowedAccountIds: [props.env.acccountID],
        });
    }
}