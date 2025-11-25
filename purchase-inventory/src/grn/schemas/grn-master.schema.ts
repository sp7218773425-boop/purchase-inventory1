import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ collection: 'grn_masters', timestamps: true })
export class GrnMaster extends Document {
  @Prop({ required: true })
  grnNo: string;           

  @Prop({ required: true })
  date: Date;              

  @Prop({ required: true })
  supId: number;           

  @Prop({ required: true })
  purInvNo: string;       

  @Prop({ required: true })
  purInvDate: Date;        

  @Prop({ type: Types.ObjectId, ref: 'PoMaster', required: true })
  poId: Types.ObjectId;    
}

export type GrnMasterDocument = GrnMaster & Document;
export const GrnMasterSchema = SchemaFactory.createForClass(GrnMaster);
