export interface Order {
    id: number;
    memberType: 'normal' | 'vip';
    orderStatus: OrderStatus;
    cookingBotId?: number; 

  }
  
  export interface Bot {
    id: number;
    botStatus: BotStatus;
  }
  
  export enum OrderStatus {
    PENDING = 'PENDING',
    COOKING = 'COOKING',
    COMPLETE = 'COMPLETE',
  }
  
  export enum BotStatus {
    IDLE = 'IDLE',
    PROCESSING = 'PROCESSING',
  }
  