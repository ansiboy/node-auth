import { controller, action, formData } from "maishu-node-mvc";
import { list, guid } from "../../database";
import { authDataContext, AuthDataContext } from "../../dataContext";
import { UserId } from "../../decorators";
import { errors } from "../../errors";
import { Application } from "entities";

@controller("distributor/application")
export default class ApplicationController {
    @action()
    async list(@authDataContext dc: AuthDataContext, @UserId userId: string): Promise<Application[]> {
        if (!userId) throw errors.argumentNull("userId")
        let items = await dc.applications.createQueryBuilder("app")
            .where("app.userId = :userId")
            .setParameters({ userId })
            .getMany();

        return items;
    }

    @action()
    async add(@authDataContext dc: AuthDataContext, @formData { app }: { app: Application }) {
        if (!app) throw errors.fieldNull("app", "formData");

        app.id = guid();
        app.createDateTime = new Date(Date.now());
        await dc.applications.insert(app)

        return { id: app.id, createDateTime: app.createDateTime };
    }

    @action()
    async update(@authDataContext dc: AuthDataContext, @UserId userId: string, @formData { app }: { app: Application }) {
        if (!app) throw errors.fieldNull("app", "formData");
        if (!app.id) throw errors.fieldNull("id", "app");

        let entity = await dc.applications.createQueryBuilder("app")
            .where("app.id = :id and app.userId = :userId")
            .setParameters({ id: app.id, userId })
            .getOne();

        if (entity == null) throw errors.objectNotExistWithId(app.id, "Application");
        entity.name = app.name;
        entity.data = app.data;

        dc.applications.save(entity);

        return { id: entity.id }
    }
}