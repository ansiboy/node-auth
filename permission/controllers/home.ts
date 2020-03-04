import { action, controller, routeData } from "maishu-node-mvc";

@controller("/")
export class HomeController {
    @action()
    index() {
        return "Auth service started."
    }
}