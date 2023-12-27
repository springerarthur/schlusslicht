import type { NextApiRequest, NextApiResponse } from 'next';
import { IActivity } from 'garmin-connect/dist/garmin/types';
import clientPromise from '../../lib/mongodb';
import GarminConnect from '../../lib/GarminConnect';

const arthurGarminId = 'Springer.arthur';
const waldiGarminId = 'f8d6b455-0aec-4c46-b3e1-5621cac1719f';
const danielGarminId = '6d29db1b-2cc2-4d32-b63c-479a1fa38471';
const rolandGarminId = '97e62216-5e5d-42b2-a7d1-f9452a5363b4';

const alexHGarminId = '1690439f-a46f-4079-9709-33ffa337c80c';
const alexSGarminId = 'skipper2193';
const janGarminId = '20434747-96b2-4592-be63-6cf0c93d42ce';
const thomasGarminId = 'b936a5d7-ed2f-4ca6-a535-25e6d25707bc';

const getActivitiesUrl = "https://connectapi.garmin.com/activitylist-service/activities/";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const GCClient = new GarminConnect({
    username: process.env.GARMIN_EMAIL + "",
    password: process.env.GARMIN_PWD + ""
  });
  await GCClient.login();

  await addActivitiesIfNotExists(GCClient, arthurGarminId);
  await addActivitiesIfNotExists(GCClient, waldiGarminId);
  await addActivitiesIfNotExists(GCClient, danielGarminId);
  await addActivitiesIfNotExists(GCClient, rolandGarminId);

  await addActivitiesIfNotExists(GCClient, alexHGarminId);
  await addActivitiesIfNotExists(GCClient, alexSGarminId);
  // await addActivitiesIfNotExists(GCClient, janGarminId);
  await addActivitiesIfNotExists(GCClient, thomasGarminId);

  response.status(200).json({});
}

async function addActivitiesIfNotExists(GCClient: GarminConnect, garminConnectUserId: string) {
  const activitiesFromGarmin = await GCClient.getActivitiesForUser(garminConnectUserId, 0, 15);
  
  for (const activityFromGarmin of activitiesFromGarmin) {
    // sportTypeId
    // 1 => Laufen
    // 2 => Fahrrad
    // 5 => Schwimmen
    if(activityFromGarmin.sportTypeId !== 1 && activityFromGarmin.sportTypeId !== 2 && activityFromGarmin.sportTypeId !== 5) {
      continue;
    }

    const activitiesFromDb = await getActivitiesFromMongoDb();

    if (activitiesFromDb.some(activityFromDb => activityFromDb.activityId == activityFromGarmin.activityId)) {
      continue;
    }

    const garminStartDate = new Date(activityFromGarmin.startTimeLocal);
    if (garminStartDate.getFullYear() === 2023 && garminStartDate.getMonth()+1 === 12) {
      await insertActivityToMongoDb(activityFromGarmin);
    }
  }
}

async function getActivitiesFromMongoDb(): Promise<IActivity[]> {
  const mongoDbClient = await clientPromise;

  return await mongoDbClient
    .db("schlusslicht")
    .collection<IActivity>("activities")
    .find()
    .toArray();
}

async function insertActivityToMongoDb(activity: IActivity) {
  const mongoDbClient = await clientPromise;

  return await mongoDbClient
    .db("schlusslicht")
    .collection<IActivity>("activities")
    .insertOne(activity);
}
