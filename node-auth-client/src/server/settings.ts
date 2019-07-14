
interface Settings {
    innerStaticRoot: string;
    roleId: string;
    gateway: string;
    clientStaticRoot: string;
}

export let settings: Settings = global['settings'] = global['settings'] || {}