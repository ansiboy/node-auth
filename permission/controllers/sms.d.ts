import { ServerContext } from 'maishu-node-mvc';
import { PermissionDataContext } from '../data-context';
import { ServerContextData } from '../global';
export default class SMSController {
    sendVerifyCode(dc: PermissionDataContext, context: ServerContext<ServerContextData>, { mobile, type }: {
        mobile: string;
        type: 'register' | 'resetPassword';
    }): Promise<{
        smsId: string;
    }>;
    checkVerifyCode(dc: PermissionDataContext, { smsId, verifyCode }: {
        smsId: string;
        verifyCode: string;
    }): Promise<boolean>;
}
