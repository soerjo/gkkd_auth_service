import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserRepository } from '../repository/user.repository';
import { FilterDto } from '../dto/filter.dto';
import { encryptPassword } from 'src/utils/hashing.util';

@Injectable()
export class UserService implements OnApplicationBootstrap {
  constructor(private readonly userRepository: UserRepository) {}

  async onApplicationBootstrap() {
    const superadmin = await this.getByUsername('superadmin');
    if (!superadmin) {
      await this.create({
        name: 'superadmin',
        email: 'superadmin@mail.com',
        password: 'Asdf1234.',
      });
    }
  }

  getByUsername(name: string) {
    return this.userRepository.findOneBy({ name });
  }

  getByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }

  getByUsernameOrEmail(usernameOrEmail: string) {
    return this.userRepository.findOne({
      where: [{ name: usernameOrEmail }, { email: usernameOrEmail }],
    });
  }

  create(createUserDto: CreateUserDto) {
    const newUser = this.userRepository.create({
      ...createUserDto,
      password: encryptPassword(createUserDto.password),
    });

    return this.userRepository.save(newUser);
  }

  getAll(filter: FilterDto) {
    return this.userRepository.getUser(filter);
  }

  findOne(id: string) {
    return this.userRepository.findOneBy({ id });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    if (!user) throw new BadRequestException({ message: 'user is not found!' });
    if (user.name === 'superadmin') throw new ForbiddenException();

    const updateUser = await this.userRepository.save({
      ...user,
      ...updateUserDto,
    });

    return updateUser.id;
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    if (!user) throw new BadRequestException({ message: 'user is not found!' });

    await this.userRepository.softRemove(user);

    return user.id;
  }
}
