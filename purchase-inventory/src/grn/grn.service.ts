import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  GrnMaster,
  GrnMasterDocument,
} from './schemas/grn-master.schema';
import {
  GrnDetail,
  GrnDetailDocument,
} from './schemas/grn-detail.schema';
import { CreateGrnDto } from './dto/create-grn.dto';
import { UpdateGrnDto } from './dto/update-grn.dto';

@Injectable()
export class GrnService {
  constructor(
    @InjectModel(GrnMaster.name)
    private readonly grnMasterModel: Model<GrnMasterDocument>,
    @InjectModel(GrnDetail.name)
    private readonly grnDetailModel: Model<GrnDetailDocument>,
  ) {}

  private calculateAmount(details: any[]) {
    return details.map((d) => {
      const amt = d.amt ?? d.qty * d.rate;
      return { ...d, amt };
    });
  }

  async create(dto: CreateGrnDto) {
    const master = await this.grnMasterModel.create({
      ...dto.master,
      date: new Date(dto.master.date),
      purInvDate: new Date(dto.master.purInvDate),
      poId: new Types.ObjectId(dto.master.poId),
    });

    const details = this.calculateAmount(dto.details).map((d) => ({
      ...d,
      grnMasterId: master._id,
    }));

    await this.grnDetailModel.insertMany(details);

    return { master, details };
  }

  async findAll() {
    const masters = await this.grnMasterModel.find().lean();
    const masterIds = masters.map((m) => m._id);
    const details = await this.grnDetailModel
      .find({ grnMasterId: { $in: masterIds } })
      .lean();

    return masters.map((m) => ({
      master: m,
      details: details.filter(
        (d) => d.grnMasterId.toString() === m._id.toString(),
      ),
    }));
  }

  async findOne(id: string) {
    const master = await this.grnMasterModel.findById(id).lean();
    if (!master) throw new NotFoundException('GRN not found');

    const details = await this.grnDetailModel
      .find({ grnMasterId: master._id })
      .lean();

    return { master, details };
  }

  async update(id: string, dto: UpdateGrnDto) {
  const existing = await this.grnMasterModel.findById(id);
  if (!existing) throw new NotFoundException('GRN not found');

  const toUpdate: any = { ...dto.master };

  if (dto.master?.date) toUpdate.date = new Date(dto.master.date);
  if (dto.master?.purInvDate)
    toUpdate.purInvDate = new Date(dto.master.purInvDate);
  if (dto.master?.poId)
    toUpdate.poId = new Types.ObjectId(dto.master.poId);

  if (dto.details && dto.details.length) {
    await this.grnDetailModel.deleteMany({ grnMasterId: existing._id });
    const details = this.calculateAmount(dto.details).map((d) => ({
      ...d,
      grnMasterId: existing._id,
    }));
    await this.grnDetailModel.insertMany(details);
  }

  const updated = await this.grnMasterModel
    .findByIdAndUpdate(id, toUpdate, { new: true })
    .lean();

  if (!updated) {
    throw new NotFoundException('GRN not found');
  }

  const details = await this.grnDetailModel
    .find({ grnMasterId: updated._id })
    .lean();

  return { master: updated, details };
}


  async remove(id: string) {
    const master = await this.grnMasterModel.findByIdAndDelete(id);
    if (!master) throw new NotFoundException('GRN not found');
    await this.grnDetailModel.deleteMany({ grnMasterId: master._id });
    return { deleted: true };
  }
}
