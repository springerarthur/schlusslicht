import IUser from "../lib/IUser";
import { AlexH, AlexS, Arthur, Daniel, Jan, Roland, Thomas, Waldi } from "./Users"

export const Team1: IUser[] = [
    Arthur,
    Daniel,
    Roland,
    Waldi,
];
export function isInTeam1(garminUserId: string): boolean {
    return Team1.find(user => user.garminUserId === garminUserId) !== undefined;
};

export const Team2: IUser[] = [
    AlexH,
    AlexS,
    Thomas,
    Jan,
];
export function isInTeam2(garminUserId: string): boolean {
    return Team2.find(user => user.garminUserId === garminUserId) !== undefined;
};