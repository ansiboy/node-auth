import { Config } from 'maishu-node-mvc';
import { ConnectionConfig } from 'mysql';
interface Options {
    port: number;
    db: ConnectionConfig;
    proxy: Config['proxy'];
}
export declare function start(options: Options): void;
export {};
