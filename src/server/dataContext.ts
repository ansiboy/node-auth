import "reflect-metadata";
import { createConnection, EntityManager, Repository } from "typeorm";
import { createParameterDecorator } from "maishu-node-mvc";
import { conn } from './settings';
import { Role, Application, Category, Resource } from "./entities";
import path = require("path");

export class AuthDataContext {
    private entityManager: EntityManager;
    categories: Repository<Category>;
    roles: Repository<Role>;
    applications: Repository<Application>;
    resources: Repository<Resource>;

    constructor(entityManager: EntityManager) {
        this.entityManager = entityManager;
        this.roles = this.entityManager.getRepository(Role);
        this.applications = this.entityManager.getRepository(Application);
        this.categories = this.entityManager.getRepository(Category);
        this.resources = this.entityManager.getRepository(Resource);
    }

    async dispose() {
        await this.entityManager.connection.close();
    }
}

export let authDataContext = createParameterDecorator<AuthDataContext>(
    async () => {
        let dc = await createDataContext()
        return dc
    },
    async (dc) => {
        await dc.dispose()
    }
)


export async function createDataContext(): Promise<AuthDataContext> {
    let c = await createConnection({
        type: "mysql",
        host: conn.auth.host,
        port: conn.auth.port,
        username: conn.auth.username,
        password: conn.auth.password,
        database: conn.auth.database,
        synchronize: false,
        logging: false,
        entities: [
            path.join(__dirname, "entities.js")
        ]
    })

    let dc = new AuthDataContext(c.manager)
    return dc
}