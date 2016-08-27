

export class Errors {
    static names = {
        ArgumentNull: 'ArgumentNull',
        FieldNull: 'FieldNull',
        NotAllowRegister: 'NotAllowRegister',
        NotImplement: 'NotImplement',
        PasswordIncorect: 'PasswordIncorect',
        Success: 'Success',
        UserExists: 'UserExists',
        UserNotExists: 'UserNotExists',
    }

    static fieldNull(fieldName: string, className: string): Error {
        let msg = `The '${fieldName}' field of '${className}' class cannt be null.`;
        let error = new Error(msg);
        error.name = Errors.names.FieldNull;
        return error;
    }

    static argumentNull(argumentName: string) {
        let msg = `Argument '${argumentName}' cannt be null`;
        let error = new Error(msg);
        error.name = Errors.names.ArgumentNull;
        return error;
    }

    static passwordIncorect(username: string) {
        let msg = `Password incorect.`;
        let error = new Error(msg);
        error.name = Errors.names.PasswordIncorect;
        return error;
    }

    static userExists(username: string): Error {
        let msg = `User '${username}' is exists.`;
        let error = new Error(msg);
        error.name = Errors.names.UserExists;
        (<any>error).arguments = { username };
        return error;
    }

    static success(): Error {
        let msg = `Success`;
        let error = new Error(msg);
        error.name = Errors.names.Success;
        return error;
    }

    static notAllowRegister(): Error {
        let msg = 'System is config to allow register.'
        let error = new Error(msg);
        error.name = Errors.names.NotAllowRegister;
        return error;
    }

    static notImplement(): Error {
        let msg = 'Not implement.';
        let error = new Error(msg);
        error.name = Errors.names.NotImplement;
        return error;
    }

    static userNotExists(username: string) {
        let msg = `User '${username}' is not exists.`
        let error = new Error(msg);
        error.name = Errors.names.UserNotExists;
        (<any>error).arguments = { username };
        return error;
    }
}