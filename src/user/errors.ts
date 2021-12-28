import { statusCodes as myStatusCodes } from "./status-codes";
import { StatusCode } from "../gateway";
import { ConnectionOptions } from "maishu-node-data";

export let errors = {
    argumentNull(argumentName: string): Error {
        let msg = `Argument '${argumentName}' cannt be null`;
        let error = new Error(msg);
        error.name = `${StatusCode.ArgumentNull} ${errors.argumentNull.name}`;
        return error;
    },
    routeDataFieldNull<T>(fieldName: keyof T): Error {
        let msg = `The '${fieldName}' field of route data cannt be null.`;
        let error = new Error(msg);
        error.name = `${StatusCode.FieldNull} ${errors.routeDataFieldNull.name}`;
        return error;
    },
    routeDataFieldTypeIncorrect(argumentName: string, expectedType: string, actualType: string) {
        let msg = `Arugment '${argumentName}' is expected ${expectedType}, actual is '${actualType}'.`;
        let error = new Error(msg);
        let name: keyof typeof errors = "routeDataFieldTypeIncorrect";
        error.name = name;
        return error;
    },
    argumentFieldNull(fieldName: string, objectName: string): Error {
        let msg = `The '${fieldName}' field of '${objectName}' object cannt be null.`;
        let error = new Error(msg);
        error.name = `${StatusCode.FieldNull} ${errors.argumentFieldNull.name}`;
        return error;
    },
    objectNotExistWithId(id: string, name: string) {
        let msg = `Object ${name} with id ${id} is not exists.`
        let err = new Error(msg)
        err.name = `${StatusCode.ObjectNotExistWithId} ${errors.objectNotExistWithId.name}`;
        return err
    },
    mobileNotExists(mobile: string): Error {
        let msg = `手机号 '${mobile}' 未注册`;
        let error = new Error(msg);
        error.name = `${myStatusCodes.mobileNotExists} ${errors.mobileNotExists.name}`;
        (<any>error).arguments = { mobile };
        return error;
    },
    mobileExists(mobile: string): Error {
        let msg = `手机号 '${mobile}' 已被注册`;
        let error = new Error(msg);
        error.name = errors.mobileExists.name;
        (<any>error).arguments = { mobile };
        return error;
    },
    userIdNull() {
        let msg = `用户 ID 号为空`;
        let err = new Error(msg);
        err.name = `${myStatusCodes.userIdNull} ${errors.userIdNull.name}`;
        return err;
    },
    verifyCodeIncorrect(verifyCode: string): Error {
        let msg = `验证码不正确`
        let err = new Error(msg);
        err.name = `${myStatusCodes.verifyCodeIncorrect} ${errors.verifyCodeIncorrect.name}`;
        return err;
    },
    canntGetUserIdFromHeader() {
        let msg = "Can not get user id from header.";
        let err = new Error(msg);
        err.name = `${myStatusCodes.canntGetUserIdFromHeader} ${errors.canntGetUserIdFromHeader.name}`;
        return err;
    },
    usernameOrPasswordIncorrect(username: string) {
        let msg = `用户名或密码不正确.`;
        let error = new Error(msg);
        error.name = `${myStatusCodes.usernameOrPasswordIncorect} ${errors.usernameOrPasswordIncorrect.name}`;
        return error;
    },
    passwordIncorrect() {
        let msg = `密码不正确.`;
        let error = new Error(msg);
        error.name = `${myStatusCodes.passwordIncorect} ${errors.passwordIncorrect.name}`;
        return error;
    },
    emailExists(email: string): Error {
        let msg = `邮箱 '${email}' 已被注册`;
        let error = new Error(msg);
        error.name = `${myStatusCodes.emailExists} ${errors.emailExists.name}`;
        return error;
    },
    usernameExists(username: string): Error {
        let msg = `用户名 '${username}' 已被注册`;
        let error = new Error(msg);
        error.name = `${myStatusCodes.usernameExists} ${errors.emailExists.name}`;
        return error;
    },
    connectionOptionFieldNull(member: keyof ConnectionOptions): Error {
        let msg = `Connection options '${member}' field is null or empty.`;
        let error = new Error(msg);
        error.name = errors.connectionOptionFieldNull.name;
        return error;
    },
    userNameMobileEmailRequireOne() {
        let msg = `User name, mobile, email is required one.`;
        let error = new Error(msg);
        error.name = errors.userNameMobileEmailRequireOne.name;
        return error;
    },
    parameterArrayIsEmpty(parameterName: string) {
        let msg = `Array ${parameterName} is empty.`;
        let err = new Error(msg);
        let name: keyof typeof errors = "parameterArrayIsEmpty";
        err.name = name;
        return err;
    },
    userInvalid(username: string) {
        let msg = `user ${username} is invalid`;
        let err = new Error(msg);
        let name: keyof typeof errors = "userInvalid";
        err.name = name;
        return err;
    }
}