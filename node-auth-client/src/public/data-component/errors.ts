export let errors = {
    argumentNull(name) {
        return new Error(`Argument ${name} cannt be null or empty.`)
    },
    dataSourceNotExists(name: string) {
        return new Error(`Data source ${name} is not exists.`)
    },
    mobileBindsDistributor(mobile: string) {
        let msg = `账号 ${mobile} 已经绑定到另外一个经销商`
        return new Error(msg)
    },
    argumentFieldNull(argumentName: string, fieldName: string) {
        return new Error(`Argument ${argumentName} field ${fieldName} cannt ben null or emtpy.`)
    },
    distributorNotAllowDelete() {
        return new Error('经销商不允许删除')
    },
    brandExists(name: string) {
        return new Error(`品牌"${name}"已存在`)
    },
    userExists(mobile: string) {
        return new Error(`用户"${mobile}"已经存在`)
    },
    notImplement() {
        return new Error('Not implement.')
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
}