import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register-dto';
export declare class AuthService {
    private readonly userRepository;
    private readonly userService;
    private readonly configService;
    private readonly jwtService;
    constructor(userRepository: Repository<User>, userService: UserService, configService: ConfigService, jwtService: JwtService);
    login(rawToken: string): Promise<{
        refreshToken: string;
        accessToken: string;
    }>;
    register(rawToken: string, registerDto: RegisterDto): Promise<User>;
    parseBasicToken(rawToken: string): {
        email: string;
        password: string;
    };
    authenticate(email: string, password: string): Promise<User>;
    makeToken(user: {
        id: number;
        nickname: string;
    }, isRefreshToken: boolean): Promise<string>;
}
