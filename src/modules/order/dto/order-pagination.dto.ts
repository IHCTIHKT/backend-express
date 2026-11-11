import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { OrderStatus, OrderType  } from '../../../database/models/order.model';


export class OrderPaginationDto {
  @Type(() => Number)
  @IsInt()
  limit: number;

  @Type(() => Number)
  @IsInt()
  offset: number;

  @IsOptional()
  @IsEnum(OrderType)
  type?: OrderType;

  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;
}
