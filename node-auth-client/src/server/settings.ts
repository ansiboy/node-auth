import { createParameterDecorator } from "maishu-node-mvc";
import { ServerContext } from "maishu-node-mvc/dist/server-context";

export interface Settings {
    innerStaticRoot: string;
    // roleId: string;
    gateway: string;
    clientStaticRoot: string;
}

export let SettingsHeaderName = "settings";

export let settings = createParameterDecorator(async (req, res, context: ServerContext) => {
    let settingsHeader = context.data[SettingsHeaderName] as string;
    console.assert(settingsHeader != null);
    let settings = JSON.parse(settingsHeader) as Settings;
    return settings;
})

// export let settings: Settings = global['settings'] = global['settings'] || {}