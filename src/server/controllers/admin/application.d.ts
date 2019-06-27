import { Controller } from "maishu-node-mvc";
import { AuthDataContext } from "../../dataContext";
export default class ApplicationController extends Controller {
    list(dc: AuthDataContext): Promise<import("../../entities").Application[]>;
}
