import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { AuthCredentialsDto } from './auth-credentials.dto';
import { JwtPayload } from './jwt-payload';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from './user.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserRepository) private userRepo: UserRepository,
        private jwtService: JwtService,
    ) {
    }

    async signUp(user: UserDto): Promise<void> {
        return this.userRepo.signUp(user);
    }

    async signIn(authCredentials: AuthCredentialsDto): Promise<string | null> {
        const username = await this.userRepo.signIn(authCredentials);

        if (!username) {
            throw new UnauthorizedException('Invalid username or password');
        }

        const payload: JwtPayload = { username };
        const accessToken = await this.jwtService.signAsync(payload);

        return accessToken;
    }
}
