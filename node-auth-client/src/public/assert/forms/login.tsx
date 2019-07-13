import { FormValidator, rules as r } from "maishu-dilu";
import { errors } from "../errors";
import { buttonOnClick } from "maishu-ui-toolkit";
import { Application } from "maishu-chitu-react";
import { PermissionService } from "assert/services/index";

type LoginOptions = { redirectURL: string }

export const USERNAME = 'username'
export const PASSWORD = 'password'
export const LOGIN = 'login'

/** 设置登录表单 */
export function setForm(formElement: HTMLElement, options: LoginOptions, app: Application): LoginOptions {
    if (!formElement) throw errors.argumentNull('formElement')
    if (!options) throw errors.argumentNull('options')
    if (!options.redirectURL) throw errors.fieldNull<LoginOptions>("options", "redirectURL")

    let validator = new FormValidator(formElement,
        { name: USERNAME, rules: [r.required('请输入用户名')] },
        { name: PASSWORD, rules: [r.required('请输入密码')] }
    )

    let usernameInput = getElement<HTMLInputElement>(formElement, USERNAME)
    let passwordInput = getElement<HTMLInputElement>(formElement, PASSWORD)
    let loginButton = getElement<HTMLButtonElement>(formElement, LOGIN)

    loginButton.addEventListener('click', () => {
        if (validator.check() == false)
            return Promise.reject('validate fail')

    })

    buttonOnClick(loginButton, async () => {
        if (validator.check() == false)
            return Promise.reject('validate fail')

        let service = app.createService(PermissionService);
        let username = usernameInput.value
        let password = passwordInput.value

        await service.user.login(username, password)

        console.assert(options.redirectURL != null)
        location.href = options.redirectURL
    })

    return options
}


function getElement<T extends HTMLElement>(formElement: HTMLElement, name: string) {
    let element = formElement.querySelector(`[name="${name}"]`)
    if (element == null)
        throw errors.elementNotExistsWithName(name)

    return element as T
}