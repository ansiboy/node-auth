import { app } from 'maishu-chitu-admin';


app.config.login = Object.assign({
    showForgetPassword: true, showRegister: true
}, app.config.login || {})

export let config = app.config