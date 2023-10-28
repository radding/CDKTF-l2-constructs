import { Construct } from "constructs";
import { IGrantable, IGrantor } from "../iam/IGrantable";
import { AwsEffects, AwsPolicyDocument, AwsPolicyStatement } from "../iam/policyStatement";
import { LambdaAlias, LambdaAliasConfig } from "@cdktf/provider-aws/lib/lambda-alias";
import { Lambda } from "./Function";

type Props = {
    function: Lambda;
    version?: string;
} & Omit<LambdaAliasConfig, "functionName" | "functionVersion">;

export class AwsLambdaAlias extends Construct implements IGrantable, IGrantor {
    public readonly fn: Lambda;
    private alias: LambdaAlias;
    constructor(scope: Construct, id: string, props: Props) {
        super(scope, id);
        this.alias = new LambdaAlias(this, "alias", {
            functionName: props.function.functionArn,
            functionVersion: props.function.currentVersion,
            ...props,
        })

        this.fn = props.function;
    }

    addInlinePolicy(policyDocument: AwsPolicyDocument): void {
        this.fn.addInlinePolicy(policyDocument);
    }
    grant(grantable: IGrantable, actions: string[]): void {
        grantable.addInlinePolicy(new AwsPolicyDocument(
            [new AwsPolicyStatement({
                resources: [this.alias.arn],
                actions,
                effect: AwsEffects.ALLOW,
            })]
        ))
    }

}