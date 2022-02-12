import { action, controller, routeData } from "maishu-node-mvc";
import { adminApiBasePath, anonApiBasePath } from '../global';
import UserController from "./user";
import { UserDataContext } from '../data-context';
import { userDataContext, currentUserId, currentUser } from "../decorators";

@controller(anonApiBasePath)
export class AnonController {
    @action()
    login(@userDataContext dc: UserDataContext, @routeData args: any) {
        let userController = new UserController();
        return userController.login(dc, args);
    }
}