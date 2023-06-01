import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  HttpErrors,
  param,
  post,
  Request,
  requestBody,
  response,
  RestBindings,
} from '@loopback/rest';
import {OrderRepository} from '../repositories';
import {ApiResponse} from '../@types';
import {Order} from '../models';
export class OrderController {
  private FRONTEND = process.env.PAYMENT_GATEAWAY as string;
  constructor(
    @inject(RestBindings.Http.REQUEST) private req: Request,
    @repository(OrderRepository)
    private orderModel: OrderRepository,
  ) {}

  @post('/order')
  @response(200, {
    description: 'PaymentRequestOrder created',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
            },
            data: {
              type: 'object',
              properties: {
                link: {
                  type: 'string',
                },
                paymentOrder: {
                  type: 'object',
                  properties: {
                    uid: {
                      type: 'string',
                    },
                    type: {
                      type: 'string',
                    },
                    total: {
                      type: 'object',
                      properties: {
                        details: {
                          type: 'object',
                          properties: {
                            items: {
                              type: 'array',
                              items: {
                                type: 'object',
                                properties: {
                                  description: {
                                    type: 'string',
                                  },
                                  amount: {
                                    type: 'number',
                                  },
                                },
                              },
                            },
                            taxes: {
                              type: 'array',
                              items: {
                                type: 'object',
                                properties: {
                                  description: {
                                    type: 'string',
                                  },
                                  amount: {
                                    type: 'number',
                                  },
                                },
                              },
                            },
                          },
                        },
                        amount: {
                          type: 'number',
                        },
                      },
                    },
                  },
                },
              },
            },
            status: {
              type: 'number',
            },
          },
        },
      },
    },
  })
  async createPaymentRequestOrder(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Order, {
            title: 'NewPaymentRequestOrder',
            exclude: ['_id', 'status', 'iat', 'destination', 'uid', 'from'],
          }),
        },
      },
    })
    paymentRequest: {
      type: 'crypto' | 'creditCard';
      total: {
        details?: {
          items?: {
            description: string;
            amount: number;
          }[];
          taxes?: {
            description: string;
            amount: number;
          }[];
        };
        amount: number;
      };
    },
  ): Promise<
    ApiResponse<{
      link: string;
      paymentOrder: Order;
    }>
  > {
    const featuresPreparedToQuery = JSON.stringify(paymentRequest.total)
      .replace('[', '{')
      .replace(']', '}');
    const newPaymentOrder = await this.orderModel.create({
      type: paymentRequest.type,
      total: featuresPreparedToQuery as any,
    });
    //create link to payment gateway
    return {
      data: {
        link: this.FRONTEND + '/' + newPaymentOrder.uid,
        paymentOrder: newPaymentOrder,
      },
      message: 'Payment order request created',
      status: 200,
    };
  }

  // @put('/payment/order/${id]')
  // async completePaymentOrder() {}

  // @get('/payment/user')
  // async retrieveMerchantInfo() {}

  @get('/order/{id}')
  async getOrder(
    @param.path.string('id') id: number,
  ): Promise<ApiResponse<Order>> {
    const paymentOrder = await this.orderModel.findOne({
      where: {
        uid: id,
      },
    });
    if (!paymentOrder) {
      throw new HttpErrors.NotFound('Payment order not found');
    }
    return {
      data: paymentOrder,
      message: 'Payment order found',
      status: 200,
    };
  }
}
