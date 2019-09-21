import { FormValidator, rules as r } from "maishu-dilu";
import { buttonOnClick, alert } from "maishu-ui-toolkit";
import { errors } from "../errors";
import { PermissionService as UserService } from "../services/index";
import { Application } from "maishu-chitu-react";
// import { app } from "../index";

export const CONFIRM_PASSWORD = 'confirmPassword'
export const MOBILE = 'mobile'
export const PASSWORD = 'password'
export const RESET_PASSWORD = 'resetPassword'
export const SEND_VERIFY_CODE = 'sendVerifyCode'
export const VERIFY_CODE = 'verifyCode'

export function setForm(formElement: HTMLElement, app: Application) {
    if (!formElement) throw errors.argumentNull('formElement')

    let validator = new FormValidator(formElement,
        { name: MOBILE, rules: [r.required('请输入手机号')] },
        { name: VERIFY_CODE, rules: [r.required('请输入验证码')] },
        { name: PASSWORD, rules: [r.required('请输入密码')] },
        { name: CONFIRM_PASSWORD, rules: [r.required('请再次输入密码')] }
    )

    let resetPasswordButton = getElement<HTMLButtonElement>(formElement, RESET_PASSWORD)
    if (!resetPasswordButton) throw errors.registerButtonNotExists()

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

    let smsId: string
    buttonOnClick(sendVerifyCodeButton, async () => {
        if (!validator.checkElement(MOBILE))
            return Promise.reject('validate mobile element fail')

        resetPasswordButton.setAttribute('disabled', '')
        smsId = await sendVerifyCode(mobileInput.value, sendVerifyCodeButton, app)
        resetPasswordButton.removeAttribute('disabled')
    })

    buttonOnClick(resetPasswordButton, async () => {
        if (validator.check() == false)
            throw Promise.reject('validate register form fail')

        let mobile = mobileInput.value
        let password = passwordInput.value
        let verifyCode = verifyCodeInput.value
        // await register(mobile, password, smsId, verifyCode, data)
        let userService = app.createService(UserService)
        await userService.user.resetPassword(mobile, password, smsId, verifyCode)
        alert({ title: '提示', message: '重置密码成功' })
    })

}


function getElement<T extends HTMLElement>(formElement: HTMLElement, name: string) {
    let element = formElement.querySelector(`[name="${name}"]`)
    return element as T
}

async function sendVerifyCode(mobile: string, button: HTMLButtonElement, app: Application) {
    if (!mobile) throw errors.argumentNull('mobile')
    if (!button) throw errors.argumentNull('button')

    let userService = app.createService(UserService)
    let data = await userService.sms.sendResetVerifyCode(mobile)
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

