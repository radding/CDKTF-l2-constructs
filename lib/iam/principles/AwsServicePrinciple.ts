import { IResolvable } from "cdktf";
import { AWSRegion } from "../../constants/regions";
import { IPrincipal } from "../IPrincipal";

export class AwsServicePrincipal implements IPrincipal {
    principalJson: Record<string, string[]> | IResolvable;
    conditions?: Record<string, any> | undefined;

    constructor(service: string, opts?: {conditions?: Record<string, any>, region?: AWSRegion}) {
        this.conditions = opts?.conditions
        this.principalJson = {
                "Service": [service],
            }
        }
    }