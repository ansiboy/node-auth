import { Controller } from './../core/mvc';
import * as mongodb  from 'mongodb';

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