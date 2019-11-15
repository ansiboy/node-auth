import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity("token")
export class TokenData {
    @PrimaryColumn({ type: "char", length: 36 })
    id: string;

    // @Column({ type: "text" })
    // content: string;

    // @Column({ type: "varchar", length: 50 })
    // content_type: string;

    @Column({ name: "user_id", type: "varchar", length: 50 })
    userId: string

    /** 用户多个角色ID，用 , 连接 */
    @Column({ name: "role_ids", type: "text", nullable: true })
    roleIds?: string

    @Column({ name: "create_date_time", type: "datetime" })
    createDateTime: Date;
}