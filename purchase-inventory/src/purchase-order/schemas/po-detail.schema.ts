import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ collection: 'po_details', timestamps: true })
export class PoDetail extends Document {
  @Prop({ type: Types.ObjectId, ref: 'PoMaster', required: true })
  poMasterId: Types.ObjectId; 

  @Prop({ required: true })
  srNo: number;                 

  @Prop({ required: true })
  proId: number;                

  @Prop()
  make: string;                 

  @Prop({ required: true })
  qty: number;                  

  @Prop({ default: 0 })
  aQty: number;                

  @Prop({ required: true })
  rate: number;                 

  @Prop({ default: 0 })
  tax: number;                  

  @Prop({ required: true })
  amt: number;                  
}

export type PoDetailDocument = PoDetail & Document;
export const PoDetailSchema = SchemaFactory.createForClass(PoDetail);
