import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PurchaseOrderService } from './purchase-order.service';
import { PurchaseOrderController } from './purchase-order.controller';
import { PoMaster, PoMasterSchema } from './schemas/po-master.schema';
import { PoDetail, PoDetailSchema } from './schemas/po-detail.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PoMaster.name, schema: PoMasterSchema },
      { name: PoDetail.name, schema: PoDetailSchema },
    ]),
  ],
  controllers: [PurchaseOrderController],
  providers: [PurchaseOrderService],
  exports: [MongooseModule],
})
export class PurchaseOrderModule {}
