import { Controller, Get, Param } from '@nestjs/common';
import { PoStatusService } from './po-status.service';

@Controller('po-status')
export class PoStatusController {
  constructor(private readonly service: PoStatusService) {}

  // GET all
  @Get()
  getAll() {
    return this.service.getAll();
  }

  // GET poNo
  @Get(':poNo')
  getByPo(@Param('poNo') poNo: string) {
    return this.service.getByPo(poNo);
  }
}
