export type ResourceAccess = 'Allow' | 'Deny'
export type Resource = {
    pathname: string,
    /*** 访问者，用户名称或者角色名称 */
    visitor: string,
    access: ResourceAccess,
    // access: [string, ResourceAccess][],
}

let RoleResources: Resource[] = [

]
let UserResources: Resource[] = [

]