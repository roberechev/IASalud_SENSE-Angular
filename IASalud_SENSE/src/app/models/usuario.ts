export class Usuario {
    id ?: number;
    username: string;
    email: string;
    password: string;
    is_superuser: boolean;

    constructor(username: string, email: string, password: string, is_superuser: boolean) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.is_superuser = is_superuser;
    }
}

