// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { Client } from 'pg';
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const pgClient = new Client({
    host: process.env.PG_HOST,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
  });
  await pgClient.connect();
  const { id } = req.query;
  const query = `UPDATE events
  SET claimed = true
  WHERE id = ${parseInt(id as string)}`;
  try {
    const data = await pgClient.query(query);
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
  }
}
