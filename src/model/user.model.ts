export class RegisterUserRequest {
    name?: string;
    username: string;
    email: string;
    password: string;
}

export class UserResponse {
    id: string;
    name?: string;
    username: string;
}

export class LoginUserRequest {
    username: string;
    password: string;
}