// interface Config {
//     firstPanelWidth: string,
//     authServiceHost: string,
//     menuType: string,
//     login: {
//         title: string,
//         showForgetPassword: boolean,
//         showRegister: boolean,
//     }
// }

// let defaultConfig = {
//     login: { showForgetPassword: true, showRegister: true }
// } as Config

// export let config: Config = window['adminConfig'] || {}

// config.login = Object.assign(defaultConfig.login, config.login || {})

import { app } from 'maishu-chitu-admin';
app.config.login = Object.assign({
    showForgetPassword: true, showRegister: true
}, app.config.login || {})

export let config = app.config