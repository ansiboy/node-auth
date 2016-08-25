

export class Errors {
    static names = {
        FieldNull: 'FieldNull',
        ArgumentNull: 'ArgumentNull',
        PasswordIncorect: 'PasswordIncorect',
        UserExists: 'UserExists',
        Success: 'Success'
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
        return error;
    }

    static success(): Error {
        let msg = `Success`;
        let error = new Error(msg);
        error.name = Errors.names.Success;
        return error;
    }
}