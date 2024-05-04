import { Controller, Post, Get, Delete, Param, Query, Render } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Order, Bot, OrderResponse } from './order.interface';

@Controller('orders')
export class OrdersController {
  constructor(private readonly orderService: OrdersService) {}

  @Post()
  createOrder(@Query('memberType') memberType: string): OrderResponse {
    try {
      memberType = memberType.toLowerCase();
      if (memberType !== 'normal' && memberType !== 'vip') {
        throw new Error('Invalid order type');
      }
      
      const order = this.orderService.createOrder(memberType as 'normal' | 'vip');
      const response: OrderResponse = order;
      //console.log('Response:', response);
      return response;
    } catch (error) {
      const response: OrderResponse = { status: 'error', statusCode: 400, error: error.message };
      //console.log('Response:', response);
      return response;
    }
  }

  @Get('')
  getAllOrders(): OrderResponse {
    const orders = this.orderService.getAllOrders();
    return orders;
  }

  @Get('bots')
  getBots(): OrderResponse {
    const bots = this.orderService.getBots();
    return bots;
  }

  @Post('bots')
  addBot(): OrderResponse {
    const bot = this.orderService.addBot();
    return bot;
  }

  @Delete('bots')
  removeBot(): OrderResponse {
    const bot = this.orderService.removeBot();
    return bot;
  }

  @Delete('')
  removeOrders(): OrderResponse {
    this.orderService.removeAllOrders();
    const response: OrderResponse = { status: 'success', statusCode: 200, message: 'All orders deleted successfully' };
    //console.log('Response:', response);
    return response;
  }
}
