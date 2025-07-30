import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

export class JwtAuthGuard extends AuthGuard('jwt') {}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      // HTTP 요청의 Authorization 헤더에서 Bearer 토큰을 추출
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // JWT 토큰 만료 여부를 검사 (false면 만료된 토큰은 거부)
      ignoreExpiration: false,
      // JWT 토큰 검증에 사용할 시크릿 키 (.env 파일에서 가져옴)
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  validate(payload: any) {
    return payload;
  }
}
