import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  PoMaster,
  PoMasterDocument,
} from './schemas/po-master.schema';
import {
  PoDetail,
  PoDetailDocument,
} from './schemas/po-detail.schema';
import { CreatePoDto } from './dto/create-po.dto';
import { UpdatePoDto } from './dto/update-po.dto';

@Injectable()
export class PurchaseOrderService {
  constructor(
    @InjectModel(PoMaster.name)
    private readonly poMasterModel: Model<PoMasterDocument>,
    @InjectModel(PoDetail.name)
    private readonly poDetailModel: Model<PoDetailDocument>,
  ) {}

  private calculateAmount(dto: CreatePoDto): { amount: number; detailsWithAmt: any[] } {
    let total = 0;
    const details = dto.details.map((d) => {
      const base = d.qty * d.rate;
      const taxAmt = d.tax ? (base * d.tax) / 100 : 0;
      const amt = d.amt ?? base + taxAmt;
      total += amt;
      return { ...d, amt };
    });
    return { amount: total, detailsWithAmt: details };
  }

  async create(dto: CreatePoDto) {
    const { amount, detailsWithAmt } = this.calculateAmount(dto);

    const master = await this.poMasterModel.create({
      ...dto.master,
      poDate: new Date(dto.master.poDate),
      amount,
    });

    const detailsToSave = detailsWithAmt.map((d) => ({
      ...d,
      poMasterId: master._id,
    }));

    await this.poDetailModel.insertMany(detailsToSave);

    return { master, details: detailsToSave };
  }

  async findAll() {
    const masters = await this.poMasterModel.find().lean();
    const masterIds = masters.map((m) => m._id);
    const details = await this.poDetailModel
      .find({ poMasterId: { $in: masterIds } })
      .lean();

    return masters.map((m) => ({
      master: m,
      details: details.filter(
        (d) => d.poMasterId.toString() === m._id.toString(),
      ),
    }));
  }

  async findOne(id: string) {
    const master = await this.poMasterModel.findById(id).lean();
    if (!master) throw new NotFoundException('PO not found');

    const details = await this.poDetailModel
      .find({ poMasterId: master._id })
      .lean();

    return { master, details };
  }

  async update(id: string, dto: UpdatePoDto) {
    const existing = await this.poMasterModel.findById(id);
    if (!existing) throw new NotFoundException('PO not found');

        const toUpdate: any = { ...dto.master };

    let detailsPayload: any[] = dto.details ? [...dto.details as any[]] : [];

    if (detailsPayload.length) {
      const { amount, detailsWithAmt } = this.calculateAmount({
        master: {
          ...(dto.master as any),
          poDate:
            (dto.master?.poDate as any) || existing.poDate.toISOString(),
        },
        details: detailsPayload as any,
      });

      toUpdate.amount = amount;
      detailsPayload = detailsWithAmt as any[];

      await this.poDetailModel.deleteMany({ poMasterId: existing._id });

      const detailsToSave = detailsPayload.map((d: any) => ({
        ...d,
        poMasterId: existing._id,
      }));

      await this.poDetailModel.insertMany(detailsToSave);
    }


    if (dto.master?.poDate) {
      toUpdate.poDate = new Date(dto.master.poDate);
    }

    const updated = await this.poMasterModel
  .findByIdAndUpdate(id, toUpdate, { new: true })
  .lean();

    if (!updated) {
  throw new NotFoundException('PO not found');
}

const details = await this.poDetailModel
  .find({ poMasterId: updated._id })
  .lean();

    return { master: updated, details };
  }

  async remove(id: string) {
    const master = await this.poMasterModel.findByIdAndDelete(id);
    if (!master) throw new NotFoundException('PO not found');
    await this.poDetailModel.deleteMany({ poMasterId: master._id });
    return { deleted: true };
  }
}
