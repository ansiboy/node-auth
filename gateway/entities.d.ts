export declare class TokenData {
    id: string;
    user_id: string;
    create_date_time: Date;
}
export declare class Role {
    id: string;
    name: string;
    remark?: string;
    data?: any;
    create_date_time: Date;
    parent_id?: string;
    userRoles?: UserRole[];
}
export declare class UserRole {
    user_id: string;
    role_id: string;
    role?: Role;
}
