import { getRepository } from "typeorm";
import { Repository } from "typeorm/repository/Repository";

import { IFindUserWithGamesDTO, IFindUserByFullNameDTO } from "../../dtos";
import { User } from "../../entities/User";
import { IUsersRepository } from "../IUsersRepository";

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findUserWithGamesById({
    user_id,
  }: IFindUserWithGamesDTO): Promise<User> {
    const user = await this.repository.findOneOrFail({
      relations: ["games"],
      where: { id: user_id },
    });

    return user;
  }

  async findAllUsersOrderedByFirstName(): Promise<User[]> {
    return await this.repository.query(
      "select * from users order by first_name"
    );
  }

  async findUserByFullName({
    first_name,
    last_name,
  }: IFindUserByFullNameDTO): Promise<User[] | undefined> {
    return await this.repository.query(
      `select * from users where lower(first_name) = lower('${first_name}') and lower(last_name) = lower('${last_name}')`
    );
  }
}
