// "Principal": { "AWS": "arn:aws:iam::123456789012:root" }

import { AWSRegion } from "../../constants/regions";
import { AwsArnPrincipal } from "./ARNPrincipal";

export class AwsServicePrincipal extends AwsArnPrincipal{

    constructor(accountID: string, opts?: {conditions?: Record<string, any>, region?: AWSRegion}) {
       super(`arn:aws:iam::${accountID}:root`, opts);
    }
}