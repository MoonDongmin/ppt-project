import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
export declare class AuthService {
    private readonly userRepository;
    private readonly userService;
    constructor(userRepository: Repository<User>, userService: UserService);
    login(rawToken: string): Promise<{
        user: string;
    }>;
    register(rawToken: string): Promise<User>;
    parseBasicToken(rawToken: string): {
        email: string;
        password: string;
    };
    authenticate(email: string, password: string): Promise<User>;
}
