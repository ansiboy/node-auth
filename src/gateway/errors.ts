import { StatusCode } from "./status-codes";

export let errors = {
    argumentNull(argumentName: string): Error {
        let msg = `Argument '${argumentName}' cannt be null`;
        let error = new Error(msg);
        error.name = `${StatusCode.ArgumentNull} ${errors.argumentNull.name}`;
        return error;
    },
    argumentFieldNull(fieldName: string, objectName: string): Error {
        let msg = `The '${fieldName}' field of '${objectName}' object cannt be null.`;
        let error = new Error(msg);
        error.name = `${StatusCode.FieldNull} ${errors.argumentFieldNull.name}`;
        return error;
    },
    routeDataFieldNull<T>(fieldName: keyof T): Error {
        let msg = `The ${fieldName} field of route data cannt be null.`;
        let error = new Error(msg);
        let name: keyof typeof errors = "routeDataFieldNull";
        error.name = name;
        return error;
    },
    userNotLogin(requestURL?: string): Error {
        let msg = `User id is required.`;
        if (requestURL) {
            msg = msg + `request url is ${requestURL}.`;
        }
        let err = new Error(msg);
        err.name = `${StatusCode.UserNotLogin} ${errors.userNotLogin.name}`;

        return err;
    },
    forbidden(path) {
        let msg = `Path ${path} can not access`;
        let error = new Error(msg);
        error.name = `${StatusCode.Forbidden} ${errors.forbidden.name}`;
        return error;
    },
    objectNotExistWithId(id: string, name: string) {
        let msg = `Object ${name} with id ${id} is not exists.`
        let err = new Error(msg)
        err.name = `${StatusCode.ObjectNotExistWithId} ${errors.objectNotExistWithId.name}`;
        return err
    },
}