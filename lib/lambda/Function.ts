import { LambdaFunction, LambdaFunctionConfig } from "@cdktf/provider-aws/lib/lambda-function";
import { Construct } from "constructs";
import { AwsRole } from "../iam/role";
import { AwsServicePrincipal } from "../iam/principles/AwsServicePrinciple";
import { IGrantable, IGrantor } from "../iam/IGrantable";
import { AwsEffects, AwsPolicyDocument, AwsPolicyStatement } from "../iam/policyStatement";

type LambdaFnProps = {
    role?: AwsRole;
} & Omit<LambdaFunctionConfig, "role">

export class Lambda extends Construct implements IGrantable, IGrantor {
    private l1Fn: LambdaFunction;
    public role: AwsRole;

    constructor(scope: Construct, id: string, props: LambdaFnProps) {
        super(scope, id);
        if (!props.role) {
            this.role = new AwsRole(this, `${id}-role`, {
                assumedBy: new AwsServicePrincipal("lambda.amazonaws.com"),
            })
        } else {
            this.role = props.role;
        }

        this.l1Fn = new LambdaFunction(this, `${id}-fn`, {
            ...props,
            role: this.role.name,
        });
        this.l1Fn.architectures
    }
    grant(grantable: IGrantable, actions: string[]): void {
       grantable.addInlinePolicy(new AwsPolicyDocument([
        new AwsPolicyStatement({
            resources: [this.l1Fn.arn],
            actions,
            effect: AwsEffects.ALLOW,
        })
       ]))
    }
    grantInvoke(grantable: IGrantable) {
        this.grant(grantable, ["lambda:InvokeFunction"]);
    }
    addInlinePolicy(policyDocument: AwsPolicyDocument): void {
        this.role.addInlinePolicy(policyDocument);
    }

    public get functionArn() {
        return this.l1Fn.arn;
    }

    public get functionName() {
        return this.l1Fn.functionName;
    }

    public get currentVersion() {
        return this.l1Fn.version;
    }
}