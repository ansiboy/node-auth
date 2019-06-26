import { AuthDataContext } from "../../dataContext";
import { Application } from "entities";
export default class ApplicationController {
    list(dc: AuthDataContext, userId: string): Promise<Application[]>;
    add(dc: AuthDataContext, { app }: {
        app: Application;
    }): Promise<{
        id: string;
        createDateTime: Date;
    }>;
    update(dc: AuthDataContext, userId: string, { app }: {
        app: Application;
    }): Promise<{
        id: string;
    }>;
}
