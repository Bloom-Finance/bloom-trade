// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import type { NextApiRequest, NextApiResponse } from 'next';
import * as jose from 'jose';
import jwt from 'jsonwebtoken';
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const secret = process.env.JWT_SECRET as string;
  /* It's getting the idToken from the request. */
  const idToken = req.headers.authorization?.split(' ')[1];
  const { bloom, type } = req.query;
  console.log(idToken);
  if (!idToken) return res.status(400).json({ isValid: false, payload: null });
  const jwks = jose.createRemoteJWKSet(
    new URL(
      type === 'web3'
        ? 'https://authjs.web3auth.io/jwks'
        : 'https://api.openlogin.com/jwks'
    )
  );
  try {
    if (bloom) {
      const decoded = jwt.verify(idToken, secret);
      return res.status(200).json({ isValid: true, payload: decoded });
    }
    const { payload } = await jose.jwtVerify(idToken, jwks, {
      algorithms: ['ES256'],
    });
    return res.status(200).json({ isValid: true, payload });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ isValid: false, payload: null });
  }
}
