/// <reference types="node" />
import { TokenData } from './entities';
import { IncomingMessage } from "http";
/**
 * 用于解释和生成 token 。
 */
export declare class TokenManager {
    static create(userId: string): Promise<TokenData>;
    /**
     * 对令牌字符串进行解释，转换为令牌对象
     * @param appId 应用ID
     * @tokenValue 令牌字符串
     */
    static parse(token: string): Promise<TokenData>;
    static remove(id: string): Promise<void>;
}
export declare function getToken(req: IncomingMessage): Promise<TokenData>;
