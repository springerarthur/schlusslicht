// import type { NextApiRequest, NextApiResponse } from 'next';
 
// export default async function handler(
//   request: NextApiRequest,
//   response: NextApiResponse,
// ) {
//   const result = await fetch(
//     'http://worldtimeapi.org/api/timezone/America/Chicago',
//   );
//   const data = await result.json();

//   console.log(data);
 
//   return response.json({ datetime: data.datetime });
// }
export default function handler(req, res) {
  console.log("Hello Cron.");
  res.status(200).end('Hello Cron!');
}