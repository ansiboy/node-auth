

//export class Errors {
export let names = {
    ApplicationExists: 'ApplicationExists',
    ArgumentNull: 'ArgumentNull',
    FieldNull: 'FieldNull',
    NotAllowRegister: 'NotAllowRegister',
    NotImplement: 'NotImplement',
    PasswordIncorect: 'PasswordIncorect',
    Success: 'Success',
    UserExists: 'UserExists',
    UserNotExists: 'UserNotExists',
    InvalidToken: 'InvalidToken',
    DeleteResultZero: 'DeleteResultZero',
    UpdateResultZero: 'UpdateResultZero',
}

export function fieldNull(fieldName: string, objectName: string): Error {
    let msg = `The '${fieldName}' field of '${objectName}' object cannt be null.`;
    let error = new Error(msg);
    error.name = names.FieldNull;
    return error;
}

export function argumentNull(argumentName: string) {
    let msg = `Argument '${argumentName}' cannt be null`;
    let error = new Error(msg);
    error.name = names.ArgumentNull;
    return error;
}

export function passwordIncorect(username: string) {
    let msg = `Password incorect.`;
    let error = new Error(msg);
    error.name = names.PasswordIncorect;
    return error;
}

export function userExists(username: string): Error {
    let msg = `User '${username}' is exists.`;
    let error = new Error(msg);
    error.name = names.UserExists;
    (<any>error).arguments = { username };
    return error;
}

export function success(): Error {
    let msg = `Success`;
    let error = new Error(msg);
    error.name = names.Success;
    error.stack = undefined;
    return error;
}

export function notAllowRegister(): Error {
    let msg = 'System is config to not allow register.'
    let error = new Error(msg);
    error.name = names.NotAllowRegister;
    return error;
}

export function notImplement(): Error {
    let msg = 'Not implement.';
    let error = new Error(msg);
    error.name = names.NotImplement;
    return error;
}

export function userNotExists(username: string) {
    let msg = `User '${username}' is not exists.`
    let error = new Error(msg);
    error.name = names.UserNotExists;
    (<any>error).arguments = { username };
    return error;
}

export function invalidToken(tokenValue: string): Error {
    let msg = `Token '${tokenValue}' is not a valid token.`;
    let error = new Error(msg);
    error.name = names.InvalidToken;
    (<any>error).arguments = { token: tokenValue };
    return error;
}

export function applicationExists(name: string) {
    let msg = `Application with name '${name}' is exists.`;
    let error = new Error(msg);
    error.name = names.ApplicationExists;
    (<any>error).arguments = { name };
    return error;
}

export function deleteResultZero() {
    let msg = 'Deleted count is zero, maybe the object is not exists.'
    let error = new Error(msg);
    error.name = names.DeleteResultZero;
    return error;
}

export function updateResultZero() {
    let msg = 'Updated count is zero, maybe the object is not exists.'
    let error = new Error(msg);
    error.name = names.UpdateResultZero;
    return error;
}
