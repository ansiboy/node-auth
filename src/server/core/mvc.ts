class Errors {
    static notImplement(methodName: string) {
        let msg = `The method '${methodName}' is not implement.`
        let err = new Error(msg);
        err.name = 'notImplement';
        return err;
    }
    static argumentNull(argumentName: string) {
        let msg = `Argument '${argumentName}' cannt be null.`;
        let err = new Error(msg);
        err.name = 'argumentName';
        return err;
    }
}

abstract class ControllerResultType {
    toString(): string {
        throw Errors.notImplement('toString');
    }
}

class JsonResultType extends ControllerResultType {
    private obj: any;
    constructor(obj: any) {
        if (obj == null)
            throw Errors.argumentNull('obj');

        super();
    }
    toString() {
        return JSON.stringify(this.obj);
    }
}

export class Controller {
    protected json(obj: any) {
        return new JsonResultType(obj);
    }
}