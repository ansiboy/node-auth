import { start as startAdmin, Settings as BaseSettings } from "maishu-chitu-admin";
// import { Settings } from "./types";
import { smsSettings, ServerContextData } from "./global";
import { initDatabase } from "./data-context";
import { ConnectionConfig } from "mysql";

// export { Settings } from "./types";
export { createDataContext } from "./data-context";
export { roleIds } from "./global";
import { createDatabaseIfNotExists } from "maishu-data";
import { permissions, stationPath } from "./website-config";

type InnerSettings = Pick<BaseSettings, "rootDirectory" | "station" | "serverContextData">;

export type Settings = Pick<BaseSettings, Exclude<keyof BaseSettings, keyof InnerSettings>> &
{ gateway: string, db: ConnectionConfig, sms?: typeof smsSettings };

export async function start(settings: Settings) {

    await createDatabaseIfNotExists(settings.db, initDatabase);



    let mySettings: InnerSettings = {
        rootDirectory: __dirname,
        station: {
            path: stationPath,
            gateway: settings.gateway,
            permissions,
        },
        serverContextData: <ServerContextData>{
            sms: smsSettings,
            db: settings.db,
        }
    }

    return startAdmin(Object.assign(settings, mySettings))
}