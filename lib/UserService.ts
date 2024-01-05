import { IActivity } from "garmin-connect/dist/garmin/types";
import clientPromise from "./mongodb";
import { User } from "./User";
import { Users } from "../datastore/Users";

export default class ActivityService {
  public async getUserByGarminUserId(garminUserId: string): Promise<User | undefined> {
    return Users.find((user) => user.garminUserId === garminUserId);
  }
}
