import { controller, action } from "maishu-node-mvc";

@controller("demo/temp")
export default class TempController {
    @action()
    index() {
        return "Demo Index"
    }
}