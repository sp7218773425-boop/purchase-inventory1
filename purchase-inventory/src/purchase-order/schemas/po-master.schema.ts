import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ collection: 'po_masters', timestamps: true })
export class PoMaster extends Document {
  @Prop({ required: true })
  poNo: string;           

  @Prop({ required: true, default: 0 })
  revNo: number;          

  @Prop({ required: true })
  poDate: Date;          

  @Prop({ required: true })
  supId: number;          

  @Prop({ required: true })
  amount: number;         

  @Prop({ default: false })
  withTransportation: boolean; 
}

export type PoMasterDocument = PoMaster & Document;
export const PoMasterSchema = SchemaFactory.createForClass(PoMaster);
