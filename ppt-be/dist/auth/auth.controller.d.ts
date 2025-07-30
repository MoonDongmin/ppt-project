import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register-dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(rawToken: string): Promise<{
        refreshToken: string;
        accessToken: string;
    }>;
    register(rawToken: string, registerDto: RegisterDto): Promise<import("../user/entities/user.entity").User>;
}
