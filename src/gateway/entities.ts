import { Entity, PrimaryColumn, Column, ManyToOne, OneToMany, JoinColumn, DataHelper, ValueTransformer } from "maishu-node-data";
import { JSONTransformer } from "../user/entities";

class StringArrayTransformer implements ValueTransformer {

    from(value: string) {
        if (!value) return [];
        return value.split(",");
    }
    to(value: string[]) {
        if (value == null || value.length == 0)
            return null;

        return value.join(",");
    }
}

@Entity("token_data")
export class TokenData {
    @PrimaryColumn({ type: "varchar", length: 36 })
    id: string;

    @Column({ name: "user_id", type: "varchar", length: 50 })
    user_id: string

    // /** 用户多个角色ID，用 , 连接 */
    // @Column({ name: "role_ids", type: "text", nullable: true, transformer: new RoleIdsStringTransformer() })
    // role_ids?: string[]

    @Column({ name: "create_date_time", type: "datetime" })
    create_date_time: Date;
}

@Entity("role")
export class Role {

    @PrimaryColumn({ type: "varchar", length: 36 })
    id: string;

    @Column({ type: "varchar", length: 45 })
    name: string;

    @Column({ type: "varchar", length: 200, nullable: true })
    remark?: string;

    @Column({ type: "json", nullable: true, transformer: new JSONTransformer() })
    data?: any;

    @Column({ type: "datetime" })
    create_date_time: Date;

    @Column({ type: "varchar", length: 36, nullable: true })
    parent_id?: string;

    // @OneToMany(() => UserRole, userRole => userRole.role)
    // @JoinColumn({ name: "id", referencedColumnName: "role_id" })
    // userRoles?: UserRole[];

    @Column({ type: "char", length: 36 })
    application_id?: string;
}

@Entity("user_role")
export class UserRole {
    @PrimaryColumn({ type: "varchar", length: 36 })
    user_id: string;

    @PrimaryColumn({ type: "varchar", length: 36 })
    role_id: string;

    // @ManyToOne(() => Role, role => role.userRoles)
    // @JoinColumn({ name: "role_id", referencedColumnName: "id" })
    // role?: Role;

    @Column({ type: "datetime", nullable: true })
    create_date_time?: Date;
}

@Entity("menu_item_record")
export class MenuItemRecord {
    @PrimaryColumn({ type: "varchar", length: 36 })
    id: string;

    @Column({
        type: "text", name: "role_ids",
        transformer: new StringArrayTransformer()
    })
    roleIds: string[];

    @Column({ type: "datetime", name: "create_date_time" })
    create_date_time: Date;
}

@Entity("station_info")
export class Station {

    @PrimaryColumn({ length: 36 })
    id: string;

    /** 路径 */
    @Column({ length: 100 })
    path: string;

    /** IP */
    @Column({ length: 50 })
    ip: string;

    /** 端口 */
    @Column({})
    port: number;

    /** 配置文件路径 */
    @Column({ nullable: true, length: 50 })
    config: string;
}

@Entity("file_permission")
export class FilePermission {
    @PrimaryColumn({ length: 36 })
    id: string;

    @Column({ length: 100 })
    path: string;

    @Column({ type: "varchar", length: 100, transformer: new StringArrayTransformer() })
    role_ids: string[];

    @Column({ type: "datetime" })
    create_date_time: Date;
}
