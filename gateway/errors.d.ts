export declare let errors: {
    argumentNull(argumentName: string): Error;
    routeDataFieldNull<T>(fieldName: keyof T): Error;
    userNotLogin(requestURL: string): Error;
    forbidden(path: any): Error;
};
