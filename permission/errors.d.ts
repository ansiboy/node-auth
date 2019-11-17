export declare let errors: {
    argumentNull(argumentName: string): Error;
    routeDataFieldNull<T>(fieldName: keyof T): Error;
    argumentFieldNull(fieldName: string, objectName: string): Error;
    objectNotExistWithId(id: string, name: string): Error;
    mobileNotExists(mobile: string): Error;
    mobileExists(mobile: string): Error;
    userIdNull(): Error;
    verifyCodeIncorrect(verifyCode: string): Error;
    canntGetUserIdFromHeader(): Error;
    usernameOrPasswordIncorrect(username: string): Error;
    emailExists(email: string): Error;
    usernameExists(username: string): Error;
};
