import { Entity, Column, PrimaryColumn, ManyToMany, JoinTable, OneToMany, OneToOne, JoinColumn, ManyToOne } from "typeorm";

export type LoginResult = { token: string, userId: string, roleId: string }

interface Model {
    id: string;
    create_date_time: Date;
}

@Entity("role")
export class Role implements Model {

    @PrimaryColumn({ type: "char", length: 36 })
    id: string;

    @Column({ type: "varchar", length: 45 })
    name: string;

    @Column({ type: "varchar", length: 200, nullable: true })
    remark: string;

    @Column({ type: "json", nullable: true, })
    data?: any;

    @Column({ name: "create_date_time" })
    create_date_time: Date;

    @ManyToMany(() => Resource)
    @JoinTable({
        name: "role_resource",
        joinColumns: [{ name: "role_id", referencedColumnName: "id" }],
        inverseJoinColumns: [{ name: "resource_id", referencedColumnName: "id" }]
    })
    resources?: Resource[];

    // @ManyToMany(() => User)
    // @JoinTable({
    //     name: "user_role",
    //     joinColumns: [{ name: "role_id", referencedColumnName: "id" }],
    //     inverseJoinColumns: [{ name: "user_id", referencedColumnName: "id" }]
    // })
    // users?: User[];
    @Column({ type: "char", length: 36, nullable: true })
    role_id?: string;

    @Column({ type: "char", length: 36, nullable: true })
    parent_id?: string;
}

@Entity("category")
export class Category implements Model {
    @PrimaryColumn({ type: "char", length: 36 })
    id: string;

    @Column({ type: "varchar", length: 45 })
    code: string;

    @Column({ type: "varchar", length: 45 })
    name: string;

    @Column({ type: "varchar", length: 45 })
    create_date_time: Date;
}

export type ResourceData = {
    position: "top-right" | "in-list",
    code?: string,
    button?: {
        // text?: string,
        className: string,
        execute_path?: string,
        toast?: string,
        showButtonText: boolean,
        title?: string,
    }
}

@Entity("resource")
export class Resource implements Model {
    @PrimaryColumn({ type: "char", length: 36 })
    id: string;

    @Column({ type: "varchar", length: 45 })
    name: string;

    @Column({ name: "path", type: "varchar", length: 200, nullable: true })
    page_path?: string;

    @Column({ type: "char", length: 36, nullable: true })
    parent_id?: string;

    @Column({ type: "int" })
    sort_number: number;

    @Column({ type: "varchar", length: 45 })
    type: "menu" | "control" | "module";

    @Column({ type: "datetime" })
    create_date_time: Date;

    @Column({ type: "json", nullable: true })
    data?: ResourceData;

    @Column({ type: "varchar", length: 200, nullable: true })
    remark?: string;

    @Column({ type: "varchar", length: 30, nullable: true })
    icon?: string;

    @ManyToMany(() => Path, path => path.resource, { cascade: true, onDelete: "CASCADE" })
    @JoinTable({
        name: "resource_path",
        joinColumns: [{ name: "resource_id", referencedColumnName: "id" }],
        inverseJoinColumns: [{ name: "path_id", referencedColumnName: "id" }]
    })
    api_paths?: Path[];
}

@Entity("token")
export class Token {
    @PrimaryColumn({ type: "char", length: 36 })
    id: string;

    @Column({ type: "text" })
    content: string;

    @Column({ type: "varchar", length: 50 })
    content_type: string;

    @Column({ name: "create_date_time", type: "datetime" })
    create_date_time: Date;
}

@Entity("user")
export class User implements Model {
    @PrimaryColumn({ type: "char", length: 36 })
    id: string;

    @Column({ type: "varchar", length: 45, nullable: true })
    user_name?: string;

    @Column({ type: "varchar", length: 45, nullable: true })
    mobile?: string;

    @Column({ type: "varchar", length: 45, nullable: true })
    email?: string;

    @Column({ type: "varchar", length: 45, nullable: true })
    password?: string;

    @Column({ type: "datetime" })
    create_date_time: Date;

    @Column({ type: "json", nullable: true })
    data?: object;

    @Column({ type: "varchar", length: 45, nullable: true })
    openid?: string;

    @Column({ type: "bit", nullable: true })
    is_system?: boolean;

    @Column({ type: "char", length: 36, nullable: true })
    role_id?: string;

    @ManyToOne(type => Role)
    @JoinColumn({ name: "role_id", referencedColumnName: "id" })
    role?: Role;
}

@Entity("user-latest-login")
export class UserLatestLogin implements Model {
    @PrimaryColumn({ type: "char", length: 36 })
    id: string;

    @Column({ type: "datetime" })
    latest_login: Date;

    @Column({ type: "datetime" })
    create_date_time: Date;
}

@Entity("sms_record")
export class SMSRecord implements Model {
    @PrimaryColumn({ type: "char", length: 36 })
    id: string;

    @Column({ type: "varchar", length: 45 })
    mobile: string;

    @Column({ type: "varchar", length: 200 })
    content: string;

    @Column({ type: "varchar", length: 10 })
    code?: string;

    @Column({ type: "datetime" })
    create_date_time: Date;
}

@Entity("path")
export class Path implements Model {
    @PrimaryColumn({ type: "char", length: 36 })
    id: string;

    @Column({ type: "datetime" })
    create_date_time: Date;

    @Column({ type: "varchar", unique: true })
    value: string;

    @Column({ type: "varchar", length: 200, nullable: true })
    remark?: string;


    @ManyToMany(() => Resource, resource => resource.api_paths)
    resource?: Resource;
}

@Entity("role_resource", { synchronize: false })
export class RoleResource {
    @PrimaryColumn({ type: "char", length: 36 })
    role_id: string;

    @PrimaryColumn({ type: "char", length: 36 })
    resource_id: string;
}

@Entity("resource_path", { synchronize: false })
export class ResourcePath {
    @PrimaryColumn({ type: "char", length: 36 })
    resource_id: string;

    @PrimaryColumn({ type: "char", length: 36 })
    path_id: string;
}