export declare type ResourceAccess = 'Allow' | 'Deny';
export declare type Resource = {
    pathname: string;
    /*** 访问者，用户名称或者角色名称 */
    visitor: string;
    access: ResourceAccess;
};
