import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../lib/mongodb'
import ActivityService from '../../lib/ActivityService';

export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse,
) {
    const activityService = new ActivityService();

    const activities = activityService.getActivities();

    await new Promise(f => setTimeout(f, 5000));

    response.status(200).json(JSON.parse(JSON.stringify(activities)));
}