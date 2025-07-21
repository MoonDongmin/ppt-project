import { Injectable } from "@nestjs/common";
import { Strategy } from "passport-local";
import { AuthService } from "../auth.service";
import { User } from "src/user/entities/user.entity";
import { AuthGuard, PassportStrategy } from "@nestjs/passport";

export class LocalAuthGuard extends AuthGuard('local') { }

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
    constructor(
        private readonly authService: AuthService,
    ) {
        super({
            usernameField: 'email',
        });
    }

    async validate(email: string, password: string): Promise<User> {
        const user = await this.authService.authenticate(email, password);

        return user;
    }
}