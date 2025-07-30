import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register-dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async login(rawToken: string) {
    const { email, password } = this.parseBasicToken(rawToken);

    const user = await this.authenticate(email, password);

    return {
      refreshToken: await this.makeToken(user, true),
      accessToken: await this.makeToken(user, false),
    };
  }

  async register(rawToken: string, registerDto: RegisterDto) {
    const { email, password } = this.parseBasicToken(rawToken);

    return this.userService.create({
      ...registerDto,
      email,
      password,
    });
  }

  parseBasicToken(rawToken: string) {
    const basicSplit = rawToken.split(' ');

    if (basicSplit.length !== 2) {
      throw new UnauthorizedException('잘못된 토큰 형식입니다.');
    }

    const [basic, token] = basicSplit;

    if (basic.toLowerCase() !== 'basic') {
      throw new BadRequestException('잘못된 토큰 형식입니다.');
    }

    const decoded = Buffer.from(token, 'base64').toString('utf-8');

    const tokenSplit = decoded.split(':');
    if (tokenSplit.length !== 2) {
      throw new BadRequestException('잘못된 토큰 형식입니다.');
    }

    const [email, password] = tokenSplit;

    return {
      email,
      password,
    };
  }

  async authenticate(email: string, password: string) {
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
      select: {
        password: true,
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

  async makeToken(
    user: { id: number; nickname: string },
    isRefreshToken: boolean,
  ) {
    const refreshTokenSecret = this.configService.get<string>('JWT_REFRESH');
    const accessTokenSecret = this.configService.get<string>('JWT_ACCESS');

    return this.jwtService.signAsync(
      {
        sub: user.id,
        nickname: user.nickname,
        type: isRefreshToken ? 'refresh' : 'access',
      },
      {
        secret: isRefreshToken ? refreshTokenSecret : accessTokenSecret,
        expiresIn: isRefreshToken ? '24h' : '1h',
      },
    );
  }
}
