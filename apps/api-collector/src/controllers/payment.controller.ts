// Uncomment these imports to begin using these cool features!

import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {get, post, Request, RestBindings} from '@loopback/rest';
import {PaymentOrderRepository} from '../repositories';

export class PaymentController {
  constructor(
    @inject(RestBindings.Http.REQUEST) private req: Request,
    @repository(PaymentOrderRepository)
    private paymentOrderModel: PaymentOrderRepository,
  ) {}
  @post('/payment/order')
  async createPaymentOrder() {}

  @get('/payment/order')
  async getPaymentOrder() {}
}
