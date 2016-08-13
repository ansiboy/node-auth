enum LoginResult {
    userNotExists,
    passwordIncorrect
}

class Authorization {
    /**
     * 登录
     * @app_name 用户所在应用的名称
     * @username 登录用户的名称
     * @password 登录用户的密码
     */
    login(app_name: string, username: string, password): LoginResult {
        return LoginResult.userNotExists;
    }
}
