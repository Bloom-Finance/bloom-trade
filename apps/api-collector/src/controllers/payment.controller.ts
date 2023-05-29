import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
  get,
  HttpErrors,
  param,
  post,
  put,
  Request,
  requestBody,
  RestBindings,
} from '@loopback/rest';
import {PaymentOrderRepository} from '../repositories';
import {ApiResponse} from '../@types';
import {PaymentOrder} from '../models';

interface PaymentRequest {
  type: 'crypto' | 'creditCard';
  status: 'processing' | 'completed' | 'failed' | 'cancelled' | 'idle';
}

export class PaymentController {
  private FRONTEND = process.env.FRONTEND as string;
  constructor(
    @inject(RestBindings.Http.REQUEST) private req: Request,
    @repository(PaymentOrderRepository)
    private paymentOrderModel: PaymentOrderRepository,
  ) {}

  // @authenticate()
  @post('/payment/order')
  async createPaymentOrder(
    @requestBody() paymentRequest: PaymentRequest,
  ): Promise<
    ApiResponse<{
      link: string;
      paymentOrder: PaymentOrder;
    }>
  > {
    const newPaymentOrder = await this.paymentOrderModel.create({
      type: paymentRequest.type,
      status: 'idle',
      iat: Date.now(),
    });
    //create link to payment gateway
    return {
      data: {
        link: this.FRONTEND + '/' + newPaymentOrder.id,
        paymentOrder: newPaymentOrder,
      },
      message: 'Payment order created',
      status: 200,
    };
  }

  @put('/payment/order/${id]')
  async completePaymentOrder() {}

  @get('/payment/user')
  async retrieveMerchantInfo() {}

  @get('/payment/order/${id}')
  async getPaymentOrder(@param.path.string('id') id: number) {
    const paymentOrder = this.paymentOrderModel.findById(id);
    if (!paymentOrder) {
      throw new HttpErrors.NotFound('Payment order not found');
    }
    return paymentOrder;
  }
}
