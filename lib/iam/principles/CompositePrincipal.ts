import { IResolvable } from "cdktf";
import { IPrincipal } from "../IPrincipal";

export class CompositePrincipal implements IPrincipal {
    principalJson: Record<string, string[]> | IResolvable;
    conditions?: Record<string, any> | undefined;
    
    constructor(...principals: IPrincipal[]) {
        this.principalJson = principals.reduce<Record<string, string[]>>((acc, principal) => {
            return {
                ...acc,
                ...principal.principalJson as Record<string, string[]>,
            }
        }, {});
    }

}