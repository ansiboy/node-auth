export declare class Role {
    id: string;
    name: string;
    remark: string;
    data?: any;
    create_date_time: Date;
    resources?: Resource[];
    /**
     * 是否系统内置的角色
     */
    is_system?: boolean;
}
export declare class Category {
    id: string;
    code: string;
    name: string;
    create_date_time: Date;
}
export declare class Resource {
    id: string;
    name: string;
    path?: string;
    parent_id?: string;
    sort_number: number;
    type: string;
    create_date_time: Date;
    data?: any;
}
export declare class Token {
    id: string;
    content: string;
    contentType: string;
    createDateTime: Date;
}
export declare class User {
    id: string;
    user_name?: string;
    mobile?: string;
    email?: string;
    password?: string;
    create_date_time: Date;
    data?: object;
    openid?: string;
    roles?: Role[];
}
export declare class UserRole {
    user_Id: string;
    role_id: string;
}
export declare class UserLatestLogin {
    id: string;
    latest_login: Date;
}
export declare class SMSRecord {
    id: string;
    mobile: string;
    content: string;
    code?: string;
    createDateTime: Date;
}
