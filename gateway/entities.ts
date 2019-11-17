import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity("token")
export class TokenData {
    @PrimaryColumn({ type: "char", length: 36 })
    id: string;

    @Column({ name: "user_id", type: "varchar", length: 50 })
    user_id: string

    /** 用户多个角色ID，用 , 连接 */
    @Column({ name: "role_ids", type: "text", nullable: true })
    role_ids?: string

    @Column({ name: "create_date_time", type: "datetime" })
    create_date_time: Date;
}