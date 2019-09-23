export let errorStatusCodes = {
    noPermission: 726,
    userIdNull: 727
}

export let errorNames = {
    ActionNotExists: '700 ActionNotExists',
    AdminNotExists: '701 AdminNotExists',
    ApplicationExists: '702 ApplicationExists',
    ApplicationIdRequired: '703 ApplicationIdRequired',
    ApplicationTokenRequired: '704 ApplicationTokenRequired',
    ArgumentNull: '705 ArgumentNull',
    CanntGetHeaderFromRequest: '706 CanntGetHeaderFromRequest',
    ControllerNotExist: '707 ControllerNotExist',
    DeleteResultZero: '708 DeleteResultZero',
    FieldNull: '709 FieldNull',
    InvalidToken: '710 InvalidToken',
    NotAllowRegister: '711 NotAllowRegister',
    NotImplement: '712 NotImplement',
    mobileIsBind: '713 MobileIsBind',
    ObjectNotExistWithId: '714 ObjectNotExistWithId',
    PasswordIncorect: '715 PasswordIncorect',
    PostIsRequired: '716 PostIsRequired',
    Success: '200 Success',
    UserExists: '717 UserExists',
    UserNotLogin: '718 UserNotLogin',
    userNotExists: '719 userNotExists',
    UpdateResultZero: '720 UpdateResultZero',
    VerifyCodeIncorrect: '721 VerifyCodeIncorrect',
    VerifyCodeNotMatchMobile: '722 VerifyCodeNotMatchMobile',
    CanntGetRedirectUrl: '723 CanntGetRedirectUrl',
    // tokenNotExists: '724 tokenNotExists',
    userTokenNotExists: '724 UserTokenNotExists',
    appTokenNotExists: '725 AppTokenNotExists',
    noPermission: `${errorStatusCodes.noPermission} NoPermission`,
    userIdNull: `${errorStatusCodes} UserIdNull`,
    forbidden: '403 forbidden'
}

interface MyError extends Error {
    arguments: any
}

export let errors = {
    argumentNull(argumentName: string): Error {
        let msg = `Argument '${argumentName}' cannt be null`;
        let error = new Error(msg) as MyError;
        error.name = errorNames.ArgumentNull;
        error.arguments = { argumentName }
        return error;
    },
    argumentEmptyArray(argumentName: string): Error {
        let msg = `Argument '${argumentName}' can not an emtpy array.`;
        let error = new Error(msg) as MyError;
        error.name = errors.argumentEmptyArray.name;
        error.arguments = { argumentName }
        return error;
    },
    canntGetRedirectUrl(rootDir: string) {
        let msg = `Can not find redirect url for '${rootDir}'`;
        let err = new Error(msg);
        err.name = errorNames.CanntGetRedirectUrl;
        return err;
    },
    emailExists(email: string): Error {
        let msg = `邮箱 '${email}' 已被注册`;
        let error = new Error(msg);
        error.name = errors.emailExists.name;
        (<any>error).arguments = { email };
        return error;
    },
    usernameExists(username: string): Error {
        let msg = `用户名 '${username}' 已被注册`;
        let error = new Error(msg);
        error.name = errors.emailExists.name;
        (<any>error).arguments = { username };
        return error;
    },
    forbidden(path) {
        let msg = `Path ${path} can not access`;
        let error = new Error(msg);
        error.name = errorNames.forbidden;
        return error;
    },
    invalidObjectId(objectId: string) {
        let msg = `invald ObjectId:'${objectId}'`;
        let err = new Error(msg);
        err.name = 'invalidObjectId';
        return err;
    },
    mobileExists(mobile: string): Error {
        let msg = `手机号 '${mobile}' 已被注册`;
        let error = new Error(msg);
        error.name = errors.mobileExists.name;
        (<any>error).arguments = { mobile };
        return error;
    },
    mobileNotExists(mobile: string): Error {
        let msg = `手机号 '${mobile}' 未注册`;
        let error = new Error(msg);
        error.name = errors.mobileNotExists.name;
        (<any>error).arguments = { mobile };
        return error;
    },
    actionNotExists(controller: string, action: string): Error {
        let msg = `Action '${action}' of ${controller} is not exists.`
        let error = new Error(msg) as MyError;
        error.name = errors.actionNotExists.name;
        error.arguments = { controller, action };
        return error;
    },
    argumentFieldNull(fieldName: string, objectName: string): Error {
        let msg = `The '${fieldName}' field of '${objectName}' object cannt be null.`;
        let error = new Error(msg);
        error.name = errorNames.FieldNull;
        return error;
    },
    routeDataFieldNull(fieldName: string): Error {
        let msg = `The '${fieldName}' field of route data cannt be null.`;
        let error = new Error(msg);
        error.name = errorNames.FieldNull;
        return error;
    },
    userNotLogin(): Error {
        let msg = `User id is required.`;
        let err = new Error(msg);
        err.name = errorNames.UserNotLogin;

        return err;
    },
    applicationExists(name: string): Error {
        let msg = `Application with name '${name}' is exists.`;
        let error = new Error(msg) as MyError;
        error.name = errorNames.ApplicationExists;
        error.arguments = { name };
        return error;
    },
    usernameOrPasswordIncorrect(username: string) {
        let msg = `用户名或密码不正确.`;
        let error = new Error(msg);
        error.name = errorNames.PasswordIncorect;
        return error;
    },
    postDataNotJSON(data: string): Error {
        let msg = `提交的数据不是 JSON 格式。提交数据为：${data}`;
        let err = new Error(msg);
        err.name = errors.postDataNotJSON.name
        return err;
    },
    objectNotExistWithId(id: string, name: string) {
        let msg = `Object ${name} with id ${id} is not exists.`
        let err = new Error(msg)
        err.name = errors.objectNotExistWithId.name
        return err
    },
    verifyCodeIncorrect(verifyCode: string): Error {
        let msg = `验证码不正确`
        let err = new Error(msg) as MyError;
        err.name = errorNames.VerifyCodeIncorrect;
        err.arguments = { verifyCode };
        return err;
    },
    notImplement() {
        return new Error('Not implement')
    },
    argumentTypeIncorrect(paramName: string, expectedTypeName: string) {
        let msg = `Argument ${paramName} is expected ${expectedTypeName} type.`
        let err = new Error(msg) as MyError;
        err.name = errors.argumentTypeIncorrect.name
        err.arguments = { paramName, typeName: expectedTypeName }
        return err
    },
    userNameFormatError(username: string) {
        let msg = `用户名 '${username}' 格式错误`
        let err = new Error(msg);
        err.name = errors.userNameFormatError.name
        return err
    },
    userIdNull() {
        let msg = `用户 ID 号为空`;
        let err  = new Error(msg);
        err.name = errors.userIdNull.name;
        return err;
    },
    noPermission(){
        let msg = "no permission";
        let err = new Error(msg);
        err.name = errors.noPermission.name;
        return err;
    }
}

// export function fieldNull(fieldName: string, objectName: string): Error {
//     let msg = `The '${fieldName}' field of '${objectName}' object cannt be null.`;
//     let error = new Error(msg);
//     error.name = names.FieldNull;
//     return error;
// }

// export function argumentNull(argumentName: string): Error {
//     let msg = `Argument '${argumentName}' cannt be null`;
//     let error = new Error(msg);
//     error.name = names.ArgumentNull;
//     return error;
// }

// export function passwordIncorect(username: string): Error {
//     let msg = `Password incorect.`;
//     let error = new Error(msg);
//     error.name = names.PasswordIncorect;
//     return error;
// }

// export function usernameExists(username: string): Error {
//     let msg = `用户名 '${username}' 已被注册`;
//     let error = new Error(msg);
//     error.name = names.UserExists;
//     (<any>error).arguments = { username };
//     return error;
// }

// export function mobileExists(mobile: string): Error {
//     let msg = `手机号 '${mobile}' 已被注册`;
//     let error = new Error(msg);
//     error.name = 'MobileExists';
//     (<any>error).arguments = { mobile };
//     return error;
// }

// export function success(): Error {
//     let msg = `Success`;
//     let error = new Error(msg);
//     error.name = names.Success;
//     error.stack = undefined;
//     return error;
// }

// export function notAllowRegister(): Error {
//     let msg = 'System is config to not allow register.'
//     let error = new Error(msg);
//     error.name = names.NotAllowRegister;
//     return error;
// }

// export function notImplement(): Error {
//     let msg = 'Not implement.';
//     let error = new Error(msg);
//     error.name = names.NotImplement;
//     return error;
// }

// export function userNotExists(username: string): Error {
//     let msg = `User '${username}' is not exists.`
//     let error = new Error(msg) as MyError;
//     error.name = names.userNotExists;
//     error.arguments = { username };
//     return error;
// }

// export function adminNotExists(username: string): Error {
//     let msg = `Admin '${username}' is not exists.`
//     let error = new Error(msg) as MyError;
//     error.name = names.AdminNotExists;
//     error.arguments = { username };
//     return error;
// }

// export function invalidToken(tokenValue: string): Error {
//     let msg = `Token '${tokenValue}' is not a valid token.`;
//     let error = new Error(msg) as MyError;
//     error.name = names.InvalidToken;
//     error.arguments = { token: tokenValue };
//     return error;
// }

// export function applicationExists(name: string): Error {
//     let msg = `Application with name '${name}' is exists.`;
//     let error = new Error(msg) as MyError;
//     error.name = names.ApplicationExists;
//     error.arguments = { name };
//     return error;
// }

// export function applicationNotExists(name: string): Error {
//     let msg = `Application with name '${name}' is not exists.`;
//     let error = new Error(msg) as MyError;
//     error.name = names.ApplicationExists;
//     error.arguments = { name };
//     return error;
// }

// export function deleteResultZero(): Error {
//     let msg = 'Deleted count is zero, maybe the object is not exists.'
//     let error = new Error(msg);
//     error.name = names.DeleteResultZero;
//     return error;
// }

// export function updateResultZero(): Error {
//     let msg = 'Updated count is zero, maybe the object is not exists.'
//     let error = new Error(msg);
//     error.name = names.UpdateResultZero;
//     return error;
// }

// export function postIsRequired(): Error {
//     let msg = 'Post request is required.';
//     let error = new Error(msg);
//     error.name = names.PostIsRequired;
//     return error;
// }

// export function canntGetQueryStringFromRequest(itemName): Error {
//     let msg = `Can not get query string '${itemName}' from the request url.`;
//     let error = new Error(msg);
//     error.name = names.CanntGetHeaderFromRequest;
//     return error;
// }

// export function canntGetHeader(headerName): Error {
//     let msg = `Cannt get header '${headerName}' from headers.`;
//     let error = new Error(msg);
//     error.name = 'CanntGetHeader';
//     return error;
// }

// export function controllerNotExist(path): Error {
//     let msg = `Controller is not exists in path '${path}'.`;
//     let error = new Error(msg);
//     error.name = names.ControllerNotExist;
//     return error;
// }

// export function actionNotExists(action: string, controller: string): Error {
//     let msg = `Action '${action}' is not exists in controller '${controller}'`;
//     let error = new Error(msg);
//     error.name = names.ActionNotExists;
//     return error;
// }

// export function objectNotExistWithId(objectId: string, objectName: string): Error {
//     let msg = `${objectName} not exists with id '${objectId}'`;
//     let error = new Error(msg);
//     error.name = names.ObjectNotExistWithId;
//     return error;
// }

// export function applicationIdRequired(): Error {
//     let msg = `Application id is required.`;
//     let err = new Error(msg);
//     err.name = names.ApplicationIdRequired;

//     return err;
// }

// export function userIdRequired(): Error {
//     let msg = `User id is required.`;
//     let err = new Error(msg);
//     err.name = names.UserIdRequired;

//     return err;
// }

// export function applicationTokenRequired(): Error {
//     let msg = `Application token is required.`;
//     let err = new Error(msg);
//     err.name = names.ApplicationTokenRequired;

//     return err;
// }

// // export function tokenNotExists(tokenId: string) {
// //     let msg = `Token not exists with id '${tokenId}'`;
// //     let error = new Error(msg);
// //     error.name = names.tokenNotExists;
// //     return error;
// // }

// //==================================================================
// // 验证码

// export function verifyCodeIncorrect(verifyCode: string): Error {
//     let msg = `验证码不正确`
//     let err = new Error(msg) as MyError;
//     err.name = names.VerifyCodeIncorrect;
//     err.arguments = { verifyCode };
//     return err;
// }

// export function verifyCodeNotMatchMobile(mobile: string): Error {
//     let msg = `验证码与手机号码'${mobile}'不匹配`
//     let err = new Error(msg) as MyError;
//     err.name = names.VerifyCodeNotMatchMobile;
//     err.arguments = { mobile };
//     return err;
// }

// //==================================================================

// export function mobileIsBind(mobile: string): Error {
//     let msg = `手机号码'${mobile}'已被绑定。`;
//     let err = new Error(msg) as MyError;
//     err.name = names.mobileIsBind;
//     return err;
// }

// export function postDataNotJSON(data: string): Error {
//     let msg = `提交的数据不是 JSON 格式。提交数据为：${data}`;
//     let err = new Error(msg) as MyError;
//     err.name = 'postDataNotJSON';
//     return err;
// }

// export function invalidObjectId(objectId: string) {
//     let msg = `非法的 ObjectId:'${objectId}'`;
//     let err = new Error(msg) as MyError;
//     err.name = 'invalidObjectId';
//     return err;
// }

// export function canntGetRedirectUrl(rootDir: string) {
//     let msg = `Can not find redirect url for '${rootDir}'`;
//     let err = new Error(msg) as MyError;
//     err.name = names.CanntGetRedirectUrl;
//     return err;
// }

// export function appTokenNotExists(token) {
//     let msg = `Application token '${token}' is not exists.`;
//     let err = new Error(msg);
//     err.name = names.appTokenNotExists;
//     return err;
// }

// export function userTokenNotExists(token){
//     let msg = `User token '${token}' is not exists.`;
//     let err = new Error(msg);
//     err.name = names.userTokenNotExists;
//     return err;
// }