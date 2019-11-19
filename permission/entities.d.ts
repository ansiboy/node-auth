interface Model {
    id: string;
    create_date_time: Date;
}
export declare class Role implements Model {
    id: string;
    name: string;
    remark?: string;
    data?: any;
    create_date_time: Date;
    parent_id?: string;
    users?: User[];
}
export declare class Category implements Model {
    id: string;
    code: string;
    name: string;
    create_date_time: Date;
}
export declare class Resource implements Model {
    id: string;
    parent_id?: string;
    sort_number: number;
    create_date_time: Date;
    remark?: string;
}
export declare class User implements Model {
    id: string;
    user_name?: string;
    mobile?: string;
    email?: string;
    password?: string;
    create_date_time: Date;
    data?: object;
    openid?: string;
    is_system?: boolean;
    roles?: Role[];
}
export declare class UserRole {
    user_id: string;
    role_id: string;
}
export declare class UserLatestLogin implements Model {
    id: string;
    latest_login: Date;
    create_date_time: Date;
}
export declare class SMSRecord implements Model {
    id: string;
    mobile: string;
    content: string;
    code?: string;
    create_date_time: Date;
}
export declare class ResourcePath {
    resource_id: string;
    path_id: string;
}
export declare class ResourceCategory {
    id: string;
    name: string;
}
export {};
