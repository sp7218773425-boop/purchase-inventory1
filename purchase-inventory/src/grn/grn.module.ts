import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GrnService } from './grn.service';
import { GrnController } from './grn.controller';
import { GrnMaster, GrnMasterSchema } from './schemas/grn-master.schema';
import { GrnDetail, GrnDetailSchema } from './schemas/grn-detail.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: GrnMaster.name, schema: GrnMasterSchema },
      { name: GrnDetail.name, schema: GrnDetailSchema },
    ]),
  ],
  controllers: [GrnController],
  providers: [GrnService],
  exports: [MongooseModule],
})
export class GrnModule {}
