import { AuthDataContext } from "../dataContext";
import { Resource } from "../entities";
export default class CurrentUserController {
    resourceList(dc: AuthDataContext, userId: string): Promise<Resource[]>;
}
