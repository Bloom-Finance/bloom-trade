// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const secret: string = process.env.JWT_SECRET as string;
  /* It's getting the idToken from the request. */
  const payload = req.body.payload;
  const token = jwt.sign(payload, secret, { expiresIn: '30d' });
  try {
    return res.status(200).json({
      token: token,
    });
  } catch (error) {
    res.status(500).json({ error: 'Couldnt generate token' });
  }
}
