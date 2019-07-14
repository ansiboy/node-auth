import { action, controller } from "maishu-node-mvc";

@controller("/home")
export class HomeController {
    @action()
    index() {
        return "hello world"
    }
}