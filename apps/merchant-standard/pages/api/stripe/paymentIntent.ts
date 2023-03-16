// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { vaultsServices } from '../../../src/services/vaults.services';
import { verifyApiKey } from '../../../src/utils/api';
import NextCors from 'nextjs-cors';
import { userServices } from '../../../src/services/users.services';
import { Stripe } from 'stripe';
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await NextCors(req, res, {
    // Options
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    origin: '*',
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  });
  const apiKey = req.headers.apikey;

  if (!apiKey || apiKey instanceof Array)
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'You must provide an API key',
    });
  if (req.method === 'POST') {
    // POST /api/stripe/create-payment-intent
    // Get a vault by id
    const { valid, error, session } = verifyApiKey(apiKey);
    if (!valid || !session)
      return res.status(401).json({
        error: 'Unauthorized',
        message: error,
      });
    try {
      const user = await userServices.getUserById(session.userId);
      const creditCard = user.plugins?.find(
        (plugin) => plugin.id === 'creditCard'
      );
      if (!user.plugins || !creditCard || !creditCard.auth)
        return res.status(400).json({
          error: 'Bad request',
        });
      const { amount } = req.body;
      const stripe = new Stripe(creditCard.auth.apiSecret, {
        apiVersion: '2022-11-15',
      });
      const paymentIntent = await stripe.paymentIntents.create({
        amount: parseInt(amount),
        currency: 'usd',
        payment_method_types: ['card'],
      });
      res.status(200).send({
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error) {
      if (
        (error as any).type &&
        (error as any).type === 'StripeInvalidRequestError'
      ) {
        let stripeError = error as Stripe.errors.StripeInvalidRequestError;
        return res.status(400).json({
          error: stripeError.message,
        });
      } else {
        return res.status(404).json({
          error,
        });
      }
    }
  }
}
