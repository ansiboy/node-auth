import { PermissionDataContext } from '../data-context';
export default class SMSController {
    sendVerifyCode(dc: PermissionDataContext, { mobile, type }: {
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
