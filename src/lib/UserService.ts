import { User } from "./User";
import { Users } from "../datastore/Users";

export default class UserService {
  public async getUserByGarminUserId(garminUserId: string): Promise<User | undefined> {
    return Users.find((user) => user.garminUserId === garminUserId);
  }
}
