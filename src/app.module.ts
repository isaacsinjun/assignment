import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrdersModule } from './orders/orders.module';
import { OrdersService } from './orders/orders.service';
import { OrdersController } from './orders/orders.controller';

@Module({
  imports: [OrdersModule],
  controllers: [AppController,OrdersController],
  providers: [AppService,OrdersService],
})
export class AppModule {}