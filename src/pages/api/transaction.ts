import type { NextApiRequest, NextApiResponse } from "next";

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  res.status(200).json({ success: true });
}
