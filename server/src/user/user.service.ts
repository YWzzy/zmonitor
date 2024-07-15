import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, Like, Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./entities/user.entity";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) {}
  create(createUserDto: CreateUserDto) {
    const data = new User();
    data.name = createUserDto.name;
    data.desc = createUserDto.desc;
    return this.userRepository.save(data);
  }

  async findUserByAccount(account: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { account } });
  }

  async findUserById(id: number): Promise<User | undefined> {
    const options: FindOneOptions<User> = {
      where: { id },
    };
    return this.userRepository.findOne(options);
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const newUser = this.userRepository.create(createUserDto);
    return this.userRepository.save(newUser);
  }

  async findAll(query: { keyWord: string; page: number; pageSize: number }) {
    const data = await this.userRepository.find({
      where: {
        name: Like(`%${query.keyWord}%`),
      },
      // order: {
      //   id: "DESC",
      // },
      // skip: (query.page - 1) * query.pageSize,
      // take: query.pageSize,
    });
    const total = await this.userRepository.count({
      where: {
        name: Like(`%${query.keyWord}%`),
      },
    });
    return {
      data,
      total,
    };
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(id, updateUserDto);
  }

  remove(id: string) {
    return this.userRepository.delete(id);
  }
}
