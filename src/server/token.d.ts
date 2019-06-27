/**
 * 用于解释和生成 token 。
 */
export declare class Token {
    id?: string;
    content: string;
    contentType: string;
    createDateTime: Date;
    cacheDateTime: number;
    static create(content: object): Promise<Token>;
    static create(content: string, contentType: string): Promise<Token>;
    /**
     * 对令牌字符串进行解释，转换为令牌对象
     * @param appId 应用ID
     * @tokenValue 令牌字符串
     */
    static parse(tokenValue: string): Promise<Token>;
}
