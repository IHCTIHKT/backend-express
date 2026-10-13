import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class OrderPaginationDto {
  @Type(() => Number)
  @IsInt()
  limit: number;

  @Type(() => Number)
  @IsInt()
  offset: number;
}
