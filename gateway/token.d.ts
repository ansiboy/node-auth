/// <reference types="node" />
import { TokenData } from './entities';
import { IncomingMessage } from "http";
import { ServerContextData } from './types';
/**
 * 用于解释和生成 token 。
 */
export declare class TokenManager {
    static create(userId: string, contextData: ServerContextData): Promise<TokenData>;
    /**
     * 对令牌字符串进行解释，转换为令牌对象
     * @param appId 应用ID
     * @tokenValue 令牌字符串
     */
    static parse(token: string, contextData: ServerContextData): Promise<TokenData>;
    static remove(id: string, contextData: ServerContextData): Promise<void>;
}
export declare function getToken(req: IncomingMessage, contextData: ServerContextData): Promise<TokenData>;
