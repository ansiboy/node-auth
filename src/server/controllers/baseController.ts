import { Controller } from './../core/mvc';
export interface BaseControllerConstructor {
    new (appId: string): Controller;
}
export class BaseController extends Controller {
    private _applicationId;
    constructor(appId: string) {
        super();
        this._applicationId = appId;
    }
    get applicationId(): string {
        return this._applicationId;
    }
}