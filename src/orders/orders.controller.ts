// order.controller.ts
import { Controller, Post, Get, Delete, Param, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Order, Bot } from './order.interface';

@Controller('orders')
export class OrdersController {
  constructor(private readonly orderService: OrdersService) {}

  @Post()
  createOrder(@Query('memberType') memberType: string): Order {
    memberType = memberType.toLowerCase();
    if (memberType !== 'normal' && memberType !== 'vip') {
      throw new Error('Invalid order type');
    }
    
    return this.orderService.createOrder(memberType as 'normal' | 'vip');
  }

  @Get('')
  getAllOrders(): Order[] {
    return this.orderService.getAllOrders();
  }

  @Get('bots')
  getBots(): Bot[] {
    return this.orderService.getBots();
  }

  @Post('bots')
  addBot(): Bot {
    return this.orderService.addBot();
  }

  @Delete('bots')
  removeBot(): Bot | undefined {
    return this.orderService.removeBot();
  }

  @Delete('')
  removeOrders(): String {
    return 'All Orders Deleted';
  }
}
