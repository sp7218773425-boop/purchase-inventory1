import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { PurchaseOrderModule } from './purchase-order/purchase-order.module';
import { GrnModule } from './grn/grn.module';
import { PoStatusModule } from './po-status/po-status.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI as string),
    PurchaseOrderModule,
    GrnModule,
    PoStatusModule,
  ],
})
export class AppModule {}
