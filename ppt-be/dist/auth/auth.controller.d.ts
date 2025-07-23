import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(rawToken: string): Promise<{
        user: string;
    }>;
    register(rawToken: string): Promise<import("../user/entities/user.entity").User>;
}
