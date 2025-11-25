import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PoMaster, PoMasterDocument } from '../purchase-order/schemas/po-master.schema';
import { PoDetail, PoDetailDocument } from '../purchase-order/schemas/po-detail.schema';
import { GrnMaster, GrnMasterDocument } from '../grn/schemas/grn-master.schema';
import { GrnDetail, GrnDetailDocument } from '../grn/schemas/grn-detail.schema';

@Injectable()
export class PoStatusService {
  constructor(
    @InjectModel(PoMaster.name)
    private readonly poMasterModel: Model<PoMasterDocument>,
    @InjectModel(PoDetail.name)
    private readonly poDetailModel: Model<PoDetailDocument>,
    @InjectModel(GrnMaster.name)
    private readonly grnMasterModel: Model<GrnMasterDocument>,
    @InjectModel(GrnDetail.name)
    private readonly grnDetailModel: Model<GrnDetailDocument>,
  ) {}

  async getAll() {
    
    const poAgg = await this.poDetailModel.aggregate([
      {
        $lookup: {
          from: 'po_masters',
          localField: 'poMasterId',
          foreignField: '_id',
          as: 'master',
        },
      },
      { $unwind: '$master' },
      {
        $group: {
          _id: {
            supId: '$master.supId',
            poNo: '$master.poNo',
            revNo: '$master.revNo',
            proId: '$proId',
          },
          orderQty: { $sum: '$qty' },
          adjQty: { $sum: '$aQty' },
        },
      },
    ]);


    const grnAgg = await this.grnDetailModel.aggregate([
      {
        $lookup: {
          from: 'grn_masters',
          localField: 'grnMasterId',
          foreignField: '_id',
          as: 'grnMaster',
        },
      },
      { $unwind: '$grnMaster' },
      {
        $lookup: {
          from: 'po_masters',
          localField: 'grnMaster.poId',
          foreignField: '_id',
          as: 'poMaster',
        },
      },
      { $unwind: '$poMaster' },
      {
        $group: {
          _id: {
            supId: '$poMaster.supId',
            poNo: '$poMaster.poNo',
            revNo: '$poMaster.revNo',
            proId: '$proId',
          },
          recQty: { $sum: '$qty' },
        },
      },
    ]);

    const grnMap = new Map<string, any>();
    for (const g of grnAgg) {
      grnMap.set(JSON.stringify(g._id), g);
    }

    const result = poAgg.map((p) => {
      const key = JSON.stringify(p._id);
      const g = grnMap.get(key);
      const recQty = g?.recQty || 0;
      const pendingQty = p.orderQty - recQty;
      return {
        supId: p._id.supId,
        poNo: p._id.poNo,
        rev: p._id.revNo,
        proId: p._id.proId,
        orderQty: p.orderQty,
        recQty,
        pendingQty,
        adjQty: p.adjQty,
      };
    });

    return result;
  }

  async getByPo(poNo: string) {
    const all = await this.getAll();
    return all.filter((r) => r.poNo === poNo);
  }
}
