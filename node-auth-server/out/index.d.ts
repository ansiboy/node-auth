import { Config } from 'maishu-node-mvc';
import { ConnectionConfig } from 'mysql';
export { AuthDataContext } from "./dataContext";
interface Options {
    port: number;
    db: ConnectionConfig;
    proxy: Config['proxy'];
}
export declare function start(options: Options): Promise<void>;
