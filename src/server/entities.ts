import { Entity, Column, PrimaryColumn, ManyToMany, JoinTable, OneToMany } from "typeorm";

@Entity("role")
export class Role {

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
}

// @Entity("application")
// export class Application {
//     @PrimaryColumn()
//     id: string;

//     @Column({ type: "json" })
//     data: any;

//     @Column()
//     name: string;

//     @Column({ name: "user_id" })
//     user_id: string;

//     @Column({ name: "create_date_time" })
//     create_date_time: Date;
// }

@Entity("category")
export class Category {
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
export class Resource {
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
    data?: object;

}

@Entity("token")
export class Token {
    @PrimaryColumn({ type: "char", length: 36 })
    id: string;

    @Column({ type: "text" })
    content: string;

    @Column({ type: "varchar", length: 50 })
    contentType: string;

    @Column({ type: "datetime" })
    createDateTime: Date;
}

@Entity("user")
export class User {
    @PrimaryColumn({ type: "char", length: 36 })
    id: string;

    @Column({ type: "varchar", length: 45, nullable: true })
    user_name?: string;

    @Column({ type: "varchar", length: 45, nullable: true })
    mobile?: string;

    @Column({ type: "varchar", length: 45, nullable: true })
    email?: string;

    @Column({ type: "varchar", length: 45 })
    password: string;

    @Column({ type: "datetime" })
    create_date_time: Date;

    @Column({ type: "json", nullable: true })
    data?: object;

    // @ManyToMany(() => Resource, { cascade: true })
    // @JoinTable({
    //     name: "user_resource",
    //     joinColumn: { name: "user_id", referencedColumnName: "id" },
    //     inverseJoinColumn: { name: "resource_id", referencedColumnName: "id" }
    // })
    // resources?: Resource[];

    @ManyToMany(() => Role, { cascade: true })
    @JoinTable({
        name: "user_role",
        joinColumn: { name: "user_id", referencedColumnName: "id" },
        inverseJoinColumn: { name: "role_id", referencedColumnName: "id" }
    })
    roles?: Role[];
}

@Entity("user-latest-login")
export class UserLatestLogin {
    @PrimaryColumn({ type: "char", length: 36 })
    id: string;

    @Column({ type: "datetime" })
    latest_login: Date;
}
