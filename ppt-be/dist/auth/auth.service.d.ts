import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
export declare class AuthService {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    login(rawToken: string): Promise<void>;
    authenticate(email: string, password: string): Promise<User>;
}
