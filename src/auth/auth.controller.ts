import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from './user.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('signup')
    @UsePipes(ValidationPipe)
    signUp(@Body() user: UserDto): Promise<void> {
        return this.authService.signUp(user);
    }

    @Post('signin')
    async signIn(@Body(ValidationPipe) authCredentials): Promise<{ accessToken }> {
        const accessToken = await this.authService.signIn(authCredentials);
        return { accessToken };
    }
}
