import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PoStatusService } from './po-status.service';
import { PoStatusController } from './po-status.controller';
import { PoMaster, PoMasterSchema } from '../purchase-order/schemas/po-master.schema';
import { PoDetail, PoDetailSchema } from '../purchase-order/schemas/po-detail.schema';
import { GrnMaster, GrnMasterSchema } from '../grn/schemas/grn-master.schema';
import { GrnDetail, GrnDetailSchema } from '../grn/schemas/grn-detail.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PoMaster.name, schema: PoMasterSchema },
      { name: PoDetail.name, schema: PoDetailSchema },
      { name: GrnMaster.name, schema: GrnMasterSchema },
      { name: GrnDetail.name, schema: GrnDetailSchema },
    ]),
  ],
  controllers: [PoStatusController],
  providers: [PoStatusService],
})
export class PoStatusModule {}
