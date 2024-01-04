import { IActivity } from "garmin-connect/dist/garmin/types";
import clientPromise from "./mongodb";
import IUser from "./IUser";
import { Users } from "../datastore/Users";

export default class ActivityService {
  public async getUserByGarminUserId(garminUserId: string): Promise<IUser | undefined> {
    return Users.find((user) => user.garminUserId === garminUserId);
  }
}
