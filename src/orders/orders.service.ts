// order.service.ts
import { Injectable } from '@nestjs/common';
import { Order, OrderStatus, Bot, BotStatus, OrderResponse } from './order.interface';
import { HttpStatus } from '@nestjs/common';

@Injectable()
export class OrdersService {
  private orders: Order[] = [];
  private bots: Bot[] = [];
  private orderIdCounter = 1;
  private botIdCounter = 1;

  getAllOrders(): OrderResponse {
    try {
      return { status: 'success', statusCode: HttpStatus.OK, orders: this.orders, message: this.orders.length === 0 ? 'No Orders Available' : undefined };
    } catch (error) {
      return { status: 'error', statusCode: HttpStatus.BAD_REQUEST, error: error };

    }

  }

  getBots(): OrderResponse {
    try {
      return { status: 'success', statusCode: HttpStatus.OK, bots: this.bots, message: this.bots.length == 0 ? 'No bots available.' : undefined };
    } catch (error) {
      return { status: 'error', statusCode: HttpStatus.BAD_REQUEST, error: error };
    }
  }


  createOrder(memberType: 'normal' | 'vip'): OrderResponse {
    try {
      const order: Order = {
        id: this.orderIdCounter++,
        memberType,
        orderStatus: OrderStatus.PENDING,
      };
      if (memberType === 'vip') {
        const index = this.orders.findIndex(order => order.memberType === 'normal');
        if (index !== -1) {
          this.orders.splice(index, 0, order);
        } else {
          this.orders.push(order);
        }
      } else {
        this.orders.push(order);
      }

      const idleBot = this.bots.find(bot => bot.botStatus === BotStatus.IDLE);
      if (idleBot) {
        this.processOrder(idleBot.id);
      }
      const response: OrderResponse = { status: 'success', statusCode: HttpStatus.CREATED, order, message: 'Order Created Successfully.' };
      return response;
    } catch (error) {
      const response: OrderResponse = { status: 'error', statusCode: HttpStatus.BAD_REQUEST, error };
      return response;
    }
  }

  processOrder(botId: number): Order | undefined {
    try {
      const bot = this.bots.find((b) => b.id === botId);
      if (!bot) return;

      const orderIndex = this.orders.findIndex(
        (order) => order.orderStatus === OrderStatus.PENDING
      );

      if (orderIndex !== -1) {
        const order = this.orders[orderIndex];
        order.orderStatus = OrderStatus.COOKING;
        order.cookingBotId = botId;
        bot.botStatus = BotStatus.PROCESSING;
        setTimeout(() => {
          order.orderStatus = OrderStatus.COMPLETE;
          bot.botStatus = BotStatus.IDLE;
          order.cookingBotId = undefined;
          this.checkForPendingOrders();
        }, 10000);
        return order;
      }

      return undefined;
    } catch (error) {
      console.log(error)
      return undefined;
    }

  }




  addBot(): OrderResponse {
    try {
      const bot: Bot = {
        id: this.botIdCounter++,
        botStatus: BotStatus.IDLE,
      };
      this.bots.push(bot);
      this.startBot(bot.id);
      const response: OrderResponse = { status: 'success', statusCode: HttpStatus.CREATED, bot, message: 'Bot Created Successfully.' };
      return response;
    } catch (error) {
      const response: OrderResponse = { status: 'error', statusCode: HttpStatus.BAD_REQUEST, error };
      return response;
    }

  }

  startBot(botId: number): void {
    const bot = this.bots.find((b) => b.id === botId);
    if (!bot) return;

    this.checkForPendingOrders();
  }

  checkForPendingOrders(): void {
    this.bots.forEach((bot) => {
      if (bot.botStatus === BotStatus.IDLE) {
        const pendingOrder = this.orders.find((order) => order.orderStatus === OrderStatus.PENDING);
        if (pendingOrder) {
          this.processOrder(bot.id);
        }
      }
    });
  }


  removeBot(): OrderResponse {
    try {
      const bot = this.bots.pop();
      if (bot) {
        const cookingOrderIndex = this.orders.findIndex(order => order.orderStatus === OrderStatus.COOKING && order.cookingBotId === bot.id);
        if (cookingOrderIndex !== -1) {
          const cookingOrder = this.orders[cookingOrderIndex];
          cookingOrder.orderStatus = OrderStatus.PENDING;
          cookingOrder.cookingBotId = undefined;
        }

        if (this.bots.length > 0) {
          const idleBot = this.bots.find(bot => bot.botStatus === BotStatus.IDLE);
          if (idleBot) {
            this.checkForPendingOrders();
          }
        }
      }
      const response: OrderResponse = { status: 'success', statusCode: HttpStatus.OK, bot };
      return response;
    } catch (error) {
      const response: OrderResponse = { status: 'error', statusCode: HttpStatus.BAD_REQUEST, error };
      return response;
    }

  }


  removeAllOrders(): Order[] {
    const removedOrders = this.orders;
    this.orders = [];
    return removedOrders;
  }
}
