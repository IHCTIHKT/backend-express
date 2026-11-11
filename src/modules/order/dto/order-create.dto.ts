import { IsEnum, IsNumber, IsString,  } from 'class-validator';
import { OrderType} from '../../../database/models/order.model';

export class OrderCreateDto {

  @IsString()
  product: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  price: number;

  @IsEnum(OrderType)
  type: OrderType;
}
