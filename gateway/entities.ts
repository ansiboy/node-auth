import { Entity, PrimaryColumn, Column, ValueTransformer, ManyToOne, OneToMany, JoinTable, JoinColumn } from "typeorm";
import { createDataContext } from "./data-context";
import { g } from "./global";


@Entity("token_data")
export class TokenData {
    @PrimaryColumn({ type: "char", length: 36 })
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

    @PrimaryColumn({ type: "char", length: 36 })
    id: string;

    @Column({ type: "varchar", length: 45 })
    name: string;

    @Column({ type: "varchar", length: 200, nullable: true })
    remark?: string;

    @Column({ type: "json", nullable: true, })
    data?: any;

    @Column({ type: "datetime" })
    create_date_time: Date;

    @Column({ type: "char", length: 36, nullable: true })
    parent_id?: string;

    @OneToMany(() => UserRole, userRole => userRole.role)
    @JoinColumn({ name: "id", referencedColumnName: "role_id" })
    userRoles?: UserRole[];

    /**
     * 获取指定用户的角色 ID
     * @param userId 指定的用户 ID
     */
    static async getUserRoleIds(userId: string): Promise<string[]> {
        //TODO: 缓存 roleids
        let dc = await createDataContext(g.settings.db);
        let userRoles = await dc.userRoles.find({ user_id: userId });
        return userRoles.map(o => o.role_id);
    }
}

@Entity("user_role")
export class UserRole {
    @PrimaryColumn({ type: "char", length: 36 })
    user_id: string;

    @PrimaryColumn({ type: "char", length: 36 })
    role_id: string;

    @ManyToOne(() => Role, role => role.userRoles)
    @JoinColumn({ name: "role_id", referencedColumnName: "id" })
    role?: Role;
}

