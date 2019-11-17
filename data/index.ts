import { DataContext } from "./data-context";
export { DataContext } from "./data-context";

let db = new DataContext({
    database: "node-auth-gateway",
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    password: "81263"
})
