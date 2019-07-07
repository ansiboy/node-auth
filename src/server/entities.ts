import { Entity, Column, PrimaryColumn, ManyToMany, JoinTable, OneToMany, OneToOne, JoinColumn, ManyToOne } from "typeorm";

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

    /**
     * 是否系统内置的角色
     */
    @Column({ type: "bit", default: false })
    is_system?: boolean;

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

@Entity("resource")
export class Resource implements Model {
    @PrimaryColumn({ type: "char", length: 36 })
    id: string;

    @Column({ type: "varchar", length: 45 })
    name: string;

    @Column({ type: "varchar", length: 200, nullable: true })
    path?: string;

    @Column({ type: "char", length: 36, nullable: true })
    parent_id?: string;

    @Column({ type: "int" })
    sort_number: number;

    @Column({ type: "varchar", length: 45 })
    type: string;

    @Column({ type: "datetime" })
    create_date_time: Date;

    @Column({ type: "json", nullable: true })
    data?: any;

    @ManyToMany(() => Path, { cascade: true })
    @JoinTable({
        name: "resource_path",
        joinColumn: { name: "resource_id", referencedColumnName: "id" },
        inverseJoinColumn: { name: "path_id", referencedColumnName: "id" }
    })
    paths?: Path[];
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

    // @ManyToMany(() => Resource, { cascade: true })
    // @JoinTable({
    //     name: "user_resource",
    //     joinColumn: { name: "user_id", referencedColumnName: "id" },
    //     inverseJoinColumn: { name: "resource_id", referencedColumnName: "id" }
    // })
    // resources?: Resource[];

    // @ManyToMany(() => Role, r => r.users, { cascade: true })
    // @JoinTable({
    //     name: "user_role",
    //     joinColumn: { name: "user_id", referencedColumnName: "id" },
    //     inverseJoinColumn: { name: "role_id", referencedColumnName: "id" }
    // })
    // roles?: Role[];
    @Column({ type: "char", length: 36, nullable: true })
    role_id?: string;

    @ManyToOne(type => Role)
    @JoinColumn({ name: "role_id", referencedColumnName: "id" })
    role?: Role;
}

@Entity("user_role", { synchronize: false })
export class UserRole {
    @PrimaryColumn({ type: "char", length: 36 })
    user_id: string;

    @PrimaryColumn({ type: "char", length: 36 })
    role_id: string;
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

    @Column({ type: "varchar" })
    value: string;

    @Column({ type: "varchar", length: 200, nullable: true })
    remark: string;
}