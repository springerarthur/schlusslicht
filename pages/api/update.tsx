import type { NextApiRequest, NextApiResponse } from 'next';
import GarminConnectSync from '../../src/lib/GarminConnectSync';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const garminConnectSync = new GarminConnectSync();
  await garminConnectSync.importDataFromGarminConnect(true);

  response.status(200).json({});
}
