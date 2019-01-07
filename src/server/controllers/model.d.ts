interface User {
    id: string,
    user_name?: string,
    mobile?: string,
    email?: string,
    password?: string,
    openid?: string,
    create_date_time: Date,
    data?: any
}

interface UserRole {
    user_id: string,
    role_id: string,
}