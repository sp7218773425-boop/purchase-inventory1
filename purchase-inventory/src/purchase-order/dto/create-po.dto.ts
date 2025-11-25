import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePoDetailDto {
  @IsInt()
  srNo: number;

  @IsInt()
  proId: number;

  @IsOptional()
  @IsString()
  make?: string;

  @IsNumber()
  @Min(0)
  qty: number;

  @IsOptional()
  @IsNumber()
  aQty?: number = 0;

  @IsNumber()
  rate: number;

  @IsOptional()
  @IsNumber()
  tax?: number = 0;

  @IsOptional()
  @IsNumber()
  amt?: number;           
}

export class CreatePoMasterDto {
  @IsString()
  poNo: string;

  @IsInt()
  revNo: number;

  @IsDateString()
  poDate: string;

  @IsInt()
  supId: number;

  @IsOptional()
  @IsNumber()
  amount?: number;

  @IsOptional()
  @IsBoolean()
  withTransportation?: boolean = false;
}

export class CreatePoDto {
  @Type(() => CreatePoMasterDto)
  @ValidateNested()
  master: CreatePoMasterDto;

  @Type(() => CreatePoDetailDto)
  @ValidateNested({ each: true })
  details: CreatePoDetailDto[];
}
