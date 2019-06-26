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
interface LoginResult {
    token: string;
    userId: string;
}
export declare class UserService extends Service {
    static loginInfo: chitu.ValueStore<LoginResult>;
    url(path: string): string;
    resources(): Promise<Resource[]>;
    login(username: string, password: string): Promise<void>;
    logout(): void;
    static readonly isLogin: boolean;
}
export {};
