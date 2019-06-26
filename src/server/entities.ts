import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity("role")
export class Role {
    @PrimaryColumn()
    id: string;

    @Column()
    name: string;

    @Column()
    remark: string;

    @Column({ type: "json" })
    data: any;

    @Column({ name: "create_date_time" })
    createDateTime: Date;

    @Column({ name: "application_id" })
    applicationId: string;
}

@Entity("application")
export class Application {
    @PrimaryColumn()
    id: string;

    @Column({ type: "json" })
    data: any;

    @Column()
    name: string;

    @Column({ name: "user_id" })
    userId: string;

    @Column({ name: "create_date_time" })
    createDateTime: Date;
}