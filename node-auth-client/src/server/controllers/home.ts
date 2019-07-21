import { controller, action } from "maishu-node-mvc";
import { settings } from "../settings";

@controller("auth")
export class HomeController {
    @action()
    index() {
        return 'Hello World'
    }
}