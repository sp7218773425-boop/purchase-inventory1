import {
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateGrnDetailDto {
  @IsInt()
  srNo: number;

  @IsInt()
  proId: number;

  @IsNumber()
  qty: number;

  @IsNumber()
  rate: number;

  @IsOptional()
  @IsNumber()
  amt?: number;
}

export class CreateGrnMasterDto {
  @IsString()
  grnNo: string;

  @IsDateString()
  date: string;

  @IsInt()
  supId: number;

  @IsString()
  purInvNo: string;

  @IsDateString()
  purInvDate: string;

  @IsString()
  poId: string;
}

export class CreateGrnDto {
  @Type(() => CreateGrnMasterDto)
  @ValidateNested()
  master: CreateGrnMasterDto;

  @Type(() => CreateGrnDetailDto)
  @ValidateNested({ each: true })
  details: CreateGrnDetailDto[];
}
