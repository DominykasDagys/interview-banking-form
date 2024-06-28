import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function GET(req: NextApiRequest, res: NextApiResponse) {
  const iban = req.query.iban as string;

  if (!iban) res.status(400).json({ message: "IBAN missing" });
  try {
    const response = await axios.get(`https://matavi.eu/validate?iban=${iban}`);

    res.status(200).json({ valid: response.data.valid });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}
