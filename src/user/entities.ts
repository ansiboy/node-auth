import { Entity, Column, PrimaryColumn } from "maishu-node-data";

import { ValueTransformer } from 'typeorm';
class BitBooleanTransformer implements ValueTransformer {
    // To db from typeorm
    to(value: boolean | null): Buffer | null {
        if (value === null) {
            return null;
        }

        const res = Buffer.from([1]);//new Buffer(1);
        res[0] = value ? 1 : 0;
        return res;
    }
    // From db to typeorm
    from(value: Buffer): boolean | null {
        if (value === null) {
            return null;
        }
        return value[0] === 1;
    }
}

export class JSONTransformer implements ValueTransformer {
    // To db from typeorm
    to(value: object): string | null {
        let res = JSON.stringify(value);
        return res;
    }
    // From db to typeorm
    from(value: string): Object | null {
        let obj = JSON.parse(value);
        return obj;
    }
}



interface Model {
    id: string;
    create_date_time: Date;
}

// @Entity("role")
// export class Role implements Model {

//     @PrimaryColumn({ type: "char", length: 36 })
//     id: string;

//     @Column({ type: "varchar", length: 45 })
//     name: string;

//     @Column({ type: "varchar", length: 200, nullable: true })
//     remark?: string;

//     @Column({ type: "json", nullable: true, })
//     data?: any;

//     @Column({ type: "datetime" })
//     create_date_time: Date;

//     // @ManyToMany(() => Resource)
//     // @JoinTable({
//     //     name: "role_resource",
//     //     joinColumns: [{ name: "role_id", referencedColumnName: "id" }],
//     //     inverseJoinColumns: [{ name: "resource_id", referencedColumnName: "id" }]
//     // })
//     // resources?: Resource[];

//     @Column({ type: "char", length: 36, nullable: true })
//     parent_id?: string;

//     @ManyToMany(() => Role, role => role.users)
//     users?: User[];
// }

@Entity("category")
export class Category implements Model {
    @PrimaryColumn({ type: "varchar", length: 36 })
    id: string;

    @Column({ type: "varchar", length: 45 })
    code: string;

    @Column({ type: "varchar", length: 45 })
    name: string;

    @Column({ type: "varchar", length: 45 })
    create_date_time: Date;
}

// export type ResourceData = {
//     position: "top-right" | "in-list",
//     code?: string,
//     button?: {
//         // text?: string,
//         className: string,
//         execute_path?: string,
//         toast?: string,
//         showButtonText: boolean,
//         title?: string,
//     }
// }

@Entity("resource")
export class Resource implements Model {
    @PrimaryColumn({ type: "varchar", length: 36 })
    id: string;

    // @Column({ type: "char", length: 36, nullable: true })
    // parent_id?: string;

    // @Column({ type: "int" })
    // sort_number: number;

    @Column({ type: "varchar", length: 300 })
    role_ids: string;

    @Column({ type: "datetime" })
    create_date_time: Date;

    // @Column({ type: "varchar", length: 200, nullable: true })
    // remark?: string;
}

@Entity("user")
export class User implements Model {
    @PrimaryColumn({ type: "varchar", length: 36 })
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

    @Column({ type: "text", nullable: true, transformer: new JSONTransformer() })
    data?: any;

    @Column({ type: "varchar", length: 45, nullable: true })
    openid?: string;

    @Column({ nullable: true, transformer: new BitBooleanTransformer() })
    is_system?: boolean;

    // @ManyToMany(() => Role, role => role.users, { cascade: true, onDelete: "CASCADE" })
    // @JoinTable({
    //     name: "user_role",
    //     joinColumns: [{ name: "user_id", referencedColumnName: "id" }],
    //     inverseJoinColumns: [{ name: "role_id", referencedColumnName: "id" }],
    // })
    // roles?: Role[];
}

// @Entity("user_role", { synchronize: false })
// export class UserRole {
//     @PrimaryColumn({ type: "char", length: 36 })
//     user_id: string;

//     @PrimaryColumn({ type: "char", length: 36 })
//     role_id: string
// }

@Entity("user-latest-login")
export class UserLatestLogin implements Model {
    @PrimaryColumn({ type: "varchar", length: 36 })
    id: string;

    @Column({ type: "datetime" })
    latest_login: Date;

    @Column({ type: "datetime" })
    create_date_time: Date;
}

@Entity("sms_record")
export class SMSRecord implements Model {
    @PrimaryColumn({ type: "varchar", length: 36 })
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

// @Entity("role_resource", { synchronize: false })
// export class RoleResource {
//     @PrimaryColumn({ type: "char", length: 36 })
//     role_id: string;

//     @PrimaryColumn({ type: "char", length: 36 })
//     resource_id: string;
// }

@Entity("resource_path", { synchronize: false })
export class ResourcePath {
    @PrimaryColumn({ type: "varchar", length: 36 })
    resource_id: string;

    @PrimaryColumn({ type: "varchar", length: 36 })
    path_id: string;
}

@Entity("resource_category")
export class ResourceCategory {
    @PrimaryColumn({ type: "varchar", length: 36 })
    id: string;

    @Column({ type: "varchar", length: 40 })
    name: string;
}

// @Entity("menu_item_record")
// export class MenuItemRecord {
//     @PrimaryColumn({ type: "char", length: 36 })
//     id: string;

//     @Column({ type: "varchar", length: 300 })
//     roleIds: string;

//     @Column({ type: "datetime" })
//     create_date_time: Date;
// }
