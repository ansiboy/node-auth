import { errors } from "../errors";
import { FormValidator, rules as r } from "maishu-dilu";
import { buttonOnClick } from "maishu-ui-toolkit";
import { Application } from "maishu-chitu-react";
import { PermissionService } from "../services/index";

export const MOBILE = 'mobile'
export const VERIFY_CODE = 'verifyCode'
export const PASSWORD = 'password'
export const CONFIRM_PASSWORD = 'confirmPassword'
export const REGISTER = 'register'
export const SEND_VERIFY_CODE = 'sendVerifyCode'
export const DATA = 'data'

type RegisterOptions = {
    redirectURL: string
}

export function setForm(formElement: HTMLElement, options: RegisterOptions, app: Application) {
    if (!formElement) throw errors.argumentNull('formElement')
    if (!options) throw errors.argumentNull('options')
    if (!options.redirectURL) throw errors.fieldNull<RegisterOptions>("options", "redirectURL")

    let validator = new FormValidator(formElement,
        { name: MOBILE, rules: [r.required('请输入手机号')] },
        { name: VERIFY_CODE, rules: [r.required('请输入验证码')] },
        { name: PASSWORD, rules: [r.required('请输入密码')] },
        { name: CONFIRM_PASSWORD, rules: [r.required('请再次输入密码')] }
    )

    let registerButton = getElement<HTMLButtonElement>(formElement, REGISTER)
    if (!registerButton) throw errors.registerButtonNotExists()

    let sendVerifyCodeButton = getElement<HTMLButtonElement>(formElement, SEND_VERIFY_CODE)
    if (!sendVerifyCodeButton) throw errors.sendVerifyCodeButtonNotExists()

    let mobileInput = getElement<HTMLInputElement>(formElement, MOBILE)
    if (!mobileInput) throw errors.elementNotExistsWithName(MOBILE)

    let passwordInput = getElement<HTMLInputElement>(formElement, PASSWORD)
    if (!passwordInput) throw errors.elementNotExistsWithName(PASSWORD)

    let confirmInput = getElement<HTMLInputElement>(formElement, CONFIRM_PASSWORD)
    if (!confirmInput) throw errors.elementNotExistsWithName(CONFIRM_PASSWORD)

    let verifyCodeInput = getElement<HTMLInputElement>(formElement, VERIFY_CODE)
    if (!verifyCodeInput) throw errors.elementNotExistsWithName(VERIFY_CODE)

    let dataHidden = getElement<HTMLInputElement>(formElement, DATA)

    let smsId: string
    buttonOnClick(sendVerifyCodeButton, async () => {
        if (!validator.checkElement(MOBILE))
            return Promise.reject('validate mobile element fail')

        registerButton.setAttribute('disabled', '')
        smsId = await sendVerifyCode(mobileInput.value, sendVerifyCodeButton, app)
        registerButton.removeAttribute('disabled')
    })

    buttonOnClick(registerButton, async () => {
        if (validator.check() == false)
            throw Promise.reject('validate register form fail')

        let mobile = mobileInput.value
        let password = passwordInput.value
        let verifyCode = verifyCodeInput.value
        let data: any
        if (dataHidden && dataHidden.value) {
            try {
                data = JSON.parse(dataHidden.value)
            }
            catch (err) {
                console.error(err)
            }
        }
        await register(mobile, password, smsId, verifyCode, data, app)
        console.assert(options.redirectURL != null)
        location.href = options.redirectURL
    })
}

function getElement<T extends HTMLElement>(formElement: HTMLElement, name: string) {
    let element = formElement.querySelector(`[name="${name}"]`)
    return element as T
}

async function sendVerifyCode(mobile: string, button: HTMLButtonElement, app: Application) {
    if (!mobile) throw errors.argumentNull('mobile')
    if (!button) throw errors.argumentNull('button')

    let userService = app.createService(PermissionService)
    let data = await userService.sms.sendRegisterVerifyCode(mobile)
    button.setAttribute("disabled", "")

    let buttonText = button.innerText
    let letfSeconds = 60
    button.innerText = `${buttonText}(${letfSeconds})`
    let intervalId = window.setInterval(() => {
        letfSeconds = letfSeconds - 1;
        button.innerText = `${buttonText}(${letfSeconds})`
        if (letfSeconds <= 0) {
            window.clearInterval(intervalId);
            button.removeAttribute("disabled")
            button.innerText = buttonText
        }

    }, 1000);


    return data.smsId
}

function register(mobile: string, password: string, smsId: string, verifyCode: string, data: any, app: Application) {
    let userService = app.createService(PermissionService)
    return userService.user.register(mobile, password, smsId, verifyCode, data)
}