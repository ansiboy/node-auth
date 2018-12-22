declare module chitu_admin {
    export interface Config {
        login: {
            title?: string,
            showForgetPassword: boolean,
            showRegister: boolean,
        }
    }
}

declare module node_auth {
    export let app: chitu_admin.Application
}

declare module 'maishu-node-auth' {
    export = node_auth
}