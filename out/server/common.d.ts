export declare let constants: {
    adminRoleId: string;
    anonymousRoleId: string;
    controllerBasePath: string;
};
export declare let actionPaths: {
    user: {
        add: string;
        update: string;
        list: string;
        item: string;
        remove: string;
        login: string;
        logout: string;
        me: string;
        register: string;
        resetPassword: string;
        resetMobile: string;
        isMobileRegister: string;
        isUserNameRegister: string;
        isEmailRegister: string;
    };
    role: {
        add: string;
        update: string;
        remove: string;
        list: string;
        item: string;
        resource: {
            ids: string;
            set: string;
        };
    };
    menu: {
        add: string;
        item: string;
        update: string;
        remove: string;
        list: string;
    };
    token: {
        add: string;
        list: string;
    };
    path: {
        list: string;
    };
    resource: {
        add: string;
        list: string;
        listByRoleId: string;
        item: string;
        remove: string;
        update: string;
    };
    sms: {
        sendVerifyCode: string;
        checkVerifyCode: string;
    };
};
