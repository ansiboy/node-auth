import { Controller } from './../core/mvc';
export class BaseController extends Controller {
    private _applicationId;
    constructor() {
        super();
    }
    get applicationId(): string {
        return this._applicationId;
    }
    set applicationId(value: string) {
        this._applicationId = value;
    }
}