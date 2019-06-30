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
    data?: any;

    @Column()
    category?: string;

    @Column({ name: "create_date_time" })
    create_date_time: Date;

    @Column({ name: "application_id" })
    application_id: string;
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
    user_id: string;

    @Column({ name: "create_date_time" })
    create_date_time: Date;
}

@Entity("category")
export class Category {
    @PrimaryColumn()
    id: string;

    @Column()
    code: string;

    @Column()
    name: string;

    @Column()
    create_date_time: Date;
}

@Entity("resource")
export class Resource {
    @PrimaryColumn()
    id: string;

    @Column()
    name: string;

    @Column()
    path?: string;

    @Column()
    parent_id: string;

    @Column()
    sort_number: number;

    @Column()
    type: string;

    @Column()
    create_date_time: Date;

    @Column({ type: "json" })
    data?: object;
}