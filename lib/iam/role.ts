import { IamRole, IamRoleConfig } from "@cdktf/provider-aws/lib/iam-role";
import { Construct } from "constructs";
import { IPrincipal } from "./IPrincipal";
import { DataAwsIamPolicyDocument, DataAwsIamPolicyDocumentStatementPrincipals } from "@cdktf/provider-aws/lib/data-aws-iam-policy-document";
import { AwsEffects, AwsPolicyDocument, AwsPolicyStatement } from "./policyStatement";
import { IResolvable } from "cdktf";
import { IamRolePolicyAttachment } from "@cdktf/provider-aws/lib/iam-role-policy-attachment";

export type AwsRoleProps = {
    /**
     * The IAM principal (i.e. new ServicePrincipal('sns.amazonaws.com')) which can assume this role.
     */
    assumedBy: IPrincipal;
} & Omit<IamRoleConfig, "assumeRolePolicy">

export class AwsRole extends Construct {
    private l1Role: IamRole;

    constructor(scope: Construct, id: string, props: AwsRoleProps) {
        super(scope, id);
        let principals: IResolvable | DataAwsIamPolicyDocumentStatementPrincipals[] = props.assumedBy.principalJson as IResolvable;
        if (!Object.prototype.hasOwnProperty.call(props.assumedBy.principalJson, "resolve")) {
            principals = Object.entries(props.assumedBy.principalJson as Record<string, string[]>).map(([type, identifiers]) => ({
                type,
                identifiers,
            }));
        }
        const policyDoc = new DataAwsIamPolicyDocument(this, `assume_role_policy`, {
           version: "2012-10-17",
           statement: [ {
                actions: ["sts:AssumeRole"],
                effect: AwsEffects.ALLOW,
                principals,
            }]
        });

        this.l1Role = new IamRole(this, id, {
            assumeRolePolicy: policyDoc.json,
            ...props,
        });
    }

    grant(actions: string[], onResource: string) {
        this.addInlinePolicy(new AwsPolicyDocument([
            new AwsPolicyStatement({
                effect: AwsEffects.ALLOW,
                actions,
                resources: [onResource],
            })
        ]))
    }

    addInlinePolicy(policyDocument: AwsPolicyDocument) {
        this.l1Role.putInlinePolicy([{
            policy: JSON.stringify(policyDocument.toJson()),
        }])
    }

    attachPolicy(policyArn: string, attachmentName: string) {
       return new IamRolePolicyAttachment(this, `${attachmentName}-atch`, {
            policyArn,
            role: this.l1Role.name,
        });
    }

    public get name(): string {
        return this.l1Role.name;
    }

    public get arn(): string {
        return this.l1Role.arn;
    }

}