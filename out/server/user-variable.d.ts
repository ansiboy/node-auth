/// <reference types="node" />
import http = require('http');
export declare function tokenConttent(req: http.IncomingMessage): Promise<Object>;
/** 获取与用户相关的变量 */
export declare function userVariable(key: 'user-id' | 'app-id'): (target: Object, propertyKey: string | symbol, parameterIndex: number) => void;
