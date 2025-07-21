import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async login(rawToken: string) {
    }

    async authenticate(email: string, password: string) {
        const user = await this.userRepository.findOne({
            where: {
                email,
            },
        });

        if (!user) {
            throw new UnauthorizedException('해당 이메일의 사용자가 없습니다.');
        }

        const passOk = await bcrypt.compare(password, user.password);

        if (!passOk) {
            throw new UnauthorizedException('비밀번호가 잘못되었습니다.');
        }

        return user;
    }
}
