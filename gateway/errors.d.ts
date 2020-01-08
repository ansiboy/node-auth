export declare let errors: {
    argumentNull(argumentName: string): Error;
    argumentFieldNull(fieldName: string, objectName: string): Error;
    argumentTypeIncorrect(argumentName: string, expectedType: string): Error;
    routeDataFieldNull<T>(fieldName: keyof T): Error;
    userNotLogin(requestURL?: string): Error;
    forbidden(path: any): Error;
    objectNotExistWithId(id: string, name: string): Error;
};
