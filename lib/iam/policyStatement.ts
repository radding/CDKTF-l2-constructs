import { IPrincipal } from "./IPrincipal";

export enum AwsEffects {
    ALLOW = "Allow",
    DENY = "Deny"
}

export type AwsPolicyStatementProps = {
        /**
        * 
        */
        actions?: string[],
        conditions?: Record<string, any>,
        effect?: AwsEffects;
        notActions?: string[];
        notPrincipals?: IPrincipal[];
        notResources?: string[];
        principals?: IPrincipal[];
        resources?: string[];
        sid?: string;
}

export class AwsPolicyDocument {
    constructor(public statements: AwsPolicyStatement[]) {

    }

    toJson() {
        return {
            Version: "2012-10-17",
            Statements: this.statements.map(statement => statement.toJson())
        }
    }
}

export class AwsPolicyStatement {
        public actions?: string[];
        public conditions?: Record<string, any>;
        public effect?: AwsEffects;
        public notActions?: string[];
        public notPrincipals?: IPrincipal[];
        public notResources?: string[] ;
        public principals?: IPrincipal[];
        public resources?: string[] ;
        public sid?: string;
    constructor (
        props: AwsPolicyStatementProps,
    ) {
        this.actions = props.actions;
        this.conditions = props.conditions;
        this.effect = props.effect;
        this.notActions = props.notActions;
        this.notPrincipals = props.notPrincipals;
        this.resources = props.resources;
        this.principals = props.principals;
        this.sid = props.sid;
    }


    public addActions(...actions: string[]) {
        this.actions = (this.actions??[]).concat(actions)
    }

    toJson() {
        return {
            Effect: this.effect ?? AwsEffects.DENY,
            Action: this.actions,
            Resource: this.resources,
            Condition: this.conditions ,
            Sid: this.sid
        }
    }

    toPolicyJson() {
        return this.toJson();
    }

}