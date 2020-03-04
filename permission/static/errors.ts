export let errors = {
    argumentNull(name: string) {
        let msg = `Argument ${name} is null or empty.`
        let error = new Error(msg)
        error.name = errors.argumentNull.name
        return error
    },
    serviceUrlCanntNull(serviceName: string) {
        let msg = `Service '${serviceName}' base url can not null.`
        return new Error(msg)
    },
    unexpectedNullResult() {
        let msg = `Null result is unexpected.`
        return new Error(msg)
    },
}