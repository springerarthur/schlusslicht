import { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable-serverless";
import CertificateService from "../../../lib/RaceResultsService";
import { RaceResult } from "../../../types/RaceResult";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function saveRaceResult(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Methode nicht erlaubt" });
  }

  const form = new formidable.IncomingForm();
  form.uploadDir = "./public/certificates";
  form.keepExtensions = true;
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: "Fehler beim Parsen der Daten" });
    }

    const certificateService = new CertificateService();
    const raceResult: RaceResult = {
      userId: fields.userId,
      name: fields.event,
      sportType: fields.sport,
      date: new Date(fields.date),
      certificatePath: files?.certificate?.path.replace("public\\", ""),
    };
    certificateService.saveRaceResult(raceResult);

    res.status(200).json({ message: "Upload erfolgreich" });
  });
}
