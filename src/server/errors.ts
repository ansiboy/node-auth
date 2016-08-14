
export class Errors {
    static fieldNull(fieldName: string, className: string): Error {
        let msg = `The '${fieldName}' field of '${className}' class cannt be null.`;
        let error = new Error(msg);
        error.name = 'FieldNull';
        return error;
    }

    static argumentNull(argumentName: string) {
        let msg = `Argument '${argumentName}' cannt be null`;
        let error = new Error(msg);
        error.name = 'ArgumentNull';
        return error;
    }
}