/// <reference types="node" />
import { AuthDataContext } from "../data-context";
import http = require("http");
import { ServerContext } from "../types";
import { Role } from "../entities";
export default class UserController {
    myRoles(dc: AuthDataContext, currentUserId: string): Promise<Role[]>;
    roles(dc: AuthDataContext, { userIds }: {
        userIds: string[];
    }): Promise<Role[][]>;
    setRoles(dc: AuthDataContext, { userId, roleids }: {
        userId: string;
        roleids: string[];
    }): Promise<void>;
    private rolesByUserIds;
    logout(req: http.IncomingMessage, res: http.ServerResponse, context: ServerContext): Promise<boolean>;
}
