"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../user/entities/user.entity");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcrypt");
const user_service_1 = require("../user/user.service");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
let AuthService = class AuthService {
    constructor(userRepository, userService, configService, jwtService) {
        this.userRepository = userRepository;
        this.userService = userService;
        this.configService = configService;
        this.jwtService = jwtService;
    }
    async login(rawToken) {
        const { email, password } = this.parseBasicToken(rawToken);
        const user = await this.authenticate(email, password);
        return {
            refreshToken: await this.makeToken(user, true),
            accessToken: await this.makeToken(user, false),
        };
    }
    async register(rawToken, registerDto) {
        const { email, password } = this.parseBasicToken(rawToken);
        return this.userService.create({
            ...registerDto,
            email,
            password,
        });
    }
    parseBasicToken(rawToken) {
        const basicSplit = rawToken.split(' ');
        if (basicSplit.length !== 2) {
            throw new common_1.UnauthorizedException('잘못된 토큰 형식입니다.');
        }
        const [basic, token] = basicSplit;
        if (basic.toLowerCase() !== 'basic') {
            throw new common_1.BadRequestException('잘못된 토큰 형식입니다.');
        }
        const decoded = Buffer.from(token, 'base64').toString('utf-8');
        const tokenSplit = decoded.split(':');
        if (tokenSplit.length !== 2) {
            throw new common_1.BadRequestException('잘못된 토큰 형식입니다.');
        }
        const [email, password] = tokenSplit;
        return {
            email,
            password,
        };
    }
    async authenticate(email, password) {
        const user = await this.userRepository.findOne({
            where: {
                email,
            },
            select: {
                password: true,
            },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('해당 이메일의 사용자가 없습니다.');
        }
        const passOk = await bcrypt.compare(password, user.password);
        if (!passOk) {
            throw new common_1.UnauthorizedException('비밀번호가 잘못되었습니다.');
        }
        return user;
    }
    async makeToken(user, isRefreshToken) {
        const refreshTokenSecret = this.configService.get('JWT_REFRESH');
        const accessTokenSecret = this.configService.get('JWT_ACCESS');
        return this.jwtService.signAsync({
            sub: user.id,
            nickname: user.nickname,
            type: isRefreshToken ? 'refresh' : 'access',
        }, {
            secret: isRefreshToken ? refreshTokenSecret : accessTokenSecret,
            expiresIn: isRefreshToken ? '24h' : '1h',
        });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        user_service_1.UserService,
        config_1.ConfigService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map