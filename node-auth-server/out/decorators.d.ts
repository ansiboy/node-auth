/// <reference types="node" />
import http = require('http');
export declare let authDataContext: (target: Object, propertyKey: string | symbol, parameterIndex: number) => void;
export declare let currentUserId: (target: Object, propertyKey: string | symbol, parameterIndex: number) => void;
export declare function getUserIdFromRequest(req: http.IncomingMessage): Promise<any>;
export declare let currentUser: (target: Object, propertyKey: string | symbol, parameterIndex: number) => void;
export declare let currentTokenId: (target: Object, propertyKey: string | symbol, parameterIndex: number) => void;
export declare let ApplicationId: (target: Object, propertyKey: string | symbol, parameterIndex: number) => void;
