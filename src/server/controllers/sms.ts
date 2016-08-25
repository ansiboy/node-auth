import { BaseController } from './baseController';
import * as data from './../database';

export class SMSController extends BaseController {
    sendVerifyCode(type: 'register' | 'receivePassword'): Promise<string> {
        return new Promise((reslove, reject) => {
            reslove('true');
        });
    }
    static verifyCode(smsId: string, code: string): Promise<boolean> {
        return new Promise((reslove, reject) => {
            reslove(true);
        });
    }
}