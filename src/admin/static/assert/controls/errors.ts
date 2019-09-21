import { Resource } from "entities";

export let errors = {
    unknonwResourceName(resourceName: string) {
        let msg = `Resource name '${resourceName}' is unknown.`
        return new Error(msg)
    },
    resourceDataFieldMissing(resource: Resource, fieldName: Extract<keyof Resource["data"], string>) {
        let msg = `Resource data field '${fieldName}' is missing, resource id is ${resource.id}.`;
        return new Error(msg);
    },
    buttonExecutePahtIsEmpty(resource: Resource) {
        let msg = `The execute_path of resource '${resource.id}' is empty.`;
        return new Error(msg);
    },
    executePathIncorrect(executePath: string) {
        let msg = `Execute path '${executePath}' is incorrect.`;
        return new Error(msg);
    },
    contextIsNull() {
        let msg = `The context object is null.`;
        return new Error(msg);
    },
    contextMemberIsNotExist(memberName: string) {
        let msg = `Context member '${memberName}' is not exists.`;
        return new Error(msg);
    },
    contextMemberIsNotFunction(memberName: string) {
        let msg = `Context member '${memberName}' is not a function.`;
        return new Error(msg);
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
    }
}