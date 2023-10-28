import { IResolvable } from "cdktf";

export interface IPrincipal {
    principalJson: Record<string, string[]> | IResolvable;
    conditions?: Record<string, any>;
}
