namespace chitu_admin {
    export interface Config {
        authServiceHost: string,
        menuType: string,
        login: {
            title?: string,
            showForgetPassword: boolean,
            showRegister: boolean,
            indexPageName?: string,
        }
    }
}

