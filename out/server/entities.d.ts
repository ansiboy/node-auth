export declare class Role {
    id: string;
    name: string;
    remark: string;
    data?: any;
    category?: string;
    create_date_time: Date;
    application_id: string;
}
export declare class Application {
    id: string;
    data: any;
    name: string;
    user_id: string;
    create_date_time: Date;
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
    parent_id: string;
    sort_number: number;
    type: string;
    create_date_time: Date;
    data?: object;
}
