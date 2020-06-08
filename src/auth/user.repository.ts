import { EntityRepository, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { AuthCredentialsDto } from './auth-credentials.dto';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';

@EntityRepository(User)
export class UserRepository extends Repository<User> {

  async signUp(authCredentials: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentials;
    const user = new User();
    user.username = username;
    user.password = password;

    try {
      await user.save();
    } catch (error) {
      const duplicateUsername = '23505';
      if (duplicateUsername) {
        throw new ConflictException('Username already exist');
      } else {
        throw new InternalServerErrorException(error.message);
      }
    }
  }

  async signIn(authCredentials: AuthCredentialsDto): Promise<string | null>  {
    const { username, password } = authCredentials;
    const user = await this.findOne({ username });
    const isValidPassword = await this.validatePassword(password, user.password);

    if (user && isValidPassword) {
      return user.username;
    } else {
      return null;
    }
  }

  private async validatePassword(candidatePassword: string, password): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, password);
  }
}
