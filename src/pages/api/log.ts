import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    console.log(req.body); // Hier kannst du die Log-Daten sehen oder in einer Datei/Datenbank speichern.
    res.status(200).json({ status: 'Success', message: 'Log received' });
  } else {
    // Nicht unterstützte Methode
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}