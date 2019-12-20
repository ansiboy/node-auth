/// <reference types="node" />
import { AuthDataContext } from "../data-context";
import http = require("http");
import { ServerContext } from "../types";
export default class UserController {
    myRoles(dc: AuthDataContext, currentUserId: string): Promise<import("../entities").Role[]>;
    logout(req: http.IncomingMessage, res: http.ServerResponse, context: ServerContext): Promise<boolean>;
}
