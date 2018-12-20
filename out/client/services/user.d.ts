import Service from "./service";
interface Resource {
    id?: string;
    name: string;
    path?: string;
    parent_id: string;
    sort_number: number;
    type: string;
    create_date_time: Date;
    visible?: boolean;
}
export declare class UserService extends Service {
    static token: chitu.ValueStore<any>;
    url(path: string): string;
    resources(): Promise<Resource[]>;
    login(username: string, password: string): Promise<void>;
    logout(): void;
    static readonly isLogin: boolean;
}
export {};
