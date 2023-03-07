// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { vaultsServices } from '../../../src/services/vaults.services';
import { verifyApiKey } from '../../../src/utils/api';
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const apiKey = req.headers.authorization?.split(' ')[1];
  if (!apiKey)
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'You must provide an API key',
    });
  if (req.method === 'GET') {
    // GET /api/vault/:id
    // Get a vault by id
    const { valid, error, session } = verifyApiKey(apiKey);
    if (!valid || !session)
      return res.status(401).json({
        error: 'Unauthorized',
        message: error,
      });
    try {
      const vault = await vaultsServices.getVaultsByUserId(session.userId);
      return res.status(200).json({
        ...vault,
      });
    } catch (error) {
      return res.status(404).json({
        error: 'Not found',
      });
    }
  }
}
