export interface Entity {
    id?: string,
    createDateTime?: Date,
}

export interface User extends Entity {
    name: string,
    password: string,
    group: string
}

export interface Appliation extends Entity {
    name: string
}

