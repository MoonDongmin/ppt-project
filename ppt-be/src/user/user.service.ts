import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = await this.userRepository.findOne({
      where: {
        email: createUserDto.email,
      },
    });

    if (user) {
      throw new BadRequestException(`존재하는 사용자 입니다.`);
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    await this.userRepository.save({
      ...createUserDto,
      password: hashedPassword,
    });

    return this.userRepository.findOne({
      where: {
        email: createUserDto.email,
      },
    });
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException(`존재하지 않는 사용자 입니다.`);
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException(`존재하지 않는 사용자 입니다.`);
    }

    await this.userRepository.update(
      {
        id,
      },
      {
        ...updateUserDto,
      },
    );

    return this.userRepository.findOne({
      where: {
        id,
      },
    });
  }

  async remove(id: number) {
    const user = this.userRepository.findOne({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException(`존재하지 않는 사용자 입니다.`);
    }

    await this.userRepository.delete(id);
  }
}
