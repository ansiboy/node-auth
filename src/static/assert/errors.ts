export let errors = {
    elementNotExistsWithName(name: string) {
        let msg = `Element with name ${name} is not exists.`
        let error = new Error(msg)
        error.name = errors.elementNotExistsWithName.name
        return error
    },
    argumentNull(name: string) {
        let msg = `Argument ${name} is null or empty.`
        let error = new Error(msg)
        error.name = errors.argumentNull.name
        return error
    },
    fieldNull<T>(itemName: string, fieldName: keyof T) {
        let msg = `Argument ${itemName} field of ${fieldName}  is null or empty.`
        let error = new Error(msg)
        error.name = errors.fieldNull.name
        return error
    },
    notImplement() {
        return new Error('Not implement.')
    },
    masterPageNameCanntEmpty() {
        let msg = `Name of the master page can be null or empty.`
        let error = new Error(msg)
        error.name = errors.masterPageNameCanntEmpty.name
        return error
    },
    masterNotExists(masterName: string) {
        let msg = `Master '${masterName}' is not exists.`
        let error = new Error(msg)
        error.name = errors.masterNotExists.name
        return error
    },
    masterPageExists(masterName: string) {
        let msg = `Master '${masterName}' is exists.`
        let error = new Error(msg)
        error.name = errors.masterPageExists.name
        return error
    },
    masterContainerIsNull(name: string) {
        let msg = `Container of master '${name}' is null.`
        let error = new Error(msg)
        error.name = errors.masterContainerIsNull.name
        return error
    },
    authServiceHostNotConfig() {
        let msg = `Auth service host is not config`
        let error = new Error(msg)
        error.name = errors.authServiceHostNotConfig.name
        return error
    },
    registerButtonNotExists() {
        let msg = `Register button is not exists`
        let error = new Error(msg)
        error.name = errors.registerButtonNotExists.name
        return error
    },
    sendVerifyCodeButtonNotExists() {
        let msg = `Send verify code button is not exists.`
        let error = new Error(msg)
        error.name = errors.sendVerifyCodeButtonNotExists.name
        return error
    },
    unexpectedNullResult() {
        let msg = `Null result is unexpected.`
        return new Error(msg)
    },
    moduleIsNull(path) {
        let msg = `Module ${path} is null.`
        return new Error(msg);
    },
    moduleHasNoneDefaultExports(path: string) {
        let msg = `Module ${path} has none default exports.`
        return new Error(msg);
    },
    moduleHasDefaultExportIsNotFunction(path: string) {
        let msg = `Default export of module ${path} is not a function.`
        return new Error(msg);
    },
    serviceUrlCanntNull(serviceName: string) {
        let msg = `Service '${serviceName}' base url can not null.`
        return new Error(msg)
    },
    unknonwResourceName(resourceName: string) {
        let msg = `Resource name '${resourceName}' is unknown.`
        return new Error(msg)
    }
}