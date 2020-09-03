import { EntityRepository, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { AuthCredentialsDto } from './auth-credentials.dto';
import { UserDto } from './user.dto';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';

@EntityRepository(User)
export class UserRepository extends Repository<User> {

    async signUp(userDto: UserDto): Promise<void> {
        const { firstName, lastName, username, password, email } = userDto;
        const user = new User();
        user.firstName = firstName;
        user.lastName = lastName;
        user.username = username;
        user.password = password;
        user.email = email;

        try {
            await user.save();
        } catch (error) {
            const duplicatedUsername = '23505';
            if (error.code === duplicatedUsername) {
                throw new ConflictException('Username or email already exist');
            } else {
                throw new InternalServerErrorException(error.message);
            }
        }
    }

    async signIn(authCredentials: AuthCredentialsDto): Promise<string | null> {
        const { username, password } = authCredentials;
        const user = await this.findOne({ username });

        if (!user) {
            return null;
        }

        const isValidPassword = await this.validatePassword(password, user.password);

        if (isValidPassword) {
            return user.username;
        } else {
            return null;
        }
    }

    private async validatePassword(candidatePassword: string, password: string): Promise<boolean> {
        return await bcrypt.compare(candidatePassword, password);
    }
}
