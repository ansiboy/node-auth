import { controller, action } from "maishu-node-mvc";

@controller("auth")
export class HomeController {
    @action()
    index() {
        return 'Hello World'
    }
}