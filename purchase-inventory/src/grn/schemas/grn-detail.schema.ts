import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ collection: 'grn_details', timestamps: true })
export class GrnDetail extends Document {
  @Prop({ type: Types.ObjectId, ref: 'GrnMaster', required: true })
  grnMasterId: Types.ObjectId;

  @Prop({ required: true })
  srNo: number;

  @Prop({ required: true })
  proId: number;

  @Prop({ required: true })
  qty: number;       

  @Prop({ required: true })
  rate: number;

  @Prop({ required: true })
  amt: number;
}

export type GrnDetailDocument = GrnDetail & Document;
export const GrnDetailSchema = SchemaFactory.createForClass(GrnDetail);
