import { Controller, Post, Get, Delete, Param, Query } from '@nestjs/common';
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
      const response: OrderResponse = { status: 'success', statusCode: 200, order, message: 'Order created successfully' };
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
    const response: OrderResponse = { status: 'success', statusCode: 200, orders };
    //console.log('Response:', response);
    return response;
  }

  @Get('bots')
  getBots(): OrderResponse {
    const bots = this.orderService.getBots();
    const response: OrderResponse = { status: 'success', statusCode: 200, bots };
    //console.log('Response:', response);
    return response;
  }

  @Post('bots')
  addBot(): OrderResponse {
    const bot = this.orderService.addBot();
    const response: OrderResponse = { status: 'success', statusCode: 201, bot, message: 'Bot added successfully' };
    //console.log('Response:', response);
    return response;
  }

  @Delete('bots')
  removeBot(): OrderResponse {
    const bot = this.orderService.removeBot();
    const response: OrderResponse = { status: 'success', statusCode: 200, bot, message: 'Bot removed successfully' };
    //console.log('Response:', response);
    return response;
  }

  @Delete('')
  removeOrders(): OrderResponse {
    this.orderService.removeAllOrders();
    const response: OrderResponse = { status: 'success', statusCode: 200, message: 'All orders deleted successfully' };
    //console.log('Response:', response);
    return response;
  }
}
