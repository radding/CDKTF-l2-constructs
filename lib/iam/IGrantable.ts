import { AwsPolicyDocument } from "./policyStatement";


export interface IGrantable {
    addInlinePolicy(policyDocument: AwsPolicyDocument): void;
}

export interface IGrantor {
    grant(grantable: IGrantable, actions: string[]): void;
}