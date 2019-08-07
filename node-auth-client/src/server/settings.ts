import { createParameterDecorator } from "maishu-node-mvc";

export interface Settings {
    innerStaticRoot: string;
    // roleId: string;
    gateway: string;
    clientStaticRoot: string;
}

export let SettingsHeaderName = "settings";

export let settings = createParameterDecorator(async (req) => {
    let settingsHeader = req.headers[SettingsHeaderName] as string;
    console.assert(settingsHeader != null);
    let settings = JSON.parse(settingsHeader) as Settings;
    return settings;
})

// export let settings: Settings = global['settings'] = global['settings'] || {}