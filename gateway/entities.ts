import { Entity, PrimaryColumn, Column, ValueTransformer } from "typeorm";

class RoleIdsStringTransformer implements ValueTransformer {
    // To db from typeorm
    to(value: string[] | null): string | null {
        if (value === null || value.length == 0) {
            return null;
        }
        let r = value.join(",");
        return r;
    }
    // From db to typeorm
    from(value: string): string[] | null {
        if (value === null) {
            return null;
        }
        return value.split(",");
    }
}

@Entity("token")
export class TokenData {
    @PrimaryColumn({ type: "char", length: 36 })
    id: string;

    @Column({ name: "user_id", type: "varchar", length: 50 })
    user_id: string

    /** 用户多个角色ID，用 , 连接 */
    @Column({ name: "role_ids", type: "text", nullable: true, transformer: new RoleIdsStringTransformer() })
    role_ids?: string[]

    @Column({ name: "create_date_time", type: "datetime" })
    create_date_time: Date;
}

